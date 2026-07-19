import type { MetaAhorro } from '../../../shared/types/meta';
import type { MetasRepository } from '../domain/repositories/metasRepository';

export const listarMetas = (repository: MetasRepository): Promise<MetaAhorro[]> => repository.listarMetas();
