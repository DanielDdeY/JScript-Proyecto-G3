import type { EstadoDeudaAmigo } from '../../../../shared/types/amigoDeudor';
import type { Gasto } from '../../../../shared/types/gasto';

export interface GastosRepository {
  listarGastos(): Promise<Gasto[]>;
  actualizarEstadoDeudor(gastoId: Gasto['id'], nombreId: string, estado: EstadoDeudaAmigo): Promise<Gasto>;
}
