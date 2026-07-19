import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { actualizarMeta as actualizarMetaUseCase } from '../../application/actualizarMeta';
import { agregarMeta as agregarMetaUseCase } from '../../application/agregarMeta';
import { eliminarMeta as eliminarMetaUseCase } from '../../application/eliminarMeta';
import { listarMetas } from '../../application/listarMetas';
import type { MetasRepository, NuevaMetaAhorro } from '../../domain/repositories/metasRepository';
import { metasAlovaRepository } from '../../infrastructure/metasAlovaRepository';
import type { MetaAhorro } from '../../../../shared/types/meta';

export interface MetasContextValue {
  metas: MetaAhorro[];
  cargando: boolean;
  error: string | null;
  recargar: () => Promise<void>;
  agregarMeta: (meta: NuevaMetaAhorro) => Promise<void>;
  actualizarMeta: (meta: MetaAhorro) => Promise<void>;
  eliminarMeta: (id: string) => Promise<void>;
}

interface MetasProviderProps {
  children: ReactNode;
  repository?: MetasRepository;
}

interface MetasState {
  metas: MetaAhorro[];
  cargando: boolean;
  error: string | null;
}

const obtenerMensajeError = (error: unknown) =>
  error instanceof Error ? error.message : 'No se pudieron cargar las metas.';

export const MetasContext = createContext<MetasContextValue | undefined>(undefined);

export function MetasProvider({ children, repository = metasAlovaRepository }: MetasProviderProps) {
  const [state, setState] = useState<MetasState>({ metas: [], cargando: true, error: null });

  const cargarDatos = useCallback(async () => {
    setState((current) => ({ ...current, cargando: true, error: null }));

    try {
      const metas = await listarMetas(repository);
      setState({ metas, cargando: false, error: null });
    } catch (error) {
      setState((current) => ({ ...current, cargando: false, error: obtenerMensajeError(error) }));
    }
  }, [repository]);

  useEffect(() => {
    void cargarDatos();
  }, [cargarDatos]);

  const ejecutarMutacion = useCallback(
    async (mutacion: () => Promise<void>) => {
      setState((current) => ({ ...current, cargando: true, error: null }));

      try {
        await mutacion();
        const metas = await listarMetas(repository);
        setState({ metas, cargando: false, error: null });
      } catch (error) {
        setState((current) => ({ ...current, cargando: false, error: obtenerMensajeError(error) }));
        throw error;
      }
    },
    [repository],
  );

  const agregarMeta = useCallback(
    (meta: NuevaMetaAhorro) => ejecutarMutacion(async () => {
      await agregarMetaUseCase(repository, meta);
    }),
    [ejecutarMutacion, repository],
  );

  const actualizarMeta = useCallback(
    (meta: MetaAhorro) => ejecutarMutacion(async () => {
      await actualizarMetaUseCase(repository, meta);
    }),
    [ejecutarMutacion, repository],
  );

  const eliminarMeta = useCallback(
    (id: string) => ejecutarMutacion(async () => {
      await eliminarMetaUseCase(repository, id);
    }),
    [ejecutarMutacion, repository],
  );

  const value = useMemo<MetasContextValue>(
    () => ({
      metas: state.metas,
      cargando: state.cargando,
      error: state.error,
      recargar: cargarDatos,
      agregarMeta,
      actualizarMeta,
      eliminarMeta,
    }),
    [agregarMeta, actualizarMeta, cargarDatos, eliminarMeta, state],
  );

  return <MetasContext.Provider value={value}>{children}</MetasContext.Provider>;
}
