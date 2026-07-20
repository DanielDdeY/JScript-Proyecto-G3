import { useContext } from 'react';
import { IngresosContext } from '../context/IngresosProvider';

export function useIngresos() {
  const context = useContext(IngresosContext);

  if (!context) {
    throw new Error('useIngresos debe usarse dentro de IngresosProvider');
  }

  return context;
}
