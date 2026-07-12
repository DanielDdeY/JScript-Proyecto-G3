import type { Gasto } from '../../../shared/types/gasto';
import type { GastosRepository } from '../domain/repositories/gastosRepository';

export const listarGastos = (repository: GastosRepository): Promise<Gasto[]> => repository.listarGastos();
