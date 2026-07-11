import { httpClient } from '../../../core/services/alovaClient';
import type { Banco } from '../../../shared/types/banco';
import type { Gasto } from '../../../shared/types/gasto';
import type { Id } from '../../../shared/types/id';
import type { Ingreso } from '../../../shared/types/ingreso';
import type { CicloFacturacion } from '../../../shared/types/cicloFacturacion';
import type { Perfil, PerfilPersistido } from '../../../shared/types/perfil';
import type { Proyeccion } from '../../../shared/types/proyeccion';
import type { Tarjeta } from '../../../shared/types/tarjeta';
import type { Usuario } from '../../../shared/types/usuario';
import { idsIguales } from '../../../shared/utils/ids';
import type { WalletOverview } from '../domain/models/walletOverview';
import type { NuevaTarjeta, NuevoGasto, NuevoIngreso, WalletRepository } from '../domain/repositories/walletRepository';

const ENDPOINTS = {
  perfil: '/perfil',
  usuarios: '/usuarios',
  usuarioById: (id: Id) => `/usuarios/${id}`,
  tarjetasBase: '/tarjetas',
  tarjetaById: (id: Id) => `/tarjetas/${id}`,
  proyecciones: '/proyecciones',
  ingresos: '/ingresos',
  gastos: '/gastos',
  bancos: '/bancos',
} as const;

const generarId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const sumarMontos = <TItem extends { monto: number }>(items: TItem[]) =>
  items.reduce((total, item) => total + item.monto, 0);

const obtenerListaOpcional = async <TItem>(endpoint: string): Promise<TItem[]> => {
  try {
    return await httpClient.get<TItem[]>(endpoint);
  } catch {
    return [];
  }
};

const obtenerOpcional = async <TItem>(endpoint: string): Promise<TItem | null> => {
  try {
    return await httpClient.get<TItem>(endpoint);
  } catch {
    return null;
  }
};


type CicloFacturacionApi = CicloFacturacion & { Facturado?: number };

const normalizarCicloFacturacion = (cicloFacturacion?: CicloFacturacionApi): CicloFacturacion | undefined => {
  if (!cicloFacturacion) return undefined;

  return {
    diaCorte: cicloFacturacion.diaCorte,
    diaPago: cicloFacturacion.diaPago,
    mesActual: cicloFacturacion.mesActual,
    montoFacturado:
      typeof cicloFacturacion.montoFacturado === 'number'
        ? cicloFacturacion.montoFacturado
        : cicloFacturacion.Facturado ?? 0,
    pagoMinimo: cicloFacturacion.pagoMinimo,
  };
};

const encontrarTarjeta = (tarjetas: Tarjeta[], tarjetaId?: Id | null) => {
  if (!tarjetaId) return undefined;
  return tarjetas.find((tarjeta) => idsIguales(tarjeta.id, tarjetaId));
};

const hidratarTarjetas = (tarjetas: Tarjeta[], bancos: Banco[]): Tarjeta[] =>
  tarjetas.map((tarjeta) => ({
    ...tarjeta,
    banco: tarjeta.banco ?? bancos.find((banco) => idsIguales(banco.id, tarjeta.bancoId)),
    cicloFacturacion: normalizarCicloFacturacion(tarjeta.cicloFacturacion as CicloFacturacionApi | undefined),
  }));

const obtenerUsuarioDelPerfil = async (perfilPersistido: PerfilPersistido | null): Promise<Usuario | null> => {
  if (!perfilPersistido) return null;

  if (perfilPersistido.usuarioId) {
    const usuario = await obtenerOpcional<Usuario>(ENDPOINTS.usuarioById(perfilPersistido.usuarioId));
    if (usuario) return usuario;
  }

  if (perfilPersistido.email) {
    const usuarios = await obtenerListaOpcional<Usuario>(
      `${ENDPOINTS.usuarios}?email=${encodeURIComponent(perfilPersistido.email)}`,
    );
    return usuarios[0] ?? null;
  }

  return null;
};

const hidratarPerfil = async (perfilPersistido: PerfilPersistido | null): Promise<Perfil | null> => {
  if (!perfilPersistido) return null;

  const usuario = await obtenerUsuarioDelPerfil(perfilPersistido);

  return {
    id: perfilPersistido.id,
    usuarioId: perfilPersistido.usuarioId ?? usuario?.id,
    saldoTotal: perfilPersistido.saldoTotal,
    nombre: usuario?.nombre ?? perfilPersistido.nombre ?? 'Usuario',
    email: usuario?.email ?? perfilPersistido.email ?? '',
    avatarUrl: usuario?.avatarUrl ?? perfilPersistido.avatarUrl,
    usuario: usuario ?? undefined,
  };
};

const patchPerfilSaldo = async (saldoTotal: number) => {
  await httpClient.patch<PerfilPersistido, Partial<PerfilPersistido>>(ENDPOINTS.perfil, { saldoTotal });
};

const obtenerPerfilPersistidoActual = () => httpClient.get<PerfilPersistido>(ENDPOINTS.perfil);

export const walletAlovaRepository: WalletRepository = {
  async obtenerResumen(): Promise<WalletOverview> {
    const [perfilPersistido, tarjetasBase, proyecciones, ingresos, gastos, bancos] = await Promise.all([
      obtenerOpcional<PerfilPersistido>(ENDPOINTS.perfil),
      obtenerListaOpcional<Tarjeta>(ENDPOINTS.tarjetasBase),
      obtenerListaOpcional<Proyeccion>(ENDPOINTS.proyecciones),
      obtenerListaOpcional<Ingreso>(ENDPOINTS.ingresos),
      obtenerListaOpcional<Gasto>(ENDPOINTS.gastos),
      obtenerListaOpcional<Banco>(ENDPOINTS.bancos),
    ]);

    const perfil = await hidratarPerfil(perfilPersistido);
    const tarjetas = hidratarTarjetas(tarjetasBase, bancos);
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
    const nuevoGasto: Gasto = {
      ...gasto,
      id: generarId('g'),
      origen: gasto.tarjetaId ? 'TARJETA' : gasto.origen ?? 'EFECTIVO',
    };

    await httpClient.post<Gasto, Gasto>(ENDPOINTS.gastos, nuevoGasto);

    const tarjeta = encontrarTarjeta(resumenActual.tarjetas, gasto.tarjetaId);
    if (tarjeta) {
      await httpClient.patch<Tarjeta, Partial<Tarjeta>>(ENDPOINTS.tarjetaById(tarjeta.id), {
        saldo: tarjeta.saldo - gasto.monto,
      });
    }

    if (resumenActual.perfil) {
      await patchPerfilSaldo(resumenActual.perfil.saldoTotal - gasto.monto);
    }
  },

  async agregarIngreso(ingreso: NuevoIngreso, resumenActual: WalletOverview): Promise<void> {
    const nuevoIngreso: Ingreso = {
      ...ingreso,
      id: generarId('ing'),
    };

    await httpClient.post<Ingreso, Ingreso>(ENDPOINTS.ingresos, nuevoIngreso);

    if (resumenActual.perfil) {
      await patchPerfilSaldo(resumenActual.perfil.saldoTotal + ingreso.monto);
    }
  },

  async agregarTarjeta(tarjeta: NuevaTarjeta, resumenActual: WalletOverview): Promise<void> {
    const nuevaTarjeta: Tarjeta = {
      ...tarjeta,
      id: generarId('tj'),
    };

    await httpClient.post<Tarjeta, Tarjeta>(ENDPOINTS.tarjetasBase, nuevaTarjeta);

    if (resumenActual.perfil) {
      await patchPerfilSaldo(resumenActual.perfil.saldoTotal + tarjeta.saldo);
    }
  },

  async actualizarPerfil(perfil: Partial<Perfil>): Promise<void> {
    const perfilActual = await obtenerPerfilPersistidoActual();
    const usuarioId = perfilActual.usuarioId ?? perfil.usuarioId;
    const usuarioPatch: Partial<Usuario> = {};
    const perfilPatch: Partial<PerfilPersistido> = {};

    if (typeof perfil.nombre === 'string') usuarioPatch.nombre = perfil.nombre;
    if (typeof perfil.email === 'string') usuarioPatch.email = perfil.email;
    if (typeof perfil.avatarUrl === 'string') usuarioPatch.avatarUrl = perfil.avatarUrl;
    if (typeof perfil.saldoTotal === 'number') perfilPatch.saldoTotal = perfil.saldoTotal;

    if (usuarioId && Object.keys(usuarioPatch).length > 0) {
      await httpClient.patch<Usuario, Partial<Usuario>>(ENDPOINTS.usuarioById(usuarioId), usuarioPatch);
    } else if (Object.keys(usuarioPatch).length > 0) {
      await httpClient.patch<PerfilPersistido, Partial<PerfilPersistido>>(ENDPOINTS.perfil, usuarioPatch);
    }

    if (Object.keys(perfilPatch).length > 0) {
      await httpClient.patch<PerfilPersistido, Partial<PerfilPersistido>>(ENDPOINTS.perfil, perfilPatch);
    }
  },
};
