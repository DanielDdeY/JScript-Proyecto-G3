import type { DetalleCuotas } from './detalleCuotas';
import type { GastoCategoria } from './gastoCategoria';
import type { GastoCompartido } from './gastoCompartido';
import type { Id } from './id';

export interface Gasto {
  id: Id;
  monto: number;
  fecha: string;
  categoria: GastoCategoria;
  tarjetaId: Id;
  descripcion: string;
  detalleCuotas?: DetalleCuotas;
  gastoCompartido?: GastoCompartido;
}
