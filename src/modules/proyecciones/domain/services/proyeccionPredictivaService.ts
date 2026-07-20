import type { ActivoInversion } from '../../../../shared/types/activoInversion';
import type { Gasto } from '../../../../shared/types/gasto';
import type { Ingreso } from '../../../../shared/types/ingreso';
import type { Reincidencia } from '../../../../shared/types/reincidencia';
import type { Tarjeta } from '../../../../shared/types/tarjeta';
import type {
  DatosProyeccion,
  InversionProyectada,
  MetaProyectada,
  MovimientoProyectado,
  ObligacionProyectada,
  ProyeccionDesglose,
  ProyeccionFiltros,
  ProyeccionMensualPunto,
  ResultadoProyeccion,
} from '../models/proyeccionPredictiva';

const MONTHS_IN_YEAR = 12;
const MIN_PRECISION = 45;
const MAX_PRECISION = 99;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const redondearSoles = (value: number) => Number(value.toFixed(2));

const parseDate = (value: string) => new Date(`${value}T00:00:00`);

const toDateKey = (date: Date) => date.toISOString().substring(0, 10);

const getMonthKey = (date: Date) => date.toISOString().substring(0, 7);

const endOfMonth = (year: number, monthIndex: number) => new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

const addMonths = (date: Date, months: number) => new Date(date.getFullYear(), date.getMonth() + months, 1);

const getMesesHastaObjetivo = (fechaActual: Date, fechaObjetivo: Date) => {
  const meses =
    (fechaObjetivo.getFullYear() - fechaActual.getFullYear()) * MONTHS_IN_YEAR +
    (fechaObjetivo.getMonth() - fechaActual.getMonth());

  return Math.max(meses, 0);
};

const getNombreMes = (date: Date) =>
  new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' }).format(date);

const getTargetDate = ({ mes, anio }: ProyeccionFiltros) => endOfMonth(anio, mes - 1);

const esFechaEntre = (fecha: string, inicio: Date, fin: Date) => {
  const parsed = parseDate(fecha);
  return parsed.getTime() > inicio.getTime() && parsed.getTime() <= fin.getTime();
};

const esFechaHasta = (fecha: string, fin: Date) => {
  const parsed = parseDate(fecha);
  return parsed.getTime() <= fin.getTime();
};

const countAnnualOccurrences = (fechaBase: string, inicio: Date, fin: Date) => {
  const base = parseDate(fechaBase);
  if (Number.isNaN(base.getTime())) return 0;

  let count = 0;
  for (let year = inicio.getFullYear(); year <= fin.getFullYear(); year += 1) {
    const occurrence = new Date(year, base.getMonth(), base.getDate(), 12, 0, 0, 0);
    if (occurrence.getTime() > inicio.getTime() && occurrence.getTime() <= fin.getTime()) {
      count += 1;
    }
  }

  return count;
};

const getFactorReincidencia = (
  reincidencia: Reincidencia | undefined,
  fechaMovimiento: string,
  mesesProyectados: number,
  fechaActual: Date,
  fechaObjetivo: Date,
) => {
  if (!reincidencia) return 0;
  if (reincidencia.esMensual || reincidencia.esRecurrente) return mesesProyectados;
  if (reincidencia.esAnual) return countAnnualOccurrences(fechaMovimiento, fechaActual, fechaObjetivo);
  if (reincidencia.esProbable) return 0.5;
  if (reincidencia.esUnico) return esFechaEntre(fechaMovimiento, fechaActual, fechaObjetivo) ? 1 : 0;
  return 0;
};

const getReglaReincidencia = (reincidencia: Reincidencia | undefined) => {
  if (!reincidencia) return 'Sin reincidencia definida';
  if (reincidencia.esMensual) return 'Mensual: se repite por cada mes proyectado';
  if (reincidencia.esAnual) return 'Anual: se cuenta por cada ocurrencia anual dentro del rango';
  if (reincidencia.esRecurrente) return 'Recurrente: se asume repetición mensual';
  if (reincidencia.esProbable) return 'Probable: se toma el 50% del monto';
  if (reincidencia.esUnico) return 'Único: solo se cuenta si cae dentro del rango futuro';
  return 'Sin reincidencia definida';
};

const crearMovimientoIngreso = (
  ingreso: Ingreso,
  mesesProyectados: number,
  fechaActual: Date,
  fechaObjetivo: Date,
): MovimientoProyectado => {
  const factorAplicado = getFactorReincidencia(ingreso.reincidencia, ingreso.fecha, mesesProyectados, fechaActual, fechaObjetivo);

  return {
    id: String(ingreso.id),
    descripcion: ingreso.descripcion || ingreso.fuente,
    tipo: 'INGRESO',
    montoBase: ingreso.monto,
    factorAplicado,
    montoProyectado: redondearSoles(ingreso.monto * factorAplicado),
    regla: getReglaReincidencia(ingreso.reincidencia),
  };
};

const crearMovimientoGasto = (
  gasto: Gasto,
  mesesProyectados: number,
  fechaActual: Date,
  fechaObjetivo: Date,
): MovimientoProyectado => {
  const factorAplicado = getFactorReincidencia(gasto.reincidencia, gasto.fecha, mesesProyectados, fechaActual, fechaObjetivo);

  return {
    id: String(gasto.id),
    descripcion: gasto.descripcion || gasto.categoria.nombre,
    tipo: 'GASTO',
    montoBase: gasto.monto,
    factorAplicado,
    montoProyectado: redondearSoles(gasto.monto * factorAplicado),
    regla: getReglaReincidencia(gasto.reincidencia),
  };
};

const calcularMovimientosIngresos = (
  ingresos: Ingreso[],
  mesesProyectados: number,
  fechaActual: Date,
  fechaObjetivo: Date,
) => ingresos.map((ingreso) => crearMovimientoIngreso(ingreso, mesesProyectados, fechaActual, fechaObjetivo));

const calcularMovimientosGastos = (
  gastos: Gasto[],
  mesesProyectados: number,
  fechaActual: Date,
  fechaObjetivo: Date,
) => gastos.map((gasto) => crearMovimientoGasto(gasto, mesesProyectados, fechaActual, fechaObjetivo));

const sumarMovimientos = (movimientos: MovimientoProyectado[]) =>
  redondearSoles(movimientos.reduce((total, movimiento) => total + movimiento.montoProyectado, 0));

const calcularObligacionesPrestamos = (
  datos: DatosProyeccion,
  fechaObjetivo: Date,
  mesesProyectados: number,
): ObligacionProyectada[] =>
  datos.prestamos.map((prestamo) => {
    const cuotasPendientes = prestamo.cuotas.filter((cuota) => cuota.estado !== 'PAGADA');
    const cuotasEnRango = cuotasPendientes.filter((cuota) => esFechaHasta(cuota.fechaVencimiento, fechaObjetivo));

    if (cuotasEnRango.length > 0) {
      return {
        id: prestamo.id,
        descripcion: `Préstamo ${prestamo.banco.nombre}`,
        tipo: 'PRESTAMO',
        montoProyectado: redondearSoles(cuotasEnRango.reduce((total, cuota) => total + cuota.montoSoles, 0)),
        cuotasContadas: cuotasEnRango.length,
        cuotasDisponibles: cuotasPendientes.length,
      };
    }

    const cuotasRestantes = Math.max(prestamo.cuotasTotales - prestamo.cuotasPagadas, 0);
    const cuotasContadas = Math.min(mesesProyectados, cuotasRestantes);
    const montoPorCuota = prestamo.detalleCuotas?.montoPorCuota ?? (cuotasRestantes > 0 ? prestamo.deudaRestante / cuotasRestantes : 0);

    return {
      id: prestamo.id,
      descripcion: `Préstamo ${prestamo.banco.nombre}`,
      tipo: 'PRESTAMO',
      montoProyectado: redondearSoles(montoPorCuota * cuotasContadas),
      cuotasContadas,
      cuotasDisponibles: cuotasRestantes,
    };
  });

const calcularObligacionesTarjetas = (tarjetas: Tarjeta[], mesesProyectados: number): ObligacionProyectada[] =>
  tarjetas
    .filter((tarjeta) => tarjeta.tipo === 'CREDITO' && (tarjeta.lineaCredito?.lineaUtilizada ?? 0) > 0)
    .map((tarjeta) => {
      const deudaPendiente = tarjeta.lineaCredito?.lineaUtilizada ?? 0;
      const pagoMensualSugerido = tarjeta.cicloFacturacion?.pagoMinimo || tarjeta.cicloFacturacion?.montoFacturado || deudaPendiente;
      const cuotasDisponibles = pagoMensualSugerido > 0 ? Math.ceil(deudaPendiente / pagoMensualSugerido) : 0;
      const cuotasContadas = Math.min(mesesProyectados, cuotasDisponibles);
      const banco = typeof tarjeta.banco === 'string' ? tarjeta.banco : tarjeta.banco?.nombre;
      const nombreBanco = banco ?? 'Tarjeta';

      return {
        id: String(tarjeta.id),
        descripcion: `Tarjeta de crédito ${nombreBanco} ****${tarjeta.numero}`,
        tipo: 'TARJETA_CREDITO',
        montoProyectado: redondearSoles(Math.min(deudaPendiente, pagoMensualSugerido * cuotasContadas)),
        cuotasContadas,
        cuotasDisponibles,
      };
    });

const obtenerUltimoPorcentaje = (activo: ActivoInversion) => {
  const historial = [...activo.historial].sort((a, b) => a.fecha.localeCompare(b.fecha));
  return historial.at(-1)?.porcentajeGanancia ?? 0;
};

const calcularInversiones = (datos: DatosProyeccion, mesesProyectados: number): InversionProyectada[] =>
  datos.inversiones.flatMap((portafolio) =>
    portafolio.activos.map((activo) => {
      const porcentajeMensual = obtenerUltimoPorcentaje(activo);
      const tasaMensual = clamp(porcentajeMensual / 100, -0.99, 2);
      const valorProyectado = activo.valorActual * (1 + tasaMensual) ** mesesProyectados;
      const gananciaOPerdida = valorProyectado - activo.valorActual;

      return {
        id: activo.id,
        activo: activo.nombreSimbolo,
        valorActual: activo.valorActual,
        porcentajeMensual,
        gananciaOPerdida: redondearSoles(gananciaOPerdida),
        valorProyectado: redondearSoles(valorProyectado),
      };
    }),
  );

const sumarObligacionesPorTipo = (obligaciones: ObligacionProyectada[], tipo: ObligacionProyectada['tipo']) =>
  redondearSoles(
    obligaciones.filter((obligacion) => obligacion.tipo === tipo).reduce((total, obligacion) => total + obligacion.montoProyectado, 0),
  );

const sumarInversiones = (inversiones: InversionProyectada[]) =>
  redondearSoles(inversiones.reduce((total, inversion) => total + inversion.gananciaOPerdida, 0));

const calcularPrecision = (
  movimientosIngresos: MovimientoProyectado[],
  movimientosGastos: MovimientoProyectado[],
  inversiones: InversionProyectada[],
  desglose: Omit<ProyeccionDesglose, 'movimientosIngresos' | 'movimientosGastos' | 'obligaciones' | 'inversiones'>,
  mesesProyectados: number,
) => {
  const movimientos = [...movimientosIngresos, ...movimientosGastos];
  const probableAbs = movimientos
    .filter((movimiento) => movimiento.regla.startsWith('Probable'))
    .reduce((total, movimiento) => total + Math.abs(movimiento.montoBase), 0);
  const impactoTotal =
    Math.abs(desglose.totalIngresos) +
    Math.abs(desglose.totalGastos) +
    Math.abs(desglose.totalPrestamos) +
    Math.abs(desglose.totalTarjetasCredito) +
    Math.abs(desglose.totalGananciaInversiones) +
    1;
  const penalizacionProbable = Math.min(30, (probableAbs / impactoTotal) * 50);
  const promedioRendimientoInversion =
    inversiones.length > 0
      ? inversiones.reduce((total, inversion) => total + Math.abs(inversion.porcentajeMensual), 0) / inversiones.length
      : 0;
  const penalizacionInversiones = Math.min(25, promedioRendimientoInversion * 0.65);
  const penalizacionPlazo = Math.min(15, mesesProyectados * 0.25);
  const precision = clamp(100 - penalizacionProbable - penalizacionInversiones - penalizacionPlazo, MIN_PRECISION, MAX_PRECISION);

  return `${Math.round(precision)}%`;
};

const calcularDesglose = (datos: DatosProyeccion, fechaObjetivo: Date, fechaActual: Date): ProyeccionDesglose => {
  const mesesProyectados = getMesesHastaObjetivo(fechaActual, fechaObjetivo);
  const movimientosIngresos = calcularMovimientosIngresos(datos.ingresos, mesesProyectados, fechaActual, fechaObjetivo);
  const movimientosGastos = calcularMovimientosGastos(datos.gastos, mesesProyectados, fechaActual, fechaObjetivo);
  const obligaciones = [
    ...calcularObligacionesPrestamos(datos, fechaObjetivo, mesesProyectados),
    ...calcularObligacionesTarjetas(datos.tarjetas, mesesProyectados),
  ];
  const inversiones = calcularInversiones(datos, mesesProyectados);

  return {
    saldoActual: datos.perfil?.saldoTotal ?? 0,
    totalIngresos: sumarMovimientos(movimientosIngresos),
    totalGastos: sumarMovimientos(movimientosGastos),
    totalPrestamos: sumarObligacionesPorTipo(obligaciones, 'PRESTAMO'),
    totalTarjetasCredito: sumarObligacionesPorTipo(obligaciones, 'TARJETA_CREDITO'),
    totalGananciaInversiones: sumarInversiones(inversiones),
    movimientosIngresos,
    movimientosGastos,
    obligaciones,
    inversiones,
  };
};

const calcularMontoFinal = (desglose: ProyeccionDesglose) =>
  redondearSoles(
    desglose.saldoActual +
      desglose.totalIngresos -
      desglose.totalGastos -
      desglose.totalPrestamos -
      desglose.totalTarjetasCredito +
      desglose.totalGananciaInversiones,
  );

const calcularLineaTiempo = (datos: DatosProyeccion, mesesProyectados: number, fechaActual: Date): ProyeccionMensualPunto[] =>
  Array.from({ length: mesesProyectados }, (_, index) => {
    const fechaPunto = endOfMonth(addMonths(fechaActual, index + 1).getFullYear(), addMonths(fechaActual, index + 1).getMonth());
    const desglose = calcularDesglose(datos, fechaPunto, fechaActual);

    return {
      periodo: getMonthKey(fechaPunto),
      saldoProyectado: calcularMontoFinal(desglose),
    };
  });

const calcularMetasProyectadas = (
  datos: DatosProyeccion,
  lineaTiempo: ProyeccionMensualPunto[],
  saldoActual: number,
  fechaObjetivo: Date,
): MetaProyectada[] =>
  datos.metas.map((meta) => {
    if (meta.completada || meta.montoActual >= meta.montoObjetivo) {
      return {
        id: meta.id,
        nombre: meta.nombre,
        montoObjetivo: meta.montoObjetivo,
        montoActual: meta.montoActual,
        cumplida: true,
        fechaCumplimientoEstimada: 'Actualidad',
        mensaje: 'Esta meta ya está cumplida con el avance registrado.',
      };
    }

    const puntoCumplimiento = lineaTiempo.find((punto) => {
      const crecimientoNeto = Math.max(0, punto.saldoProyectado - saldoActual);
      return meta.montoActual + crecimientoNeto >= meta.montoObjetivo;
    });

    if (puntoCumplimiento) {
      return {
        id: meta.id,
        nombre: meta.nombre,
        montoObjetivo: meta.montoObjetivo,
        montoActual: meta.montoActual,
        cumplida: true,
        fechaCumplimientoEstimada: puntoCumplimiento.periodo,
        mensaje: `Para ${getNombreMes(fechaObjetivo)}, esta meta habrá sido cumplida. Fecha estimada: ${puntoCumplimiento.periodo}.`,
      };
    }

    return {
      id: meta.id,
      nombre: meta.nombre,
      montoObjetivo: meta.montoObjetivo,
      montoActual: meta.montoActual,
      cumplida: false,
      mensaje: `Para ${getNombreMes(fechaObjetivo)}, esta meta todavía no se cumpliría con la proyección actual.`,
    };
  });

export const calcularProyeccionPredictiva = (
  datos: DatosProyeccion,
  filtros: ProyeccionFiltros,
  fechaActual = new Date(),
): ResultadoProyeccion => {
  const fechaObjetivo = getTargetDate(filtros);
  const mesesProyectados = getMesesHastaObjetivo(fechaActual, fechaObjetivo);
  const desglose = calcularDesglose(datos, fechaObjetivo, fechaActual);
  const monto = calcularMontoFinal(desglose);
  const lineaTiempo = calcularLineaTiempo(datos, mesesProyectados, fechaActual);
  const porcentaje = calcularPrecision(
    desglose.movimientosIngresos,
    desglose.movimientosGastos,
    desglose.inversiones,
    desglose,
    mesesProyectados,
  );

  return {
    tiempo: getNombreMes(fechaObjetivo),
    monto,
    porcentaje,
    fechaObjetivo: toDateKey(fechaObjetivo),
    mesesProyectados,
    desglose,
    metas: calcularMetasProyectadas(datos, lineaTiempo, desglose.saldoActual, fechaObjetivo),
    lineaTiempo,
  };
};
