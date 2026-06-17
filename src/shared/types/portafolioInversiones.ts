import  type {ActivoInversion} from "./activoInversion";

export interface PortafolioInversiones {
  idUsuario: string;
  riesgo: 'BAJO' | 'MEDIO' | 'ALTO';
  activos: ActivoInversion[]; // Nivel 2 (Portafolio -> Activo -> Historial)
}