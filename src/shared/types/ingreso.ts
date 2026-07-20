import type { Id } from './id';
import type { Reincidencia } from './reincidencia';

export type FuenteIngreso = 'Sueldo' | 'Freelance' | 'Inversiones' | 'Venta' | 'Premio' | 'Otros';

export interface Ingreso {
  id: Id;
  monto: number;
  fecha: string;
  fuente: FuenteIngreso;
  descripcion: string;
  reincidencia: Reincidencia;
}
