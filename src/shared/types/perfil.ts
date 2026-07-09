import type { Id } from './id';

export interface Perfil {
  id?: Id;
  nombre: string;
  email?: string;
  avatarUrl?: string;
  saldoTotal: number;
}
