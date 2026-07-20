import type { FiltrosWallet } from '../../../shared/types/filtros';

interface FiltrosGastosSidebarProps {
  readonly filtros: FiltrosWallet;
  readonly onChange: (filtros: FiltrosWallet) => void;
  readonly onLimpiar: () => void;
}

export function FiltrosGastosSidebar({ filtros, onChange, onLimpiar }: FiltrosGastosSidebarProps) {
  const actualizarRango = (campo: keyof FiltrosWallet['rangoFecha'], valor: string) => {
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
        <i className="bi bi-funnel-fill text-danger" />
        <h6 className="fw-bold mb-0">Filtros</h6>
      </div>

      <div className="mb-3">
        <label className="form-label small fw-semibold" htmlFor="gastos-fecha-desde">Fecha desde</label>
        <input
          id="gastos-fecha-desde"
          type="date"
          className="form-control form-control-sm"
          value={filtros.rangoFecha.inicio}
          onChange={(event) => actualizarRango('inicio', event.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label small fw-semibold" htmlFor="gastos-fecha-hasta">Fecha hasta</label>
        <input
          id="gastos-fecha-hasta"
          type="date"
          className="form-control form-control-sm"
          value={filtros.rangoFecha.fin}
          onChange={(event) => actualizarRango('fin', event.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="form-label small fw-semibold" htmlFor="gastos-importancia">Importancia</label>
        <select
          id="gastos-importancia"
          className="form-select form-select-sm"
          value={filtros.importancia ?? 'TODAS'}
          onChange={(event) => onChange({ ...filtros, importancia: event.target.value as FiltrosWallet['importancia'] })}
        >
          <option value="TODAS">Todas</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
      </div>

      <button className="btn btn-outline-secondary btn-sm w-100 fw-semibold" type="button" onClick={onLimpiar}>
        <i className="bi bi-arrow-counterclockwise me-1" />{' '}Limpiar filtros
      </button>
    </aside>
  );
}
