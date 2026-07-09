import type { AlertaPresupuesto } from './alertaPresupuesto';
import type { DetalleCategoria } from './detalleCategoria';

export interface PresupuestoMensual {
  id: string;
  mes: string;
  totalAsignado: number;
  desgloseCategorias: DetalleCategoria[];
  alertasActivas: AlertaPresupuesto[];
}
