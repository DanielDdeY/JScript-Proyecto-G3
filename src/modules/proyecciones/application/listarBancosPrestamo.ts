import type { Banco } from '../../../shared/types/banco';
import type { PrestamosRepository } from '../domain/repositories/prestamosRepository';

export const listarBancosPrestamo = (repository: PrestamosRepository): Promise<Banco[]> =>
  repository.listarBancos();
