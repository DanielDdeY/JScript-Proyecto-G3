import { useMemo, useState } from 'react';
import type { Gasto } from '../../../../shared/types/gasto';
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
  const { gastos, cargando, error, actualizarEstadoDeudor } = useGastos();
  const { tarjetas, cargando: cargandoWallet } = useWallet();
  const [gastoSeleccionado, setGastoSeleccionado] = useState<Gasto | null>(null);

  const gastoModal = useMemo(
    () => gastos.find((gasto) => gastoSeleccionado && gasto.id === gastoSeleccionado.id) ?? gastoSeleccionado,
    [gastoSeleccionado, gastos],
  );

  if (cargando || cargandoWallet) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card border-0 shadow-sm p-4 bg-white">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h4 className="fw-bold text-dark m-0">Historial de Gastos</h4>
            <p className="text-muted small mb-0">Haz clic en un gasto para ver cuotas, deudores y detalles completos.</p>
          </div>
          <span className="badge bg-danger-subtle text-danger py-2 px-3 fw-bold align-self-start align-self-md-center">
            {gastos.length} Transacciones
          </span>
        </div>

        {error ? (
          <div className="alert alert-danger border-0 rounded-4 fw-semibold" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2" /> {error}
          </div>
        ) : null}

        {gastos.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-cart-x display-1 text-light" />
            <p className="mt-3 fw-semibold">No se han registrado gastos aún.</p>
            <p className="small">Usa el botón Agregar Gasto para registrar uno nuevo.</p>
          </div>
        ) : (
          <ListaGastos gastos={gastos} tarjetas={tarjetas} onSeleccionarGasto={setGastoSeleccionado} />
        )}
      </div>

      <GastoDetalleModal
        gasto={gastoModal}
        onClose={() => setGastoSeleccionado(null)}
        onActualizarEstadoDeudor={actualizarEstadoDeudor}
      />
    </>
  );
}
