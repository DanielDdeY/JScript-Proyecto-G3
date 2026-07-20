import { Paginacion } from '../../../../shared/components/pagination/Paginacion';
import { FiltrosIngresosSidebar } from '../../components/FiltrosIngresosSidebar';
import { ListaIngresos } from '../../components/ListaIngresos';
import { IngresosProvider } from '../../presentation/context/IngresosProvider';
import { useIngresos } from '../../presentation/hooks/useIngresos';
import { useWallet } from '../../../wallet/presentation/hooks/useWallet';

export function ListarIngresoPage() {
  return (
    <IngresosProvider>
      <ListarIngresoContent />
    </IngresosProvider>
  );
}

function ListarIngresoContent() {
  const { ingresos, respuesta, filtros, cargando, error, actualizarFiltros, limpiarFiltros, cambiarPagina } = useIngresos();
  const { tarjetas } = useWallet();

  return (
    <div className="row g-4 align-items-start">
      <div className="col-12 col-xl-3">
        <FiltrosIngresosSidebar filtros={filtros} onChange={actualizarFiltros} onLimpiar={limpiarFiltros} />
      </div>

      <div className="col-12 col-xl-9">
        <div className="card border-0 shadow-sm p-4 bg-white">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
            <div>
              <h4 className="fw-bold text-dark m-0">Historial de Ingresos</h4>
              <p className="text-muted small mb-0">
                Carga paginada de 10 ingresos por página, filtrada por rango de fechas y fuente.
              </p>
            </div>
            <span className="badge bg-success-subtle text-success py-2 px-3 fw-bold align-self-start align-self-md-center">
              {respuesta.meta.totalRegistros} registros
            </span>
          </div>

          {error ? (
            <div className="alert alert-danger border-0 rounded-4 fw-semibold" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2" />{' '}{error}
            </div>
          ) : null}

          {cargando ? (
            <div className="text-center p-5">
              <output className="spinner-border text-primary">
          <span className="visually-hidden">Cargando...</span>
        </output>
            </div>
          ) : null}

          {!cargando && ingresos.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-wallet2 display-1 text-light" />
              <p className="mt-3 fw-semibold">No se encontraron ingresos con esos filtros.</p>
              <p className="small">Ajusta el rango de fechas o la fuente de ingreso.</p>
            </div>
          ) : null}

          {!cargando && ingresos.length > 0 ? (
            <>
              <ListaIngresos ingresos={ingresos} tarjetas={tarjetas} />
              <Paginacion meta={respuesta.meta} onCambiarPagina={cambiarPagina} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
