import { Link } from 'react-router-dom';
import { MetaCard } from '../../components/MetaCard';
import { useMetas } from '../../presentation/hooks/useMetas';

export function ListarMetasPage() {
  const { metas, cargando, error, actualizarMeta, eliminarMeta } = useMetas();

  if (cargando && metas.length === 0) {
    return (
      <div className="text-center p-5">
        <output className="spinner-border text-primary">
          <span className="visually-hidden">Cargando...</span>
        </output>
      </div>
    );
  }

  return (
    <section className="d-flex flex-column gap-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Mis metas</h4>
          <p className="text-muted mb-0">
            Controla cuánto has avanzado, cuánto falta y modifica tus metas cuando cambie tu planificación.
          </p>
        </div>
        <Link className="btn btn-primary fw-bold rounded-pill px-4" to="/app/proyecciones/agregar">
          <i className="bi bi-plus-circle me-2" />{' '}Agregar meta
        </Link>
      </div>

      {error ? (
        <div className="alert alert-danger border-0 shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2" />{' '}{error}
        </div>
      ) : null}

      {metas.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 text-center bg-white">
          <i className="bi bi-bullseye display-2 text-muted" />
          <h5 className="fw-bold mt-3">Todavía no registraste metas</h5>
          <p className="text-muted mb-3">Crea una meta de ahorro con o sin fecha límite.</p>
          <Link className="btn btn-primary fw-bold align-self-center" to="/app/proyecciones/agregar">
            Crear primera meta
          </Link>
        </div>
      ) : (
        <div className="row g-3">
          {metas.map((meta) => (
            <div key={meta.id} className="col-12 col-xl-6">
              <MetaCard meta={meta} cargando={cargando} onActualizar={actualizarMeta} onEliminar={eliminarMeta} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
