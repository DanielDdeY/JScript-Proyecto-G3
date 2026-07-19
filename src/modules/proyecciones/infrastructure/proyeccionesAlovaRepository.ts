import { httpClient } from '../../../core/services/alovaClient';
import type { Banco } from '../../../shared/types/banco';
import type { CicloFacturacion } from '../../../shared/types/cicloFacturacion';
import type { Gasto } from '../../../shared/types/gasto';
import type { Ingreso } from '../../../shared/types/ingreso';
import type { MetaAhorro } from '../../../shared/types/meta';
import type { Perfil, PerfilPersistido } from '../../../shared/types/perfil';
import type { PortafolioInversiones } from '../../../shared/types/portafolioInversiones';
import type { Prestamo } from '../../../shared/types/prestamo';
import type { Tarjeta } from '../../../shared/types/tarjeta';
import type { Usuario } from '../../../shared/types/usuario';
import { idsIguales } from '../../../shared/utils/ids';
import type { DatosProyeccion } from '../domain/models/proyeccionPredictiva';
import type { ProyeccionesRepository } from '../domain/repositories/proyeccionesRepository';

const ENDPOINTS = {
  perfil: '/perfil',
  usuarios: '/usuarios',
  usuarioById: (id: string) => `/usuarios/${id}`,
  ingresos: '/ingresos',
  gastos: '/gastos',
  prestamos: '/prestamos',
  tarjetas: '/tarjetas',
  bancos: '/bancos',
  inversiones: '/inversiones',
  metas: '/metas',
} as const;

type CicloFacturacionApi = CicloFacturacion & { Facturado?: number };

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

const hidratarTarjetas = (tarjetas: Tarjeta[], bancos: Banco[]): Tarjeta[] =>
  tarjetas.map((tarjeta) => ({
    ...tarjeta,
    banco: tarjeta.banco ?? bancos.find((banco) => idsIguales(banco.id, tarjeta.bancoId)),
    cicloFacturacion: normalizarCicloFacturacion(tarjeta.cicloFacturacion as CicloFacturacionApi | undefined),
  }));

const hidratarPerfil = async (perfilPersistido: PerfilPersistido | null): Promise<Perfil | null> => {
  if (!perfilPersistido) return null;

  const usuario = perfilPersistido.usuarioId
    ? await obtenerOpcional<Usuario>(ENDPOINTS.usuarioById(String(perfilPersistido.usuarioId)))
    : null;

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

export const proyeccionesAlovaRepository: ProyeccionesRepository = {
  async obtenerDatosProyeccion(): Promise<DatosProyeccion> {
    const [perfilPersistido, ingresos, gastos, prestamos, tarjetasBase, bancos, inversiones, metas] = await Promise.all([
      obtenerOpcional<PerfilPersistido>(ENDPOINTS.perfil),
      obtenerListaOpcional<Ingreso>(ENDPOINTS.ingresos),
      obtenerListaOpcional<Gasto>(ENDPOINTS.gastos),
      obtenerListaOpcional<Prestamo>(ENDPOINTS.prestamos),
      obtenerListaOpcional<Tarjeta>(ENDPOINTS.tarjetas),
      obtenerListaOpcional<Banco>(ENDPOINTS.bancos),
      obtenerListaOpcional<PortafolioInversiones>(ENDPOINTS.inversiones),
      obtenerListaOpcional<MetaAhorro>(ENDPOINTS.metas),
    ]);

    return {
      perfil: await hidratarPerfil(perfilPersistido),
      ingresos,
      gastos,
      prestamos,
      tarjetas: hidratarTarjetas(tarjetasBase, bancos),
      inversiones,
      metas,
    };
  },
};
