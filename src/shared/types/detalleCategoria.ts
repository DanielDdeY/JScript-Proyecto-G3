import type { GastoCategoria } from "./gastoCategoria";

export interface DetalleCategoria {
  categoria: GastoCategoria;
  limiteSoles: number;
  gastadoSoles: number;
}