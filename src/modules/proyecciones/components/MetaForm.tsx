import { useEffect, useState, type FormEvent } from 'react';
import type { MetaAhorro } from '../../../shared/types/meta';
import type { NuevaMetaAhorro } from '../domain/repositories/metasRepository';

interface MetaFormProps {
  readonly metaInicial?: MetaAhorro;
  readonly cargando?: boolean;
  readonly textoBoton?: string;
  readonly onGuardar: (meta: NuevaMetaAhorro | MetaAhorro) => Promise<void>;
  readonly onCancelar?: () => void;
}

interface MetaFormState {
  nombre: string;
  montoObjetivo: string;
  montoActual: string;
  fechaLimite: string;
}

const estadoInicial: MetaFormState = {
  nombre: '',
  montoObjetivo: '',
  montoActual: '0',
  fechaLimite: '',
};

const crearEstadoDesdeMeta = (meta?: MetaAhorro): MetaFormState => {
  if (!meta) return estadoInicial;

  return {
    nombre: meta.nombre,
    montoObjetivo: String(meta.montoObjetivo),
    montoActual: String(meta.montoActual),
    fechaLimite: meta.fechaLimite ?? '',
  };
};

export function MetaForm({
  metaInicial,
  cargando = false,
  textoBoton = 'Guardar meta',
  onGuardar,
  onCancelar,
}: MetaFormProps) {
  const [form, setForm] = useState<MetaFormState>(() => crearEstadoDesdeMeta(metaInicial));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(crearEstadoDesdeMeta(metaInicial));
  }, [metaInicial]);

  const actualizarCampo = (campo: keyof MetaFormState, valor: string) => {
    setForm((current) => ({ ...current, [campo]: valor }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const montoObjetivo = Number(form.montoObjetivo);
    const montoActual = Number(form.montoActual);

    if (!form.nombre.trim()) {
      setError('Ingresa el nombre de la meta.');
      return;
    }

    if (!Number.isFinite(montoObjetivo) || montoObjetivo <= 0) {
      setError('El monto objetivo debe ser mayor a cero.');
      return;
    }

    if (!Number.isFinite(montoActual) || montoActual < 0) {
      setError('El monto actual no puede ser negativo.');
      return;
    }

    const metaBase = {
      nombre: form.nombre.trim(),
      montoObjetivo,
      montoActual,
      fechaLimite: form.fechaLimite || undefined,
    };

    if (metaInicial) {
      await onGuardar({
        ...metaInicial,
        ...metaBase,
      });
      return;
    }

    await onGuardar(metaBase);
    setForm(estadoInicial);
  };

  return (
    <form className="card border-0 shadow-sm bg-white p-4" onSubmit={handleSubmit}>
      <div className="d-flex flex-column gap-1 mb-4">
        <h4 className="fw-bold text-dark mb-0">{metaInicial ? 'Modificar meta' : 'Nueva meta de ahorro'}</h4>
        <p className="text-muted mb-0">
          La fecha límite es opcional. Puedes dejarla vacía si la meta todavía no tiene fecha definida.
        </p>
      </div>

      {error ? (
        <div className="alert alert-danger border-0" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2" />{' '}{error}
        </div>
      ) : null}

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <label className="form-label fw-semibold" htmlFor="meta-nombre">
            Nombre de la meta
          </label>
          <input
            id="meta-nombre"
            className="form-control"
            value={form.nombre}
            onChange={(event) => actualizarCampo('nombre', event.target.value)}
            placeholder="Ej. Comprar laptop"
          />
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <label className="form-label fw-semibold" htmlFor="meta-objetivo">
            Monto objetivo
          </label>
          <div className="input-group">
            <span className="input-group-text">S/</span>
            <input
              id="meta-objetivo"
              className="form-control"
              type="number"
              min="0"
              step="0.01"
              value={form.montoObjetivo}
              onChange={(event) => actualizarCampo('montoObjetivo', event.target.value)}
              placeholder="3000"
            />
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <label className="form-label fw-semibold" htmlFor="meta-actual">
            Monto actual
          </label>
          <div className="input-group">
            <span className="input-group-text">S/</span>
            <input
              id="meta-actual"
              className="form-control"
              type="number"
              min="0"
              step="0.01"
              value={form.montoActual}
              onChange={(event) => actualizarCampo('montoActual', event.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <label className="form-label fw-semibold" htmlFor="meta-fecha">
            Fecha límite opcional
          </label>
          <input
            id="meta-fecha"
            className="form-control"
            type="date"
            value={form.fechaLimite}
            onChange={(event) => actualizarCampo('fechaLimite', event.target.value)}
          />
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
        {onCancelar ? (
          <button type="button" className="btn btn-outline-secondary fw-semibold" onClick={onCancelar} disabled={cargando}>
            Cancelar
          </button>
        ) : null}
        <button type="submit" className="btn btn-primary fw-bold px-4" disabled={cargando}>
          {cargando ? 'Guardando...' : textoBoton}
        </button>
      </div>
    </form>
  );
}
