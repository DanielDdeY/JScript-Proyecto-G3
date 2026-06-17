export interface CuotaPrestamo {
  numeroCuota: number;
  montoSoles: number;
  fechaVencimiento: string;
  estado: 'PAGADA' | 'PENDIENTE' | 'ATRASADA';
}