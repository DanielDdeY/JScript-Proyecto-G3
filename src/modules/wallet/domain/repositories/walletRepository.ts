import type { Gasto } from '../../../../shared/types/gasto';
import type { Ingreso } from '../../../../shared/types/ingreso';
import type { Perfil } from '../../../../shared/types/perfil';
import type { Tarjeta } from '../../../../shared/types/tarjeta';
import type { WalletOverview } from '../models/walletOverview';

export type NuevoGasto = Omit<Gasto, 'id'>;
export type NuevoIngreso = Omit<Ingreso, 'id'>;
export type NuevaTarjeta = Omit<Tarjeta, 'id' | 'banco'>;

export interface WalletRepository {
  obtenerResumen(): Promise<WalletOverview>;
  agregarGasto(gasto: NuevoGasto, resumenActual: WalletOverview): Promise<void>;
  agregarIngreso(ingreso: NuevoIngreso, resumenActual: WalletOverview): Promise<void>;
  agregarTarjeta(tarjeta: NuevaTarjeta, resumenActual: WalletOverview): Promise<void>;
  actualizarPerfil(perfil: Partial<Perfil>): Promise<void>;
}
