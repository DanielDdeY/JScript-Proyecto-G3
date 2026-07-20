import type { FiltrosWallet } from '../../../shared/types/filtros';
import type { Gasto } from '../../../shared/types/gasto';
import type { PaginatedResponse } from '../../../shared/types/paginatedResponse';
import type { PaginacionParams } from '../../../shared/services/paginacionService';
import type { GastosRepository } from '../domain/repositories/gastosRepository';

export const listarGastos = (repository: GastosRepository): Promise<Gasto[]> => repository.listarGastos();

export const listarGastosPaginados = (
  repository: GastosRepository,
  filtros: FiltrosWallet,
  paginacion: PaginacionParams,
): Promise<PaginatedResponse<Gasto>> => repository.listarGastosPaginados(filtros, paginacion);
