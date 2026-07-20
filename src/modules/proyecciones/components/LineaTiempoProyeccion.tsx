import type { ResultadoProyeccion } from '../domain/models/proyeccionPredictiva';
import { formatCurrencyPen } from '../../../shared/utils/formatters';

interface LineaTiempoProyeccionProps {
  readonly resultado: ResultadoProyeccion;
}

export function LineaTiempoProyeccion({ resultado }: LineaTiempoProyeccionProps) {
  const puntos = resultado.lineaTiempo.slice(-6);

  if (puntos.length === 0) {
    return null;
  }

  const max = Math.max(...puntos.map((punto) => Math.abs(punto.saldoProyectado)), 1);

  return (
    <section className="card border-0 shadow-sm p-4 bg-white">
      <h5 className="fw-bold mb-3">Últimos meses de la proyección</h5>
      <div className="d-flex flex-column gap-3">
        {puntos.map((punto) => {
          const width = Math.max((Math.abs(punto.saldoProyectado) / max) * 100, 8);
          return (
            <div key={punto.periodo}>
              <div className="d-flex justify-content-between small fw-semibold mb-1">
                <span>{punto.periodo}</span>
                <span>{formatCurrencyPen(punto.saldoProyectado)}</span>
              </div>
              <div className="progress" role="progressbar" aria-label={`Proyección ${punto.periodo}`} style={{ height: 12 }}>
                <div className="progress-bar" style={{ width: `${width}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
