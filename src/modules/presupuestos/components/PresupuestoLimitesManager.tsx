import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { formatCurrencyPen } from '../../../shared/utils/formatters';
import { CATEGORIAS_PRESUPUESTO, presupuestoService } from '../domain/services/presupuestoService';
import { usePresupuestos } from '../presentation/hooks/usePresupuestos';

const presupuestoSchema = z.object({
  categoriaNombre: z.string().min(1, { message: 'Debe seleccionar una categoría' }),
  limiteSoles: z.coerce.number().positive({ message: 'El límite debe ser mayor que cero' }),
  mes: z.string().min(1, { message: 'Debe indicar el mes de vigencia' }),
});

type PresupuestoFormInput = z.input<typeof presupuestoSchema>;
type PresupuestoFormValues = z.output<typeof presupuestoSchema>;

interface PresupuestoLimitesManagerProps {
  titulo?: string;
  descripcion?: string;
  textoBoton?: string;
}

export function PresupuestoLimitesManager({
  titulo = 'Límites de Presupuesto',
  descripcion = 'Define cuánto quieres gastar como máximo por categoría. El total mensual se configura desde Saldo > Separar para que no se use.',
  textoBoton = 'Guardar límite',
}: PresupuestoLimitesManagerProps) {
  const { presupuestos, cargando, guardando, error, guardarLimite } = usePresupuestos();
  const [success, setSuccess] = useState(false);

  const presupuestosOrdenados = useMemo(() => presupuestoService.ordenarPorMesDesc(presupuestos), [presupuestos]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PresupuestoFormInput, unknown, PresupuestoFormValues>({
    resolver: zodResolver(presupuestoSchema),
    defaultValues: {
      categoriaNombre: 'Alimentación',
      limiteSoles: 0,
      mes: presupuestoService.obtenerMesActual(),
    },
  });

  const onSubmit = async (data: PresupuestoFormValues) => {
    await guardarLimite(data);
    setSuccess(true);
    reset({ categoriaNombre: data.categoriaNombre, limiteSoles: 0, mes: data.mes });
    window.setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="card border-0 shadow-sm p-4 bg-white">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-dark m-0">{titulo}</h4>
          <p className="text-muted mb-0 small">{descripcion}</p>
        </div>
        <i className="bi bi-pie-chart text-danger fs-3" />
      </div>

      {error ? (
        <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-triangle-fill" />
          <div>{error}</div>
        </div>
      ) : null}

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="border p-4 rounded-3 bg-light">
            <h5 className="fw-bold text-dark mb-3">Definir límite por categoría</h5>

            {success ? (
              <div className="alert alert-success d-flex align-items-center gap-2 mb-3 small" role="alert">
                <i className="bi bi-check-circle-fill" />
                <div>Límite guardado correctamente.</div>
              </div>
            ) : null}

            <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Mes de vigencia</label>
                <input type="month" className={`form-control ${errors.mes ? 'is-invalid' : ''}`} {...register('mes')} />
                {errors.mes ? <div className="invalid-feedback fw-semibold">{errors.mes.message}</div> : null}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Categoría de gasto</label>
                <select className={`form-select ${errors.categoriaNombre ? 'is-invalid' : ''}`} {...register('categoriaNombre')}>
                  {CATEGORIAS_PRESUPUESTO.map((categoria) => (
                    <option key={categoria.nombre} value={categoria.nombre}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
                {errors.categoriaNombre ? (
                  <div className="invalid-feedback fw-semibold">{errors.categoriaNombre.message}</div>
                ) : null}
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small">Monto límite</label>
                <div className="input-group">
                  <span className="input-group-text fw-bold">S/.</span>
                  <input
                    type="number"
                    step="0.01"
                    className={`form-control fw-bold ${errors.limiteSoles ? 'is-invalid' : ''}`}
                    placeholder="0.00"
                    {...register('limiteSoles')}
                  />
                  {errors.limiteSoles ? (
                    <div className="invalid-feedback fw-semibold">{errors.limiteSoles.message}</div>
                  ) : null}
                </div>
              </div>

              <button
                type="submit"
                disabled={guardando}
                className="btn btn-danger w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
              >
                {guardando ? 'Guardando...' : textoBoton}
              </button>
            </form>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <h5 className="fw-bold text-dark mb-1">Límites por categoría establecidos</h5>
          <p className="text-muted small mb-3">El total límite mensual viene de Saldo &gt; Separar para que no se use.</p>

          {cargando ? <p className="text-muted">Cargando límites...</p> : null}

          {!cargando && presupuestosOrdenados.length === 0 ? (
            <div className="alert alert-info mb-0">Aún no hay límites de presupuesto guardados.</div>
          ) : null}

          {!cargando && presupuestosOrdenados.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {presupuestosOrdenados.map((presupuesto) => (
                <section className="border rounded-3 overflow-hidden bg-white" key={presupuesto.id}>
                  <div className="bg-light px-3 py-3 d-flex flex-wrap justify-content-between gap-2">
                    <strong>{presupuestoService.formatearMes(presupuesto.mes)}</strong>
                    <span className="fw-bold text-primary">
                      Total límite mensual: {presupuesto.totalAsignado > 0 ? formatCurrencyPen(presupuesto.totalAsignado) : 'No definido'}
                    </span>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="fw-bold text-dark py-3">Categoría</th>
                          <th className="fw-bold text-dark py-3">Importancia</th>
                          <th className="fw-bold text-dark py-3 text-end">Límite permitido</th>
                        </tr>
                      </thead>
                      <tbody>
                        {presupuesto.desgloseCategorias.map((detalle) => (
                          <tr key={`${presupuesto.id}-${detalle.categoria.nombre}`}>
                            <td className="py-3">
                              <span className="badge bg-light text-dark border py-1 px-2 small fw-semibold">
                                {detalle.categoria.nombre}
                              </span>
                            </td>
                            <td className="py-3 text-muted small">{detalle.categoria.importancia}</td>
                            <td className="py-3 text-end fw-bold text-primary font-monospace">
                              {formatCurrencyPen(detalle.limiteSoles)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
