import type { Banco } from "./banco";
import type { CicloFacturacion } from "./cicloFacturacion";
import type { LineaCredito } from "./lineaCredito";

export interface Tarjeta {
    id: string;
    bancoId: string; // El ID que lo relaciona con la base de datos de bancos
    banco?: Banco;
    numero: string;
    saldo: number;
    tipo: 'DEBITO' | 'CREDITO';
    cicloFacturacion?: CicloFacturacion;
    lineaCredito?: LineaCredito;
}