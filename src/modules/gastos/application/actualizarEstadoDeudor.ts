import type { EstadoDeudaAmigo } from '../../../shared/types/amigoDeudor';
import type { Gasto } from '../../../shared/types/gasto';
import type { GastosRepository } from '../domain/repositories/gastosRepository';

export const actualizarEstadoDeudor = (
  repository: GastosRepository,
  gastoId: Gasto['id'],
  nombreId: string,
  estado: EstadoDeudaAmigo,
): Promise<Gasto> => repository.actualizarEstadoDeudor(gastoId, nombreId, estado);
