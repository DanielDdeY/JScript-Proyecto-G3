import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { agregarActivoInversion } from '../../application/agregarActivoInversion';
import { listarInversiones } from '../../application/listarInversiones';
import type { InversionesRepository, NuevoActivoInversion } from '../../domain/repositories/inversionesRepository';
import { inversionesAlovaRepository } from '../../infrastructure/inversionesAlovaRepository';
import type { PortafolioInversiones } from '../../../../shared/types/portafolioInversiones';

export interface InversionesContextValue {
  portafolios: PortafolioInversiones[];
  cargando: boolean;
  error: string | null;
  recargar: () => Promise<void>;
  agregarActivo: (idUsuario: string, activo: NuevoActivoInversion) => Promise<void>;
}

interface InversionesProviderProps {
  children: ReactNode;
  repository?: InversionesRepository;
}

interface InversionesState {
  portafolios: PortafolioInversiones[];
  cargando: boolean;
  error: string | null;
}

const obtenerMensajeError = (error: unknown) =>
  error instanceof Error ? error.message : 'No se pudieron cargar las inversiones.';

export const InversionesContext = createContext<InversionesContextValue | undefined>(undefined);

export function InversionesProvider({ children, repository = inversionesAlovaRepository }: InversionesProviderProps) {
  const [state, setState] = useState<InversionesState>({ portafolios: [], cargando: true, error: null });

  const cargarDatos = useCallback(async () => {
    setState((current) => ({ ...current, cargando: true, error: null }));

    try {
      const portafolios = await listarInversiones(repository);
      setState({ portafolios, cargando: false, error: null });
    } catch (error) {
      setState({ portafolios: [], cargando: false, error: obtenerMensajeError(error) });
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
        const portafolios = await listarInversiones(repository);
        setState({ portafolios, cargando: false, error: null });
      } catch (error) {
        setState((current) => ({ ...current, cargando: false, error: obtenerMensajeError(error) }));
        throw error;
      }
    },
    [repository],
  );

  const agregarActivo = useCallback(
    (idUsuario: string, activo: NuevoActivoInversion) =>
      ejecutarMutacion(async () => {
        await agregarActivoInversion(repository, idUsuario, activo);
      }),
    [ejecutarMutacion, repository],
  );

  const value = useMemo<InversionesContextValue>(
    () => ({
      portafolios: state.portafolios,
      cargando: state.cargando,
      error: state.error,
      recargar: cargarDatos,
      agregarActivo,
    }),
    [agregarActivo, cargarDatos, state],
  );

  return <InversionesContext.Provider value={value}>{children}</InversionesContext.Provider>;
}
