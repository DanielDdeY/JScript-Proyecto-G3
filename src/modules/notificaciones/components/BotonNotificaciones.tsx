import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Notificacion } from '../domain/models/notificacion';
import { useNotificaciones } from '../presentation/hooks/useNotificaciones';

const obtenerIcono = (notificacion: Notificacion) => {
  if (notificacion.tipo === 'PRESUPUESTO') return 'bi-graph-up-arrow';
  if (notificacion.tipo === 'TARJETA') return 'bi-credit-card';
  return 'bi-cash-coin';
};

const obtenerColor = (notificacion: Notificacion) => {
  if (notificacion.nivel === 'PELIGRO') return 'text-danger';
  if (notificacion.nivel === 'ADVERTENCIA') return 'text-warning';
  return 'text-primary';
};

export function BotonNotificaciones() {
  const { notificaciones, total, cargando, error, recargar, descartarNotificacion } = useNotificaciones();
  const [panelAbierto, setPanelAbierto] = useState(false);

  return (
    <div className="dropdown position-relative">
      <button
        className="btn btn-light border rounded-circle notification-button position-relative d-flex align-items-center justify-content-center"
        type="button"
        aria-label="Abrir notificaciones"
        aria-expanded={panelAbierto}
        onClick={() => setPanelAbierto((current) => !current)}
      >
        <i className="bi bi-bell fs-5" />
        {total > 0 ? <span className="notification-badge">{total > 9 ? '9+' : total}</span> : null}
      </button>

      <div className={`dropdown-menu dropdown-menu-end notification-panel shadow border-0 ${panelAbierto ? 'show' : ''}`}>
        <div className="d-flex align-items-center justify-content-between border-bottom px-3 py-2">
          <div>
            <strong>Notificaciones</strong>
            <div className="text-muted small">Presupuestos y pagos próximos</div>
          </div>
          <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => void recargar()}>
            <i className="bi bi-arrow-clockwise" />
          </button>
        </div>

        {cargando ? <p className="text-muted mb-0 px-3 py-3">Cargando...</p> : null}
        {error ? <p className="text-danger mb-0 px-3 py-3">{error}</p> : null}

        {!cargando && !error && notificaciones.length === 0 ? (
          <p className="text-muted mb-0 px-3 py-3">No tienes notificaciones pendientes.</p>
        ) : null}

        {!cargando && !error && notificaciones.length > 0 ? (
          <div className="notification-list">
            {notificaciones.map((notificacion) => (
              <div key={notificacion.id} className="dropdown-item notification-item py-3 d-flex align-items-start gap-2">
                <Link
                  to={notificacion.enlace ?? '#'}
                  className="d-flex align-items-start gap-2 text-decoration-none text-reset flex-grow-1 min-w-0"
                  onClick={() => setPanelAbierto(false)}
                >
                  <div className={`notification-item-icon ${obtenerColor(notificacion)}`}>
                    <i className={`bi ${obtenerIcono(notificacion)}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="fw-semibold text-wrap">{notificacion.titulo}</div>
                    <div className="small text-muted text-wrap">{notificacion.mensaje}</div>
                    <div className="small text-secondary mt-1">{notificacion.fecha}</div>
                  </div>
                </Link>
                <button
                  className="btn btn-sm btn-link text-secondary p-0 ms-auto notification-dismiss"
                  type="button"
                  aria-label="Eliminar notificación"
                  title="Eliminar notificación"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    descartarNotificacion(notificacion.id);
                  }}
                >
                  <i className="bi bi-x-lg" />
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
