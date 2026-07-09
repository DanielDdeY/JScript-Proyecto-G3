import type { Banco } from '../../../../shared/types/banco';
import type { Gasto } from '../../../../shared/types/gasto';
import type { Ingreso } from '../../../../shared/types/ingreso';
import type { Perfil } from '../../../../shared/types/perfil';
import type { Proyeccion } from '../../../../shared/types/proyeccion';
import type { ResumenFinanciero } from '../../../../shared/types/resumenFinanciero';
import type { Tarjeta } from '../../../../shared/types/tarjeta';

export interface WalletOverview {
  perfil: Perfil | null;
  tarjetas: Tarjeta[];
  proyecciones: Proyeccion[];
  resumenFinanciero: ResumenFinanciero;
  gastos: Gasto[];
  ingresos: Ingreso[];
  bancos: Banco[];
}

export const emptyWalletOverview: WalletOverview = {
  perfil: null,
  tarjetas: [],
  proyecciones: [],
  resumenFinanciero: {
    ingresos: 0,
    gastos: 0,
    ahorro: 0,
  },
  gastos: [],
  ingresos: [],
  bancos: [],
};
