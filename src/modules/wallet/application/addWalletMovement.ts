import type { WalletOverview } from '../domain/models/walletOverview';
import type { NuevaTarjeta, NuevoGasto, NuevoIngreso, WalletRepository } from '../domain/repositories/walletRepository';

export const addExpense = (repository: WalletRepository, gasto: NuevoGasto, resumenActual: WalletOverview) =>
  repository.agregarGasto(gasto, resumenActual);

export const addIncome = (repository: WalletRepository, ingreso: NuevoIngreso, resumenActual: WalletOverview) =>
  repository.agregarIngreso(ingreso, resumenActual);

export const addCard = (repository: WalletRepository, tarjeta: NuevaTarjeta, resumenActual: WalletOverview) =>
  repository.agregarTarjeta(tarjeta, resumenActual);
