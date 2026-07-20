import { useState } from 'react';
import type { Tarjeta } from '../../../shared/types/tarjeta';
import { formatCurrencyPen } from '../../../shared/utils/formatters';
import { obtenerUltimosDigitos } from '../../../shared/utils/tarjetaUtils';
import {
  normalizarCicloFacturacion,
  obtenerBancoComoTexto,
  obtenerBancoCompleto,
  obtenerLineaCredito,
  obtenerTextoCicloFacturacion,
  obtenerTipoTarjetaLabel,
} from '../domain/services/tarjetaDisplayService';
import { TarjetaInfoModal, type TarjetaInfoModalData } from './TarjetaInfoModal';

interface TarjetaDetalleModalProps {
  readonly tarjeta: Tarjeta | null;
  readonly onClose: () => void;
}

export function TarjetaDetalleModal({ tarjeta, onClose }: TarjetaDetalleModalProps) {
  const [infoModal, setInfoModal] = useState<TarjetaInfoModalData | null>(null);

  if (!tarjeta) return null;

  const banco = obtenerBancoCompleto(tarjeta) ?? tarjeta.banco ?? obtenerBancoComoTexto(tarjeta);
  const cicloFacturacion = normalizarCicloFacturacion(tarjeta.cicloFacturacion);
  const lineaCredito = obtenerLineaCredito(tarjeta);

  return (
    <>
      <dialog open className="modal fade show d-block" aria-modal="true">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 pb-0">
              <div>
                <p className="text-primary fw-bold text-uppercase small mb-1">Detalle completo</p>
                <h4 className="modal-title fw-bold mb-0">Tarjeta **** {obtenerUltimosDigitos(tarjeta.numero)}</h4>
              </div>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
            </div>
            <div className="modal-body pt-3">
              <div className="row g-3 mb-4">
                <DetalleResumen label="Banco" value={obtenerBancoComoTexto(tarjeta)} />
                <DetalleResumen label="Número" value={`**** **** **** ${obtenerUltimosDigitos(tarjeta.numero)}`} />
                <DetalleResumen label="Saldo" value={formatCurrencyPen(tarjeta.saldo)} />
                <DetalleResumen label="Tipo" value={obtenerTipoTarjetaLabel(tarjeta)} />
              </div>

              <div className="card border-0 bg-light-subtle rounded-4 p-3 mb-3">
                <h6 className="fw-bold mb-3">Tipos vinculados</h6>
                <div className="d-flex flex-wrap gap-2">
                  <button type="button" className="btn btn-outline-primary fw-semibold" onClick={() => setInfoModal({ tipo: 'banco', data: banco })}>
                    <i className="bi bi-bank me-2" />{' '}Banco
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger fw-semibold"
                    onClick={() => setInfoModal({ tipo: 'cicloFacturacion', data: cicloFacturacion })}
                  >
                    <i className="bi bi-calendar-event me-2" />{' '}CicloFacturacion
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-success fw-semibold"
                    onClick={() => setInfoModal({ tipo: 'lineaCredito', data: lineaCredito })}
                  >
                    <i className="bi bi-bar-chart-line me-2" />{' '}LineaCredito
                  </button>
                </div>
              </div>

              <div className="alert alert-danger-subtle border-0 rounded-4 mb-0">
                <i className="bi bi-calendar-event me-2" />{' '}{obtenerTextoCicloFacturacion(cicloFacturacion)}
              </div>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </dialog>
      <div className="modal-backdrop fade show" />
      <TarjetaInfoModal modal={infoModal} onClose={() => setInfoModal(null)} />
    </>
  );
}

function DetalleResumen({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="col-12 col-md-6">
      <div className="border rounded-4 p-3 h-100 bg-white">
        <span className="d-block small text-muted fw-semibold text-uppercase">{label}</span>
        <span className="d-block fs-6 fw-bold text-dark mt-1">{value}</span>
      </div>
    </div>
  );
}
