import { httpClient } from '../../../core/services/alovaClient';
import type { EstadoDeudaAmigo } from '../../../shared/types/amigoDeudor';
import type { FiltrosWallet } from '../../../shared/types/filtros';
import type { Gasto } from '../../../shared/types/gasto';
import type { PaginatedResponse } from '../../../shared/types/paginatedResponse';
import type { PaginacionParams } from '../../../shared/services/paginacionService';
import { idsIguales } from '../../../shared/utils/ids';
import type { GastosRepository } from '../domain/repositories/gastosRepository';
import { gastoPaginationService } from '../domain/services/gastoPaginationService';

const ENDPOINTS = {
  gastos: '/gastos',
  gastoById: (id: Gasto['id']) => `/gastos/${id}`,
} as const;

interface JsonServerPaginatedResponse<T> {
  data: T[];
  items?: number;
  pages?: number;
  next?: number | null;
  prev?: number | null;
}

const crearQueryPaginada = (filtros: FiltrosWallet, paginacion: PaginacionParams) => {
  const params = new URLSearchParams();
  params.set('_page', String(paginacion.pagina));
  params.set('_per_page', String(paginacion.limite));
  params.set('_sort', '-fecha');

  if (filtros.rangoFecha.inicio) params.set('fecha_gte', filtros.rangoFecha.inicio);
  if (filtros.rangoFecha.fin) params.set('fecha_lte', filtros.rangoFecha.fin);
  if (filtros.importancia && filtros.importancia !== 'TODAS') {
    params.set('categoria.importancia', filtros.importancia);
  }

  return `${ENDPOINTS.gastos}?${params.toString()}`;
};

const normalizarRespuesta = (
  response: JsonServerPaginatedResponse<Gasto> | Gasto[],
  filtros: FiltrosWallet,
  paginacion: PaginacionParams,
): PaginatedResponse<Gasto> => {
  if (Array.isArray(response)) {
    return gastoPaginationService.paginar(response, filtros, paginacion);
  }

  const totalRegistros = Number(response.items ?? response.data.length);
  const totalPaginas = Number(response.pages ?? Math.max(Math.ceil(totalRegistros / paginacion.limite), 1));

  return {
    data: response.data,
    meta: {
      totalRegistros,
      paginaActual: Math.min(Math.max(paginacion.pagina, 1), Math.max(totalPaginas, 1)),
      totalPaginas: Math.max(totalPaginas, 1),
      registrosPorPagina: paginacion.limite,
      registrosMostrados: response.data.length,
    },
    estado: 200,
  };
};

export const gastosWalletRepository: GastosRepository = {
  async listarGastos(): Promise<Gasto[]> {
    return httpClient.get<Gasto[]>(ENDPOINTS.gastos);
  },

  async listarGastosPaginados(filtros: FiltrosWallet, paginacion: PaginacionParams): Promise<PaginatedResponse<Gasto>> {
    try {
      const response = await httpClient.get<JsonServerPaginatedResponse<Gasto> | Gasto[]>(crearQueryPaginada(filtros, paginacion));
      return normalizarRespuesta(response, filtros, paginacion);
    } catch {
      const gastos = await this.listarGastos();
      return gastoPaginationService.paginar(gastos, filtros, paginacion);
    }
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
