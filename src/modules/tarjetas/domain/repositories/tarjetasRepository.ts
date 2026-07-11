import type { Banco } from '../../../../shared/types/banco';
import type { Tarjeta } from '../../../../shared/types/tarjeta';

export type NuevaTarjetaConDetalles = Omit<Tarjeta, 'id' | 'banco'>;

export interface TarjetasRepository {
  obtenerTarjetas(): Promise<Tarjeta[]>;
  obtenerBancos(): Promise<Banco[]>;
  agregarTarjeta(tarjeta: NuevaTarjetaConDetalles): Promise<void>;
  recargar(): Promise<void>;
}
