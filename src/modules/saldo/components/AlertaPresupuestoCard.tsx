import type { AlertaPresupuesto } from '../../../shared/types/alertaPresupuesto';

interface AlertaPresupuestoCardProps {
  alerta: AlertaPresupuesto;
}

export function AlertaPresupuestoCard({ alerta }: AlertaPresupuestoCardProps) {
  const alertClass = alerta.tipo === 'PELIGRO' ? 'alert-danger' : 'alert-warning';

  return (
    <div className={`alert ${alertClass} border-0 shadow-sm d-flex align-items-start gap-2 mb-0`} role="alert">
      <i className="bi bi-bell-fill fs-5" />
      <div>
        <strong>{alerta.tipo === 'PELIGRO' ? 'Alerta crítica' : 'Advertencia'}</strong>
        <p className="mb-0">{alerta.mensaje}</p>
        <small className="opacity-75">Emitida el {alerta.fechaEmision}</small>
      </div>
    </div>
  );
}
