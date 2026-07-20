import type { Banco } from '../../../../shared/types/banco';
import type { CuotaPrestamo } from '../../../../shared/types/cuotaPrestamo';
import type { Prestamo } from '../../../../shared/types/prestamo';

export type NuevoPrestamo = Omit<Prestamo, 'id'>;

export interface PrestamosRepository {
  listarPrestamos(): Promise<Prestamo[]>;
  listarBancos(): Promise<Banco[]>;
  agregarPrestamo(prestamo: NuevoPrestamo): Promise<Prestamo>;
  actualizarCuota(prestamoId: string, cuota: CuotaPrestamo): Promise<Prestamo>;
}
