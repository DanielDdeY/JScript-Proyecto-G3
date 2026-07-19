import type { ActivoInversion } from './activoInversion';

export interface PortafolioInversiones {
  id?: string;
  idUsuario: string;
  riesgo: 'BAJO' | 'MEDIO' | 'ALTO';
  activos: ActivoInversion[];
}
