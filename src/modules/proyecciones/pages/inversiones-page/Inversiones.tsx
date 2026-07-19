import { useMemo, useState } from 'react';
import { AgregarActivoModal } from '../../components/AgregarActivoModal';
import { ActivoInversionCard } from '../../components/ActivoInversionCard';
import { ResumenPortafolioCard } from '../../components/ResumenPortafolioCard';
import { useInversiones } from '../../presentation/hooks/useInversiones';
import { useAuth } from '../../../auth/presentation/hooks/useAuth';
import type { NuevoActivoInversion } from '../../domain/repositories/inversionesRepository';

export function Inversiones() {
  const { portafolios, cargando, error, agregarActivo } = useInversiones();
  const { usuario } = useAuth();
  const [modalAbierto, setModalAbierto] = useState(false);

  const idUsuarioDestino = useMemo(
    () => String(usuario?.id ?? portafolios[0]?.idUsuario ?? 'user-1'),
    [portafolios, usuario],
  );

  const guardarActivo = (activo: NuevoActivoInversion) => agregarActivo(idUsuarioDestino, activo);

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
    <section className="d-flex flex-column gap-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Inversiones</h4>
          <p className="text-muted mb-0">
            El valor actual se maneja como dato estático para simular la lectura en tiempo real sin consultar APIs externas.
          </p>
        </div>
        <button type="button" className="btn btn-success fw-bold rounded-pill px-4" onClick={() => setModalAbierto(true)}>
          <i className="bi bi-plus-circle me-2" /> Añadir activo
        </button>
      </div>

      {error ? (
        <div className="alert alert-danger border-0 shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2" /> {error}
        </div>
      ) : null}

      {portafolios.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 text-center bg-white">
          <i className="bi bi-graph-up-arrow display-2 text-muted" />
          <h5 className="fw-bold mt-3">Aún no tienes inversiones registradas</h5>
          <p className="text-muted mb-0">Presiona “Añadir activo” para crear tu primer portafolio.</p>
        </div>
      ) : (
        portafolios.map((portafolio) => (
          <div key={portafolio.id ?? portafolio.idUsuario} className="d-flex flex-column gap-3">
            <ResumenPortafolioCard portafolio={portafolio} />
            <div className="row g-3">
              {portafolio.activos.map((activo) => (
                <div key={activo.id} className="col-12 col-xl-6">
                  <ActivoInversionCard activo={activo} />
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <AgregarActivoModal abierto={modalAbierto} onClose={() => setModalAbierto(false)} onGuardar={guardarActivo} />
    </section>
  );
}
