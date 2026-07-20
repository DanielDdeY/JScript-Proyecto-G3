import { useMemo } from 'react';
import { useWallet } from '../../../modules/wallet/presentation/hooks/useWallet';
import { calcularProyeccionPredictiva } from '../../proyecciones/domain/services/proyeccionPredictivaService';
import { useProyecciones } from '../../proyecciones/presentation/hooks/useProyecciones';
import { obtenerClaseTarjeta, obtenerNombreBanco, obtenerUltimosDigitos } from '../../../shared/utils/tarjetaUtils';
import { CurrencyDisplay } from '../../../shared/components/CurrencyDisplay/CurrencyDisplay';
import { SaldoTrendChart } from '../components/SaldoTrendChart';

const mockTrendData = [
  { date: 'Lun', amount: 1200 },
  { date: 'Mar', amount: 1150 },
  { date: 'Mie', amount: 1300 },
  { date: 'Jue', amount: 1280 },
  { date: 'Vie', amount: 1400 },
  { date: 'Sab', amount: 1350 },
  { date: 'Dom', amount: 1500 },
];

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
      <div className="min-h-loading">
        <output className="spinner-border text-primary">
          <span className="visually-hidden">Cargando...</span>
        </output>
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
          <div className="card h-100 border-0 shadow-sm p-4 text-center text-xl-start justify-content-center" style={{ background: 'var(--color-surface)' }}>
            <span className="text-uppercase fw-bold small mb-1 d-block" style={{ color: 'var(--color-text-muted)', letterSpacing: '0.06em' }}>Saldo Total</span>
            <CurrencyDisplay amount={perfil?.saldoTotal ?? 0} size="xl" />
            <div className="mt-2 mb-3">
              <span className="badge bg-success-subtle text-success py-1 px-2 fw-semibold" style={{ fontSize: '0.75rem' }}>↑ +2.4% vs mes anterior</span>
            </div>
            {/* Sparkline Analítico */}
            <div style={{ marginLeft: '-16px', marginRight: '-16px' }}>
              <SaldoTrendChart data={mockTrendData} />
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-9">
          <div className="row g-3 h-100">
            {tarjetas.map((tarjeta) => (
              <div key={String(tarjeta.id)} className="col-12 col-md-6 col-lg-4">
                <article className={`${obtenerClaseTarjeta(tarjeta)} card p-4 h-100 d-flex flex-column justify-content-between`}>
                  <div className="d-flex justify-content-between align-items-center mb-4 text-white">
                    <span className="fw-bold fs-5">{obtenerNombreBanco(tarjeta)}</span>
                    <span className="small opacity-75 font-monospace">**** {obtenerUltimosDigitos(tarjeta.numero)}</span>
                  </div>
                  <div className="text-white">
                    <span className="small opacity-75 d-block mb-1">Saldo disponible</span>
                    <CurrencyDisplay amount={tarjeta.saldo} size="lg" variant="light" />
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card p-4 border-0 shadow-sm" style={{ background: 'var(--color-surface)' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold text-dark mb-0">Resumen Financiero del Mes</h5>
        </div>
        <div className="row text-center g-4">
          <div className="col-12 col-md-4 border-end-md position-relative">
            <div className="icon-circle-md bg-success-subtle mb-3">
              <i className="bi bi-arrow-down-left text-success fs-4" />
            </div>
            <span className="text-muted small fw-semibold d-block text-uppercase mb-1">Ingresos Totales</span>
            <CurrencyDisplay amount={resumenFinanciero.ingresos} variant="success" size="lg" />
          </div>
          <div className="col-12 col-md-4 border-end-md position-relative">
            <div className="icon-circle-md bg-danger-subtle mb-3">
              <i className="bi bi-arrow-up-right text-danger fs-4" />
            </div>
            <span className="text-muted small fw-semibold d-block text-uppercase mb-1">Gastos Totales</span>
            <CurrencyDisplay amount={resumenFinanciero.gastos} variant="danger" size="lg" />
          </div>
          <div className="col-12 col-md-4">
            <div className="icon-circle-md bg-primary-subtle mb-3">
              <i className="bi bi-piggy-bank text-primary fs-4" />
            </div>
            <span className="text-muted small fw-semibold d-block text-uppercase mb-1">Ahorro Neto</span>
            <CurrencyDisplay amount={resumenFinanciero.ahorro} size="lg" />
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
              <article className="card p-3 border-0 shadow-sm h-100 d-flex flex-column justify-content-center" style={{ background: 'var(--color-surface)' }}>
                <span className="text-muted small fw-semibold text-uppercase mb-2">{proyeccion.tiempo}</span>
                <div className="mb-2">
                  <CurrencyDisplay amount={proyeccion.monto} size="md" />
                </div>
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
