import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { EstadoDeudaAmigo } from '../../../../shared/types/amigoDeudor';
import type { Gasto } from '../../../../shared/types/gasto';
import { actualizarEstadoDeudor as actualizarEstadoDeudorUseCase } from '../../application/actualizarEstadoDeudor';
import { listarGastos } from '../../application/listarGastos';
import type { GastosRepository } from '../../domain/repositories/gastosRepository';
import { gastosWalletRepository } from '../../infrastructure/gastosWalletRepository';

export interface GastosContextValue {
  gastos: Gasto[];
  cargando: boolean;
  error: string | null;
  recargarGastos: () => Promise<void>;
  actualizarEstadoDeudor: (gastoId: Gasto['id'], nombreId: string, estado: EstadoDeudaAmigo) => Promise<void>;
}

interface GastosProviderProps {
  children: ReactNode;
  repository?: GastosRepository;
}

interface GastosState {
  gastos: Gasto[];
  cargando: boolean;
  error: string | null;
}

export const GastosContext = createContext<GastosContextValue | undefined>(undefined);

const obtenerMensajeError = (error: unknown): string =>
  error instanceof Error ? error.message : 'No se pudieron cargar los gastos.';

export function GastosProvider({ children, repository = gastosWalletRepository }: GastosProviderProps) {
  const [state, setState] = useState<GastosState>({ gastos: [], cargando: true, error: null });

  const recargarGastos = useCallback(async () => {
    setState((currentState) => ({ ...currentState, cargando: true, error: null }));

    try {
      const gastos = await listarGastos(repository);
      setState({ gastos, cargando: false, error: null });
    } catch (error) {
      setState((currentState) => ({ ...currentState, cargando: false, error: obtenerMensajeError(error) }));
    }
  }, [repository]);

  useEffect(() => {
    void recargarGastos();
  }, [recargarGastos]);

  const actualizarEstadoDeudor = useCallback(
    async (gastoId: Gasto['id'], nombreId: string, estado: EstadoDeudaAmigo) => {
      setState((currentState) => ({ ...currentState, error: null }));

      try {
        const gastoActualizado = await actualizarEstadoDeudorUseCase(repository, gastoId, nombreId, estado);
        setState((currentState) => ({
          ...currentState,
          gastos: currentState.gastos.map((gasto) => (gasto.id === gastoActualizado.id ? gastoActualizado : gasto)),
        }));
      } catch (error) {
        setState((currentState) => ({ ...currentState, error: obtenerMensajeError(error) }));
        throw error;
      }
    },
    [repository],
  );

  const value = useMemo<GastosContextValue>(
    () => ({
      gastos: state.gastos,
      cargando: state.cargando,
      error: state.error,
      recargarGastos,
      actualizarEstadoDeudor,
    }),
    [actualizarEstadoDeudor, recargarGastos, state.error, state.gastos, state.cargando],
  );

  return <GastosContext.Provider value={value}>{children}</GastosContext.Provider>;
}
