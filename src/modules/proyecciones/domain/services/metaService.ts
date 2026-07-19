import type { MetaAhorro } from '../../../../shared/types/meta';
import type { NuevaMetaAhorro } from '../repositories/metasRepository';

export const calcularPorcentajeMeta = (meta: Pick<MetaAhorro, 'montoActual' | 'montoObjetivo'>): number => {
  if (meta.montoObjetivo <= 0) return 0;
  return Math.min(100, Math.max(0, (meta.montoActual / meta.montoObjetivo) * 100));
};

export const calcularMontoRestanteMeta = (meta: Pick<MetaAhorro, 'montoActual' | 'montoObjetivo'>): number =>
  Math.max(0, meta.montoObjetivo - meta.montoActual);

export const estaMetaCompletada = (meta: Pick<MetaAhorro, 'montoActual' | 'montoObjetivo'>): boolean =>
  meta.montoObjetivo > 0 && meta.montoActual >= meta.montoObjetivo;

export const normalizarNuevaMeta = (meta: NuevaMetaAhorro): NuevaMetaAhorro => {
  const metaNormalizada = {
    ...meta,
    nombre: meta.nombre.trim(),
    montoObjetivo: Number(meta.montoObjetivo),
    montoActual: Number(meta.montoActual),
    fechaLimite: meta.fechaLimite?.trim() || undefined,
  };

  return {
    ...metaNormalizada,
    completada: meta.completada ?? estaMetaCompletada(metaNormalizada),
  };
};

export const normalizarMetaExistente = (meta: MetaAhorro): MetaAhorro => {
  const metaNormalizada = {
    ...meta,
    nombre: meta.nombre.trim(),
    montoObjetivo: Number(meta.montoObjetivo),
    montoActual: Number(meta.montoActual),
    fechaLimite: meta.fechaLimite?.trim() || undefined,
  };

  return {
    ...metaNormalizada,
    completada: estaMetaCompletada(metaNormalizada),
  };
};
