import { useWallet } from '../../../wallet/presentation/hooks/useWallet';
import { formatCurrencyPen, formatShortDate } from '../../../../shared/utils/formatters';
import { idsIguales } from '../../../../shared/utils/ids';
import { obtenerNombreBanco, obtenerUltimosDigitos } from '../../../../shared/utils/tarjetaUtils';

export function ListarGastoPage() {
  const { gastos, tarjetas, cargando } = useWallet();

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
        <h4 className="fw-bold text-dark m-0">Historial de Gastos</h4>
        <span className="badge bg-danger-subtle text-danger py-2 px-3 fw-bold">{gastos.length} Transacciones</span>
      </div>

      {gastos.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-cart-x display-1 text-light" />
          <p className="mt-3 fw-semibold">No se han registrado gastos aún.</p>
          <p className="small">Usa el botón Agregar Gasto para registrar uno nuevo.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th className="fw-bold text-dark py-3">Descripción</th>
                <th className="fw-bold text-dark py-3">Categoría</th>
                <th className="fw-bold text-dark py-3">Fecha</th>
                <th className="fw-bold text-dark py-3">Cuenta / Tarjeta</th>
                <th className="fw-bold text-dark py-3 text-end">Monto</th>
              </tr>
            </thead>
            <tbody>
              {gastos.map((gasto) => {
                const tarjeta = gasto.tarjetaId ? tarjetas.find((item) => idsIguales(item.id, gasto.tarjetaId)) : undefined;
                const priorityClass =
                  gasto.categoria.importancia === 'Alta'
                    ? 'bg-danger-subtle text-danger'
                    : gasto.categoria.importancia === 'Media'
                      ? 'bg-warning-subtle text-warning-emphasis'
                      : 'bg-success-subtle text-success';

                return (
                  <tr key={String(gasto.id)}>
                    <td className="py-3">
                      <div className="fw-bold text-dark">{gasto.descripcion}</div>
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
                        <>
                          <i className="bi bi-credit-card me-1" />
                          {obtenerNombreBanco(tarjeta)} (**** {obtenerUltimosDigitos(tarjeta.numero)})
                        </>
                      ) : (
                        <>
                          <i className="bi bi-cash-stack me-1" />
                          Efectivo
                        </>
                      )}
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
      )}
    </div>
  );
}
