import { useWallet } from '../../../wallet/presentation/hooks/useWallet';
import { formatCurrencyPen, formatShortDate } from '../../../../shared/utils/formatters';

export function ListarIngresoPage() {
  const { ingresos, cargando } = useWallet();

  if (cargando) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm p-4 bg-white">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="fw-bold text-dark m-0">Historial de Ingresos</h4>
        <span className="badge bg-success-subtle text-success py-2 px-3 fw-bold">
          {ingresos.length} Transacciones
        </span>
      </div>

      {ingresos.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-wallet2 display-1 text-light" />
          <p className="mt-3 fw-semibold">No se han registrado ingresos aún.</p>
          <p className="small">Usa el botón Agregar Ingreso para registrar uno nuevo.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th className="fw-bold text-dark py-3">Descripción</th>
                <th className="fw-bold text-dark py-3">Fuente</th>
                <th className="fw-bold text-dark py-3">Fecha</th>
                <th className="fw-bold text-dark py-3 text-end">Monto</th>
              </tr>
            </thead>
            <tbody>
              {ingresos.map((ingreso) => (
                <tr key={String(ingreso.id)}>
                  <td className="py-3">
                    <div className="fw-bold text-dark">{ingreso.descripcion}</div>
                  </td>
                  <td className="py-3">
                    <span className="badge bg-success-subtle text-success py-1 px-2 small fw-semibold">
                      {ingreso.fuente}
                    </span>
                  </td>
                  <td className="py-3 text-muted">{formatShortDate(ingreso.fecha)}</td>
                  <td className="py-3 text-end fw-bold text-success font-monospace">
                    + {formatCurrencyPen(ingreso.monto)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
