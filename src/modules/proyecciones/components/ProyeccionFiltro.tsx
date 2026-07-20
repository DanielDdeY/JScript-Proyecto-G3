import type { FormEvent } from 'react';
import type { ProyeccionFiltros } from '../domain/models/proyeccionPredictiva';

interface ProyeccionFiltroProps {
  readonly filtros: ProyeccionFiltros;
  readonly onChange: (filtros: ProyeccionFiltros) => void;
  readonly onSubmit: () => void;
  readonly cargando?: boolean;
}

const MESES = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

const currentYear = new Date().getFullYear();
const ANIOS = Array.from({ length: 16 }, (_, index) => currentYear + index);

export function ProyeccionFiltro({ filtros, onChange, onSubmit, cargando = false }: ProyeccionFiltroProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="card border-0 shadow-sm p-4 bg-white" onSubmit={handleSubmit}>
      <div className="d-flex align-items-start gap-3 mb-3">
        <div className="icon-circle-md bg-primary-subtle text-primary">
          <i className="bi bi-funnel-fill fs-5" />
        </div>
        <div>
          <h5 className="fw-bold mb-1">Filtro de proyección</h5>
          <p className="text-muted mb-0">Selecciona el mes y año futuro que quieres analizar.</p>
        </div>
      </div>

      <div className="row g-3 align-items-end">
        <div className="col-12 col-md-5">
          <label className="form-label fw-semibold" htmlFor="proyeccion-mes">Mes</label>
          <select
            id="proyeccion-mes"
            className="form-select"
            value={filtros.mes}
            onChange={(event) => onChange({ ...filtros, mes: Number(event.target.value) })}
          >
            {MESES.map((mes) => (
              <option key={mes.value} value={mes.value}>
                {mes.label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label fw-semibold" htmlFor="proyeccion-anio">Año</label>
          <select
            id="proyeccion-anio"
            className="form-select"
            value={filtros.anio}
            onChange={(event) => onChange({ ...filtros, anio: Number(event.target.value) })}
          >
            {ANIOS.map((anio) => (
              <option key={anio} value={anio}>
                {anio}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-3 d-grid">
          <button type="submit" className="btn btn-primary fw-bold" disabled={cargando}>
            <i className="bi bi-magic me-2" />{' '}Calcular
          </button>
        </div>
      </div>
    </form>
  );
}
