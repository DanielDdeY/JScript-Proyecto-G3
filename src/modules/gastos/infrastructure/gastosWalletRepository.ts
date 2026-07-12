import { httpClient } from '../../../core/services/alovaClient';
import type { EstadoDeudaAmigo } from '../../../shared/types/amigoDeudor';
import type { Gasto } from '../../../shared/types/gasto';
import { idsIguales } from '../../../shared/utils/ids';
import type { GastosRepository } from '../domain/repositories/gastosRepository';

const ENDPOINTS = {
  gastos: '/gastos',
  gastoById: (id: Gasto['id']) => `/gastos/${id}`,
} as const;

export const gastosWalletRepository: GastosRepository = {
  async listarGastos(): Promise<Gasto[]> {
    return httpClient.get<Gasto[]>(ENDPOINTS.gastos);
  },

  async actualizarEstadoDeudor(gastoId: Gasto['id'], nombreId: string, estado: EstadoDeudaAmigo): Promise<Gasto> {
    const gasto = await httpClient.get<Gasto>(ENDPOINTS.gastoById(gastoId));

    if (!gasto.gastoCompartido) {
      throw new Error('Este gasto no tiene deudores vinculados.');
    }

    const gastoActualizado: Gasto = {
      ...gasto,
      gastoCompartido: {
        ...gasto.gastoCompartido,
        deudores: gasto.gastoCompartido.deudores.map((amigo) =>
          idsIguales(amigo.nombreId, nombreId) ? { ...amigo, estado } : amigo,
        ),
      },
    };

    return httpClient.put<Gasto, Gasto>(ENDPOINTS.gastoById(gastoId), gastoActualizado);
  },
};
