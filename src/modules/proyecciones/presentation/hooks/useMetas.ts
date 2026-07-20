import { useContext } from 'react';
import { MetasContext } from '../context/MetasProvider';

export function useMetas() {
  const context = useContext(MetasContext);

  if (!context) {
    throw new Error('useMetas debe usarse dentro de MetasProvider');
  }

  return context;
}
