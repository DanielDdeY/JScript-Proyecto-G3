import { useMemo } from 'react';
import { useWallet } from '../../../modules/wallet/presentation/hooks/useWallet';
import { calcularProyeccionPredictiva } from '../../proyecciones/domain/services/proyeccionPredictivaService';
import { useProyecciones } from '../../proyecciones/presentation/hooks/useProyecciones';
import { formatCurrencyPen } from '../../../shared/utils/formatters';
import { obtenerClaseTarjeta, obtenerNombreBanco, obtenerUltimosDigitos } from '../../../shared/utils/tarjetaUtils';

const opcionesResumenProyeccion = [
  { etiqueta: 'EN 1 MES', meses: 1 },
  { etiqueta: 'EN 3 MESES', meses: 3 },
  { etiqueta: 'EN 6 MESES', meses: 6 },
  { etiqueta: 'EN 1 AÑO', meses: 12 },
] as const;

const sumarMeses = (fecha: Date, meses: number) => new Date(fecha.getFullYear(), fecha.getMonth() + meses, 1);

const formatPorcentajeVariacion = (montoFinal: number, saldoActual: number) => {
  if (saldoActual === 0) return '+ 0.0%';

  const variacion = ((montoFinal - saldoActual) / Math.abs(saldoActual)) * 100;
  const signo = variacion >= 0 ? '+' : '-';

  return `${signo} ${Math.abs(variacion).toFixed(1)}%`;
};

export function Dashboard() {
  const { perfil, tarjetas, resumenFinanciero, cargando, error, recargar } = useWallet();
  const { datos: datosProyeccion, cargando: cargandoProyecciones, error: errorProyecciones } = useProyecciones();

  const proyeccionesCalculadas = useMemo(() => {
    if (!datosProyeccion) return [];

    const fechaActual = new Date();
    const saldoActual = datosProyeccion.perfil?.saldoTotal ?? 0;

    return opcionesResumenProyeccion.map((opcion) => {
      const fechaObjetivo = sumarMeses(fechaActual, opcion.meses);
      const resultado = calcularProyeccionPredictiva(
        datosProyeccion,
        {
          mes: fechaObjetivo.getMonth() + 1,
          anio: fechaObjetivo.getFullYear(),
        },
        fechaActual,
      );

      return {
        tiempo: opcion.etiqueta,
        monto: resultado.monto,
        crecimiento: formatPorcentajeVariacion(resultado.monto, saldoActual),
        precision: resultado.porcentaje,
      };
    });
  }, [datosProyeccion]);

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex justify-content-between align-items-center">
        <span>{error}</span>
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => void recargar()}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">
      <section className="row g-4 align-items-stretch">
        <div className="col-12 col-xl-3">
          <div className="card h-100 border-0 shadow-sm p-4 text-center text-xl-start justify-content-center">
            <span className="text-uppercase text-muted fw-bold small mb-2 d-block">Saldo Total</span>
            <h2 className="fw-bold m-0 text-dark display-6 mb-2">{formatCurrencyPen(perfil?.saldoTotal ?? 0)}</h2>
            <div>
              <span className="badge bg-success-subtle text-success py-2 px-3 fw-semibold">↑ + 8.3% vs mes anterior</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-9">
          <div className="row g-3 h-100">
            {tarjetas.map((tarjeta) => (
              <div key={String(tarjeta.id)} className="col-12 col-md-6 col-lg-4">
                <article className={`${obtenerClaseTarjeta(tarjeta)} card p-4 h-100 d-flex flex-column justify-content-between`}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="fw-bold fs-5">{obtenerNombreBanco(tarjeta)}</span>
                    <span className="small opacity-75 font-monospace">**** {obtenerUltimosDigitos(tarjeta.numero)}</span>
                  </div>
                  <div>
                    <span className="small opacity-75 d-block mb-1">Saldo disponible</span>
                    <span className="fw-bold fs-4 font-monospace">{formatCurrencyPen(tarjeta.saldo)}</span>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card p-4 border-0 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold text-dark mb-0">Resumen Financiero del Mes</h5>
        </div>
        <div className="row text-center g-4">
          <div className="col-12 col-md-4 border-end-md position-relative">
            <div
              className="bg-success-subtle rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '48px', height: '48px' }}
            >
              <i className="bi bi-arrow-down-left text-success fs-4" />
            </div>
            <span className="text-muted small fw-semibold d-block text-uppercase mb-1">Ingresos Totales</span>
            <span className="fw-bold text-success fs-3">{formatCurrencyPen(resumenFinanciero.ingresos)}</span>
          </div>
          <div className="col-12 col-md-4 border-end-md position-relative">
            <div
              className="bg-danger-subtle rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '48px', height: '48px' }}
            >
              <i className="bi bi-arrow-up-right text-danger fs-4" />
            </div>
            <span className="text-muted small fw-semibold d-block text-uppercase mb-1">Gastos Totales</span>
            <span className="fw-bold text-danger fs-3">{formatCurrencyPen(resumenFinanciero.gastos)}</span>
          </div>
          <div className="col-12 col-md-4">
            <div
              className="bg-primary-subtle rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '48px', height: '48px' }}
            >
              <i className="bi bi-piggy-bank text-primary fs-4" />
            </div>
            <span className="text-muted small fw-semibold d-block text-uppercase mb-1">Ahorro Neto</span>
            <span className="fw-bold text-primary fs-3">{formatCurrencyPen(resumenFinanciero.ahorro)}</span>
          </div>
        </div>
      </section>

      <section className="mb-2">
        <h5 className="fw-bold text-dark mb-3">Proyección Financiera</h5>
        {errorProyecciones ? (
          <div className="alert alert-warning border-0 shadow-sm" role="alert">
            No se pudieron calcular las proyecciones del dashboard: {errorProyecciones}
          </div>
        ) : null}
        <div className="row g-3">
          {cargandoProyecciones && proyeccionesCalculadas.length === 0 ? (
            <div className="col-12">
              <div className="card p-4 border-0 shadow-sm bg-white text-muted">Calculando proyecciones...</div>
            </div>
          ) : null}
          {proyeccionesCalculadas.map((proyeccion) => (
            <div key={proyeccion.tiempo} className="col-12 col-sm-6 col-lg-3">
              <article className="card p-3 border-0 shadow-sm bg-white h-100 d-flex flex-column justify-content-center">
                <span className="text-muted small fw-semibold text-uppercase mb-2">{proyeccion.tiempo}</span>
                <h4 className="fw-bold text-dark mb-1">{formatCurrencyPen(proyeccion.monto)}</h4>
                <div className="d-flex flex-wrap gap-2">
                  <span
                    className={`badge fw-bold align-self-start ${
                      proyeccion.crecimiento.trim().startsWith('-')
                        ? 'bg-danger-subtle text-danger'
                        : 'bg-success-subtle text-success'
                    }`}
                  >
                    {proyeccion.crecimiento}
                  </span>
                  <span className="badge bg-primary-subtle text-primary align-self-start fw-semibold">
                    Precisión {proyeccion.precision}
                  </span>
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
