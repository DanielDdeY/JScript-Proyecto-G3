import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { EstadoDeudaAmigo } from '../../../../shared/types/amigoDeudor';
import type { FiltrosWallet } from '../../../../shared/types/filtros';
import type { Gasto } from '../../../../shared/types/gasto';
import type { PaginatedResponse } from '../../../../shared/types/paginatedResponse';
import { REGISTROS_POR_PAGINA_DEFAULT, paginacionService } from '../../../../shared/services/paginacionService';
import { actualizarEstadoDeudor as actualizarEstadoDeudorUseCase } from '../../application/actualizarEstadoDeudor';
import { listarGastosPaginados } from '../../application/listarGastos';
import type { GastosRepository } from '../../domain/repositories/gastosRepository';
import { gastosWalletRepository } from '../../infrastructure/gastosWalletRepository';

export interface GastosContextValue {
  respuesta: PaginatedResponse<Gasto>;
  gastos: Gasto[];
  filtros: FiltrosWallet;
  cargando: boolean;
  error: string | null;
  recargarGastos: () => Promise<void>;
  actualizarFiltros: (filtros: FiltrosWallet) => void;
  limpiarFiltros: () => void;
  cambiarPagina: (pagina: number) => void;
  actualizarEstadoDeudor: (gastoId: Gasto['id'], nombreId: string, estado: EstadoDeudaAmigo) => Promise<void>;
}

interface GastosProviderProps {
  children: ReactNode;
  repository?: GastosRepository;
}

interface GastosState {
  respuesta: PaginatedResponse<Gasto>;
  cargando: boolean;
  error: string | null;
}

const obtenerAnioActual = () => String(new Date().getFullYear());

const crearFiltrosIniciales = (): FiltrosWallet => {
  const anio = obtenerAnioActual();
  return {
    rangoFecha: {
      inicio: `${anio}-01-01`,
      fin: `${anio}-12-31`,
    },
    importancia: 'TODAS',
  };
};

export const GastosContext = createContext<GastosContextValue | undefined>(undefined);

const obtenerMensajeError = (error: unknown): string =>
  error instanceof Error ? error.message : 'No se pudieron cargar los gastos.';

export function GastosProvider({ children, repository = gastosWalletRepository }: GastosProviderProps) {
  const [filtros, setFiltros] = useState<FiltrosWallet>(() => crearFiltrosIniciales());
  const [pagina, setPagina] = useState(1);
  const [state, setState] = useState<GastosState>({
    respuesta: paginacionService.crearRespuestaVacia<Gasto>({ pagina: 1, limite: REGISTROS_POR_PAGINA_DEFAULT }),
    cargando: true,
    error: null,
  });

  const recargarGastos = useCallback(async () => {
    setState((currentState) => ({ ...currentState, cargando: true, error: null }));

    try {
      const respuesta = await listarGastosPaginados(repository, filtros, {
        pagina,
        limite: REGISTROS_POR_PAGINA_DEFAULT,
      });
      setState({ respuesta, cargando: false, error: null });
    } catch (error) {
      setState((currentState) => ({ ...currentState, cargando: false, error: obtenerMensajeError(error) }));
    }
  }, [filtros, pagina, repository]);

  useEffect(() => {
    void recargarGastos();
  }, [recargarGastos]);

  const actualizarFiltros = useCallback((nuevosFiltros: FiltrosWallet) => {
    setFiltros(nuevosFiltros);
    setPagina(1);
  }, []);

  const limpiarFiltros = useCallback(() => {
    setFiltros(crearFiltrosIniciales());
    setPagina(1);
  }, []);

  const cambiarPagina = useCallback((nuevaPagina: number) => {
    setPagina(Math.max(1, nuevaPagina));
  }, []);

  const actualizarEstadoDeudor = useCallback(
    async (gastoId: Gasto['id'], nombreId: string, estado: EstadoDeudaAmigo) => {
      setState((currentState) => ({ ...currentState, error: null }));

      try {
        const gastoActualizado = await actualizarEstadoDeudorUseCase(repository, gastoId, nombreId, estado);
        setState((currentState) => ({
          ...currentState,
          respuesta: {
            ...currentState.respuesta,
            data: currentState.respuesta.data.map((gasto) => (gasto.id === gastoActualizado.id ? gastoActualizado : gasto)),
          },
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
      respuesta: state.respuesta,
      gastos: state.respuesta.data,
      filtros,
      cargando: state.cargando,
      error: state.error,
      recargarGastos,
      actualizarFiltros,
      limpiarFiltros,
      cambiarPagina,
      actualizarEstadoDeudor,
    }),
    [actualizarEstadoDeudor, actualizarFiltros, cambiarPagina, limpiarFiltros, recargarGastos, state, filtros],
  );

  return <GastosContext.Provider value={value}>{children}</GastosContext.Provider>;
}
