import { httpClient } from '../../../core/services/alovaClient';
import type { Gasto } from '../../../shared/types/gasto';
import type { PresupuestoMensual } from '../../../shared/types/presupuestoMensual';
import { presupuestoService } from '../../presupuestos/domain/services/presupuestoService';
import type { PresupuestoSaldoRepository } from '../domain/repositories/presupuestoSaldoRepository';

const ENDPOINTS = {
  presupuestos: '/presupuestos',
  gastos: '/gastos',
} as const;

const obtenerListaOpcional = async <TItem>(endpoint: string): Promise<TItem[]> => {
  try {
    return await httpClient.get<TItem[]>(endpoint);
  } catch {
    return [];
  }
};

export const presupuestoSaldoAlovaRepository: PresupuestoSaldoRepository = {
  async listarPresupuestos(): Promise<PresupuestoMensual[]> {
    const [presupuestos, gastos] = await Promise.all([
      obtenerListaOpcional<PresupuestoMensual>(ENDPOINTS.presupuestos),
      obtenerListaOpcional<Gasto>(ENDPOINTS.gastos),
    ]);

    return presupuestoService.normalizarListaConGastos(presupuestos, gastos);
  },

  async obtenerPresupuestoActual(): Promise<PresupuestoMensual | null> {
    const presupuestos = await this.listarPresupuestos();
    return presupuestoService.obtenerPresupuestoMasRelevante(presupuestos);
  },
};
