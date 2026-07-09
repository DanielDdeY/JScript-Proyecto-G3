import { FeatureShell } from '../../../shared/components/FeatureShell/FeatureShell';

export function PerfilPage() {
  return (
    <FeatureShell
      title="Módulo de Perfil"
      description="Actualiza tus datos y configuración de seguridad."
      icon="bi bi-person-circle"
      iconClassName="text-secondary"
      actions={[
        { to: 'editar', label: 'Editar Perfil' },
        { to: 'seguridad', label: 'Seguridad' },
      ]}
    />
  );
}
