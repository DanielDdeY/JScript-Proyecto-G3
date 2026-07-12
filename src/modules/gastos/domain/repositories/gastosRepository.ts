import type { EstadoDeudaAmigo } from '../../../../shared/types/amigoDeudor';
import type { FiltrosWallet } from '../../../../shared/types/filtros';
import type { Gasto } from '../../../../shared/types/gasto';
import type { PaginatedResponse } from '../../../../shared/types/paginatedResponse';
import type { PaginacionParams } from '../../../../shared/services/paginacionService';

export interface GastosRepository {
  listarGastos(): Promise<Gasto[]>;
  listarGastosPaginados(filtros: FiltrosWallet, paginacion: PaginacionParams): Promise<PaginatedResponse<Gasto>>;
  actualizarEstadoDeudor(gastoId: Gasto['id'], nombreId: string, estado: EstadoDeudaAmigo): Promise<Gasto>;
}
