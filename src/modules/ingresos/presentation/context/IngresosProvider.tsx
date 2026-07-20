import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { FiltrosIngresos } from '../../../../shared/types/filtros';
import type { Ingreso } from '../../../../shared/types/ingreso';
import type { PaginatedResponse } from '../../../../shared/types/paginatedResponse';
import { REGISTROS_POR_PAGINA_DEFAULT, paginacionService } from '../../../../shared/services/paginacionService';
import { listarIngresosPaginados } from '../../application/listarIngresos';
import type { IngresosRepository } from '../../domain/repositories/ingresosRepository';
import { ingresosAlovaRepository } from '../../infrastructure/ingresosAlovaRepository';

export interface IngresosContextValue {
  respuesta: PaginatedResponse<Ingreso>;
  ingresos: Ingreso[];
  filtros: FiltrosIngresos;
  cargando: boolean;
  error: string | null;
  actualizarFiltros: (filtros: FiltrosIngresos) => void;
  limpiarFiltros: () => void;
  cambiarPagina: (pagina: number) => void;
  recargar: () => Promise<void>;
}

interface IngresosProviderProps {
  children: ReactNode;
  repository?: IngresosRepository;
}

const obtenerAnioActual = () => String(new Date().getFullYear());

const crearFiltrosIniciales = (): FiltrosIngresos => {
  const anio = obtenerAnioActual();
  return {
    rangoFecha: {
      inicio: `${anio}-01-01`,
      fin: `${anio}-12-31`,
    },
    fuente: 'TODAS',
  };
};

const obtenerMensajeError = (error: unknown): string =>
  error instanceof Error ? error.message : 'No se pudieron cargar los ingresos.';

export const IngresosContext = createContext<IngresosContextValue | undefined>(undefined);

export function IngresosProvider({ children, repository = ingresosAlovaRepository }: IngresosProviderProps) {
  const [filtros, setFiltros] = useState<FiltrosIngresos>(() => crearFiltrosIniciales());
  const [pagina, setPagina] = useState(1);
  const [respuesta, setRespuesta] = useState<PaginatedResponse<Ingreso>>(
    paginacionService.crearRespuestaVacia<Ingreso>({ pagina: 1, limite: REGISTROS_POR_PAGINA_DEFAULT }),
  );
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const data = await listarIngresosPaginados(repository, filtros, {
        pagina,
        limite: REGISTROS_POR_PAGINA_DEFAULT,
      });
      setRespuesta(data);
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setCargando(false);
    }
  }, [filtros, pagina, repository]);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  const actualizarFiltros = useCallback((nuevosFiltros: FiltrosIngresos) => {
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

  const value = useMemo<IngresosContextValue>(
    () => ({
      respuesta,
      ingresos: respuesta.data,
      filtros,
      cargando,
      error,
      actualizarFiltros,
      limpiarFiltros,
      cambiarPagina,
      recargar,
    }),
    [actualizarFiltros, cambiarPagina, cargando, error, filtros, limpiarFiltros, recargar, respuesta],
  );

  return <IngresosContext.Provider value={value}>{children}</IngresosContext.Provider>;
}
