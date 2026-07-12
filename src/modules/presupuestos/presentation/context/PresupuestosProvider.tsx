import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { PresupuestoMensual } from '../../../../shared/types/presupuestoMensual';
import type { PresupuestosRepository } from '../../domain/repositories/presupuestosRepository';
import type { GuardarLimiteMensualPayload, GuardarLimitePresupuestoPayload } from '../../domain/services/presupuestoService';
import { presupuestosAlovaRepository } from '../../infrastructure/presupuestosAlovaRepository';

export interface PresupuestosContextValue {
  presupuestos: PresupuestoMensual[];
  cargando: boolean;
  guardando: boolean;
  error: string | null;
  recargar: () => Promise<void>;
  guardarLimite: (payload: GuardarLimitePresupuestoPayload) => Promise<void>;
  guardarLimiteMensual: (payload: GuardarLimiteMensualPayload) => Promise<void>;
}

interface PresupuestosProviderProps {
  children: ReactNode;
  repository?: PresupuestosRepository;
}

interface PresupuestosState {
  presupuestos: PresupuestoMensual[];
  cargando: boolean;
  guardando: boolean;
  error: string | null;
}

export const PresupuestosContext = createContext<PresupuestosContextValue | undefined>(undefined);

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'No se pudieron cargar los límites de presupuesto.';

export function PresupuestosProvider({ children, repository = presupuestosAlovaRepository }: PresupuestosProviderProps) {
  const [state, setState] = useState<PresupuestosState>({
    presupuestos: [],
    cargando: true,
    guardando: false,
    error: null,
  });

  const recargar = useCallback(async () => {
    setState((currentState) => ({ ...currentState, cargando: true, error: null }));

    try {
      const presupuestos = await repository.listarPresupuestos();
      setState((currentState) => ({ ...currentState, presupuestos, cargando: false, error: null }));
    } catch (error) {
      setState((currentState) => ({ ...currentState, presupuestos: [], cargando: false, error: getErrorMessage(error) }));
    }
  }, [repository]);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  const guardarLimite = useCallback(
    async (payload: GuardarLimitePresupuestoPayload) => {
      setState((currentState) => ({ ...currentState, guardando: true, error: null }));

      try {
        await repository.guardarLimite(payload);
        const presupuestos = await repository.listarPresupuestos();
        setState((currentState) => ({ ...currentState, presupuestos, guardando: false, error: null }));
      } catch (error) {
        setState((currentState) => ({ ...currentState, guardando: false, error: getErrorMessage(error) }));
        throw error;
      }
    },
    [repository],
  );


  const guardarLimiteMensual = useCallback(
    async (payload: GuardarLimiteMensualPayload) => {
      setState((currentState) => ({ ...currentState, guardando: true, error: null }));

      try {
        await repository.guardarLimiteMensual(payload);
        const presupuestos = await repository.listarPresupuestos();
        setState((currentState) => ({ ...currentState, presupuestos, guardando: false, error: null }));
      } catch (error) {
        setState((currentState) => ({ ...currentState, guardando: false, error: getErrorMessage(error) }));
        throw error;
      }
    },
    [repository],
  );

  const value = useMemo<PresupuestosContextValue>(
    () => ({
      presupuestos: state.presupuestos,
      cargando: state.cargando,
      guardando: state.guardando,
      error: state.error,
      recargar,
      guardarLimite,
      guardarLimiteMensual,
    }),
    [guardarLimite, guardarLimiteMensual, recargar, state],
  );

  return <PresupuestosContext.Provider value={value}>{children}</PresupuestosContext.Provider>;
}
