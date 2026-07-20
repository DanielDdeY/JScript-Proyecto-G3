import { useContext } from 'react';
import { PresupuestoSaldoContext } from '../context/PresupuestoSaldoProvider';

export function usePresupuestoSaldo() {
  const context = useContext(PresupuestoSaldoContext);

  if (!context) {
    throw new Error('usePresupuestoSaldo debe ser usado dentro de PresupuestoSaldoProvider');
  }

  return context;
}
