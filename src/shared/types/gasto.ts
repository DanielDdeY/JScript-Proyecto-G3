import type { DetalleCuotas } from './detalleCuotas';
import type { GastoCategoria } from './gastoCategoria';
import type { GastoCompartido } from './gastoCompartido';
import type { Id } from './id';

export type OrigenGasto = 'EFECTIVO' | 'TARJETA';

export interface Gasto {
  id: Id;
  monto: number;
  fecha: string;
  categoria: GastoCategoria;
  tarjetaId?: Id;
  origen?: OrigenGasto;
  descripcion: string;
  detalleCuotas?: DetalleCuotas;
  gastoCompartido?: GastoCompartido;
}
