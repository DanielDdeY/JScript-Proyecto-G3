import type { TarjetasRepository, NuevaTarjetaConDetalles } from '../domain/repositories/tarjetasRepository';

export const crearTarjeta = (repository: TarjetasRepository, tarjeta: NuevaTarjetaConDetalles): Promise<void> =>
  repository.agregarTarjeta(tarjeta);
