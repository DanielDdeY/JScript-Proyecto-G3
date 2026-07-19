import { useEffect, useMemo, useState } from 'react';
import { DesgloseProyeccion } from '../../components/DesgloseProyeccion';
import { DetalleMovimientosProyeccion } from '../../components/DetalleMovimientosProyeccion';
import { LineaTiempoProyeccion } from '../../components/LineaTiempoProyeccion';
import { MetasProyectadas } from '../../components/MetasProyectadas';
import { ProyeccionFiltro } from '../../components/ProyeccionFiltro';
import { ResumenProyeccionCard } from '../../components/ResumenProyeccionCard';
import type { ProyeccionFiltros } from '../../domain/models/proyeccionPredictiva';
import { useProyecciones } from '../../presentation/hooks/useProyecciones';

const getDefaultFiltros = (): ProyeccionFiltros => {
  const nextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
  return {
    mes: nextMonth.getMonth() + 1,
    anio: nextMonth.getFullYear(),
  };
};

export function Proyecciones() {
  const { datos, resultado, cargando, error, calcularProyeccion } = useProyecciones();
  const [filtros, setFiltros] = useState<ProyeccionFiltros>(getDefaultFiltros);

  const puedeCalcular = useMemo(() => Boolean(datos && !cargando), [cargando, datos]);

  useEffect(() => {
    if (puedeCalcular && !resultado) {
      calcularProyeccion(filtros);
    }
  }, [calcularProyeccion, filtros, puedeCalcular, resultado]);

  const ejecutarCalculo = () => {
    calcularProyeccion(filtros);
  };

  if (cargando && !datos) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="d-flex flex-column gap-4">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Proyecciones financieras</h4>
          <p className="text-muted mb-0">
            Calcula cuánto podrías tener en un mes futuro usando saldo actual, reincidencias, préstamos, tarjetas e inversiones.
          </p>
        </div>
      </div>

      {error ? (
        <div className="alert alert-danger border-0 shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2" /> {error}
        </div>
      ) : null}

      <ProyeccionFiltro filtros={filtros} onChange={setFiltros} onSubmit={ejecutarCalculo} cargando={!puedeCalcular} />

      <div className="alert alert-info border-0 shadow-sm mb-0" role="alert">
        <strong>Importante:</strong> esta proyección es una aproximación. Los movimientos probables se calculan al 50% y las inversiones usan el último rendimiento registrado como supuesto mensual.
      </div>

      {resultado ? (
        <>
          <ResumenProyeccionCard resultado={resultado} />
          <DesgloseProyeccion resultado={resultado} />
          <DetalleMovimientosProyeccion resultado={resultado} />
          <MetasProyectadas resultado={resultado} />
          <LineaTiempoProyeccion resultado={resultado} />
        </>
      ) : (
        <div className="card border-0 shadow-sm p-5 text-center bg-white">
          <i className="bi bi-graph-up-arrow display-2 text-muted" />
          <h5 className="fw-bold mt-3">Selecciona un mes y año</h5>
          <p className="text-muted mb-0">Cuando calcules, aquí aparecerá el resultado predictivo.</p>
        </div>
      )}
    </section>
  );
}
