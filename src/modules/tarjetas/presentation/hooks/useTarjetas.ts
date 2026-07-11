import { useContext } from 'react';
import { TarjetasContext } from '../context/TarjetasProvider';

export function useTarjetas() {
  const context = useContext(TarjetasContext);

  if (!context) {
    throw new Error('useTarjetas debe usarse dentro de TarjetasProvider.');
  }

  return context;
}
