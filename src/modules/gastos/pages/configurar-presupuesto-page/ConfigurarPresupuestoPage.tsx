import { PresupuestoLimitesManager } from '../../../presupuestos/components/PresupuestoLimitesManager';
import { PresupuestosProvider } from '../../../presupuestos/presentation/context/PresupuestosProvider';

export function ConfigurarPresupuestoPage() {
  return (
    <PresupuestosProvider>
      <PresupuestoLimitesManager
        titulo="Límites de presupuesto por categoría"
        descripcion="Define cuánto quieres gastar por categoría. El total límite mensual se toma de Saldo > Separar para que no se use."
        textoBoton="Establecer límite por categoría"
      />
    </PresupuestosProvider>
  );
}
