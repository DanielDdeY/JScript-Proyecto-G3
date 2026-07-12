import type { DetalleCategoriaConPorcentaje } from '../domain/services/presupuestoSaldoService';
import { formatCurrencyPen } from '../../../shared/utils/formatters';

interface PresupuestoCategoriaProgressProps {
  detalle: DetalleCategoriaConPorcentaje;
}

const obtenerColorBarra = (detalle: DetalleCategoriaConPorcentaje) => {
  if (detalle.excedido) return 'bg-danger';
  if (detalle.enRiesgo) return 'bg-warning';
  return 'bg-primary';
};

export function PresupuestoCategoriaProgress({ detalle }: PresupuestoCategoriaProgressProps) {
  const porcentajeLabel = `${Math.round(detalle.porcentajeUso)}%`;

  return (
    <article className="border rounded-4 p-3 bg-white shadow-sm">
      <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
        <div>
          <h6 className="fw-bold mb-1">{detalle.categoria.nombre}</h6>
          <span className="text-muted small">Importancia: {detalle.categoria.importancia}</span>
        </div>
        <div className="text-end">
          <strong>{porcentajeLabel}</strong>
          <div className="text-muted small">
            {formatCurrencyPen(detalle.gastadoSoles)} gastados de {formatCurrencyPen(detalle.limiteSoles)}
          </div>
          <div className="text-success small">Te queda {formatCurrencyPen(detalle.restanteSoles)}</div>
        </div>
      </div>

      <div
        className="progress presupuesto-progress"
        role="progressbar"
        aria-valuenow={Math.round(detalle.porcentajeUso)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={`progress-bar ${obtenerColorBarra(detalle)}`} style={{ width: `${detalle.porcentajeUso}%` }} />
      </div>

      {detalle.enRiesgo ? (
        <p className="text-danger small fw-semibold mt-2 mb-0">
          <i className="bi bi-exclamation-triangle-fill me-1" />
          Esta categoría necesita atención.
        </p>
      ) : null}
    </article>
  );
}
