import { httpClient } from '../../../core/services/alovaClient';
import type { Gasto } from '../../../shared/types/gasto';
import type { Id } from '../../../shared/types/id';
import type { Ingreso } from '../../../shared/types/ingreso';
import type { Perfil } from '../../../shared/types/perfil';
import type { Proyeccion } from '../../../shared/types/proyeccion';
import type { Tarjeta } from '../../../shared/types/tarjeta';
import type { Banco } from '../../../shared/types/banco';
import { idsIguales } from '../../../shared/utils/ids';
import type { WalletOverview } from '../domain/models/walletOverview';
import type { NuevaTarjeta, NuevoGasto, NuevoIngreso, WalletRepository } from '../domain/repositories/walletRepository';

const ENDPOINTS = {
  perfil: '/perfil',
  tarjetas: '/tarjetas?_expand=banco',
  tarjetasBase: '/tarjetas',
  tarjetaById: (id: Id) => `/tarjetas/${id}`,
  proyecciones: '/proyecciones',
  ingresos: '/ingresos',
  gastos: '/gastos',
  bancos: '/bancos',
} as const;

const sumarMontos = <TItem extends { monto: number }>(items: TItem[]) =>
  items.reduce((total, item) => total + item.monto, 0);

const obtenerListaOpcional = async <TItem>(endpoint: string): Promise<TItem[]> => {
  try {
    return await httpClient.get<TItem[]>(endpoint);
  } catch {
    return [];
  }
};

const patchPerfilSaldo = async (perfil: Perfil | null, saldoTotal: number) => {
  if (!perfil) return;
  await httpClient.patch<Perfil, Partial<Perfil>>(ENDPOINTS.perfil, { saldoTotal });
};

const encontrarTarjeta = (tarjetas: Tarjeta[], tarjetaId: Id) =>
  tarjetas.find((tarjeta) => idsIguales(tarjeta.id, tarjetaId));

export const walletAlovaRepository: WalletRepository = {
  async obtenerResumen(): Promise<WalletOverview> {
    const [perfil, tarjetas, proyecciones, ingresos, gastos, bancos] = await Promise.all([
      httpClient.get<Perfil>(ENDPOINTS.perfil),
      httpClient.get<Tarjeta[]>(ENDPOINTS.tarjetas),
      httpClient.get<Proyeccion[]>(ENDPOINTS.proyecciones),
      obtenerListaOpcional<Ingreso>(ENDPOINTS.ingresos),
      obtenerListaOpcional<Gasto>(ENDPOINTS.gastos),
      obtenerListaOpcional<Banco>(ENDPOINTS.bancos),
    ]);

    const totalIngresos = sumarMontos(ingresos);
    const totalGastos = sumarMontos(gastos);

    return {
      perfil,
      tarjetas,
      proyecciones,
      gastos,
      ingresos,
      bancos,
      resumenFinanciero: {
        ingresos: totalIngresos,
        gastos: totalGastos,
        ahorro: totalIngresos - totalGastos,
      },
    };
  },

  async agregarGasto(gasto: NuevoGasto, resumenActual: WalletOverview): Promise<void> {
    await httpClient.post<Gasto, NuevoGasto>(ENDPOINTS.gastos, gasto);

    const tarjeta = encontrarTarjeta(resumenActual.tarjetas, gasto.tarjetaId);
    if (tarjeta) {
      await httpClient.patch<Tarjeta, Partial<Tarjeta>>(ENDPOINTS.tarjetaById(tarjeta.id), {
        saldo: tarjeta.saldo - gasto.monto,
      });
    }

    if (resumenActual.perfil) {
      await patchPerfilSaldo(resumenActual.perfil, resumenActual.perfil.saldoTotal - gasto.monto);
    }
  },

  async agregarIngreso(ingreso: NuevoIngreso, resumenActual: WalletOverview): Promise<void> {
    await httpClient.post<Ingreso, NuevoIngreso>(ENDPOINTS.ingresos, ingreso);

    if (resumenActual.perfil) {
      await patchPerfilSaldo(resumenActual.perfil, resumenActual.perfil.saldoTotal + ingreso.monto);
    }
  },

  async agregarTarjeta(tarjeta: NuevaTarjeta, resumenActual: WalletOverview): Promise<void> {
    await httpClient.post<Tarjeta, NuevaTarjeta>(ENDPOINTS.tarjetasBase, tarjeta);

    if (resumenActual.perfil) {
      await patchPerfilSaldo(resumenActual.perfil, resumenActual.perfil.saldoTotal + tarjeta.saldo);
    }
  },

  async actualizarPerfil(perfil: Partial<Perfil>): Promise<void> {
    await httpClient.patch<Perfil, Partial<Perfil>>(ENDPOINTS.perfil, perfil);
  },
};
