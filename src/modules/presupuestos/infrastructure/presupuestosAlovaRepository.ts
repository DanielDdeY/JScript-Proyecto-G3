import { httpClient } from '../../../core/services/alovaClient';
import type { PresupuestoMensual } from '../../../shared/types/presupuestoMensual';
import type { PresupuestosRepository } from '../domain/repositories/presupuestosRepository';
import { presupuestoService, type GuardarLimiteMensualPayload, type GuardarLimitePresupuestoPayload } from '../domain/services/presupuestoService';

const ENDPOINTS = {
  presupuestos: '/presupuestos',
  presupuestoById: (id: string) => `/presupuestos/${id}`,
} as const;

export const presupuestosAlovaRepository: PresupuestosRepository = {
  async listarPresupuestos(): Promise<PresupuestoMensual[]> {
    const presupuestos = await httpClient.get<PresupuestoMensual[]>(ENDPOINTS.presupuestos);
    return presupuestoService.ordenarPorMesDesc(presupuestos);
  },

  async guardarLimite(payload: GuardarLimitePresupuestoPayload): Promise<PresupuestoMensual> {
    const presupuestos = await this.listarPresupuestos();
    const { presupuesto, esNuevo } = presupuestoService.actualizarLimite(presupuestos, payload);

    if (esNuevo) {
      return httpClient.post<PresupuestoMensual, PresupuestoMensual>(ENDPOINTS.presupuestos, presupuesto);
    }

    return httpClient.patch<PresupuestoMensual, Partial<PresupuestoMensual>>(
      ENDPOINTS.presupuestoById(presupuesto.id),
      {
        desgloseCategorias: presupuesto.desgloseCategorias,
      },
    );
  },

  async guardarLimiteMensual(payload: GuardarLimiteMensualPayload): Promise<PresupuestoMensual> {
    const presupuestos = await this.listarPresupuestos();
    const { presupuesto, esNuevo } = presupuestoService.actualizarLimiteMensual(presupuestos, payload);

    if (esNuevo) {
      return httpClient.post<PresupuestoMensual, PresupuestoMensual>(ENDPOINTS.presupuestos, presupuesto);
    }

    return httpClient.patch<PresupuestoMensual, Partial<PresupuestoMensual>>(
      ENDPOINTS.presupuestoById(presupuesto.id),
      {
        totalAsignado: presupuesto.totalAsignado,
      },
    );
  },
};
