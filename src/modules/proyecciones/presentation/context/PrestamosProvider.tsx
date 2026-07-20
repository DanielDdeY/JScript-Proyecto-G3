import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { actualizarEstadoCuotaPrestamo } from '../../application/actualizarEstadoCuotaPrestamo';
import { agregarPrestamo as crearPrestamo } from '../../application/agregarPrestamo';
import { listarBancosPrestamo } from '../../application/listarBancosPrestamo';
import { listarPrestamos } from '../../application/listarPrestamos';
import type { NuevoPrestamo, PrestamosRepository } from '../../domain/repositories/prestamosRepository';
import { prestamosAlovaRepository } from '../../infrastructure/prestamosAlovaRepository';
import type { Banco } from '../../../../shared/types/banco';
import type { CuotaPrestamo } from '../../../../shared/types/cuotaPrestamo';
import type { Prestamo } from '../../../../shared/types/prestamo';

export interface PrestamosContextValue {
  prestamos: Prestamo[];
  bancos: Banco[];
  cargando: boolean;
  error: string | null;
  recargar: () => Promise<void>;
  agregarPrestamo: (prestamo: NuevoPrestamo) => Promise<void>;
  cambiarEstadoCuota: (prestamoId: string, cuota: CuotaPrestamo) => Promise<void>;
}

interface PrestamosProviderProps {
  readonly children: ReactNode;
  readonly repository?: PrestamosRepository;
}

interface PrestamosState {
  prestamos: Prestamo[];
  bancos: Banco[];
  cargando: boolean;
  error: string | null;
}

const obtenerMensajeError = (error: unknown) =>
  error instanceof Error ? error.message : 'No se pudieron cargar los préstamos.';

export const PrestamosContext = createContext<PrestamosContextValue | undefined>(undefined);

export function PrestamosProvider({ children, repository = prestamosAlovaRepository }: PrestamosProviderProps) {
  const [state, setState] = useState<PrestamosState>({
    prestamos: [],
    bancos: [],
    cargando: true,
    error: null,
  });

  const cargarDatos = useCallback(async () => {
    setState((current) => ({ ...current, cargando: true, error: null }));

    try {
      const [prestamos, bancos] = await Promise.all([listarPrestamos(repository), listarBancosPrestamo(repository)]);
      setState({ prestamos, bancos, cargando: false, error: null });
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
        const [prestamos, bancos] = await Promise.all([listarPrestamos(repository), listarBancosPrestamo(repository)]);
        setState({ prestamos, bancos, cargando: false, error: null });
      } catch (error) {
        setState((current) => ({ ...current, cargando: false, error: obtenerMensajeError(error) }));
        throw error;
      }
    },
    [repository],
  );

  const agregarPrestamo = useCallback(
    (prestamo: NuevoPrestamo) => ejecutarMutacion(async () => {
      await crearPrestamo(repository, prestamo);
    }),
    [ejecutarMutacion, repository],
  );

  const cambiarEstadoCuota = useCallback(
    (prestamoId: string, cuota: CuotaPrestamo) => ejecutarMutacion(async () => {
      await actualizarEstadoCuotaPrestamo(repository, prestamoId, cuota);
    }),
    [ejecutarMutacion, repository],
  );

  const value = useMemo<PrestamosContextValue>(
    () => ({
      prestamos: state.prestamos,
      bancos: state.bancos,
      cargando: state.cargando,
      error: state.error,
      recargar: cargarDatos,
      agregarPrestamo,
      cambiarEstadoCuota,
    }),
    [agregarPrestamo, cambiarEstadoCuota, cargarDatos, state],
  );

  return <PrestamosContext.Provider value={value}>{children}</PrestamosContext.Provider>;
}
