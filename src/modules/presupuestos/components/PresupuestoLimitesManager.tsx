import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { formatCurrencyPen } from '../../../shared/utils/formatters';
import { CATEGORIAS_PRESUPUESTO, presupuestoService } from '../domain/services/presupuestoService';
import { usePresupuestos } from '../presentation/hooks/usePresupuestos';

const presupuestoSchema = z.object({
  categoriaNombre: z.string().min(1, { message: 'Debe seleccionar una categoría' }),
  limiteSoles: z.coerce.number().positive({ message: 'El límite debe ser mayor que cero' }),
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
  const mesActual = presupuestoService.obtenerMesActual();

  const presupuestoActual = useMemo(
    () => presupuestoService.obtenerPresupuestoCategoriaVigente(presupuestos, mesActual),
    [mesActual, presupuestos],
  );

  const totalLimiteMensual = useMemo(
    () => presupuestoService.obtenerPresupuestoPorMes(presupuestos, mesActual)?.totalAsignado ?? 0,
    [mesActual, presupuestos],
  );

  const totalAsignadoCategorias = useMemo(() => {
    if (!presupuestoActual) return 0;
    return presupuestoActual.desgloseCategorias.reduce((sum, detalle) => sum + detalle.limiteSoles, 0);
  }, [presupuestoActual]);

  const presupuestoDisponible = Math.max(0, totalLimiteMensual - totalAsignadoCategorias);

  const chartData = useMemo(() => {
    const data = presupuestoActual?.desgloseCategorias.map((d) => ({
      name: d.categoria.nombre,
      value: d.limiteSoles,
    })) ?? [];

    if (presupuestoDisponible > 0 && totalLimiteMensual > 0) {
      data.push({ name: 'Disponible (Sin Asignar)', value: presupuestoDisponible });
    }
    return data;
  }, [presupuestoActual, presupuestoDisponible, totalLimiteMensual]);

  // Colores fáciles de identificar para el pastel. El último (gris) será para lo "Disponible"
  const COLORS = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac'];


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
    },
  });

  const onSubmit = async (data: PresupuestoFormValues) => {
    await guardarLimite({ ...data, mes: mesActual });
    setSuccess(true);
    reset({ categoriaNombre: data.categoriaNombre, limiteSoles: data.limiteSoles });
    window.setTimeout(() => setSuccess(false), 3000);
  };

  const cargarParaModificar = (categoriaNombre: string, limiteSoles: number) => {
    reset({ categoriaNombre, limiteSoles });
  };

  return (
    <div className="card border-0 shadow-sm p-4 bg-white">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-dark m-0">{titulo}</h4>
          <p className="text-muted mb-0 small">{descripcion}</p>
          <p className="text-primary fw-bold small mb-0 mt-2">
            Mes activo: {presupuestoService.formatearMes(mesActual)}. Si cambia el mes, se muestran los mismos límites hasta que el usuario los modifique.
          </p>
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
                <label className="form-label fw-semibold small">Monto límite permitido</label>
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
          <p className="text-muted small mb-3">
            Solo se muestran los límites vigentes del mes actual. El total límite mensual viene de Saldo &gt; Separar para que no se use.
          </p>

          {cargando ? <p className="text-muted">Cargando límites...</p> : null}

          {!cargando && !presupuestoActual ? (
            <div className="alert alert-info mb-0">Aún no hay límites de presupuesto guardados.</div>
          ) : null}

          {!cargando && presupuestoActual ? (
            <section className="border rounded-3 overflow-hidden bg-white">
              <div className="bg-light px-3 py-3 d-flex flex-wrap justify-content-between gap-2">
                <strong>{presupuestoService.formatearMes(mesActual)}</strong>
                <span className="fw-bold text-primary">
                  Total límite mensual: {totalLimiteMensual > 0 ? formatCurrencyPen(totalLimiteMensual) : 'No definido'}
                </span>
              </div>
              
              {chartData.length > 0 && totalLimiteMensual > 0 && (
                <div style={{ height: 300, width: '100%', margin: '16px 0' }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => {
                          const isAvailable = entry.name === 'Disponible (Sin Asignar)';
                          return (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={isAvailable ? '#e9ecef' : COLORS[index % (COLORS.length - 1)]} 
                              stroke={isAvailable ? '#ced4da' : 'none'}
                            />
                          );
                        })}
                      </Pie>
                      <Tooltip formatter={(value: any) => formatCurrencyPen(Number(value))} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-bold text-dark py-3">Categoría</th>
                      <th className="fw-bold text-dark py-3">Importancia</th>
                      <th className="fw-bold text-dark py-3 text-end">Límite permitido</th>
                      <th className="fw-bold text-dark py-3 text-end">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {presupuestoActual.desgloseCategorias.map((detalle) => (
                      <tr key={`${presupuestoActual.id}-${detalle.categoria.nombre}`}>
                        <td className="py-3">
                          <span className="badge bg-light text-dark border py-1 px-2 small fw-semibold">
                            {detalle.categoria.nombre}
                          </span>
                        </td>
                        <td className="py-3 text-muted small">{detalle.categoria.importancia}</td>
                        <td className="py-3 text-end fw-bold text-primary font-monospace">
                          {formatCurrencyPen(detalle.limiteSoles)}
                        </td>
                        <td className="py-3 text-end">
                          <button
                            className="btn btn-sm btn-outline-primary fw-semibold"
                            type="button"
                            onClick={() => cargarParaModificar(detalle.categoria.nombre, detalle.limiteSoles)}
                          >
                            Modificar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
