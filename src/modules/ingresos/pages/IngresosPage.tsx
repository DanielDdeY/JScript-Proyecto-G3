import { FeatureShell } from '../../../shared/components/FeatureShell/FeatureShell';

export function IngresosPage() {
  return (
    <FeatureShell
      title="Módulo de Ingresos"
      description="Registra y consulta las entradas de dinero."
      icon="bi bi-cash-coin"
      iconClassName="text-success"
      actions={[
        { to: 'listar', label: 'Listar Ingresos' },
        { to: 'agregar', label: 'Agregar Ingreso' },
      ]}
    />
  );
}
