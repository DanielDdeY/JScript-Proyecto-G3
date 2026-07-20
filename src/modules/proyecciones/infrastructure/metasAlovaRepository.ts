import { httpClient } from '../../../core/services/alovaClient';
import type { MetaAhorro } from '../../../shared/types/meta';
import type { MetasRepository, NuevaMetaAhorro } from '../domain/repositories/metasRepository';
import { normalizarMetaExistente, normalizarNuevaMeta } from '../domain/services/metaService';

const ENDPOINTS = {
  metas: '/metas',
  metaById: (id: string) => `/metas/${id}`,
} as const;

const generarId = () => `meta-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const ordenarMetas = (metas: MetaAhorro[]) =>
  [...metas].sort((a, b) => {
    if (!a.fechaLimite && !b.fechaLimite) return a.nombre.localeCompare(b.nombre);
    if (!a.fechaLimite) return 1;
    if (!b.fechaLimite) return -1;
    return a.fechaLimite.localeCompare(b.fechaLimite);
  });

export const metasAlovaRepository: MetasRepository = {
  async listarMetas(): Promise<MetaAhorro[]> {
    const metas = await httpClient.get<MetaAhorro[]>(ENDPOINTS.metas);
    return ordenarMetas(metas.map(normalizarMetaExistente));
  },

  async crearMeta(meta: NuevaMetaAhorro): Promise<MetaAhorro> {
    const metaNormalizada = normalizarNuevaMeta(meta);
    const nuevaMeta: MetaAhorro = {
      id: generarId(),
      ...metaNormalizada,
      completada: Boolean(metaNormalizada.completada),
    };

    return httpClient.post<MetaAhorro, MetaAhorro>(ENDPOINTS.metas, nuevaMeta);
  },

  async actualizarMeta(meta: MetaAhorro): Promise<MetaAhorro> {
    const metaNormalizada = normalizarMetaExistente(meta);
    return httpClient.put<MetaAhorro, MetaAhorro>(ENDPOINTS.metaById(String(meta.id)), metaNormalizada);
  },

  async eliminarMeta(id: string): Promise<void> {
    await httpClient.delete<null>(ENDPOINTS.metaById(String(id)));
  },
};
