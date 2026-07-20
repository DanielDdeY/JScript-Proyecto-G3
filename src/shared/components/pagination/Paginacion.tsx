import type { PaginacionMeta } from '../../types/paginacionMeta';

interface PaginacionProps {
  readonly meta: PaginacionMeta;
  readonly onCambiarPagina: (pagina: number) => void;
}

const crearPaginasVisibles = (totalPaginas: number, paginaActual: number) => {
  const inicio = Math.max(1, paginaActual - 2);
  const fin = Math.min(totalPaginas, paginaActual + 2);
  return Array.from({ length: fin - inicio + 1 }, (_, index) => inicio + index);
};

export function Paginacion({ meta, onCambiarPagina }: PaginacionProps) {
  const paginas = crearPaginasVisibles(meta.totalPaginas, meta.paginaActual);

  return (
    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mt-4">
      <p className="text-muted small mb-0">
        Mostrando <strong>{meta.registrosMostrados}</strong> de <strong>{meta.totalRegistros}</strong> registros totales
      </p>

      <nav aria-label="Paginación de registros">
        <ul className="pagination pagination-sm mb-0 flex-wrap">
          <li className={`page-item ${meta.paginaActual <= 1 ? 'disabled' : ''}`}>
            <button className="page-link" type="button" onClick={() => onCambiarPagina(meta.paginaActual - 1)}>
              Anterior
            </button>
          </li>

          {paginas.map((pagina) => (
            <li key={pagina} className={`page-item ${pagina === meta.paginaActual ? 'active' : ''}`}>
              <button className="page-link" type="button" onClick={() => onCambiarPagina(pagina)}>
                {pagina}
              </button>
            </li>
          ))}

          <li className={`page-item ${meta.paginaActual >= meta.totalPaginas ? 'disabled' : ''}`}>
            <button className="page-link" type="button" onClick={() => onCambiarPagina(meta.paginaActual + 1)}>
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
