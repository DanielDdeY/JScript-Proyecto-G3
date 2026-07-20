import type { PresupuestoMensual } from '../../../../shared/types/presupuestoMensual';

export interface NotificacionesRepository {
  listarPresupuestos(): Promise<PresupuestoMensual[]>;
}
