import { FeatureShell } from '../../../shared/components/FeatureShell/FeatureShell';

export function ProyeccionesPage() {
  return (
    <FeatureShell
      title="Módulo de Proyecciones"
      description="Planifica metas, inversiones, préstamos y proyecciones financieras."
      actions={[
        { to: 'agregar', label: 'Agregar Meta' },
        { to: 'listar', label: 'Listar Metas' },
        { to: 'inversiones', label: 'Inversiones' },
        { to: 'prestamos', label: 'Préstamos' },
        { to: 'proyecciones', label: 'Proyecciones', match: '/app/proyecciones/proyecciones' },
      ]}
    />
  );
}
