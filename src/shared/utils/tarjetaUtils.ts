import type { Banco } from '../types/banco';
import type { Tarjeta } from '../types/tarjeta';

export const obtenerNombreBanco = (tarjeta: Tarjeta): string => {
  if (!tarjeta.banco) return 'Banco';
  return typeof tarjeta.banco === 'string' ? tarjeta.banco : tarjeta.banco.nombre;
};

export const obtenerBanco = (tarjeta: Tarjeta): Banco | undefined =>
  typeof tarjeta.banco === 'object' ? tarjeta.banco : undefined;

export const obtenerUltimosDigitos = (numero: string): string => numero.slice(-4).padStart(4, '*');

export const obtenerClaseTarjeta = (tarjeta: Tarjeta): string => {
  const banco = obtenerNombreBanco(tarjeta).toLowerCase();

  if (banco.includes('visa')) return 'wallet-card wallet-card--visa';
  if (banco.includes('bcp')) return 'wallet-card wallet-card--bcp';
  if (banco.includes('bbva')) return 'wallet-card wallet-card--bbva';

  return 'wallet-card wallet-card--default';
};
