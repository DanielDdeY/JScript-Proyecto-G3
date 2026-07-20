import type { FiltrosIngresos } from '../../../shared/types/filtros';

interface FiltrosIngresosSidebarProps {
  readonly filtros: FiltrosIngresos;
  readonly onChange: (filtros: FiltrosIngresos) => void;
  readonly onLimpiar: () => void;
}

export function FiltrosIngresosSidebar({ filtros, onChange, onLimpiar }: FiltrosIngresosSidebarProps) {
  const actualizarRango = (campo: keyof FiltrosIngresos['rangoFecha'], valor: string) => {
    onChange({
      ...filtros,
      rangoFecha: {
        ...filtros.rangoFecha,
        [campo]: valor,
      },
    });
  };

  return (
    <aside className="card border-0 shadow-sm p-3 bg-white h-100 filtros-wallet-sidebar">
      <div className="d-flex align-items-center gap-2 mb-3">
        <i className="bi bi-funnel-fill text-success" />
        <h6 className="fw-bold mb-0">Filtros</h6>
      </div>

      <div className="mb-3">
        <label className="form-label small fw-semibold" htmlFor="ingresos-fecha-desde">Fecha desde</label>
        <input
          id="ingresos-fecha-desde"
          type="date"
          className="form-control form-control-sm"
          value={filtros.rangoFecha.inicio}
          onChange={(event) => actualizarRango('inicio', event.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label small fw-semibold" htmlFor="ingresos-fecha-hasta">Fecha hasta</label>
        <input
          id="ingresos-fecha-hasta"
          type="date"
          className="form-control form-control-sm"
          value={filtros.rangoFecha.fin}
          onChange={(event) => actualizarRango('fin', event.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="form-label small fw-semibold" htmlFor="ingresos-fuente">Fuente de ingreso</label>
        <select
          id="ingresos-fuente"
          className="form-select form-select-sm"
          value={filtros.fuente ?? 'TODAS'}
          onChange={(event) => onChange({ ...filtros, fuente: event.target.value as FiltrosIngresos['fuente'] })}
        >
          <option value="TODAS">Todas</option>
          <option value="Sueldo">Sueldo</option>
          <option value="Freelance">Freelance</option>
          <option value="Inversiones">Inversiones</option>
          <option value="Venta">Venta</option>
          <option value="Premio">Premio</option>
          <option value="Otros">Otros</option>
        </select>
      </div>

      <button className="btn btn-outline-secondary btn-sm w-100 fw-semibold" type="button" onClick={onLimpiar}>
        <i className="bi bi-arrow-counterclockwise me-1" />{' '}Limpiar filtros
      </button>
    </aside>
  );
}
