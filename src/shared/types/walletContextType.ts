import type { Perfil } from '../../shared/types/perfil';
import type { Tarjeta } from '../../shared/types/tarjeta';
import type { ResumenFinanciero } from '../../shared/types/resumenFinanciero';
import type { Proyeccion } from '../../shared/types/proyeccion';

export interface WalletContextType {
    perfil: Perfil;
    tarjetas: Tarjeta[];
    resumenFinanciero: ResumenFinanciero;
    proyecciones: Proyeccion[];
}