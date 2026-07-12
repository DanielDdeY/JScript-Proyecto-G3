import type { FiltrosIngresos } from '../../../shared/types/filtros';
import type { Ingreso } from '../../../shared/types/ingreso';
import type { PaginatedResponse } from '../../../shared/types/paginatedResponse';
import type { PaginacionParams } from '../../../shared/services/paginacionService';
import type { IngresosRepository } from '../domain/repositories/ingresosRepository';

export const listarIngresosPaginados = (
  repository: IngresosRepository,
  filtros: FiltrosIngresos,
  paginacion: PaginacionParams,
): Promise<PaginatedResponse<Ingreso>> => repository.listarIngresosPaginados(filtros, paginacion);
