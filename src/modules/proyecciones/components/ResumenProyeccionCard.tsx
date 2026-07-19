import type { ResultadoProyeccion } from '../domain/models/proyeccionPredictiva';
import { formatCurrencyPen } from '../../../shared/utils/formatters';

interface ResumenProyeccionCardProps {
  resultado: ResultadoProyeccion;
}

const getBadgeClass = (porcentaje: string) => {
  const value = Number(porcentaje.replace('%', ''));
  if (value >= 80) return 'bg-success';
  if (value >= 60) return 'bg-warning text-dark';
  return 'bg-danger';
};

export function ResumenProyeccionCard({ resultado }: ResumenProyeccionCardProps) {
  const variacion = resultado.monto - resultado.desglose.saldoActual;
  const variacionClass = variacion >= 0 ? 'text-success' : 'text-danger';

  return (
    <section className="card border-0 shadow-sm overflow-hidden">
      <div className="card-body p-4 p-lg-5 bg-dark text-white">
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-4">
          <div>
            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-3">Resultado predictivo</span>
            <h3 className="fw-bold mb-2">Para {resultado.tiempo} podrías tener</h3>
            <p className="display-5 fw-bold mb-2">{formatCurrencyPen(resultado.monto)}</p>
            <p className={`fw-semibold mb-0 ${variacionClass}`}>
              {variacion >= 0 ? '+' : ''}{formatCurrencyPen(variacion)} frente a tu saldo actual
            </p>
          </div>

          <div className="bg-white bg-opacity-10 rounded-4 p-4 align-self-start">
            <span className="text-white-50 small text-uppercase fw-bold d-block mb-2">Precisión estimada</span>
            <span className={`badge ${getBadgeClass(resultado.porcentaje)} rounded-pill fs-5 px-4 py-3`}>
              {resultado.porcentaje}
            </span>
            <p className="small text-white-50 mt-3 mb-0">
              Baja cuando hay movimientos probables o inversiones con rendimiento variable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
