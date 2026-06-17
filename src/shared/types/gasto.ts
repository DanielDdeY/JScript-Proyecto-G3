import type { DetalleCategoria } from "./detalleCategoria";
import type { DetalleCuotas } from "./detalleCuotas";
import type { GastoCategoria } from "./gastoCategoria";
import type { GastoCompartido } from "./gastoCompartido";

export interface Gasto {
  id: string;
  monto: number;
  fecha: string; 
  categoria: GastoCategoria;
  tarjetaId: string; 
  descripcion?: string;
  detalleCuotas?: DetalleCuotas;
  gastoCompartido?: GastoCompartido;
}