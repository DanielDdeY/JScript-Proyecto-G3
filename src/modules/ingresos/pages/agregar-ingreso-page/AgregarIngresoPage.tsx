import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useWallet } from '../../../wallet/presentation/hooks/useWallet';

const ingresoSchema = z.object({
  monto: z.coerce.number().positive({ message: 'El monto debe ser un número positivo mayor que cero' }),
  fecha: z.string().min(1, { message: 'La fecha es requerida' }),
  fuente: z.string().min(1, { message: 'La fuente de ingreso es requerida' }),
  descripcion: z
    .string()
    .min(3, { message: 'La descripción debe tener al menos 3 caracteres' })
    .max(100, { message: 'La descripción no puede exceder los 100 caracteres' }),
});

type IngresoFormInput = z.input<typeof ingresoSchema>;
type IngresoFormValues = z.output<typeof ingresoSchema>;

const today = () => new Date().toISOString().substring(0, 10);

export function AgregarIngresoPage() {
  const { agregarIngreso, cargando } = useWallet();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IngresoFormInput, unknown, IngresoFormValues>({
    resolver: zodResolver(ingresoSchema),
    defaultValues: {
      monto: 0,
      fecha: today(),
      fuente: 'Sueldo',
      descripcion: '',
    },
  });

  const onSubmit = async (data: IngresoFormValues) => {
    await agregarIngreso(data);
    setSuccess(true);
    reset({ monto: 0, fecha: today(), fuente: 'Sueldo', descripcion: '' });
    window.setTimeout(() => setSuccess(false), 4000);
  };

  if (cargando) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm p-4 bg-white">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="fw-bold text-dark m-0">Registrar Nuevo Ingreso</h4>
        <i className="bi bi-cash-coin text-success fs-1" />
      </div>

      {success ? (
        <div className="alert alert-success border-0 shadow-sm" role="alert">
          <i className="bi bi-check-circle-fill me-2" /> ¡Ingreso registrado con éxito! Tu saldo total se actualizó.
        </div>
      ) : null}

      <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Monto</label>
            <div className="input-group">
              <span className="input-group-text fw-bold">S/.</span>
              <input
                type="number"
                step="0.01"
                className={`form-control form-control-lg fw-bold ${errors.monto ? 'is-invalid' : ''}`}
                placeholder="0.00"
                {...register('monto')}
              />
              {errors.monto ? <div className="invalid-feedback fw-semibold">{errors.monto.message}</div> : null}
            </div>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Fecha de Recepción</label>
            <input
              type="date"
              className={`form-control form-control-lg ${errors.fecha ? 'is-invalid' : ''}`}
              {...register('fecha')}
            />
            {errors.fecha ? <div className="invalid-feedback fw-semibold">{errors.fecha.message}</div> : null}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Fuente del Ingreso</label>
            <select className={`form-select ${errors.fuente ? 'is-invalid' : ''}`} {...register('fuente')}>
              <option value="Sueldo">Sueldo / Planilla</option>
              <option value="Freelance">Trabajo Freelance / Consultoría</option>
              <option value="Inversión">Inversiones / Rendimiento</option>
              <option value="Venta">Venta de Productos / Servicios</option>
              <option value="Premio">Premios / Sorteos</option>
              <option value="Otros">Otros</option>
            </select>
            {errors.fuente ? <div className="invalid-feedback fw-semibold">{errors.fuente.message}</div> : null}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Descripción / Detalle</label>
            <input
              type="text"
              className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
              placeholder="Ej. Pago quincenal, proyecto web, etc."
              {...register('descripcion')}
            />
            {errors.descripcion ? <div className="invalid-feedback fw-semibold">{errors.descripcion.message}</div> : null}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-success w-100 fw-bold py-2.5 mt-4 d-flex align-items-center justify-content-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              Registrando...
            </>
          ) : (
            <>
              <i className="bi bi-wallet2" /> Guardar Ingreso
            </>
          )}
        </button>
      </form>
    </div>
  );
}
