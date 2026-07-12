import { formatCurrencyPen } from '../../../../shared/utils/formatters';
import { AlertaPresupuestoCard } from '../../components/AlertaPresupuestoCard';
import { PresupuestoCategoriaProgress } from '../../components/PresupuestoCategoriaProgress';
import { PresupuestoSaldoProvider } from '../../presentation/context/PresupuestoSaldoProvider';
import { usePresupuestoSaldo } from '../../presentation/hooks/usePresupuestoSaldo';

function PresupuestoSaldoContent() {
  const { titulo, presupuesto, resumenMensual, detalles, alertas, cargando, error, recargar } = usePresupuestoSaldo();

  if (cargando) {
    return (
      <section className="card border-0 shadow-sm p-4">
        <p className="mb-0 text-muted">Cargando presupuesto...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="card border-0 shadow-sm p-4">
        <div className="alert alert-danger mb-3">{error}</div>
        <button className="btn btn-outline-primary align-self-start" type="button" onClick={() => void recargar()}>
          Reintentar
        </button>
      </section>
    );
  }

  if (!presupuesto) {
    return (
      <section className="card border-0 shadow-sm p-4 text-center">
        <i className="bi bi-clipboard2-data fs-1 text-primary" />
        <h5 className="fw-bold mt-3">No tienes presupuesto configurado</h5>
        <p className="text-muted mb-0">
          Configura primero tu límite mensual en Saldo &gt; Separar para que no se use y luego tus límites por categoría en Gastos &gt; Configurar presupuesto.
        </p>
      </section>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">
      <section className="card border-0 shadow-sm p-4 presupuesto-header-card">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <p className="text-primary fw-semibold mb-1">Panel de Control de Gastos</p>
            <h3 className="fw-bold text-dark mb-2">{titulo}</h3>
            <p className="text-muted mb-0">
              El límite general viene de Saldo &gt; Separar para que no se use. Las barras por categoría vienen de Gastos &gt; Configurar presupuesto.
            </p>
          </div>
          <div className="presupuesto-total-circle">
            <span className="small text-muted">Límite mensual</span>
            <strong>{formatCurrencyPen(presupuesto.totalAsignado)}</strong>
          </div>
        </div>
      </section>

      {resumenMensual ? (
        <section className="card border-0 shadow-sm p-4 bg-white">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            <div>
              <h5 className="fw-bold mb-1">Uso del límite mensual</h5>
              <p className="text-muted mb-0">
                Has gastado {formatCurrencyPen(resumenMensual.gastadoSoles)} de {formatCurrencyPen(resumenMensual.totalAsignado)}. Te queda{' '}
                <strong>{formatCurrencyPen(resumenMensual.restanteSoles)}</strong>.
              </p>
            </div>
            <span className={`badge ${resumenMensual.enRiesgo ? 'bg-danger' : 'bg-primary'} fs-6`}>
              {resumenMensual.porcentajeUso.toFixed(0)}%
            </span>
          </div>
          <div className="progress presupuesto-progress">
            <div
              className={`progress-bar ${resumenMensual.excedido || resumenMensual.enRiesgo ? 'bg-danger' : 'bg-primary'}`}
              style={{ width: `${resumenMensual.porcentajeUso}%` }}
              role="progressbar"
              aria-valuenow={resumenMensual.porcentajeUso}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </section>
      ) : null}

      {alertas.length > 0 ? (
        <section className="d-flex flex-column gap-3">
          {alertas.map((alerta) => (
            <AlertaPresupuestoCard key={`${alerta.mensaje}-${alerta.fechaEmision}`} alerta={alerta} />
          ))}
        </section>
      ) : null}

      <section className="card border-0 shadow-sm p-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div>
            <h5 className="fw-bold mb-1">Detalle por categoría</h5>
            <p className="text-muted mb-0">Cada barra compara tus gastos reales contra los límites por categoría que configuraste.</p>
          </div>
          <button className="btn btn-outline-primary btn-sm" type="button" onClick={() => void recargar()}>
            <i className="bi bi-arrow-clockwise me-1" /> Actualizar
          </button>
        </div>

        {detalles.length === 0 ? (
          <div className="alert alert-info mb-0">
            Todavía no tienes límites por categoría para este mes. Configúralos en Gastos &gt; Configurar presupuesto.
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {detalles.map((detalle) => (
              <PresupuestoCategoriaProgress key={detalle.categoria.nombre} detalle={detalle} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function PresupuestoSaldoPage() {
  return (
    <PresupuestoSaldoProvider>
      <PresupuestoSaldoContent />
    </PresupuestoSaldoProvider>
  );
}
