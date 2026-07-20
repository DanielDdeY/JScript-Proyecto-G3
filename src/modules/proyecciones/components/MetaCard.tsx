import { useState, type CSSProperties } from 'react';
import type { MetaAhorro } from '../../../shared/types/meta';
import { calcularMontoRestanteMeta, calcularPorcentajeMeta } from '../domain/services/metaService';
import { MetaForm } from './MetaForm';

interface MetaCardProps {
  readonly meta: MetaAhorro;
  readonly cargando?: boolean;
  readonly onActualizar: (meta: MetaAhorro) => Promise<void>;
  readonly onEliminar: (id: string) => Promise<void>;
}

const formatoSoles = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
});

const formatearFecha = (fecha?: string) => {
  if (!fecha) return 'Sin fecha límite';
  return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }).format(
    new Date(`${fecha}T00:00:00`),
  );
};

export function MetaCard({ meta, cargando = false, onActualizar, onEliminar }: MetaCardProps) {
  const [editando, setEditando] = useState(false);
  const porcentaje = calcularPorcentajeMeta(meta);
  const restante = calcularMontoRestanteMeta(meta);

  if (editando) {
    return (
      <MetaForm
        metaInicial={meta}
        cargando={cargando}
        textoBoton="Actualizar meta"
        onGuardar={async (metaActualizada) => {
          await onActualizar(metaActualizada as MetaAhorro);
          setEditando(false);
        }}
        onCancelar={() => setEditando(false)}
      />
    );
  }

  return (
    <article className="card border-0 shadow-sm bg-white overflow-hidden h-100">
      <div className="card-body p-4 d-flex flex-column gap-3">
        <div className="d-flex justify-content-between gap-3">
          <div>
            <span className={`badge ${meta.completada ? 'text-bg-success' : 'text-bg-primary'} mb-2`}>
              {meta.completada ? 'Completada' : 'En progreso'}
            </span>
            <h5 className="fw-bold text-dark mb-1">{meta.nombre}</h5>
            <p className="text-muted small mb-0">
              <i className="bi bi-calendar-event me-1" />{' '}{formatearFecha(meta.fechaLimite)}
            </p>
          </div>
          <div className="meta-progress-circle" style={{ '--meta-progress': `${porcentaje}%` } as CSSProperties}>
            <span>{porcentaje.toFixed(0)}%</span>
          </div>
        </div>

        <div className="progress meta-progress-bar" role="progressbar" aria-valuenow={porcentaje} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-bar" style={{ width: `${porcentaje}%` }} />
        </div>

        <div className="row g-3">
          <div className="col-6">
            <div className="rounded-4 bg-light p-3 h-100">
              <span className="text-muted small d-block">Actual</span>
              <strong className="text-dark">{formatoSoles.format(meta.montoActual)}</strong>
            </div>
          </div>
          <div className="col-6">
            <div className="rounded-4 bg-light p-3 h-100">
              <span className="text-muted small d-block">Objetivo</span>
              <strong className="text-dark">{formatoSoles.format(meta.montoObjetivo)}</strong>
            </div>
          </div>
        </div>

        <p className="text-muted small mb-0">
          {meta.completada
            ? 'Ya alcanzaste esta meta.'
            : `Faltan ${formatoSoles.format(restante)} para completarla.`}
        </p>

        <div className="d-flex flex-wrap gap-2 mt-auto">
          <button type="button" className="btn btn-outline-primary btn-sm fw-semibold" onClick={() => setEditando(true)}>
            <i className="bi bi-pencil-square me-1" />{' '}Modificar
          </button>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm fw-semibold"
            onClick={() => void onEliminar(meta.id)}
            disabled={cargando}
          >
            <i className="bi bi-trash me-1" />{' '}Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}
