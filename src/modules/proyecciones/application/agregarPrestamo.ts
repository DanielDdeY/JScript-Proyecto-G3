import type { Prestamo } from '../../../shared/types/prestamo';
import type { NuevoPrestamo, PrestamosRepository } from '../domain/repositories/prestamosRepository';

export const agregarPrestamo = (repository: PrestamosRepository, prestamo: NuevoPrestamo): Promise<Prestamo> =>
  repository.agregarPrestamo(prestamo);
