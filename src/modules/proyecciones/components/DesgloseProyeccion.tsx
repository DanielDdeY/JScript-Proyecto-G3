import type { ResultadoProyeccion } from '../domain/models/proyeccionPredictiva';
import { formatCurrencyPen } from '../../../shared/utils/formatters';

interface DesgloseProyeccionProps {
  readonly resultado: ResultadoProyeccion;
}

export function DesgloseProyeccion({ resultado }: DesgloseProyeccionProps) {
  const { desglose } = resultado;

  const resumen = [
    { label: 'Saldo actual', value: desglose.saldoActual, className: 'text-dark' },
    { label: 'Ingresos proyectados', value: desglose.totalIngresos, className: 'text-success' },
    { label: 'Gastos proyectados', value: -desglose.totalGastos, className: 'text-danger' },
    { label: 'Préstamos', value: -desglose.totalPrestamos, className: 'text-danger' },
    { label: 'Tarjetas de crédito', value: -desglose.totalTarjetasCredito, className: 'text-danger' },
    { label: 'Ganancia / pérdida de inversiones', value: desglose.totalGananciaInversiones, className: desglose.totalGananciaInversiones >= 0 ? 'text-success' : 'text-danger' },
  ];

  return (
    <section className="card border-0 shadow-sm p-4 bg-white">
      <h5 className="fw-bold mb-3">Desglose del cálculo</h5>
      <div className="row g-3">
        {resumen.map((item) => (
          <div key={item.label} className="col-12 col-md-6 col-xl-4">
            <div className="bg-light rounded-4 p-3 h-100">
              <span className="text-muted small d-block">{item.label}</span>
              <strong className={`fs-5 ${item.className}`}>{formatCurrencyPen(item.value)}</strong>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
