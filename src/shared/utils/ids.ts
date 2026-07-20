import type { Id } from '../types/id';

export const idsIguales = (left: Id | undefined | null, right: Id | undefined | null) =>
  String(left) === String(right);

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const generarIdConPrefijo = <TItem extends { id?: Id | null }>(
  items: TItem[],
  prefijo: string,
): string => {
  const patron = new RegExp(`^${escapeRegExp(prefijo)}-(\\d+)$`);
  const ultimoNumero = items.reduce((mayor, item) => {
    const id = item.id == null ? '' : String(item.id);
    const coincidencia = id.match(patron);
    if (!coincidencia) return mayor;

    const numero = Number(coincidencia[1]);
    return Number.isFinite(numero) ? Math.max(mayor, numero) : mayor;
  }, 0);

  return `${prefijo}-${ultimoNumero + 1}`;
};
