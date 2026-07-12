import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { formatCurrencyPen } from '../../../shared/utils/formatters';
import { presupuestoService } from '../domain/services/presupuestoService';
import { usePresupuestos } from '../presentation/hooks/usePresupuestos';

const limiteMensualSchema = z.object({
  mes: z.string().min(1, { message: 'Debe seleccionar un mes' }),
  totalAsignado: z.coerce.number().positive({ message: 'El límite mensual debe ser mayor que cero' }),
});

type LimiteMensualFormInput = z.input<typeof limiteMensualSchema>;
type LimiteMensualFormValues = z.output<typeof limiteMensualSchema>;

export function PresupuestoMensualManager() {
  const { presupuestos, cargando, guardando, error, guardarLimiteMensual, eliminarLimiteMensual } = usePresupuestos();
  const [success, setSuccess] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const mesActual = presupuestoService.obtenerMesActual();
  const presupuestoMesActual = useMemo(
    () => presupuestoService.obtenerPresupuestoPorMes(presupuestos, mesActual),
    [mesActual, presupuestos],
  );
  const presupuestosOrdenados = useMemo(
    () => presupuestoService.ordenarPorMesDesc(presupuestos).filter((presupuesto) => presupuesto.totalAsignado > 0),
    [presupuestos],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LimiteMensualFormInput, unknown, LimiteMensualFormValues>({
    resolver: zodResolver(limiteMensualSchema),
    defaultValues: {
      mes: mesActual,
      totalAsignado: presupuestoMesActual?.totalAsignado ?? 0,
    },
  });

  const onSubmit = async (data: LimiteMensualFormValues) => {
    await guardarLimiteMensual(data);
    setSuccess(true);
    setDeleted(false);
    reset({ mes: data.mes, totalAsignado: data.totalAsignado });
    window.setTimeout(() => setSuccess(false), 3000);
  };

  const cargarParaModificar = (mes: string, totalAsignado: number) => {
    reset({ mes, totalAsignado });
  };

  const eliminar = async (mes: string) => {
    const confirmado = window.confirm(`¿Eliminar el límite mensual de ${presupuestoService.formatearMes(mes)}?`);
    if (!confirmado) return;

    await eliminarLimiteMensual(mes);
    setDeleted(true);
    setSuccess(false);
    window.setTimeout(() => setDeleted(false), 3000);
  };

  return (
    <div className="d-flex flex-column gap-4">
      <section className="card border-0 shadow-sm p-4 presupuesto-header-card">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <p className="text-primary fw-semibold mb-1">Separar para que no se use</p>
            <h3 className="fw-bold text-dark mb-2">Límite del mes actual</h3>
            <p className="text-muted mb-0">
              Aquí solo defines el máximo general que quieres gastar en el mes. Los límites por categoría se configuran en Gastos.
            </p>
          </div>
          <div className="presupuesto-total-circle">
            <span className="small text-muted">{presupuestoService.formatearMes(mesActual)}</span>
            <strong>{presupuestoMesActual?.totalAsignado ? formatCurrencyPen(presupuestoMesActual.totalAsignado) : 'No definido'}</strong>
          </div>
        </div>
      </section>

      <section className="card border-0 shadow-sm p-4 bg-white">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h4 className="fw-bold text-dark m-0">Establecer o modificar límite mensual</h4>
            <p className="text-muted mb-0 small">Puedes guardar el mes actual o preparar límites para meses futuros.</p>
          </div>
          <i className="bi bi-wallet2 text-primary fs-3" />
        </div>

        {error ? (
          <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
            <i className="bi bi-exclamation-triangle-fill" />
            <div>{error}</div>
          </div>
        ) : null}

        {success ? (
          <div className="alert alert-success d-flex align-items-center gap-2" role="alert">
            <i className="bi bi-check-circle-fill" />
            <div>Límite mensual guardado correctamente.</div>
          </div>
        ) : null}

        {deleted ? (
          <div className="alert alert-warning d-flex align-items-center gap-2" role="alert">
            <i className="bi bi-trash-fill" />
            <div>Límite mensual eliminado.</div>
          </div>
        ) : null}

        <div className="row g-4">
          <div className="col-12 col-lg-5">
            <form className="border rounded-3 p-4 bg-light" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Mes</label>
                <input type="month" className={`form-control ${errors.mes ? 'is-invalid' : ''}`} {...register('mes')} />
                {errors.mes ? <div className="invalid-feedback fw-semibold">{errors.mes.message}</div> : null}
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small">Límite máximo del mes</label>
                <div className="input-group">
                  <span className="input-group-text fw-bold">S/.</span>
                  <input
                    type="number"
                    step="0.01"
                    className={`form-control fw-bold ${errors.totalAsignado ? 'is-invalid' : ''}`}
                    placeholder="0.00"
                    {...register('totalAsignado')}
                  />
                  {errors.totalAsignado ? (
                    <div className="invalid-feedback fw-semibold">{errors.totalAsignado.message}</div>
                  ) : null}
                </div>
              </div>

              <button type="submit" disabled={guardando} className="btn btn-primary w-100 fw-bold">
                {guardando ? 'Guardando...' : 'Guardar límite mensual'}
              </button>
            </form>
          </div>

          <div className="col-12 col-lg-7">
            <h5 className="fw-bold text-dark mb-3">Límites mensuales guardados</h5>

            {cargando ? <p className="text-muted">Cargando límites...</p> : null}

            {!cargando && presupuestosOrdenados.length === 0 ? (
              <div className="alert alert-info mb-0">Aún no hay límites mensuales guardados.</div>
            ) : null}

            {!cargando && presupuestosOrdenados.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {presupuestosOrdenados.map((presupuesto) => (
                  <div
                    key={presupuesto.id}
                    className="border rounded-3 p-3 bg-white d-flex flex-wrap align-items-center justify-content-between gap-3"
                  >
                    <div>
                      <strong className="d-block">{presupuestoService.formatearMes(presupuesto.mes)}</strong>
                      <span className="text-muted small">Límite general del mes</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="fw-bold text-primary font-monospace me-1">
                        {formatCurrencyPen(presupuesto.totalAsignado)}
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary fw-semibold"
                        onClick={() => cargarParaModificar(presupuesto.mes, presupuesto.totalAsignado)}
                      >
                        Modificar
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger fw-semibold"
                        disabled={guardando}
                        onClick={() => void eliminar(presupuesto.mes)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
