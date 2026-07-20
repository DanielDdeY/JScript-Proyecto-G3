import { httpClient } from '../../../core/services/alovaClient';
import type { FiltrosIngresos } from '../../../shared/types/filtros';
import type { Ingreso } from '../../../shared/types/ingreso';
import type { PaginatedResponse } from '../../../shared/types/paginatedResponse';
import type { PaginacionParams } from '../../../shared/services/paginacionService';
import type { IngresosRepository } from '../domain/repositories/ingresosRepository';
import { ingresoPaginationService } from '../domain/services/ingresoPaginationService';

const ENDPOINTS = {
  ingresos: '/ingresos',
} as const;

interface JsonServerPaginatedResponse<T> {
  data: T[];
  items?: number;
  pages?: number;
}

const crearQueryPaginada = (filtros: FiltrosIngresos, paginacion: PaginacionParams) => {
  const params = new URLSearchParams();
  params.set('_page', String(paginacion.pagina));
  params.set('_per_page', String(paginacion.limite));
  params.set('_sort', '-fecha');

  if (filtros.rangoFecha.inicio) params.set('fecha_gte', filtros.rangoFecha.inicio);
  if (filtros.rangoFecha.fin) params.set('fecha_lte', filtros.rangoFecha.fin);
  if (filtros.fuente && filtros.fuente !== 'TODAS') params.set('fuente', filtros.fuente);

  return `${ENDPOINTS.ingresos}?${params.toString()}`;
};

const normalizarRespuesta = (
  response: JsonServerPaginatedResponse<Ingreso> | Ingreso[],
  filtros: FiltrosIngresos,
  paginacion: PaginacionParams,
): PaginatedResponse<Ingreso> => {
  if (Array.isArray(response)) {
    return ingresoPaginationService.paginar(response, filtros, paginacion);
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

export const ingresosAlovaRepository: IngresosRepository = {
  async listarIngresosPaginados(filtros: FiltrosIngresos, paginacion: PaginacionParams): Promise<PaginatedResponse<Ingreso>> {
    try {
      const response = await httpClient.get<JsonServerPaginatedResponse<Ingreso> | Ingreso[]>(crearQueryPaginada(filtros, paginacion));
      return normalizarRespuesta(response, filtros, paginacion);
    } catch {
      const ingresos = await httpClient.get<Ingreso[]>(ENDPOINTS.ingresos);
      return ingresoPaginationService.paginar(ingresos, filtros, paginacion);
    }
  },
};
