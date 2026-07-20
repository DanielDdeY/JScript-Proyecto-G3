import { PresupuestoMensualManager } from '../../../presupuestos/components/PresupuestoMensualManager';
import { PresupuestosProvider } from '../../../presupuestos/presentation/context/PresupuestosProvider';

export function SeparacionSaldoPage() {
  return (
    <PresupuestosProvider>
      <PresupuestoMensualManager />
    </PresupuestosProvider>
  );
}