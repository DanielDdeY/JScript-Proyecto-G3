import type { PresupuestoMensual } from '../../../../shared/types/presupuestoMensual';

export interface PresupuestoSaldoRepository {
  listarPresupuestos(): Promise<PresupuestoMensual[]>;
  obtenerPresupuestoActual(): Promise<PresupuestoMensual | null>;
}
