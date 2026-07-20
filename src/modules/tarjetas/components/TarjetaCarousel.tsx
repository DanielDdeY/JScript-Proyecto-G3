import { useEffect, useState } from 'react';
import type { Tarjeta } from '../../../shared/types/tarjeta';
import { formatCurrencyPen } from '../../../shared/utils/formatters';
import { obtenerClaseTarjeta, obtenerUltimosDigitos } from '../../../shared/utils/tarjetaUtils';
import {
  normalizarCicloFacturacion,
  obtenerBancoComoTexto,
  obtenerTextoCicloFacturacion,
  obtenerTipoTarjetaLabel,
} from '../domain/services/tarjetaDisplayService';
import { useTarjetas } from '../presentation/hooks/useTarjetas';
import { CreditLineProgress } from './CreditLineProgress';
import { TarjetaDetalleModal } from './TarjetaDetalleModal';

export function TarjetaCarousel() {
  const { tarjetas, cargando, error } = useTarjetas();
  const [indiceActivo, setIndiceActivo] = useState(0);
  const [tarjetaDetalle, setTarjetaDetalle] = useState<Tarjeta | null>(null);

  useEffect(() => {
    if (indiceActivo > tarjetas.length - 1) {
      setIndiceActivo(Math.max(tarjetas.length - 1, 0));
    }
  }, [indiceActivo, tarjetas.length]);

  const tarjetaActiva = tarjetas[indiceActivo];

  const irAnterior = () => {
    setIndiceActivo((actual) => (actual === 0 ? tarjetas.length - 1 : actual - 1));
  };

  const irSiguiente = () => {
    setIndiceActivo((actual) => (actual === tarjetas.length - 1 ? 0 : actual + 1));
  };

  if (cargando) {
    return (
      <div className="text-center p-5">
        <output className="spinner-border text-primary">
          <span className="visually-hidden">Cargando...</span>
        </output>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger border-0 shadow-sm" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2" />{' '}{error}
      </div>
    );
  }

  if (!tarjetaActiva) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="bi bi-credit-card display-1 text-light" />
        <p className="mt-3 fw-semibold">No se han registrado tarjetas aún.</p>
        <p className="small">Usa el botón Agregar Tarjeta para vincular una nueva.</p>
      </div>
    );
  }

  const cicloFacturacion = normalizarCicloFacturacion(tarjetaActiva.cicloFacturacion);

  return (
    <section className="tarjetas-carousel-section">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Carrusel de Tarjetas</h4>
          <p className="text-muted mb-0">Revisa la información completa de tus tarjetas y cuentas.</p>
        </div>
        <span className="badge bg-primary-subtle text-primary py-2 px-3 fw-bold">{tarjetas.length} Activas</span>
      </div>

      <div className="tarjetas-carousel-wrapper">
        {tarjetas.length > 1 ? (
          <button type="button" className="tarjetas-carousel-control tarjetas-carousel-control--left" onClick={irAnterior} aria-label="Tarjeta anterior">
            <i className="bi bi-chevron-left" />
          </button>
        ) : null}

        <article className={`${obtenerClaseTarjeta(tarjetaActiva)} tarjeta-carousel-card p-4 p-md-5`}>
          <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
            <div>
              <span className="fw-bold fs-2 d-block lh-1 text-white">{obtenerBancoComoTexto(tarjetaActiva)}</span>
              <span className="badge bg-white text-warning fw-bold mt-2 py-2 px-3">
                {obtenerTipoTarjetaLabel(tarjetaActiva)}
              </span>
            </div>
            <i className="bi bi-credit-card-2-front fs-1 opacity-75" />
          </div>

          <div className="tarjeta-chip mb-4">
            <i className="bi bi-cpu" />
          </div>

          <div className="font-monospace text-white fs-4 text-opacity-75 mb-1">
            **** **** **** {obtenerUltimosDigitos(tarjetaActiva.numero)}
          </div>

          <CreditLineProgress lineaCredito={tarjetaActiva.lineaCredito} />

          <div className="d-flex flex-wrap justify-content-between align-items-end gap-4 mt-4 tarjeta-carousel-footer">
            <div>
              <span className="small text-white opacity-75 d-block text-uppercase text-xs fw-semibold">
                Saldo actual
              </span>
              <span className="fw-bold fs-3 font-monospace text-white">{formatCurrencyPen(tarjetaActiva.saldo)}</span>
            </div>

            <div className="d-flex flex-column align-items-start align-items-md-end gap-3">
              <div className="tarjeta-ciclo-alert text-danger fw-bold">
                <span className="me-2" aria-hidden="true">📅</span>
                {obtenerTextoCicloFacturacion(cicloFacturacion)}
              </div>
              <button type="button" className="btn btn-light fw-bold rounded-pill px-4" onClick={() => setTarjetaDetalle(tarjetaActiva)}>
                Detalles
              </button>
            </div>
          </div>
        </article>

        {tarjetas.length > 1 ? (
          <button type="button" className="tarjetas-carousel-control tarjetas-carousel-control--right" onClick={irSiguiente} aria-label="Siguiente tarjeta">
            <i className="bi bi-chevron-right" />
          </button>
        ) : null}
      </div>

      {tarjetas.length > 1 ? (
        <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
          {tarjetas.map((tarjeta, index) => (
            <button
              key={String(tarjeta.id)}
              type="button"
              className={`tarjeta-carousel-dot ${index === indiceActivo ? 'tarjeta-carousel-dot--active' : ''}`}
              onClick={() => setIndiceActivo(index)}
              aria-label={`Ver tarjeta ${obtenerUltimosDigitos(tarjeta.numero)}`}
            />
          ))}
        </div>
      ) : null}

      <TarjetaDetalleModal tarjeta={tarjetaDetalle} onClose={() => setTarjetaDetalle(null)} />
    </section>
  );
}
