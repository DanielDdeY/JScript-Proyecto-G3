import { useContext } from 'react';
import { PresupuestosContext } from '../context/PresupuestosProvider';

export const usePresupuestos = () => {
  const context = useContext(PresupuestosContext);

  if (!context) {
    throw new Error('usePresupuestos debe usarse dentro de PresupuestosProvider');
  }

  return context;
};
