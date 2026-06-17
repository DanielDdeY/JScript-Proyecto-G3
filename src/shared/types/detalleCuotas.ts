export interface DetalleCuotas {
  cuotasTotales: number;
  cuotasPagadas: number;
  montoPorCuota: number;
  mesesSinIntereses: boolean;
  tasaInteresAplicada?: number; // Solo si `mesesSinIntereses` es false
}