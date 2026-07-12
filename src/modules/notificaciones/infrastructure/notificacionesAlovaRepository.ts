import { httpClient } from '../../../core/services/alovaClient';
import type { PresupuestoMensual } from '../../../shared/types/presupuestoMensual';
import type { NotificacionesRepository } from '../domain/repositories/notificacionesRepository';

const ENDPOINTS = {
  presupuestos: '/presupuestos',
} as const;

export const notificacionesAlovaRepository: NotificacionesRepository = {
  async listarPresupuestos(): Promise<PresupuestoMensual[]> {
    return httpClient.get<PresupuestoMensual[]>(ENDPOINTS.presupuestos);
  },
};
