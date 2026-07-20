import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { calcularProyeccion as calcularProyeccionUseCase } from '../../application/calcularProyeccion';
import { obtenerDatosProyeccion } from '../../application/obtenerDatosProyeccion';
import type { DatosProyeccion, ProyeccionFiltros, ResultadoProyeccion } from '../../domain/models/proyeccionPredictiva';
import type { ProyeccionesRepository } from '../../domain/repositories/proyeccionesRepository';
import { proyeccionesAlovaRepository } from '../../infrastructure/proyeccionesAlovaRepository';

export interface ProyeccionesContextValue {
  datos: DatosProyeccion | null;
  resultado: ResultadoProyeccion | null;
  cargando: boolean;
  error: string | null;
  recargar: () => Promise<void>;
  calcularProyeccion: (filtros: ProyeccionFiltros) => ResultadoProyeccion | null;
}

interface ProyeccionesProviderProps {
  readonly children: ReactNode;
  readonly repository?: ProyeccionesRepository;
}

interface ProyeccionesState {
  datos: DatosProyeccion | null;
  resultado: ResultadoProyeccion | null;
  cargando: boolean;
  error: string | null;
}

const obtenerMensajeError = (error: unknown) =>
  error instanceof Error ? error.message : 'No se pudieron cargar los datos para proyecciones.';

export const ProyeccionesContext = createContext<ProyeccionesContextValue | undefined>(undefined);

export function ProyeccionesProvider({ children, repository = proyeccionesAlovaRepository }: ProyeccionesProviderProps) {
  const [state, setState] = useState<ProyeccionesState>({
    datos: null,
    resultado: null,
    cargando: true,
    error: null,
  });

  const cargarDatos = useCallback(async () => {
    setState((current) => ({ ...current, cargando: true, error: null }));

    try {
      const datos = await obtenerDatosProyeccion(repository);
      setState((current) => ({ ...current, datos, cargando: false, error: null }));
    } catch (error) {
      setState((current) => ({ ...current, cargando: false, error: obtenerMensajeError(error) }));
    }
  }, [repository]);

  useEffect(() => {
    void cargarDatos();
  }, [cargarDatos]);

  const calcularProyeccion = useCallback((filtros: ProyeccionFiltros) => {
    if (!state.datos) return null;

    const resultado = calcularProyeccionUseCase(state.datos, filtros);
    setState((current) => ({ ...current, resultado }));
    return resultado;
  }, [state.datos]);

  const value = useMemo<ProyeccionesContextValue>(
    () => ({
      datos: state.datos,
      resultado: state.resultado,
      cargando: state.cargando,
      error: state.error,
      recargar: cargarDatos,
      calcularProyeccion,
    }),
    [calcularProyeccion, cargarDatos, state],
  );

  return <ProyeccionesContext.Provider value={value}>{children}</ProyeccionesContext.Provider>;
}
