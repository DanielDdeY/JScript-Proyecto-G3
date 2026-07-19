import { useContext } from 'react';
import { PrestamosContext } from '../context/PrestamosProvider';

export function usePrestamos() {
  const context = useContext(PrestamosContext);

  if (!context) {
    throw new Error('usePrestamos debe usarse dentro de PrestamosProvider');
  }

  return context;
}
