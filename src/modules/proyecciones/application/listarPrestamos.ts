import type { Prestamo } from '../../../shared/types/prestamo';
import type { PrestamosRepository } from '../domain/repositories/prestamosRepository';

export const listarPrestamos = (repository: PrestamosRepository): Promise<Prestamo[]> =>
  repository.listarPrestamos();
