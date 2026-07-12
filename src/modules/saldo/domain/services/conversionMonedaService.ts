import type { Tarjeta } from '../../../../shared/types/tarjeta';

export type MonedaConversion = 'USD' | 'EUR' | 'JPY';

export interface ConversionMonedaResultado {
  moneda: MonedaConversion;
  nombre: string;
  simbolo: string;
  tasaSolesPorUnidad: number;
  montoConvertido: number;
}

export const TASAS_CONVERSION_ESTATICAS: Record<MonedaConversion, { nombre: string; simbolo: string; solesPorUnidad: number }> = {
  USD: { nombre: 'Dólar estadounidense', simbolo: 'US$', solesPorUnidad: 3.75 },
  EUR: { nombre: 'Euro', simbolo: '€', solesPorUnidad: 4.05 },
  JPY: { nombre: 'Yen japonés', simbolo: '¥', solesPorUnidad: 0.026 },
};

const obtenerNombreBanco = (tarjeta: Tarjeta): string => {
  if (typeof tarjeta.banco === 'string') return tarjeta.banco;
  return tarjeta.banco?.nombre ?? 'Banco no definido';
};

export const conversionMonedaService = {
  convertirDesdeSoles(montoSoles: number): ConversionMonedaResultado[] {
    return (Object.entries(TASAS_CONVERSION_ESTATICAS) as [MonedaConversion, (typeof TASAS_CONVERSION_ESTATICAS)[MonedaConversion]][])
      .map(([moneda, config]) => ({
        moneda,
        nombre: config.nombre,
        simbolo: config.simbolo,
        tasaSolesPorUnidad: config.solesPorUnidad,
        montoConvertido: montoSoles / config.solesPorUnidad,
      }));
  },

  obtenerEtiquetaTarjeta(tarjeta: Tarjeta): string {
    return `${obtenerNombreBanco(tarjeta)} · ${tarjeta.tipo} · **** ${tarjeta.numero}`;
  },
};
