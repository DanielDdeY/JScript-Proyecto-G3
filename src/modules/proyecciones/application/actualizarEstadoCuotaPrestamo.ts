import type { CuotaPrestamo } from '../../../shared/types/cuotaPrestamo';
import type { Prestamo } from '../../../shared/types/prestamo';
import type { PrestamosRepository } from '../domain/repositories/prestamosRepository';

export const actualizarEstadoCuotaPrestamo = (
  repository: PrestamosRepository,
  prestamoId: string,
  cuota: CuotaPrestamo,
): Promise<Prestamo> => repository.actualizarCuota(prestamoId, cuota);
