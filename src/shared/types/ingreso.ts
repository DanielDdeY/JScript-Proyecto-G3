import type { Id } from './id';

export type FuenteIngreso = 'Sueldo' | 'Freelance' | 'Inversiones' | 'Venta' | 'Premio' | 'Otros';

export interface Ingreso {
  id: Id;
  monto: number;
  fecha: string;
  fuente: FuenteIngreso;
  descripcion: string;
}
