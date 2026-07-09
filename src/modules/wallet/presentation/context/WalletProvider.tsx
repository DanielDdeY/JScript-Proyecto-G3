import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { addCard, addExpense, addIncome } from '../../application/addWalletMovement';
import { getWalletOverview } from '../../application/getWalletOverview';
import { updateProfile } from '../../application/updateProfile';
import { emptyWalletOverview, type WalletOverview } from '../../domain/models/walletOverview';
import type { NuevaTarjeta, NuevoGasto, NuevoIngreso, WalletRepository } from '../../domain/repositories/walletRepository';
import { walletAlovaRepository } from '../../infrastructure/walletAlovaRepository';
import type { Perfil } from '../../../../shared/types/perfil';

export interface WalletContextValue extends WalletOverview {
  cargando: boolean;
  error: string | null;
  recargar: () => Promise<void>;
  agregarGasto: (gasto: NuevoGasto) => Promise<void>;
  agregarIngreso: (ingreso: NuevoIngreso) => Promise<void>;
  agregarTarjeta: (tarjeta: NuevaTarjeta) => Promise<void>;
  actualizarPerfil: (perfil: Partial<Perfil>) => Promise<void>;
}

interface WalletProviderProps {
  children: ReactNode;
  repository?: WalletRepository;
}

interface WalletState {
  data: WalletOverview;
  cargando: boolean;
  error: string | null;
}

export const WalletContext = createContext<WalletContextValue | undefined>(undefined);

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'No se pudieron cargar los datos de la billetera.';

export function WalletProvider({ children, repository = walletAlovaRepository }: WalletProviderProps) {
  const [state, setState] = useState<WalletState>({
    data: emptyWalletOverview,
    cargando: true,
    error: null,
  });

  const cargarDatos = useCallback(async () => {
    setState((currentState) => ({ ...currentState, cargando: true, error: null }));

    try {
      const data = await getWalletOverview(repository);
      setState({ data, cargando: false, error: null });
    } catch (error) {
      setState({ data: emptyWalletOverview, cargando: false, error: getErrorMessage(error) });
    }
  }, [repository]);

  useEffect(() => {
    void cargarDatos();
  }, [cargarDatos]);

  const ejecutarMutacion = useCallback(
    async (mutacion: (resumenActual: WalletOverview) => Promise<void>) => {
      setState((currentState) => ({ ...currentState, cargando: true, error: null }));

      try {
        await mutacion(state.data);
        const data = await getWalletOverview(repository);
        setState({ data, cargando: false, error: null });
      } catch (error) {
        setState((currentState) => ({ ...currentState, cargando: false, error: getErrorMessage(error) }));
        throw error;
      }
    },
    [repository, state.data],
  );

  const agregarGasto = useCallback(
    (gasto: NuevoGasto) => ejecutarMutacion((resumenActual) => addExpense(repository, gasto, resumenActual)),
    [ejecutarMutacion, repository],
  );

  const agregarIngreso = useCallback(
    (ingreso: NuevoIngreso) => ejecutarMutacion((resumenActual) => addIncome(repository, ingreso, resumenActual)),
    [ejecutarMutacion, repository],
  );

  const agregarTarjeta = useCallback(
    (tarjeta: NuevaTarjeta) => ejecutarMutacion((resumenActual) => addCard(repository, tarjeta, resumenActual)),
    [ejecutarMutacion, repository],
  );

  const actualizarPerfil = useCallback(
    (perfil: Partial<Perfil>) => ejecutarMutacion(() => updateProfile(repository, perfil)),
    [ejecutarMutacion, repository],
  );

  const value = useMemo<WalletContextValue>(
    () => ({
      ...state.data,
      cargando: state.cargando,
      error: state.error,
      recargar: cargarDatos,
      agregarGasto,
      agregarIngreso,
      agregarTarjeta,
      actualizarPerfil,
    }),
    [actualizarPerfil, agregarGasto, agregarIngreso, agregarTarjeta, cargarDatos, state],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}
