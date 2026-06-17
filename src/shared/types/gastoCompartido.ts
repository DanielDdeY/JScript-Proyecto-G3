import type { AmigoDeudor } from "./amigoDeudor";

export interface GastoCompartido {
  esGastoGrupal: boolean;
  miParteSoles: number; // Lo que realmente te costó a ti
  deudores: AmigoDeudor[];
}