import { useState } from 'react';
import type { EstadoDeudaAmigo } from '../../../shared/types/amigoDeudor';
import type { Gasto } from '../../../shared/types/gasto';
import { formatCurrencyPen, formatShortDate } from '../../../shared/utils/formatters';
import { obtenerEtiquetasReincidencia } from '../../../shared/utils/reincidenciaUtils';
import {
  esPrestacion,
  obtenerClaseEstadoDeudor,
  obtenerEstadoOpuesto,
  obtenerEtiquetaDetalleCuotas,
  obtenerInicialesAmigo,
  obtenerTextoEstadoDeudor,
  tieneGastoCompartido,
} from '../domain/services/gastoDisplayService';

interface GastoDetalleModalProps {
  gasto: Gasto | null;
  onClose: () => void;
  onActualizarEstadoDeudor: (gastoId: Gasto['id'], nombreId: string, estado: EstadoDeudaAmigo) => Promise<void>;
}

export function GastoDetalleModal({ gasto, onClose, onActualizarEstadoDeudor }: GastoDetalleModalProps) {
  const [actualizando, setActualizando] = useState<string | null>(null);

  if (!gasto) return null;

  const etiquetaCuotas = obtenerEtiquetaDetalleCuotas(gasto.detalleCuotas);
  const mostrarGastoCompartido = tieneGastoCompartido(gasto);

  const handleActualizarEstado = async (nombreId: string, estadoActual: EstadoDeudaAmigo) => {
    setActualizando(nombreId);

    try {
      await onActualizarEstadoDeudor(gasto.id, nombreId, obtenerEstadoOpuesto(estadoActual));
    } catch {
      // El provider expone el error en pantalla. Evitamos una promesa no controlada en el botón del modal.
    } finally {
      setActualizando(null);
    }
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 pb-0">
              <div>
                <p className="text-danger fw-bold text-uppercase small mb-1">Detalle del gasto</p>
                <h4 className="modal-title fw-bold mb-0">{gasto.descripcion}</h4>
              </div>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
            </div>

            <div className="modal-body pt-3">
              <div className="bg-danger-subtle rounded-4 p-4 mb-4">
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                  <div>
                    <span className="d-block text-danger fw-bold small text-uppercase">Monto total</span>
                    <span className="display-6 fw-bold text-danger">{formatCurrencyPen(gasto.monto)}</span>
                  </div>
                  <div className="text-md-end">
                    <span className="badge bg-white text-dark border me-2 mb-2 px-3 py-2">
                      <i className="bi bi-calendar-event me-1" /> {formatShortDate(gasto.fecha)}
                    </span>
                    <span className="badge bg-white text-dark border mb-2 px-3 py-2">
                      <i className="bi bi-tag me-1" /> {gasto.categoria.nombre}
                    </span>
                    <p className="mb-0 small text-muted fw-semibold">Prioridad: {gasto.categoria.importancia}</p>
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <DetalleItem label="Descripción" value={gasto.descripcion} icon="bi bi-card-text" />
                <DetalleItem label="Origen" value={gasto.tarjetaId ? 'Tarjeta / cuenta vinculada' : 'Efectivo'} icon="bi bi-wallet2" />
                {gasto.tarjetaId ? <DetalleItem label="Tarjeta ID" value={String(gasto.tarjetaId)} icon="bi bi-credit-card" /> : null}
                {esPrestacion(gasto) && gasto.prestacion ? (
                  <DetalleItem label="Prestado a" value={gasto.prestacion.nombrePersona} icon="bi bi-person-check" />
                ) : null}
              </div>

              <div className="border rounded-4 p-3 bg-light mb-4">
                <span className="d-block small text-muted fw-semibold text-uppercase mb-2">
                  <i className="bi bi-arrow-repeat me-2" /> Reincidencia
                </span>
                <div className="d-flex flex-wrap gap-2">
                  {obtenerEtiquetasReincidencia(gasto.reincidencia).map((etiqueta) => (
                    <span key={etiqueta} className="badge bg-secondary-subtle text-secondary px-3 py-2">{etiqueta}</span>
                  ))}
                </div>
              </div>

              {etiquetaCuotas ? (
                <div className="alert alert-warning border-0 rounded-4 d-flex align-items-center gap-2 fw-bold mb-4" role="status">
                  <i className="bi bi-credit-card-2-front-fill" />
                  <span>{etiquetaCuotas}</span>
                </div>
              ) : null}

              {mostrarGastoCompartido ? (
                <section className="border rounded-4 p-3 p-md-4 bg-light-subtle">
                  <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mb-3">
                    <div>
                      <h5 className="fw-bold mb-1">Gasto compartido</h5>
                      <p className="text-muted small mb-0">Personas que deben parte de este gasto.</p>
                    </div>
                    <span className="badge bg-primary-subtle text-primary align-self-md-start px-3 py-2">
                      Mi parte: {formatCurrencyPen(gasto.gastoCompartido?.miParteSoles ?? 0)}
                    </span>
                  </div>

                  <div className="list-group list-group-flush">
                    {gasto.gastoCompartido?.deudores.map((amigo) => (
                      <div
                        key={amigo.nombreId}
                        className="list-group-item bg-transparent px-0 py-3 d-flex align-items-center justify-content-between gap-3"
                      >
                        <div className="d-flex align-items-center gap-3 min-w-0">
                          <AvatarAmigo nombre={amigo.nombreId} avatarUrl={amigo.avatarUrl} />
                          <div className="min-w-0">
                            <p className="fw-bold text-dark mb-0 text-truncate">{amigo.nombreId}</p>
                            <p className="small text-muted mb-0">Debe {formatCurrencyPen(amigo.montoDeuda)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className={`btn btn-sm fw-bold rounded-pill px-3 ${obtenerClaseEstadoDeudor(amigo.estado)}`}
                          disabled={actualizando === amigo.nombreId}
                          onClick={() => void handleActualizarEstado(amigo.nombreId, amigo.estado)}
                        >
                          {actualizando === amigo.nombreId ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                          ) : (
                            obtenerTextoEstadoDeudor(amigo)
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>

            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}

function DetalleItem({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="col-12 col-md-6">
      <div className="border rounded-4 p-3 h-100 bg-white">
        <span className="d-block small text-muted fw-semibold text-uppercase">
          <i className={`${icon} me-2`} /> {label}
        </span>
        <span className="d-block fw-bold text-dark mt-1">{value}</span>
      </div>
    </div>
  );
}

function AvatarAmigo({ nombre, avatarUrl }: { nombre: string; avatarUrl?: string }) {
  if (avatarUrl) {
    return <img src={avatarUrl} alt={nombre} className="gasto-amigo-avatar" />;
  }

  return <span className="gasto-amigo-avatar gasto-amigo-avatar--placeholder">{obtenerInicialesAmigo({ nombreId: nombre, montoDeuda: 0, estado: 'PENDIENTE' })}</span>;
}
