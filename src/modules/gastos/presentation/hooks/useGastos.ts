import { useContext } from 'react';
import { GastosContext } from '../context/GastosProvider';

export function useGastos() {
  const context = useContext(GastosContext);

  if (!context) {
    throw new Error('useGastos debe usarse dentro de GastosProvider.');
  }

  return context;
}
