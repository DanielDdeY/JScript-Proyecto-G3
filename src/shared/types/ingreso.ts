import type { Id } from './id';
import type { OrigenMovimiento } from './origenMovimiento';
import type { Reincidencia } from './reincidencia';

export type FuenteIngreso = 'Sueldo' | 'Freelance' | 'Inversiones' | 'Venta' | 'Premio' | 'Otros';
export type OrigenIngreso = OrigenMovimiento;

export interface Ingreso {
  id: Id;
  monto: number;
  fecha: string;
  fuente: FuenteIngreso;
  origen?: OrigenIngreso;
  tarjetaId?: Id;
  descripcion: string;
  reincidencia: Reincidencia;
}
