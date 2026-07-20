import { FeatureShell } from '../../../shared/components/FeatureShell/FeatureShell';

export function SaldoPage() {
  return (
    <FeatureShell
      title="Módulo de Saldo"
      description="Consulta tu saldo y simula acciones futuras."
      actions={[
        { to: 'convertir', label: 'Convertir la plata', match: 'convertir' },
        { to: 'separar', label: 'Separar para que no se use', match: 'separar' },
        { to: 'presupuesto', label: 'Controlar presupuesto', match: 'presupuesto' },
      ]}
    />
  );
}
