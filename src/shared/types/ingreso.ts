import type { Id } from './id';

export interface Ingreso {
  id: Id;
  monto: number;
  fecha: string;
  fuente: string;
  descripcion: string;
}
