import { useContext } from 'react';
import { InversionesContext } from '../context/InversionesProvider';

export function useInversiones() {
  const context = useContext(InversionesContext);

  if (!context) {
    throw new Error('useInversiones debe usarse dentro de InversionesProvider');
  }

  return context;
}
