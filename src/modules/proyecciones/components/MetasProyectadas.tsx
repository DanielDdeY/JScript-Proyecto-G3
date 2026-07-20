import type { ResultadoProyeccion } from '../domain/models/proyeccionPredictiva';
import { formatCurrencyPen } from '../../../shared/utils/formatters';

interface MetasProyectadasProps {
  resultado: ResultadoProyeccion;
}

export function MetasProyectadas({ resultado }: MetasProyectadasProps) {
  return (
    <section className="card border-0 shadow-sm p-4 bg-white">
      <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
        <div>
          <h5 className="fw-bold mb-1">Metas frente a esta proyección</h5>
          <p className="text-muted mb-0">El sistema indica si para ese entonces la meta ya habría sido cumplida.</p>
        </div>
        <i className="bi bi-bullseye fs-2 text-primary" />
      </div>

      <div className="row g-3">
        {resultado.metas.map((meta) => (
          <div key={meta.id} className="col-12 col-xl-6">
            <article className="border rounded-4 p-3 h-100">
              <div className="d-flex justify-content-between gap-3 mb-2">
                <div>
                  <h6 className="fw-bold mb-1">{meta.nombre}</h6>
                  <p className="text-muted small mb-0">
                    {formatCurrencyPen(meta.montoActual)} de {formatCurrencyPen(meta.montoObjetivo)}
                  </p>
                </div>
                <span className={`badge rounded-pill align-self-start ${meta.cumplida ? 'bg-success' : 'bg-secondary'}`}>
                  {meta.cumplida ? 'Cumplida' : 'Pendiente'}
                </span>
              </div>
              <p className="mb-0 small">{meta.mensaje}</p>
            </article>
          </div>
        ))}

        {resultado.metas.length === 0 ? (
          <div className="col-12">
            <p className="text-muted text-center mb-0 py-4">Todavía no tienes metas registradas.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
