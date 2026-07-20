import type { DetalleCategoria } from '../../../../shared/types/detalleCategoria';
import type { Gasto } from '../../../../shared/types/gasto';
import type { GastoCategoria, ImportanciaGasto } from '../../../../shared/types/gastoCategoria';
import type { PresupuestoMensual } from '../../../../shared/types/presupuestoMensual';

export interface GuardarLimitePresupuestoPayload {
  mes: string;
  categoriaNombre: string;
  limiteSoles: number;
}

export interface GuardarLimiteMensualPayload {
  mes: string;
  totalAsignado: number;
}

export interface ResultadoGuardadoPresupuesto {
  presupuesto: PresupuestoMensual;
  esNuevo: boolean;
}

export interface ResultadoEliminacionLimiteMensual {
  presupuesto: PresupuestoMensual | null;
  debeEliminarRegistro: boolean;
}

export const CATEGORIAS_PRESUPUESTO: GastoCategoria[] = [
  { nombre: 'Alimentación', importancia: 'Alta' },
  { nombre: 'Transporte', importancia: 'Alta' },
  { nombre: 'Servicios', importancia: 'Alta' },
  { nombre: 'Tecnología', importancia: 'Media' },
  { nombre: 'Entretenimiento', importancia: 'Baja' },
  { nombre: 'Salud', importancia: 'Alta' },
  { nombre: 'Prestaciones', importancia: 'Media' },
  { nombre: 'Otros', importancia: 'Baja' },
];

const formatterMes = new Intl.DateTimeFormat('es-PE', {
  month: 'long',
  timeZone: 'UTC',
});

const obtenerImportanciaPorCategoria = (categoriaNombre: string): ImportanciaGasto =>
  CATEGORIAS_PRESUPUESTO.find((categoria) => categoria.nombre === categoriaNombre)?.importancia ?? 'Media';

const crearCategoria = (categoriaNombre: string): GastoCategoria => ({
  nombre: categoriaNombre,
  importancia: obtenerImportanciaPorCategoria(categoriaNombre),
});

const crearIdPresupuesto = (mes: string) => `pres-${mes}`;

const perteneceAlMes = (fecha: string, mes: string) => fecha?.startsWith(mes);

const sumarGastosDeCategoria = (gastos: Gasto[], mes: string, categoriaNombre: string) =>
  gastos
    .filter((gasto) => perteneceAlMes(gasto.fecha, mes) && gasto.categoria.nombre === categoriaNombre)
    .reduce((total, gasto) => total + Number(gasto.monto || 0), 0);

const sumarGastosDelMes = (gastos: Gasto[], mes: string) =>
  gastos
    .filter((gasto) => perteneceAlMes(gasto.fecha, mes))
    .reduce((total, gasto) => total + Number(gasto.monto || 0), 0);

const tieneCategorias = (presupuesto: PresupuestoMensual) => presupuesto.desgloseCategorias.length > 0;

export const presupuestoService = {
  obtenerMesActual(): string {
    return new Date().toISOString().substring(0, 7);
  },

  formatearMes(mes: string): string {
    const [anio, mesNumero] = mes.split('-').map(Number);
    if (!anio || !mesNumero) return mes;

    const fecha = new Date(Date.UTC(anio, mesNumero - 1, 1));
    return formatterMes.format(fecha).replace(/^./, (letra) => letra.toUpperCase());
  },

  ordenarPorMesDesc(presupuestos: PresupuestoMensual[]): PresupuestoMensual[] {
    return [...presupuestos].sort((a, b) => b.mes.localeCompare(a.mes));
  },

  obtenerPresupuestoPorMes(presupuestos: PresupuestoMensual[], mes: string): PresupuestoMensual | null {
    return presupuestos.find((presupuesto) => presupuesto.mes === mes) ?? null;
  },

  obtenerPresupuestoConCategoriasMasReciente(presupuestos: PresupuestoMensual[], mesReferencia: string): PresupuestoMensual | null {
    const presupuestosConCategorias = this.ordenarPorMesDesc(presupuestos.filter(tieneCategorias));
    return (
      presupuestosConCategorias.find((presupuesto) => presupuesto.mes <= mesReferencia) ??
      presupuestosConCategorias[0] ??
      null
    );
  },

  obtenerPresupuestoCategoriaVigente(presupuestos: PresupuestoMensual[], mes: string): PresupuestoMensual | null {
    const presupuestoMes = this.obtenerPresupuestoPorMes(presupuestos, mes);

    if (presupuestoMes && presupuestoMes.desgloseCategorias.length > 0) {
      return presupuestoMes;
    }

    const plantillaCategorias = this.obtenerPresupuestoConCategoriasMasReciente(presupuestos, mes);
    if (!plantillaCategorias && !presupuestoMes) return null;

    return {
      id: presupuestoMes?.id ?? crearIdPresupuesto(mes),
      mes,
      totalAsignado: Number(presupuestoMes?.totalAsignado ?? 0),
      desgloseCategorias: plantillaCategorias?.desgloseCategorias.map((detalle) => ({ ...detalle, gastadoSoles: 0 })) ?? [],
      alertasActivas: presupuestoMes?.alertasActivas ?? [],
    };
  },

  obtenerPresupuestoActual(presupuestos: PresupuestoMensual[]): PresupuestoMensual | null {
    return this.obtenerPresupuestoCategoriaVigente(presupuestos, this.obtenerMesActual());
  },

  obtenerPresupuestoMasRelevante(presupuestos: PresupuestoMensual[]): PresupuestoMensual | null {
    return this.obtenerPresupuestoActual(presupuestos);
  },

  calcularGastoTotalDelMes(gastos: Gasto[], mes: string): number {
    return sumarGastosDelMes(gastos, mes);
  },

  normalizarConGastos(presupuesto: PresupuestoMensual, gastos: Gasto[]): PresupuestoMensual {
    const desgloseCategorias = presupuesto.desgloseCategorias.map<DetalleCategoria>((detalle) => ({
      ...detalle,
      gastadoSoles: sumarGastosDeCategoria(gastos, presupuesto.mes, detalle.categoria.nombre),
    }));

    return {
      ...presupuesto,
      totalAsignado: Number(presupuesto.totalAsignado || 0),
      desgloseCategorias,
    };
  },

  normalizarListaConGastos(presupuestos: PresupuestoMensual[], gastos: Gasto[]): PresupuestoMensual[] {
    return this.ordenarPorMesDesc(presupuestos.map((presupuesto) => this.normalizarConGastos(presupuesto, gastos)));
  },

  actualizarLimiteMensual(
    presupuestos: PresupuestoMensual[],
    payload: GuardarLimiteMensualPayload,
  ): ResultadoGuardadoPresupuesto {
    const presupuestoExistente = this.obtenerPresupuestoPorMes(presupuestos, payload.mes);

    if (!presupuestoExistente) {
      return {
        esNuevo: true,
        presupuesto: {
          id: crearIdPresupuesto(payload.mes),
          mes: payload.mes,
          totalAsignado: payload.totalAsignado,
          desgloseCategorias: [],
          alertasActivas: [],
        },
      };
    }

    return {
      esNuevo: false,
      presupuesto: {
        ...presupuestoExistente,
        totalAsignado: payload.totalAsignado,
      },
    };
  },

  eliminarLimiteMensual(presupuestos: PresupuestoMensual[], mes: string): ResultadoEliminacionLimiteMensual {
    const presupuestoExistente = this.obtenerPresupuestoPorMes(presupuestos, mes);

    if (!presupuestoExistente) {
      return { presupuesto: null, debeEliminarRegistro: false };
    }

    if (presupuestoExistente.desgloseCategorias.length === 0) {
      return { presupuesto: presupuestoExistente, debeEliminarRegistro: true };
    }

    return {
      debeEliminarRegistro: false,
      presupuesto: {
        ...presupuestoExistente,
        totalAsignado: 0,
      },
    };
  },

  actualizarLimite(
    presupuestos: PresupuestoMensual[],
    payload: GuardarLimitePresupuestoPayload,
  ): ResultadoGuardadoPresupuesto {
    const presupuestoExistente = this.obtenerPresupuestoPorMes(presupuestos, payload.mes);
    const presupuestoVigente = this.obtenerPresupuestoCategoriaVigente(presupuestos, payload.mes);
    const detalleActualizado: DetalleCategoria = {
      categoria: crearCategoria(payload.categoriaNombre),
      limiteSoles: payload.limiteSoles,
      gastadoSoles: 0,
    };

    if (!presupuestoExistente) {
      const categoriasBase = presupuestoVigente?.desgloseCategorias ?? [];
      const categoriaExiste = categoriasBase.some((detalle) => detalle.categoria.nombre === payload.categoriaNombre);
      const desgloseCategorias = categoriaExiste
        ? categoriasBase.map((detalle) =>
            detalle.categoria.nombre === payload.categoriaNombre
              ? { ...detalle, categoria: detalleActualizado.categoria, limiteSoles: payload.limiteSoles }
              : detalle,
          )
        : [...categoriasBase, detalleActualizado];

      return {
        esNuevo: true,
        presupuesto: {
          id: crearIdPresupuesto(payload.mes),
          mes: payload.mes,
          totalAsignado: 0,
          desgloseCategorias,
          alertasActivas: [],
        },
      };
    }

    const categoriasBase = presupuestoExistente.desgloseCategorias.length > 0
      ? presupuestoExistente.desgloseCategorias
      : presupuestoVigente?.desgloseCategorias ?? [];

    const categoriaExiste = categoriasBase.some(
      (detalle) => detalle.categoria.nombre === payload.categoriaNombre,
    );

    const desgloseCategorias = categoriaExiste
      ? categoriasBase.map((detalle) =>
          detalle.categoria.nombre === payload.categoriaNombre
            ? { ...detalle, categoria: detalleActualizado.categoria, limiteSoles: payload.limiteSoles }
            : detalle,
        )
      : [...categoriasBase, detalleActualizado];

    return {
      esNuevo: false,
      presupuesto: {
        ...presupuestoExistente,
        desgloseCategorias,
        totalAsignado: Number(presupuestoExistente.totalAsignado || 0),
      },
    };
  },
};
