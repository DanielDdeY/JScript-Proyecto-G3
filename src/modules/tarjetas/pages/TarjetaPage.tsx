import { FeatureShell } from '../../../shared/components/FeatureShell/FeatureShell';

export function TarjetaPage() {
  return (
    <FeatureShell
      title="Módulo de Tarjetas"
      description="Administra tus tarjetas y revisa sus datos principales."
      icon="bi bi-credit-card"
      iconClassName="text-primary"
      actions={[
        { to: 'listar', label: 'Listar Tarjetas' },
        { to: 'agregar', label: 'Agregar Tarjeta' },
      ]}
    />
  );
}
