import type { CuotaPrestamo } from '../../../shared/types/cuotaPrestamo';
import type { Prestamo } from '../../../shared/types/prestamo';
import { formatCurrencyPen, formatShortDate } from '../../../shared/utils/formatters';
import { calcularPorcentajeAvancePrestamo, obtenerCuotaActual } from '../domain/services/prestamoService';

interface PrestamoCardProps {
  prestamo: Prestamo;
  onCambiarEstadoCuota: (prestamoId: string, cuota: CuotaPrestamo) => Promise<void>;
}

const estadoClassName: Record<CuotaPrestamo['estado'], string> = {
  PAGADA: 'bg-success',
  PENDIENTE: 'bg-secondary',
  ATRASADA: 'bg-danger',
};

const estadoSiguiente: Record<CuotaPrestamo['estado'], CuotaPrestamo['estado']> = {
  PENDIENTE: 'ATRASADA',
  ATRASADA: 'PAGADA',
  PAGADA: 'PENDIENTE',
};

export function PrestamoCard({ prestamo, onCambiarEstadoCuota }: PrestamoCardProps) {
  const progreso = calcularPorcentajeAvancePrestamo(prestamo);
  const cuotaActual = obtenerCuotaActual(prestamo);

  return (
    <article className="card border-0 shadow-lg overflow-hidden">
      <div className="card-header border-0 bg-danger text-white p-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
          <div>
            <span className="badge bg-white text-danger fw-bold mb-2">Préstamo actual</span>
            <h4 className="fw-bold mb-1">{prestamo.banco.nombre}</h4>
            <p className="mb-0 text-white-50">
              TCEA {prestamo.banco.tcea}% · Seguro desgravamen {prestamo.banco.seguroDesgravamen}
            </p>
          </div>
          <div className="text-lg-end">
            <span className="small text-white-50 d-block">Fecha de desembolso</span>
            <strong>{formatShortDate(prestamo.fechaDesembolso)}</strong>
          </div>
        </div>
      </div>

      <div className="card-body p-4">
        <div className="row g-4 align-items-center">
          <div className="col-12 col-lg-7">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-semibold text-muted">Avance de cuotas</span>
              <span className="fw-bold text-danger">
                {prestamo.cuotasPagadas} de {prestamo.cuotasTotales}
              </span>
            </div>
            <div className="progress" style={{ height: '14px' }}>
              <div
                className="progress-bar bg-danger"
                role="progressbar"
                style={{ width: `${progreso}%` }}
                aria-valuenow={progreso}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {progreso}%
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="bg-light rounded-4 p-3 h-100">
              <div className="d-flex justify-content-between gap-3 mb-2">
                <span className="text-muted">Monto aprobado</span>
                <strong>{formatCurrencyPen(prestamo.montoAprobado)}</strong>
              </div>
              <div className="d-flex justify-content-between gap-3">
                <span className="text-muted">Falta pagar</span>
                <strong className="text-danger">{formatCurrencyPen(prestamo.deudaRestante)}</strong>
              </div>
            </div>
          </div>
        </div>

        {cuotaActual ? (
          <section className="border rounded-4 p-3 mt-4">
            <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
              <div>
                <span className="text-muted small text-uppercase fw-bold">Cuota actual</span>
                <h5 className="fw-bold mb-1">Cuota N.° {cuotaActual.numeroCuota}</h5>
                <p className="mb-0 text-muted">
                  {formatCurrencyPen(cuotaActual.montoSoles)} · Vence el {formatShortDate(cuotaActual.fechaVencimiento)}
                </p>
              </div>
              <button
                type="button"
                className={`btn ${estadoClassName[cuotaActual.estado]} text-white fw-bold rounded-pill px-4`}
                title={`Cambiar a ${estadoSiguiente[cuotaActual.estado]}`}
                onClick={() => {
                  void onCambiarEstadoCuota(prestamo.id, cuotaActual);
                }}
              >
                Estado: {cuotaActual.estado}
              </button>
              <span className="text-muted small">
                Clic para cambiar a {estadoSiguiente[cuotaActual.estado].toLowerCase()}
              </span>
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
