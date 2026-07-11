import type { Banco } from '../../../../shared/types/banco';
import type { CicloFacturacion } from '../../../../shared/types/cicloFacturacion';
import type { LineaCredito } from '../../../../shared/types/lineaCredito';
import type { Tarjeta } from '../../../../shared/types/tarjeta';
import { formatCurrencyPen } from '../../../../shared/utils/formatters';
import { obtenerNombreBanco } from '../../../../shared/utils/tarjetaUtils';

type CicloFacturacionApi = CicloFacturacion & {
  Facturado?: number;
};

export interface LineaCreditoDistribucion {
  disponible: number;
  utilizada: number;
  total: number;
  disponiblePorcentaje: number;
  utilizadaPorcentaje: number;
}

const clampPorcentaje = (valor: number) => Math.max(0, Math.min(100, valor));

export const normalizarCicloFacturacion = (
  cicloFacturacion?: CicloFacturacion | CicloFacturacionApi,
): CicloFacturacion | undefined => {
  if (!cicloFacturacion) return undefined;

  const cicloApi = cicloFacturacion as CicloFacturacionApi;

  return {
    diaCorte: cicloApi.diaCorte,
    diaPago: cicloApi.diaPago,
    mesActual: cicloApi.mesActual,
    montoFacturado: typeof cicloApi.montoFacturado === 'number' ? cicloApi.montoFacturado : cicloApi.Facturado ?? 0,
    pagoMinimo: cicloApi.pagoMinimo,
  };
};

export const obtenerBancoCompleto = (tarjeta: Tarjeta): Banco | undefined => {
  if (!tarjeta.banco || typeof tarjeta.banco === 'string') return undefined;
  return tarjeta.banco;
};

export const obtenerBancoComoTexto = (tarjeta: Tarjeta): string => obtenerNombreBanco(tarjeta);

export const obtenerLineaCredito = (tarjeta: Tarjeta): LineaCredito | undefined => tarjeta.lineaCredito;

export const calcularDistribucionLineaCredito = (
  lineaCredito?: LineaCredito,
): LineaCreditoDistribucion | undefined => {
  if (!lineaCredito) return undefined;

  const total = Math.max(lineaCredito.limiteTotal, lineaCredito.lineaDisponible + lineaCredito.lineaUtilizada, 0);

  if (total <= 0) {
    return {
      disponible: 0,
      utilizada: 0,
      total: 0,
      disponiblePorcentaje: 0,
      utilizadaPorcentaje: 0,
    };
  }

  const disponiblePorcentaje = clampPorcentaje((lineaCredito.lineaDisponible / total) * 100);
  const utilizadaPorcentaje = clampPorcentaje((lineaCredito.lineaUtilizada / total) * 100);

  return {
    disponible: lineaCredito.lineaDisponible,
    utilizada: lineaCredito.lineaUtilizada,
    total,
    disponiblePorcentaje,
    utilizadaPorcentaje,
  };
};

export const obtenerTextoCicloFacturacion = (cicloFacturacion?: CicloFacturacion): string => {
  if (!cicloFacturacion) return 'Sin ciclo de facturación registrado';

  return `Cierra el ${cicloFacturacion.diaCorte}. Pago mín: ${formatCurrencyPen(cicloFacturacion.pagoMinimo)}`;
};

export const obtenerTipoTarjetaLabel = (tarjeta: Tarjeta): string =>
  tarjeta.tipo === 'CREDITO' ? 'Tarjeta de crédito' : 'Tarjeta de débito';
