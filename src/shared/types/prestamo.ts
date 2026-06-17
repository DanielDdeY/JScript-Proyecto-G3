import type { Banco } from "./banco";
import type { CuotaPrestamo } from "./cuotaPrestamo";

export interface Prestamo {
  id: string;
  banco: Banco; // Anidamos la interfaz del banco aquí
  montoAprobado: number;
  deudaRestante: number;
  fechaDesembolso: string;
  cuotas: CuotaPrestamo[];
  cuotasPagadas: number;
  cuotasTotales: number;
}