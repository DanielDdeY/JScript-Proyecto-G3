import type { MetasRepository } from '../domain/repositories/metasRepository';

export const eliminarMeta = (repository: MetasRepository, id: string): Promise<void> => repository.eliminarMeta(id);
