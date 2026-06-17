import type { RendimientoHistorico } from "./rendimientoHistorico";

export interface ActivoInversion {
  id: string;
  nombreSimbolo: string; // Ej. "BTC" o "Plazo Fijo BCP"
  capitalInvertido: number;
  valorActual: number;
  historial: RendimientoHistorico[]; // Nivel 1
}