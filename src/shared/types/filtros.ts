import type { ImportanciaGasto } from './gastoCategoria';
import type { FuenteIngreso } from './ingreso';

export interface RangoFechaFiltro {
  inicio: string;
  fin: string;
}

export interface FiltrosWallet {
  rangoFecha: RangoFechaFiltro;
  importancia?: ImportanciaGasto | 'TODAS';
}

export interface FiltrosIngresos {
  rangoFecha: RangoFechaFiltro;
  fuente?: FuenteIngreso | 'TODAS';
}
