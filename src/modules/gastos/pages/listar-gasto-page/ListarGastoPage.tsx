import { useMemo, useState } from 'react';
import type { Gasto } from '../../../../shared/types/gasto';
import { Paginacion } from '../../../../shared/components/pagination/Paginacion';
import { FiltrosGastosSidebar } from '../../components/FiltrosGastosSidebar';
import { GastoDetalleModal } from '../../components/GastoDetalleModal';
import { ListaGastos } from '../../components/ListaGastos';
import { GastosProvider } from '../../presentation/context/GastosProvider';
import { useGastos } from '../../presentation/hooks/useGastos';
import { useWallet } from '../../../wallet/presentation/hooks/useWallet';

export function ListarGastoPage() {
  return (
    <GastosProvider>
      <ListarGastoContent />
    </GastosProvider>
  );
}

function ListarGastoContent() {
  const {
    gastos,
    respuesta,
    filtros,
    cargando,
    error,
    actualizarFiltros,
    limpiarFiltros,
    cambiarPagina,
    actualizarEstadoDeudor,
  } = useGastos();
  const { tarjetas, cargando: cargandoWallet } = useWallet();
  const [gastoSeleccionado, setGastoSeleccionado] = useState<Gasto | null>(null);

  const gastoModal = useMemo(
    () => gastos.find((gasto) => gastoSeleccionado && gasto.id === gastoSeleccionado.id) ?? gastoSeleccionado,
    [gastoSeleccionado, gastos],
  );

  return (
    <>
      <div className="row g-4 align-items-start">
        <div className="col-12 col-xl-3">
          <FiltrosGastosSidebar filtros={filtros} onChange={actualizarFiltros} onLimpiar={limpiarFiltros} />
        </div>

        <div className="col-12 col-xl-9">
          <div className="card border-0 shadow-sm p-4 bg-white">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
              <div>
                <h4 className="fw-bold text-dark m-0">Historial de Gastos</h4>
                <p className="text-muted small mb-0">
                  Carga paginada de 10 egresos por página para evitar traer demasiados registros al navegador.
                </p>
              </div>
              <span className="badge bg-danger-subtle text-danger py-2 px-3 fw-bold align-self-start align-self-md-center">
                {respuesta.meta.totalRegistros} registros
              </span>
            </div>

            {error ? (
              <div className="alert alert-danger border-0 rounded-4 fw-semibold" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2" /> {error}
              </div>
            ) : null}

            {cargando || cargandoWallet ? (
              <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : null}

            {!cargando && !cargandoWallet && gastos.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-cart-x display-1 text-light" />
                <p className="mt-3 fw-semibold">No se encontraron gastos con esos filtros.</p>
                <p className="small">Ajusta el rango de fechas o la importancia de categoría.</p>
              </div>
            ) : null}

            {!cargando && !cargandoWallet && gastos.length > 0 ? (
              <>
                <ListaGastos gastos={gastos} tarjetas={tarjetas} onSeleccionarGasto={setGastoSeleccionado} />
                <Paginacion meta={respuesta.meta} onCambiarPagina={cambiarPagina} />
              </>
            ) : null}
          </div>
        </div>
      </div>

      <GastoDetalleModal
        gasto={gastoModal}
        onClose={() => setGastoSeleccionado(null)}
        onActualizarEstadoDeudor={actualizarEstadoDeudor}
      />
    </>
  );
}
