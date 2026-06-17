import type { PaginacionMeta } from "./paginacionMeta";


export interface PaginatedResponse<T> {
  data: T[]; // Aquí puede ir un arreglo de CUALQUIER otro modelo
  meta: PaginacionMeta; // Datos de la paginación anidados
  estado: number; // Ej. 200 o 404
}