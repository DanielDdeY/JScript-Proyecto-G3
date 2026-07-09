import type { Id } from './id';

export interface Banco {
  id: Id;
  nombre: string;
  logoUrl?: string;
  tcea: number;
  tiemposDePagoMeses: number[];
  seguroDesgravamen: string;
}
