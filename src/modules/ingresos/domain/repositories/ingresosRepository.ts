import type { FiltrosIngresos } from '../../../../shared/types/filtros';
import type { Ingreso } from '../../../../shared/types/ingreso';
import type { PaginatedResponse } from '../../../../shared/types/paginatedResponse';
import type { PaginacionParams } from '../../../../shared/services/paginacionService';

export interface IngresosRepository {
  listarIngresosPaginados(filtros: FiltrosIngresos, paginacion: PaginacionParams): Promise<PaginatedResponse<Ingreso>>;
}
