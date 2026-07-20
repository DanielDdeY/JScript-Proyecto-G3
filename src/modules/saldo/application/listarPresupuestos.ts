import type { PresupuestoMensual } from '../../../shared/types/presupuestoMensual';
import type { PresupuestoSaldoRepository } from '../domain/repositories/presupuestoSaldoRepository';

export const listarPresupuestos = (repository: PresupuestoSaldoRepository): Promise<PresupuestoMensual[]> =>
  repository.listarPresupuestos();

export const obtenerPresupuestoActual = (repository: PresupuestoSaldoRepository): Promise<PresupuestoMensual | null> =>
  repository.obtenerPresupuestoActual();
