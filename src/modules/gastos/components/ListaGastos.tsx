import type { Gasto } from '../../../shared/types/gasto';
import type { Tarjeta } from '../../../shared/types/tarjeta';
import { formatCurrencyPen, formatShortDate } from '../../../shared/utils/formatters';
import { idsIguales } from '../../../shared/utils/ids';
import { obtenerNombreBanco, obtenerUltimosDigitos } from '../../../shared/utils/tarjetaUtils';
import { obtenerEtiquetasReincidencia } from '../../../shared/utils/reincidenciaUtils';
import { obtenerEtiquetaDetalleCuotas, tieneGastoCompartido } from '../domain/services/gastoDisplayService';

interface ListaGastosProps {
  readonly gastos: Gasto[];
  readonly tarjetas: Tarjeta[];
  readonly onSeleccionarGasto: (gasto: Gasto) => void;
}

const obtenerClaseImportancia = (importancia: Gasto['categoria']['importancia']) => {
  if (importancia === 'Alta') return 'bg-danger-subtle text-danger';
  if (importancia === 'Media') return 'bg-warning-subtle text-warning-emphasis';

  return 'bg-success-subtle text-success';
};

export function ListaGastos({ gastos, tarjetas, onSeleccionarGasto }: ListaGastosProps) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th className="fw-bold text-dark py-3">Descripción</th>
            <th className="fw-bold text-dark py-3">Categoría</th>
            <th className="fw-bold text-dark py-3">Fecha</th>
            <th className="fw-bold text-dark py-3">Cuenta / Tarjeta</th>
            <th className="fw-bold text-dark py-3">Extras</th>
            <th className="fw-bold text-dark py-3 text-end">Monto</th>
          </tr>
        </thead>
        <tbody>
          {gastos.map((gasto) => {
            const tarjeta = gasto.tarjetaId ? tarjetas.find((item) => idsIguales(item.id, gasto.tarjetaId)) : undefined;
            const priorityClass = obtenerClaseImportancia(gasto.categoria.importancia);
            const etiquetaCuotas = obtenerEtiquetaDetalleCuotas(gasto.detalleCuotas);

            return (
              <tr key={String(gasto.id)} className="gasto-row">
                <td className="py-3">
                  <button
                    type="button"
                    className="btn btn-link p-0 text-start text-decoration-none"
                    onClick={() => onSeleccionarGasto(gasto)}
                  >
                    <span className="d-block fw-bold text-dark">{gasto.descripcion}</span>
                    {gasto.prestacion ? (
                      <span className="d-block small text-muted">Prestado a: {gasto.prestacion.nombrePersona}</span>
                    ) : null}
                    <span className="visually-hidden">Ver detalle del gasto</span>
                  </button>
                </td>
                <td className="py-3">
                  <span className="badge bg-light text-dark border me-2 py-1 px-2 small fw-semibold">
                    {gasto.categoria.nombre}
                  </span>
                  <span className={`badge ${priorityClass} py-1 px-2 small fw-bold`}>
                    {gasto.categoria.importancia}
                  </span>
                </td>
                <td className="py-3 text-muted">{formatShortDate(gasto.fecha)}</td>
                <td className="py-3 text-secondary small">
                  {tarjeta ? (
                    <span className="d-inline-flex align-items-center gap-1">
                      <i className="bi bi-credit-card" aria-hidden="true" />
                      <span>{obtenerNombreBanco(tarjeta)} (**** {obtenerUltimosDigitos(tarjeta.numero)})</span>
                    </span>
                  ) : (
                    <span className="d-inline-flex align-items-center gap-1">
                      <i className="bi bi-cash-stack" aria-hidden="true" />
                      <span>Efectivo</span>
                    </span>
                  )}
                </td>
                <td className="py-3">
                  <div className="d-flex flex-wrap gap-1">
                    {etiquetaCuotas ? <span className="badge bg-warning text-dark">Cuotas</span> : null}
                    {tieneGastoCompartido(gasto) ? <span className="badge bg-primary-subtle text-primary">Compartido</span> : null}
                    {gasto.prestacion ? <span className="badge bg-info-subtle text-info-emphasis">Prestación</span> : null}
                    {obtenerEtiquetasReincidencia(gasto.reincidencia).map((etiqueta) => (
                      <span key={etiqueta} className="badge bg-secondary-subtle text-secondary">{etiqueta}</span>
                    ))}
                  </div>
                </td>
                <td className="py-3 text-end fw-bold text-danger font-monospace">
                  - {formatCurrencyPen(gasto.monto)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
