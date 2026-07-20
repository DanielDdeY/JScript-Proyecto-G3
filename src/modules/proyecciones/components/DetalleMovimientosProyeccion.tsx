import type { ResultadoProyeccion } from '../domain/models/proyeccionPredictiva';
import { formatCurrencyPen } from '../../../shared/utils/formatters';

interface DetalleMovimientosProyeccionProps {
  readonly resultado: ResultadoProyeccion;
}

export function DetalleMovimientosProyeccion({ resultado }: DetalleMovimientosProyeccionProps) {
  const ingresos = resultado.desglose.movimientosIngresos.filter((movimiento) => movimiento.montoProyectado > 0);
  const gastos = resultado.desglose.movimientosGastos.filter((movimiento) => movimiento.montoProyectado > 0);
  const obligaciones = resultado.desglose.obligaciones.filter((obligacion) => obligacion.montoProyectado > 0);
  const inversiones = resultado.desglose.inversiones.filter((inversion) => inversion.gananciaOPerdida !== 0);

  return (
    <section className="row g-4">
      <div className="col-12 col-xl-6">
        <div className="card border-0 shadow-sm p-4 bg-white h-100">
          <h5 className="fw-bold mb-3">Ingresos y gastos considerados</h5>
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Movimiento</th>
                  <th>Regla</th>
                  <th className="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {[...ingresos, ...gastos].map((movimiento) => (
                  <tr key={`${movimiento.tipo}-${movimiento.id}`}>
                    <td>
                      <div className="fw-semibold">{movimiento.descripcion}</div>
                      <small className="text-muted">
                        {formatCurrencyPen(movimiento.montoBase)} × {movimiento.factorAplicado}
                      </small>
                    </td>
                    <td><small>{movimiento.regla}</small></td>
                    <td className={movimiento.tipo === 'INGRESO' ? 'text-success text-end fw-bold' : 'text-danger text-end fw-bold'}>
                      {movimiento.tipo === 'INGRESO' ? '+' : '-'}{formatCurrencyPen(movimiento.montoProyectado)}
                    </td>
                  </tr>
                ))}
                {ingresos.length + gastos.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center text-muted py-4">No hay movimientos futuros para este rango.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="col-12 col-xl-6">
        <div className="card border-0 shadow-sm p-4 bg-white h-100">
          <h5 className="fw-bold mb-3">Préstamos, tarjetas e inversiones</h5>
          <div className="d-flex flex-column gap-3">
            {obligaciones.map((obligacion) => (
              <div key={`${obligacion.tipo}-${obligacion.id}`} className="border rounded-4 p-3">
                <div className="d-flex justify-content-between gap-3">
                  <div>
                    <strong>{obligacion.descripcion}</strong>
                    <p className="text-muted small mb-0">
                      {obligacion.cuotasContadas} de {obligacion.cuotasDisponibles} cuotas pendientes consideradas
                    </p>
                  </div>
                  <strong className="text-danger">-{formatCurrencyPen(obligacion.montoProyectado)}</strong>
                </div>
              </div>
            ))}

            {inversiones.map((inversion) => (
              <div key={inversion.id} className="border rounded-4 p-3">
                <div className="d-flex justify-content-between gap-3">
                  <div>
                    <strong>{inversion.activo}</strong>
                    <p className="text-muted small mb-0">
                      Último rendimiento aplicado: {inversion.porcentajeMensual.toFixed(2)}% mensual
                    </p>
                  </div>
                  <strong className={inversion.gananciaOPerdida >= 0 ? 'text-success' : 'text-danger'}>
                    {inversion.gananciaOPerdida >= 0 ? '+' : ''}{formatCurrencyPen(inversion.gananciaOPerdida)}
                  </strong>
                </div>
              </div>
            ))}

            {obligaciones.length + inversiones.length === 0 ? (
              <p className="text-center text-muted py-4 mb-0">No hay obligaciones ni variaciones de inversión para este rango.</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
