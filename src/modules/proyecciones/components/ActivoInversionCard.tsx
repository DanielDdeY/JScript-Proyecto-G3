import type { ActivoInversion } from '../../../shared/types/activoInversion';
import { formatCurrencyPen } from '../../../shared/utils/formatters';
import {
  calcularGananciaActiva,
  calcularPorcentajeGananciaActiva,
  obtenerUltimoRendimiento,
} from '../domain/services/inversionService';

interface ActivoInversionCardProps {
  activo: ActivoInversion;
}

export function ActivoInversionCard({ activo }: ActivoInversionCardProps) {
  const ganancia = calcularGananciaActiva(activo);
  const porcentajeGanancia = calcularPorcentajeGananciaActiva(activo);
  const ultimoRendimiento = obtenerUltimoRendimiento(activo.historial);
  const gananciaClassName = ganancia >= 0 ? 'bg-success' : 'bg-danger';

  return (
    <article className="card border-0 shadow-sm p-4 bg-white h-100">
      <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
        <div>
          <span className="text-muted small text-uppercase fw-bold">Activo de inversión</span>
          <h5 className="fw-bold mb-0">{activo.nombreSimbolo}</h5>
        </div>
        <span className={`badge ${gananciaClassName} rounded-pill px-3 py-2`}>
          {ganancia >= 0 ? '+' : ''} {formatCurrencyPen(ganancia)}
        </span>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="bg-light rounded-4 p-3 h-100">
            <span className="text-muted small d-block">Capital invertido</span>
            <strong>{formatCurrencyPen(activo.capitalInvertido)}</strong>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="bg-light rounded-4 p-3 h-100">
            <span className="text-muted small d-block">Valor actual estático</span>
            <strong>{formatCurrencyPen(activo.valorActual)}</strong>
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 mt-3">
        <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
          Ganancia: {porcentajeGanancia.toFixed(2)}%
        </span>
        <span className="badge bg-secondary-subtle text-secondary rounded-pill px-3 py-2">
          Último rendimiento histórico: {ultimoRendimiento.toFixed(2)}%
        </span>
      </div>
    </article>
  );
}
