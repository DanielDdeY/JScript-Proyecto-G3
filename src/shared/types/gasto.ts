import type { DetalleCuotas } from './detalleCuotas';
import type { GastoCategoria } from './gastoCategoria';
import type { GastoCompartido } from './gastoCompartido';
import type { Id } from './id';
import type { PrestacionGasto } from './prestacionGasto';

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
  prestacion?: PrestacionGasto;
}
