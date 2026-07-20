import type { CuotaPrestamo } from '../../../../shared/types/cuotaPrestamo';
import type { DetalleCuotas } from '../../../../shared/types/detallecuotas';
import type { Prestamo } from '../../../../shared/types/prestamo';

export interface GenerarCuotasParams {
  cuotasTotales: number;
  cuotasPagadas: number;
  montoPorCuota: number;
  fechaPrimerVencimiento: string;
}

const sumarMeses = (fecha: string, meses: number) => {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  const base = new Date(anio, mes - 1 + meses, dia);
  const yyyy = base.getFullYear();
  const mm = String(base.getMonth() + 1).padStart(2, '0');
  const dd = String(base.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const calcularPorcentajeAvancePrestamo = (prestamo: Prestamo): number => {
  if (!prestamo.cuotasTotales) return 0;
  return Math.min(100, Math.round((prestamo.cuotasPagadas / prestamo.cuotasTotales) * 100));
};

export const obtenerCuotaActual = (prestamo: Prestamo): CuotaPrestamo | null => {
  const cuotas = [...(prestamo.cuotas ?? [])].sort((a, b) => a.numeroCuota - b.numeroCuota);
  return cuotas.find((cuota) => cuota.estado !== 'PAGADA') ?? cuotas.at(-1) ?? null;
};

export const obtenerSiguienteEstadoCuota = (estado: CuotaPrestamo['estado']): CuotaPrestamo['estado'] => {
  if (estado === 'PENDIENTE') return 'ATRASADA';
  if (estado === 'ATRASADA') return 'PAGADA';
  return 'PENDIENTE';
};

export const crearDetalleCuotasPrestamo = (
  cuotasTotales: number,
  cuotasPagadas: number,
  montoPorCuota: number,
  tasaInteresAplicada?: number,
): DetalleCuotas => ({
  cuotasTotales,
  cuotasPagadas,
  montoPorCuota,
  mesesSinIntereses: false,
  tasaInteresAplicada,
});

export const generarCuotasPrestamo = ({
  cuotasTotales,
  cuotasPagadas,
  montoPorCuota,
  fechaPrimerVencimiento,
}: GenerarCuotasParams): CuotaPrestamo[] =>
  Array.from({ length: cuotasTotales }, (_, index) => {
    const numeroCuota = index + 1;
    return {
      numeroCuota,
      montoSoles: montoPorCuota,
      fechaVencimiento: sumarMeses(fechaPrimerVencimiento, index),
      estado: numeroCuota <= cuotasPagadas ? 'PAGADA' : 'PENDIENTE',
    };
  });

export const normalizarPrestamo = (prestamo: Prestamo): Prestamo => {
  const cuotasTotales = prestamo.cuotasTotales ?? prestamo.detalleCuotas?.cuotasTotales ?? 0;
  const cuotasPagadas = prestamo.cuotasPagadas ?? prestamo.detalleCuotas?.cuotasPagadas ?? 0;
  const montoPorCuota = prestamo.detalleCuotas?.montoPorCuota ?? (cuotasTotales > 0 ? prestamo.montoAprobado / cuotasTotales : 0);
  const detalleCuotas = prestamo.detalleCuotas ?? crearDetalleCuotasPrestamo(cuotasTotales, cuotasPagadas, montoPorCuota, prestamo.banco.tcea);
  const fechaPrimerVencimiento = prestamo.cuotas?.[0]?.fechaVencimiento ?? prestamo.fechaDesembolso;
  const cuotas = prestamo.cuotas?.length
    ? prestamo.cuotas
    : generarCuotasPrestamo({ cuotasTotales, cuotasPagadas, montoPorCuota, fechaPrimerVencimiento });
  const cuotasPagadasCalculadas = cuotas.filter((cuota) => cuota.estado === 'PAGADA').length;

  return {
    ...prestamo,
    detalleCuotas: {
      ...detalleCuotas,
      cuotasPagadas: cuotasPagadasCalculadas,
      cuotasTotales,
      montoPorCuota,
    },
    cuotas,
    cuotasPagadas: cuotasPagadasCalculadas,
    cuotasTotales,
  };
};

export const recalcularPrestamoPorCuotas = (prestamo: Prestamo): Prestamo => {
  const prestamoNormalizado = normalizarPrestamo(prestamo);
  const totalPagado = prestamoNormalizado.cuotas
    .filter((cuota) => cuota.estado === 'PAGADA')
    .reduce((total, cuota) => total + cuota.montoSoles, 0);
  const cuotasPagadas = prestamoNormalizado.cuotas.filter((cuota) => cuota.estado === 'PAGADA').length;

  return {
    ...prestamoNormalizado,
    cuotasPagadas,
    deudaRestante: Math.max(0, prestamoNormalizado.montoAprobado - totalPagado),
    detalleCuotas: {
      ...prestamoNormalizado.detalleCuotas,
      cuotasPagadas,
    },
  };
};
