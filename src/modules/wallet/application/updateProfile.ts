import type { Perfil } from '../../../shared/types/perfil';
import type { WalletRepository } from '../domain/repositories/walletRepository';

export const updateProfile = (repository: WalletRepository, perfil: Partial<Perfil>) =>
  repository.actualizarPerfil(perfil);
