import type { PortafolioInversiones } from '../../../shared/types/portafolioInversiones';
import { formatCurrencyPen } from '../../../shared/utils/formatters';
import { calcularRiesgoPortafolio, calcularTotalesPortafolio, obtenerUltimoRendimiento } from '../domain/services/inversionService';

interface ResumenPortafolioCardProps {
  portafolio: PortafolioInversiones;
}

const riesgoClassName = {
  BAJO: 'bg-success',
  MEDIO: 'bg-warning text-dark',
  ALTO: 'bg-danger',
} as const;

export function ResumenPortafolioCard({ portafolio }: ResumenPortafolioCardProps) {
  const riesgo = calcularRiesgoPortafolio(portafolio);
  const totales = calcularTotalesPortafolio(portafolio);
  const promedioRendimiento = portafolio.activos.length
    ? portafolio.activos.reduce((total, activo) => total + obtenerUltimoRendimiento(activo.historial), 0) /
      portafolio.activos.length
    : 0;

  return (
    <article className="card border-0 shadow-sm p-4 bg-white">
      <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
        <div>
          <span className="text-muted small text-uppercase fw-bold">Resumen de portafolio</span>
          <h4 className="fw-bold mb-2">Perfil de riesgo del usuario</h4>
          <span className={`badge ${riesgoClassName[riesgo]} px-3 py-2 rounded-pill`}>Riesgo {riesgo}</span>
          <p className="text-muted small mb-0 mt-2">
            Calculado con el último porcentaje de rendimiento histórico de cada activo. Promedio actual:{' '}
            <strong>{promedioRendimiento.toFixed(2)}%</strong>.
          </p>
        </div>

        <div className="row g-2 text-lg-end">
          <div className="col-12">
            <span className="text-muted small d-block">Capital invertido</span>
            <strong>{formatCurrencyPen(totales.capitalInvertido)}</strong>
          </div>
          <div className="col-12">
            <span className="text-muted small d-block">Valor actual estático</span>
            <strong>{formatCurrencyPen(totales.valorActual)}</strong>
          </div>
          <div className="col-12">
            <span className="text-muted small d-block">Ganancia neta</span>
            <strong className={totales.gananciaNeta >= 0 ? 'text-success' : 'text-danger'}>
              {totales.gananciaNeta >= 0 ? '+' : ''} {formatCurrencyPen(totales.gananciaNeta)}
            </strong>
          </div>
        </div>
      </div>
    </article>
  );
}
