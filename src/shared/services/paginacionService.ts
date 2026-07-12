import type { PaginacionMeta } from '../types/paginacionMeta';
import type { PaginatedResponse } from '../types/paginatedResponse';

export interface PaginacionParams {
  pagina: number;
  limite: number;
}

export const REGISTROS_POR_PAGINA_DEFAULT = 10;

const normalizarPagina = (pagina: number) => (Number.isFinite(pagina) && pagina > 0 ? Math.floor(pagina) : 1);
const normalizarLimite = (limite: number) => (Number.isFinite(limite) && limite > 0 ? Math.floor(limite) : REGISTROS_POR_PAGINA_DEFAULT);

export const paginacionService = {
  crearMeta(totalRegistros: number, pagina: number, limite: number, registrosMostrados: number): PaginacionMeta {
    const registrosPorPagina = normalizarLimite(limite);
    const totalPaginas = Math.max(Math.ceil(totalRegistros / registrosPorPagina), 1);
    const paginaActual = Math.min(normalizarPagina(pagina), totalPaginas);

    return {
      totalRegistros,
      paginaActual,
      totalPaginas,
      registrosPorPagina,
      registrosMostrados,
    };
  },

  paginar<T>(items: T[], params: PaginacionParams): PaginatedResponse<T> {
    const limite = normalizarLimite(params.limite);
    const totalRegistros = items.length;
    const totalPaginas = Math.max(Math.ceil(totalRegistros / limite), 1);
    const paginaActual = Math.min(normalizarPagina(params.pagina), totalPaginas);
    const inicio = (paginaActual - 1) * limite;
    const data = items.slice(inicio, inicio + limite);

    return {
      data,
      meta: this.crearMeta(totalRegistros, paginaActual, limite, data.length),
      estado: 200,
    };
  },

  crearRespuestaVacia<T>(params: PaginacionParams): PaginatedResponse<T> {
    const limite = normalizarLimite(params.limite);
    return {
      data: [],
      meta: this.crearMeta(0, normalizarPagina(params.pagina), limite, 0),
      estado: 200,
    };
  },
};
