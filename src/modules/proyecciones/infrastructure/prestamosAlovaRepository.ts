import { httpClient } from '../../../core/services/alovaClient';
import type { Banco } from '../../../shared/types/banco';
import type { CuotaPrestamo } from '../../../shared/types/cuotaPrestamo';
import type { Prestamo } from '../../../shared/types/prestamo';
import { normalizarPrestamo, obtenerSiguienteEstadoCuota, recalcularPrestamoPorCuotas } from '../domain/services/prestamoService';
import type { NuevoPrestamo, PrestamosRepository } from '../domain/repositories/prestamosRepository';

const ENDPOINTS = {
  prestamos: '/prestamos',
  prestamoById: (id: string) => `/prestamos/${id}`,
  bancos: '/bancos',
} as const;

const generarId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

export const prestamosAlovaRepository: PrestamosRepository = {
  async listarPrestamos(): Promise<Prestamo[]> {
    const prestamos = await httpClient.get<Prestamo[]>(ENDPOINTS.prestamos);
    return prestamos.map(normalizarPrestamo);
  },

  async listarBancos(): Promise<Banco[]> {
    return httpClient.get<Banco[]>(ENDPOINTS.bancos);
  },

  async agregarPrestamo(prestamo: NuevoPrestamo): Promise<Prestamo> {
    const nuevoPrestamo = recalcularPrestamoPorCuotas({
      ...prestamo,
      id: generarId('prestamo'),
    });

    return httpClient.post<Prestamo, Prestamo>(ENDPOINTS.prestamos, nuevoPrestamo);
  },

  async actualizarCuota(prestamoId: string, cuota: CuotaPrestamo): Promise<Prestamo> {
    const prestamoActual = normalizarPrestamo(await httpClient.get<Prestamo>(ENDPOINTS.prestamoById(prestamoId)));
    const cuotasActualizadas = prestamoActual.cuotas.map((item) =>
      item.numeroCuota === cuota.numeroCuota
        ? { ...item, estado: obtenerSiguienteEstadoCuota(item.estado) }
        : item,
    );
    const prestamoActualizado = recalcularPrestamoPorCuotas({ ...prestamoActual, cuotas: cuotasActualizadas });

    return httpClient.put<Prestamo, Prestamo>(ENDPOINTS.prestamoById(prestamoId), prestamoActualizado);
  },
};
