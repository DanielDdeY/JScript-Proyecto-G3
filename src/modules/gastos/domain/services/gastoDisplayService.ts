import type { AmigoDeudor, EstadoDeudaAmigo } from '../../../../shared/types/amigoDeudor';
import type { DetalleCuotas } from '../../../../shared/types/detallecuotas';
import type { Gasto } from '../../../../shared/types/gasto';
import { formatCurrencyPen, formatShortDate } from '../../../../shared/utils/formatters';

const normalizarTexto = (texto: string) => texto.trim().toLocaleLowerCase('es-PE');

export const esPrestacion = (gasto: Pick<Gasto, 'categoria'>): boolean =>
  normalizarTexto(gasto.categoria.nombre) === 'prestaciones';

export const obtenerTituloGasto = (gasto: Gasto): string =>
  `${gasto.descripcion} - ${formatCurrencyPen(gasto.monto)}`;

export const obtenerResumenGasto = (gasto: Gasto): string =>
  `${formatCurrencyPen(gasto.monto)} · ${formatShortDate(gasto.fecha)} · ${gasto.categoria.nombre}`;

export const obtenerEtiquetaDetalleCuotas = (detalleCuotas?: DetalleCuotas): string | null => {
  if (!detalleCuotas) return null;

  return `Cuota ${detalleCuotas.cuotasPagadas} de ${detalleCuotas.cuotasTotales} (${formatCurrencyPen(
    detalleCuotas.montoPorCuota,
  )}/mes)`;
};

export const tieneGastoCompartido = (gasto: Gasto): boolean =>
  Boolean(gasto.gastoCompartido?.esGastoGrupal && gasto.gastoCompartido.deudores.length > 0);

export const obtenerInicialesAmigo = (amigo: AmigoDeudor): string => {
  const partes = amigo.nombreId.trim().split(/\s+/).filter(Boolean);
  const iniciales = partes.slice(0, 2).map((parte) => parte.charAt(0).toUpperCase()).join('');
  return iniciales || '?';
};

export const obtenerClaseEstadoDeudor = (estado: EstadoDeudaAmigo): string =>
  estado === 'PAGADO' ? 'btn-success' : 'btn-warning text-dark';

export const obtenerTextoEstadoDeudor = (amigo: AmigoDeudor): string =>
  `${amigo.estado === 'PAGADO' ? 'Pagado' : 'Pendiente'} (${formatCurrencyPen(amigo.montoDeuda)})`;

export const obtenerEstadoOpuesto = (estado: EstadoDeudaAmigo): EstadoDeudaAmigo =>
  estado === 'PAGADO' ? 'PENDIENTE' : 'PAGADO';
