import type { WalletOverview } from '../domain/models/walletOverview';
import type { WalletRepository } from '../domain/repositories/walletRepository';

export const getWalletOverview = (repository: WalletRepository): Promise<WalletOverview> =>
  repository.obtenerResumen();
