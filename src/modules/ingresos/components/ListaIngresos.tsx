import type { Ingreso } from '../../../shared/types/ingreso';
import type { Tarjeta } from '../../../shared/types/tarjeta';
import { formatCurrencyPen, formatShortDate } from '../../../shared/utils/formatters';
import { idsIguales } from '../../../shared/utils/ids';
import { obtenerEtiquetasReincidencia } from '../../../shared/utils/reincidenciaUtils';
import { obtenerNombreBanco, obtenerUltimosDigitos } from '../../../shared/utils/tarjetaUtils';

interface ListaIngresosProps {
  ingresos: Ingreso[];
  tarjetas: Tarjeta[];
}

const obtenerEtiquetaOrigenIngreso = (ingreso: Ingreso, tarjetas: Tarjeta[]) => {
  const tarjeta = ingreso.tarjetaId ? tarjetas.find((item) => idsIguales(item.id, ingreso.tarjetaId)) : undefined;

  if (tarjeta) {
    return {
      icono: 'bi bi-credit-card',
      texto: `${obtenerNombreBanco(tarjeta)} (**** ${obtenerUltimosDigitos(tarjeta.numero)})`,
      clase: 'text-primary',
    };
  }

  if (ingreso.origen === 'TARJETA') {
    return {
      icono: 'bi bi-credit-card',
      texto: 'Tarjeta / cuenta vinculada',
      clase: 'text-primary',
    };
  }

  return {
    icono: 'bi bi-cash-stack',
    texto: 'Efectivo',
    clase: 'text-secondary',
  };
};

export function ListaIngresos({ ingresos, tarjetas }: ListaIngresosProps) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th className="fw-bold text-dark py-3">Fecha</th>
            <th className="fw-bold text-dark py-3">Descripción</th>
            <th className="fw-bold text-dark py-3">Fuente de Ingreso</th>
            <th className="fw-bold text-dark py-3">Origen</th>
            <th className="fw-bold text-dark py-3">Reincidencia</th>
            <th className="fw-bold text-dark py-3 text-end">Monto</th>
          </tr>
        </thead>
        <tbody>
          {ingresos.map((ingreso) => {
            const origen = obtenerEtiquetaOrigenIngreso(ingreso, tarjetas);

            return (
              <tr key={String(ingreso.id)}>
                <td className="py-3 text-muted">{formatShortDate(ingreso.fecha)}</td>
                <td className="py-3">
                  <div className="fw-bold text-dark">{ingreso.descripcion}</div>
                </td>
                <td className="py-3">
                  <span className="badge bg-success-subtle text-success py-1 px-2 small fw-semibold">
                    {ingreso.fuente}
                  </span>
                </td>
                <td className={`py-3 small fw-semibold ${origen.clase}`}>
                  <i className={`${origen.icono} me-1`} />
                  {origen.texto}
                </td>
                <td className="py-3">
                  <div className="d-flex flex-wrap gap-1">
                    {obtenerEtiquetasReincidencia(ingreso.reincidencia).map((etiqueta) => (
                      <span key={etiqueta} className="badge bg-secondary-subtle text-secondary">{etiqueta}</span>
                    ))}
                  </div>
                </td>
                <td className="py-3 text-end fw-bold text-success font-monospace">
                  + {formatCurrencyPen(ingreso.monto)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
