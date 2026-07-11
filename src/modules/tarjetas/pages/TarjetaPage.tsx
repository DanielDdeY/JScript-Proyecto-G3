import { FeatureShell } from '../../../shared/components/FeatureShell/FeatureShell';
import { TarjetasProvider } from '../presentation/context/TarjetasProvider';

export function TarjetaPage() {
  return (
    <TarjetasProvider>
      <FeatureShell
        title="Módulo de Tarjetas"
        description="Administra tus tarjetas, líneas de crédito, ciclos de facturación y datos bancarios."
        icon="bi bi-credit-card"
        iconClassName="text-primary"
        actions={[
          { to: 'listar', label: 'Carrusel de Tarjetas' },
          { to: 'agregar', label: 'Agregar Tarjeta' },
        ]}
      />
    </TarjetasProvider>
  );
}
