import type { Id } from '../types/id';

export const idsIguales = (left: Id | undefined | null, right: Id | undefined | null) =>
  String(left) === String(right);
