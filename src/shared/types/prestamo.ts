import type { Banco } from './banco';
import type { CuotaPrestamo } from './cuotaPrestamo';
import type { DetalleCuotas } from './detallecuotas';

export interface Prestamo {
  id: string;
  banco: Banco;
  montoAprobado: number;
  deudaRestante: number;
  fechaDesembolso: string;
  detalleCuotas: DetalleCuotas;
  cuotas: CuotaPrestamo[];
  cuotasPagadas: number;
  cuotasTotales: number;
}
