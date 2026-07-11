import type { Banco } from '../../../shared/types/banco';
import type { TarjetasRepository } from '../domain/repositories/tarjetasRepository';

export const listarBancos = (repository: TarjetasRepository): Promise<Banco[]> => repository.obtenerBancos();
