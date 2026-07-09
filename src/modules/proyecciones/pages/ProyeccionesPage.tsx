import { FeatureShell } from '../../../shared/components/FeatureShell/FeatureShell';

export function ProyeccionesPage() {
  return (
    <FeatureShell
      title="Módulo de Proyecciones"
      description="Planifica metas y revisa proyecciones mensuales o anuales."
      actions={[
        { to: 'agregar', label: 'Agregar Meta' },
        { to: 'listar', label: 'Listar Metas' },
        { to: 'mensual', label: 'Proyección Mensual' },
        { to: 'anual', label: 'Proyección Anual' },
      ]}
    />
  );
}
