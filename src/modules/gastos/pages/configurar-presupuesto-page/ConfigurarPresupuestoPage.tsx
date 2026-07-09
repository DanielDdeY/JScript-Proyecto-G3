import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { formatCurrencyPen } from '../../../../shared/utils/formatters';

const presupuestoSchema = z.object({
  categoria: z.string().min(1, { message: 'Debe seleccionar una categoría' }),
  limiteSoles: z.coerce.number().positive({ message: 'El límite debe ser un número positivo mayor que cero' }),
  mes: z.string().min(1, { message: 'Debe indicar el mes de vigencia' }),
});

type PresupuestoFormValues = z.infer<typeof presupuestoSchema>;

interface Budget {
  categoria: string;
  limiteSoles: number;
  mes: string;
}

const currentMonth = () => new Date().toISOString().substring(0, 7);

export function ConfigurarPresupuestoPage() {
  const [success, setSuccess] = useState(false);
  const [budgets, setBudgets] = useState<Budget[]>([
    { categoria: 'Alimentación', limiteSoles: 650, mes: currentMonth() },
    { categoria: 'Transporte', limiteSoles: 400, mes: currentMonth() },
  ]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PresupuestoFormValues>({
    resolver: zodResolver(presupuestoSchema),
    defaultValues: {
      categoria: 'Alimentación',
      limiteSoles: 0,
      mes: currentMonth(),
    },
  });

  const onSubmit = async (data: PresupuestoFormValues) => {
    setBudgets((currentBudgets) => {
      const index = currentBudgets.findIndex((budget) => budget.categoria === data.categoria && budget.mes === data.mes);

      if (index === -1) return [...currentBudgets, data];

      return currentBudgets.map((budget, currentIndex) =>
        currentIndex === index ? { ...budget, limiteSoles: data.limiteSoles } : budget,
      );
    });

    setSuccess(true);
    reset({ categoria: data.categoria, limiteSoles: 0, mes: data.mes });
    window.setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="card border-0 shadow-sm p-4 bg-white">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="fw-bold text-dark m-0">Límites de Presupuesto</h4>
        <i className="bi bi-pie-chart text-danger fs-3" />
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="border p-4 rounded-3 bg-light">
            <h5 className="fw-bold text-dark mb-3">Definir Límite</h5>

            {success ? (
              <div className="alert alert-success d-flex align-items-center gap-2 mb-3 small" role="alert">
                <i className="bi bi-check-circle-fill" />
                <div>Límite guardado correctamente.</div>
              </div>
            ) : null}

            <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Mes de Vigencia</label>
                <input type="month" className={`form-control ${errors.mes ? 'is-invalid' : ''}`} {...register('mes')} />
                {errors.mes ? <div className="invalid-feedback fw-semibold">{errors.mes.message}</div> : null}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Categoría de Gasto</label>
                <select className={`form-select ${errors.categoria ? 'is-invalid' : ''}`} {...register('categoria')}>
                  <option value="Alimentación">Alimentación</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Servicios">Servicios</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Entretenimiento">Entretenimiento</option>
                  <option value="Salud">Salud</option>
                  <option value="Otros">Otros</option>
                </select>
                {errors.categoria ? <div className="invalid-feedback fw-semibold">{errors.categoria.message}</div> : null}
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small">Monto Límite</label>
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
                disabled={isSubmitting}
                className="btn btn-danger w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
              >
                {isSubmitting ? 'Guardando...' : 'Establecer Límite'}
              </button>
            </form>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <h5 className="fw-bold text-dark mb-3">Límites Establecidos</h5>
          <div className="table-responsive border rounded-3 bg-white">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="fw-bold text-dark py-3">Categoría</th>
                  <th className="fw-bold text-dark py-3">Mes</th>
                  <th className="fw-bold text-dark py-3 text-end">Límite Permitido</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((budget) => (
                  <tr key={`${budget.categoria}-${budget.mes}`}>
                    <td className="py-3">
                      <span className="badge bg-light text-dark border py-1 px-2 small fw-semibold">
                        {budget.categoria}
                      </span>
                    </td>
                    <td className="py-3 text-muted small">{budget.mes}</td>
                    <td className="py-3 text-end fw-bold text-primary font-monospace">
                      {formatCurrencyPen(budget.limiteSoles)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
