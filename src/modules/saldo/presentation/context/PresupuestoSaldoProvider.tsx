import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { obtenerPresupuestoActual } from '../../application/listarPresupuestos';
import {
  presupuestoSaldoService,
  type DetalleCategoriaConPorcentaje,
  type ResumenMensualPresupuesto,
} from '../../domain/services/presupuestoSaldoService';
import { presupuestoSaldoAlovaRepository } from '../../infrastructure/presupuestoSaldoAlovaRepository';
import type { AlertaPresupuesto } from '../../../../shared/types/alertaPresupuesto';
import type { PresupuestoMensual } from '../../../../shared/types/presupuestoMensual';
import type { PresupuestoSaldoRepository } from '../../domain/repositories/presupuestoSaldoRepository';
import { useWallet } from '../../../wallet/presentation/hooks/useWallet';

export interface PresupuestoSaldoContextValue {
  presupuesto: PresupuestoMensual | null;
  detalles: DetalleCategoriaConPorcentaje[];
  alertas: AlertaPresupuesto[];
  titulo: string;
  resumenMensual: ResumenMensualPresupuesto | null;
  cargando: boolean;
  error: string | null;
  recargar: () => Promise<void>;
}

interface PresupuestoSaldoProviderProps {
  children: ReactNode;
  repository?: PresupuestoSaldoRepository;
}

interface PresupuestoSaldoState {
  presupuesto: PresupuestoMensual | null;
  cargando: boolean;
  error: string | null;
}

export const PresupuestoSaldoContext = createContext<PresupuestoSaldoContextValue | undefined>(undefined);

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'No se pudo cargar el presupuesto mensual.';

export function PresupuestoSaldoProvider({
  children,
  repository = presupuestoSaldoAlovaRepository,
}: PresupuestoSaldoProviderProps) {
  const { gastos, cargando: cargandoWallet } = useWallet();
  const [state, setState] = useState<PresupuestoSaldoState>({
    presupuesto: null,
    cargando: true,
    error: null,
  });

  const cargarPresupuesto = useCallback(async () => {
    setState((currentState) => ({ ...currentState, cargando: true, error: null }));

    try {
      const presupuesto = await obtenerPresupuestoActual(repository);
      setState({ presupuesto, cargando: false, error: null });
    } catch (error) {
      setState({ presupuesto: null, cargando: false, error: getErrorMessage(error) });
    }
  }, [repository]);

  useEffect(() => {
    void cargarPresupuesto();
  }, [cargarPresupuesto]);

  const value = useMemo<PresupuestoSaldoContextValue>(() => {
    const detalles = state.presupuesto?.desgloseCategorias.map((detalle) =>
      presupuestoSaldoService.prepararDetalle(detalle),
    ) ?? [];

    return {
      presupuesto: state.presupuesto,
      detalles,
      alertas: presupuestoSaldoService.generarAlertas(state.presupuesto),
      titulo: presupuestoSaldoService.obtenerTitulo(state.presupuesto),
      resumenMensual: presupuestoSaldoService.prepararResumenMensual(state.presupuesto, gastos),
      cargando: state.cargando || cargandoWallet,
      error: state.error,
      recargar: cargarPresupuesto,
    };
  }, [cargandoWallet, cargarPresupuesto, gastos, state]);

  return <PresupuestoSaldoContext.Provider value={value}>{children}</PresupuestoSaldoContext.Provider>;
}
