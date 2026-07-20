import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useWallet } from '../../../wallet/presentation/hooks/useWallet';
import type { PresupuestoMensual } from '../../../../shared/types/presupuestoMensual';
import { notificacionService } from '../../domain/services/notificacionService';
import type { Notificacion } from '../../domain/models/notificacion';
import type { NotificacionesRepository } from '../../domain/repositories/notificacionesRepository';
import { notificacionesAlovaRepository } from '../../infrastructure/notificacionesAlovaRepository';

const DISMISSED_NOTIFICATIONS_KEY = 'vizcash.notificaciones.descartadas';

export interface NotificacionesContextValue {
  notificaciones: Notificacion[];
  total: number;
  cargando: boolean;
  error: string | null;
  recargar: () => Promise<void>;
  descartarNotificacion: (id: string) => void;
}

interface NotificacionesProviderProps {
  readonly children: ReactNode;
  readonly repository?: NotificacionesRepository;
}

interface NotificacionesState {
  presupuestos: PresupuestoMensual[];
  descartadas: string[];
  cargando: boolean;
  error: string | null;
}

export const NotificacionesContext = createContext<NotificacionesContextValue | undefined>(undefined);

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'No se pudieron cargar las notificaciones.';

const cargarDescartadas = (): string[] => {
  try {
    const raw = window.localStorage.getItem(DISMISSED_NOTIFICATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
};

const guardarDescartadas = (ids: string[]) => {
  window.localStorage.setItem(DISMISSED_NOTIFICATIONS_KEY, JSON.stringify(ids));
};

export function NotificacionesProvider({
  children,
  repository = notificacionesAlovaRepository,
}: NotificacionesProviderProps) {
  const { tarjetas, bancos, gastos, cargando: cargandoWallet } = useWallet();
  const [state, setState] = useState<NotificacionesState>({
    presupuestos: [],
    descartadas: cargarDescartadas(),
    cargando: true,
    error: null,
  });

  const cargarPresupuestos = useCallback(async () => {
    setState((currentState) => ({ ...currentState, cargando: true, error: null }));

    try {
      const presupuestos = await repository.listarPresupuestos();
      setState((currentState) => ({ ...currentState, presupuestos, cargando: false, error: null }));
    } catch (error) {
      setState((currentState) => ({ ...currentState, presupuestos: [], cargando: false, error: getErrorMessage(error) }));
    }
  }, [repository]);

  useEffect(() => {
    void cargarPresupuestos();
  }, [cargarPresupuestos]);

  const descartarNotificacion = useCallback((id: string) => {
    setState((currentState) => {
      const descartadas = Array.from(new Set([...currentState.descartadas, id]));
      guardarDescartadas(descartadas);
      return { ...currentState, descartadas };
    });
  }, []);

  const notificaciones = useMemo(() => {
    const todas = notificacionService.construirNotificaciones({
      presupuestos: state.presupuestos,
      gastos,
      tarjetas,
      bancos,
    });

    const descartadas = new Set(state.descartadas);
    return todas.filter((notificacion) => !descartadas.has(notificacion.id));
  }, [bancos, gastos, state.descartadas, state.presupuestos, tarjetas]);

  const value = useMemo<NotificacionesContextValue>(
    () => ({
      notificaciones,
      total: notificaciones.length,
      cargando: state.cargando || cargandoWallet,
      error: state.error,
      recargar: cargarPresupuestos,
      descartarNotificacion,
    }),
    [cargandoWallet, cargarPresupuestos, descartarNotificacion, notificaciones, state.cargando, state.error],
  );

  return <NotificacionesContext.Provider value={value}>{children}</NotificacionesContext.Provider>;
}
