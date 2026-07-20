import type { PaginacionMeta } from './paginacionMeta';

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginacionMeta;
  estado: number;
}
