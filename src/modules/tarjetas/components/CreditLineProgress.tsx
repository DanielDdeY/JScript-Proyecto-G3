import type { LineaCredito } from '../../../shared/types/lineaCredito';
import { formatCurrencyPen } from '../../../shared/utils/formatters';
import { calcularDistribucionLineaCredito } from '../domain/services/tarjetaDisplayService';

interface CreditLineProgressProps {
  lineaCredito?: LineaCredito;
}

export function CreditLineProgress({ lineaCredito }: CreditLineProgressProps) {
  const distribucion = calcularDistribucionLineaCredito(lineaCredito);

  if (!distribucion) {
    return (
      <div className="tarjeta-linea-placeholder rounded-4 p-3 mt-3">
        <span className="small fw-semibold text-white-50">Sin línea de crédito registrada</span>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-2 small text-white-50">
        <span>Línea disponible</span>
        <span>{formatCurrencyPen(distribucion.total)}</span>
      </div>
      <div className="tarjeta-linea-progress" aria-label="Distribución de línea de crédito">
        <div
          className="tarjeta-linea-progress__disponible"
          style={{ width: `${distribucion.disponiblePorcentaje}%` }}
          title={`Disponible: ${formatCurrencyPen(distribucion.disponible)}`}
        />
        <div
          className="tarjeta-linea-progress__utilizada"
          style={{ width: `${distribucion.utilizadaPorcentaje}%` }}
          title={`Utilizada: ${formatCurrencyPen(distribucion.utilizada)}`}
        />
      </div>
      <div className="row g-2 mt-2 small">
        <div className="col-6">
          <span className="tarjeta-legend tarjeta-legend--green" /> Disponible {formatCurrencyPen(distribucion.disponible)}
        </div>
        <div className="col-6 text-end">
          <span className="tarjeta-legend tarjeta-legend--red" /> Utilizada {formatCurrencyPen(distribucion.utilizada)}
        </div>
      </div>
    </div>
  );
}
