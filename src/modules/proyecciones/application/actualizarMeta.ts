import type { MetaAhorro } from '../../../shared/types/meta';
import type { MetasRepository } from '../domain/repositories/metasRepository';
import { normalizarMetaExistente } from '../domain/services/metaService';

export const actualizarMeta = (repository: MetasRepository, meta: MetaAhorro): Promise<MetaAhorro> =>
  repository.actualizarMeta(normalizarMetaExistente(meta));
