import { useWallet } from '../../../wallet/presentation/hooks/useWallet';
import { formatCurrencyPen } from '../../../../shared/utils/formatters';
import { obtenerClaseTarjeta, obtenerNombreBanco, obtenerUltimosDigitos } from '../../../../shared/utils/tarjetaUtils';

export function ListarTarjetaPage() {
  const { tarjetas, cargando } = useWallet();

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
        <h4 className="fw-bold text-dark m-0">Mis Tarjetas y Cuentas</h4>
        <span className="badge bg-primary-subtle text-primary py-2 px-3 fw-bold">{tarjetas.length} Activas</span>
      </div>

      {tarjetas.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-credit-card display-1 text-light" />
          <p className="mt-3 fw-semibold">No se han registrado tarjetas aún.</p>
          <p className="small">Usa el botón Agregar Tarjeta para vincular una nueva.</p>
        </div>
      ) : (
        <div className="row g-3">
          {tarjetas.map((tarjeta) => (
            <div key={String(tarjeta.id)} className="col-12 col-md-6 col-lg-4">
              <article className={`${obtenerClaseTarjeta(tarjeta)} card h-100 d-flex flex-column justify-content-between p-4`}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <span className="fw-bold fs-5 d-block">{obtenerNombreBanco(tarjeta)}</span>
                    <span className="badge bg-white bg-opacity-25 mt-1 text-white py-1 px-2 small">
                      {tarjeta.tipo === 'CREDITO' ? 'Línea Crédito' : 'Cuenta de Ahorro'}
                    </span>
                  </div>
                  <i className="bi bi-cpu fs-3 opacity-75" />
                </div>

                <div>
                  <div className="font-monospace text-white text-opacity-75 small mb-1">
                    **** **** **** {obtenerUltimosDigitos(tarjeta.numero)}
                  </div>
                  <div className="d-flex justify-content-between align-items-end">
                    <div>
                      <span className="small opacity-75 d-block text-uppercase" style={{ fontSize: '0.7rem' }}>
                        Saldo Disponible
                      </span>
                      <span className="fw-bold fs-4 font-monospace">{formatCurrencyPen(tarjeta.saldo)}</span>
                    </div>
                    <i className="bi bi-wallet2 fs-2 opacity-25" />
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
