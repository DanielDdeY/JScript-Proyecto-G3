import { FeatureShell } from '../../../shared/components/FeatureShell/FeatureShell';

export function GastosPage() {
  return (
    <FeatureShell
      title="Módulo de Gastos"
      description="Administra tus gastos, consulta registros y configura presupuestos."
      icon="bi bi-cart"
      iconClassName="text-danger"
      actions={[
        { to: 'listar', label: 'Listar Gastos' },
        { to: 'agregar', label: 'Agregar Gasto' },
        { to: 'configurar-presupuesto', label: 'Configurar Presupuesto' },
      ]}
    />
  );
}
