import type { Banco } from './banco';
import type { CicloFacturacion } from './cicloFacturacion';
import type { Id } from './id';
import type { LineaCredito } from './lineaCredito';

export type TipoTarjeta = 'DEBITO' | 'CREDITO';

export interface Tarjeta {
  id: Id;
  bancoId: Id;
  banco?: Banco | string;
  numero: string;
  saldo: number;
  tipo: TipoTarjeta;
  cicloFacturacion?: CicloFacturacion;
  lineaCredito?: LineaCredito;
}
