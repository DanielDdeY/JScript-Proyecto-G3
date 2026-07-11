import type { Tarjeta } from '../../../shared/types/tarjeta';
import type { TarjetasRepository } from '../domain/repositories/tarjetasRepository';

export const listarTarjetas = (repository: TarjetasRepository): Promise<Tarjeta[]> => repository.obtenerTarjetas();
