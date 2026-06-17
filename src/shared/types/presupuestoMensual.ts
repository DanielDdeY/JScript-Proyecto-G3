import type { DetalleCategoria } from '../../shared/types/detalleCategoria';
import type { AlertaPresupuesto } from '../../shared/types/alertaPresupuesto';

export interface PresupuestoMensual {
  id: string;
  mes: string; // ej. "2026-06"
  totalAsignado: number;
  desgloseCategorias: DetalleCategoria[]; // Nivel 1
  alertasActivas: AlertaPresupuesto[];    // Nivel 1
}