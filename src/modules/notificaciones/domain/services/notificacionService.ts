import type { Banco } from '../../../../shared/types/banco';
import type { Gasto } from '../../../../shared/types/gasto';
import type { PresupuestoMensual } from '../../../../shared/types/presupuestoMensual';
import type { Tarjeta } from '../../../../shared/types/tarjeta';
import { formatCurrencyPen } from '../../../../shared/utils/formatters';
import { idsIguales } from '../../../../shared/utils/ids';
import { presupuestoService } from '../../../presupuestos/domain/services/presupuestoService';
import type { Notificacion } from '../models/notificacion';

const MS_POR_DIA = 1000 * 60 * 60 * 24;

const normalizarFecha = (fecha: Date) => new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());

const obtenerNombreBanco = (tarjeta: Tarjeta): string => {
  if (typeof tarjeta.banco === 'string') return tarjeta.banco;
  if (tarjeta.banco?.nombre) return tarjeta.banco.nombre;
  return 'Tarjeta';
};

const obtenerFechaPago = (tarjeta: Tarjeta, referencia: Date): Date | null => {
  const diaPago = tarjeta.cicloFacturacion?.diaPago;
  if (!diaPago || diaPago < 1 || diaPago > 31) return null;

  const fechaBase = normalizarFecha(referencia);
  const fechaPago = new Date(fechaBase.getFullYear(), fechaBase.getMonth(), diaPago);

  if (fechaPago.getTime() < fechaBase.getTime()) {
    fechaPago.setMonth(fechaPago.getMonth() + 1);
  }

  return fechaPago;
};

const obtenerDiasHastaPago = (fechaPago: Date, referencia: Date) =>
  Math.ceil((normalizarFecha(fechaPago).getTime() - normalizarFecha(referencia).getTime()) / MS_POR_DIA);

const hidratarBancoSiFalta = (tarjeta: Tarjeta, bancos: Banco[]): Tarjeta => {
  if (tarjeta.banco) return tarjeta;
  return {
    ...tarjeta,
    banco: bancos.find((banco) => idsIguales(banco.id, tarjeta.bancoId)),
  };
};

export const notificacionService = {
  construirNotificaciones({
    presupuestos,
    gastos,
    tarjetas,
    bancos,
    referencia = new Date(),
  }: {
    presupuestos: PresupuestoMensual[];
    gastos: Gasto[];
    tarjetas: Tarjeta[];
    bancos: Banco[];
    referencia?: Date;
  }): Notificacion[] {
    const notificacionesPresupuesto = this.construirNotificacionesPresupuesto(presupuestos, gastos, referencia);
    const tarjetasHidratadas = tarjetas.map((tarjeta) => hidratarBancoSiFalta(tarjeta, bancos));
    const notificacionesTarjeta = this.construirNotificacionesTarjeta(tarjetasHidratadas, referencia);

    return [...notificacionesPresupuesto, ...notificacionesTarjeta].sort((a, b) => b.fecha.localeCompare(a.fecha));
  },

  construirNotificacionesPresupuesto(
    presupuestos: PresupuestoMensual[],
    gastos: Gasto[],
    referencia: Date,
  ): Notificacion[] {
    const presupuestosCalculados = presupuestoService.normalizarListaConGastos(presupuestos, gastos);

    return presupuestosCalculados.flatMap((presupuesto) =>
      presupuesto.desgloseCategorias
        .filter((detalle) => detalle.limiteSoles > 0 && detalle.gastadoSoles / detalle.limiteSoles >= 0.9)
        .map<Notificacion>((detalle) => ({
          id: `presupuesto-${presupuesto.id}-${detalle.categoria.nombre}-${detalle.limiteSoles}-${detalle.gastadoSoles}`,
          tipo: 'PRESUPUESTO',
          nivel: detalle.gastadoSoles >= detalle.limiteSoles ? 'PELIGRO' : 'ADVERTENCIA',
          titulo: 'Límite de presupuesto',
          mensaje: `¡Atención! Has superado el 90% de tu presupuesto en ${detalle.categoria.nombre}.`,
          fecha: referencia.toISOString().slice(0, 10),
          enlace: '/app/saldo/presupuesto',
        })),
    );
  },

  construirNotificacionesTarjeta(tarjetas: Tarjeta[], referencia: Date): Notificacion[] {
    return tarjetas
      .filter((tarjeta) => tarjeta.tipo === 'CREDITO' && tarjeta.cicloFacturacion?.pagoMinimo)
      .flatMap((tarjeta): Notificacion[] => {
        const fechaPago = obtenerFechaPago(tarjeta, referencia);
        if (!fechaPago) return [];

        const dias = obtenerDiasHastaPago(fechaPago, referencia);
        if (dias < 0 || dias > 7) return [];

        const nombreBanco = obtenerNombreBanco(tarjeta);
        const pagoMinimo = tarjeta.cicloFacturacion?.pagoMinimo ?? 0;
        const fecha = fechaPago.toISOString().slice(0, 10);

        return [
          {
            id: `tarjeta-${tarjeta.id}-${fecha}`,
            tipo: 'TARJETA',
            nivel: dias <= 2 ? 'PELIGRO' : 'ADVERTENCIA',
            titulo: 'Pago de tarjeta próximo',
            mensaje: `${nombreBanco} termina en ${tarjeta.numero}: pago mínimo ${formatCurrencyPen(pagoMinimo)} vence ${dias === 0 ? 'hoy' : `en ${dias} día${dias === 1 ? '' : 's'}`}.`,
            fecha,
            enlace: '/app/tarjetas/listar',
          },
        ];
      });
  },
};
