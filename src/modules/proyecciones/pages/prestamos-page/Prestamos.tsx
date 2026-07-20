import { useState } from 'react';
import { AgregarPrestamoModal } from '../../components/AgregarPrestamoModal';
import { PrestamoCard } from '../../components/PrestamoCard';
import { usePrestamos } from '../../presentation/hooks/usePrestamos';

export function Prestamos() {
  const { prestamos, bancos, cargando, error, agregarPrestamo, cambiarEstadoCuota } = usePrestamos();
  const [modalAbierto, setModalAbierto] = useState(false);

  if (cargando) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="d-flex flex-column gap-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Panel de Préstamos</h4>
          <p className="text-muted mb-0">Controla tus deudas actuales, cuotas pagadas y próximos vencimientos.</p>
        </div>
        <button type="button" className="btn btn-danger fw-bold rounded-pill px-4" onClick={() => setModalAbierto(true)}>
          <i className="bi bi-plus-circle me-2" /> Agregar Préstamo
        </button>
      </div>

      {error ? (
        <div className="alert alert-danger border-0 shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2" /> {error}
        </div>
      ) : null}

      {prestamos.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 text-center bg-white">
          <i className="bi bi-bank display-2 text-muted" />
          <h5 className="fw-bold mt-3">Aún no tienes préstamos registrados</h5>
          <p className="text-muted mb-0">Agrega tu primer préstamo para visualizar su avance de cuotas.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {prestamos.map((prestamo) => (
            <PrestamoCard key={prestamo.id} prestamo={prestamo} onCambiarEstadoCuota={cambiarEstadoCuota} />
          ))}
        </div>
      )}

      <AgregarPrestamoModal
        abierto={modalAbierto}
        bancos={bancos}
        onClose={() => setModalAbierto(false)}
        onGuardar={agregarPrestamo}
      />
    </section>
  );
}
