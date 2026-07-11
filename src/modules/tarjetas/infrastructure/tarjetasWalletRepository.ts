import type { WalletContextValue } from '../../wallet/presentation/context/WalletProvider';
import type { NuevaTarjetaConDetalles, TarjetasRepository } from '../domain/repositories/tarjetasRepository';

export const createTarjetasWalletRepository = (wallet: WalletContextValue): TarjetasRepository => ({
  obtenerTarjetas: async () => wallet.tarjetas,
  obtenerBancos: async () => wallet.bancos,
  agregarTarjeta: async (tarjeta: NuevaTarjetaConDetalles) => {
    await wallet.agregarTarjeta(tarjeta);
  },
  recargar: wallet.recargar,
});
