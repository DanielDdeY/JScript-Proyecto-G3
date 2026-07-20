import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Banco } from '../../../../shared/types/banco';
import type { Tarjeta } from '../../../../shared/types/tarjeta';
import { crearTarjeta } from '../../application/crearTarjeta';
import { listarBancos } from '../../application/listarBancos';
import { listarTarjetas } from '../../application/listarTarjetas';
import type { NuevaTarjetaConDetalles, TarjetasRepository } from '../../domain/repositories/tarjetasRepository';
import { createTarjetasWalletRepository } from '../../infrastructure/tarjetasWalletRepository';
import { useWallet } from '../../../wallet/presentation/hooks/useWallet';

interface TarjetasState {
  tarjetas: Tarjeta[];
  bancos: Banco[];
  cargando: boolean;
  error: string | null;
}

export interface TarjetasContextValue extends TarjetasState {
  recargar: () => Promise<void>;
  agregarTarjeta: (tarjeta: NuevaTarjetaConDetalles) => Promise<void>;
}

interface TarjetasProviderProps {
  readonly children: ReactNode;
  readonly repository?: TarjetasRepository;
}

export const TarjetasContext = createContext<TarjetasContextValue | undefined>(undefined);

const obtenerMensajeError = (error: unknown) =>
  error instanceof Error ? error.message : 'No se pudo cargar la información de tarjetas.';

export function TarjetasProvider({ children, repository: repositoryProp }: TarjetasProviderProps) {
  const wallet = useWallet();
  const repository = useMemo(
    () => repositoryProp ?? createTarjetasWalletRepository(wallet),
    [repositoryProp, wallet],
  );

  const [state, setState] = useState<TarjetasState>({
    tarjetas: [],
    bancos: [],
    cargando: true,
    error: null,
  });

  const cargarTarjetas = useCallback(async () => {
    setState((currentState) => ({ ...currentState, cargando: true, error: null }));

    try {
      const [tarjetas, bancos] = await Promise.all([listarTarjetas(repository), listarBancos(repository)]);
      setState({ tarjetas, bancos, cargando: false, error: null });
    } catch (error) {
      setState((currentState) => ({ ...currentState, cargando: false, error: obtenerMensajeError(error) }));
    }
  }, [repository]);

  useEffect(() => {
    void cargarTarjetas();
  }, [cargarTarjetas]);

  const agregarTarjeta = useCallback(
    async (tarjeta: NuevaTarjetaConDetalles) => {
      setState((currentState) => ({ ...currentState, cargando: true, error: null }));

      try {
        await crearTarjeta(repository, tarjeta);
        await repository.recargar();
        await cargarTarjetas();
      } catch (error) {
        setState((currentState) => ({ ...currentState, cargando: false, error: obtenerMensajeError(error) }));
        throw error;
      }
    },
    [cargarTarjetas, repository],
  );

  const value = useMemo<TarjetasContextValue>(
    () => ({
      ...state,
      recargar: cargarTarjetas,
      agregarTarjeta,
    }),
    [agregarTarjeta, cargarTarjetas, state],
  );

  return <TarjetasContext.Provider value={value}>{children}</TarjetasContext.Provider>;
}
