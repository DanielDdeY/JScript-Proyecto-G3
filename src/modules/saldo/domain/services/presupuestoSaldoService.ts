import type { AlertaPresupuesto } from '../../../../shared/types/alertaPresupuesto';
import type { DetalleCategoria } from '../../../../shared/types/detalleCategoria';
import type { Gasto } from '../../../../shared/types/gasto';
import type { PresupuestoMensual } from '../../../../shared/types/presupuestoMensual';
import { presupuestoService } from '../../../presupuestos/domain/services/presupuestoService';

export interface DetalleCategoriaConPorcentaje extends DetalleCategoria {
  porcentajeUso: number;
  excedido: boolean;
  enRiesgo: boolean;
  restanteSoles: number;
}

export interface ResumenMensualPresupuesto {
  gastadoSoles: number;
  totalAsignado: number;
  restanteSoles: number;
  porcentajeUso: number;
  excedido: boolean;
  enRiesgo: boolean;
}

export const presupuestoSaldoService = {
  obtenerTitulo(presupuesto: PresupuestoMensual | null): string {
    if (!presupuesto) return 'Presupuesto mensual';
    return `Presupuesto de ${presupuestoService.formatearMes(presupuesto.mes)}: S/. ${presupuesto.totalAsignado.toLocaleString('es-PE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  },

  calcularPorcentaje(detalle: DetalleCategoria): number {
    if (detalle.limiteSoles <= 0) return 0;
    return Math.min((detalle.gastadoSoles / detalle.limiteSoles) * 100, 100);
  },

  calcularPorcentajeMensual(gastadoSoles: number, totalAsignado: number): number {
    if (totalAsignado <= 0) return 0;
    return Math.min((gastadoSoles / totalAsignado) * 100, 100);
  },

  prepararResumenMensual(presupuesto: PresupuestoMensual | null, gastos: Gasto[]): ResumenMensualPresupuesto | null {
    if (!presupuesto) return null;

    const gastadoSoles = presupuestoService.calcularGastoTotalDelMes(gastos, presupuesto.mes);
    const porcentajeUso = this.calcularPorcentajeMensual(gastadoSoles, presupuesto.totalAsignado);

    return {
      gastadoSoles,
      totalAsignado: presupuesto.totalAsignado,
      restanteSoles: Math.max(presupuesto.totalAsignado - gastadoSoles, 0),
      porcentajeUso,
      excedido: presupuesto.totalAsignado > 0 && gastadoSoles > presupuesto.totalAsignado,
      enRiesgo: porcentajeUso >= 90,
    };
  },

  prepararDetalle(detalle: DetalleCategoria): DetalleCategoriaConPorcentaje {
    const porcentajeUso = this.calcularPorcentaje(detalle);

    return {
      ...detalle,
      porcentajeUso,
      excedido: detalle.gastadoSoles > detalle.limiteSoles,
      enRiesgo: porcentajeUso >= 90,
      restanteSoles: Math.max(detalle.limiteSoles - detalle.gastadoSoles, 0),
    };
  },

  generarAlertas(presupuesto: PresupuestoMensual | null): AlertaPresupuesto[] {
    if (!presupuesto) return [];

    return presupuesto.desgloseCategorias
      .filter((detalle) => this.calcularPorcentaje(detalle) >= 90)
      .map<AlertaPresupuesto>((detalle) => ({
        tipo: this.calcularPorcentaje(detalle) >= 100 ? 'PELIGRO' : 'ADVERTENCIA',
        mensaje: `¡Atención! Has superado el 90% de tu presupuesto en ${detalle.categoria.nombre}`,
        fechaEmision: new Date().toISOString().slice(0, 10),
      }));
  },
};
