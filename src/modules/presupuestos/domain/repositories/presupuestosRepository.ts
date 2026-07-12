import type { PresupuestoMensual } from '../../../../shared/types/presupuestoMensual';
import type { GuardarLimiteMensualPayload, GuardarLimitePresupuestoPayload } from '../services/presupuestoService';

export interface PresupuestosRepository {
  listarPresupuestos(): Promise<PresupuestoMensual[]>;
  guardarLimite(payload: GuardarLimitePresupuestoPayload): Promise<PresupuestoMensual>;
  guardarLimiteMensual(payload: GuardarLimiteMensualPayload): Promise<PresupuestoMensual>;
}
