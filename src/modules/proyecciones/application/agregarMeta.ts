import type { MetaAhorro } from '../../../shared/types/meta';
import type { MetasRepository, NuevaMetaAhorro } from '../domain/repositories/metasRepository';
import { normalizarNuevaMeta } from '../domain/services/metaService';

export const agregarMeta = (repository: MetasRepository, meta: NuevaMetaAhorro): Promise<MetaAhorro> =>
  repository.crearMeta(normalizarNuevaMeta(meta));
