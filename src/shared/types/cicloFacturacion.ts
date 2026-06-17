export interface CicloFacturacion {
  diaCorte: number;
  diaPago: number;
  mesActual: string; // Ej. "2026-06"
  montoFacturado: number;
  pagoMinimo: number;
}