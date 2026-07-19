import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { NuevoActivoInversion } from '../domain/repositories/inversionesRepository';

const activoSchema = z
  .object({
    nombreSimbolo: z.string().min(2, { message: 'Ingresa el nombre del activo' }).max(80),
    capitalInvertido: z.coerce.number().positive({ message: 'El capital invertido debe ser mayor que cero' }),
    valorActual: z.coerce.number().nonnegative({ message: 'El valor actual no puede ser negativo' }),
    fechaRendimiento: z.string().min(1, { message: 'Ingresa la fecha del rendimiento' }),
    porcentajeGanancia: z.coerce.number(),
  });

type ActivoFormInput = z.input<typeof activoSchema>;
type ActivoFormValues = z.output<typeof activoSchema>;

interface AgregarActivoModalProps {
  abierto: boolean;
  onClose: () => void;
  onGuardar: (activo: NuevoActivoInversion) => Promise<void>;
}

const today = () => new Date().toISOString().substring(0, 10);

export function AgregarActivoModal({ abierto, onClose, onGuardar }: AgregarActivoModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ActivoFormInput, unknown, ActivoFormValues>({
    resolver: zodResolver(activoSchema),
    defaultValues: {
      nombreSimbolo: '',
      capitalInvertido: 0,
      valorActual: 0,
      fechaRendimiento: today(),
      porcentajeGanancia: 0,
    },
  });

  useEffect(() => {
    if (!abierto) {
      reset({
        nombreSimbolo: '',
        capitalInvertido: 0,
        valorActual: 0,
        fechaRendimiento: today(),
        porcentajeGanancia: 0,
      });
    }
  }, [abierto, reset]);

  const onSubmit = async (data: ActivoFormValues) => {
    await onGuardar({
      nombreSimbolo: data.nombreSimbolo.trim(),
      capitalInvertido: data.capitalInvertido,
      valorActual: data.valorActual,
      historial: [
        {
          fecha: data.fechaRendimiento,
          porcentajeGanancia: data.porcentajeGanancia,
        },
      ],
    });

    onClose();
  };

  if (!abierto) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header bg-success text-white border-0 rounded-top-4">
              <div>
                <h5 className="modal-title fw-bold">Añadir activo</h5>
                <p className="mb-0 small text-white-50">Registra una inversión para actualizar tu portafolio.</p>
              </div>
              <button type="button" className="btn-close btn-close-white" aria-label="Cerrar" onClick={onClose} />
            </div>

            <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Nombre del activo</label>
                    <input
                      type="text"
                      className={`form-control ${errors.nombreSimbolo ? 'is-invalid' : ''}`}
                      placeholder="Ej. Fondo Mutuo BCP"
                      {...register('nombreSimbolo')}
                    />
                    {errors.nombreSimbolo ? <div className="invalid-feedback fw-semibold">{errors.nombreSimbolo.message}</div> : null}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Fecha del rendimiento</label>
                    <input
                      type="date"
                      className={`form-control ${errors.fechaRendimiento ? 'is-invalid' : ''}`}
                      {...register('fechaRendimiento')}
                    />
                    {errors.fechaRendimiento ? <div className="invalid-feedback fw-semibold">{errors.fechaRendimiento.message}</div> : null}
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold">Capital invertido</label>
                    <div className="input-group">
                      <span className="input-group-text fw-bold">S/.</span>
                      <input
                        type="number"
                        step="0.01"
                        className={`form-control ${errors.capitalInvertido ? 'is-invalid' : ''}`}
                        {...register('capitalInvertido')}
                      />
                      {errors.capitalInvertido ? <div className="invalid-feedback fw-semibold">{errors.capitalInvertido.message}</div> : null}
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold">Valor actual estático</label>
                    <div className="input-group">
                      <span className="input-group-text fw-bold">S/.</span>
                      <input
                        type="number"
                        step="0.01"
                        className={`form-control ${errors.valorActual ? 'is-invalid' : ''}`}
                        {...register('valorActual')}
                      />
                      {errors.valorActual ? <div className="invalid-feedback fw-semibold">{errors.valorActual.message}</div> : null}
                    </div>
                    <div className="form-text">Este valor simula el valor en tiempo real sin consumir una API externa.</div>
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold">% de ganancia histórica</label>
                    <div className="input-group">
                      <input
                        type="number"
                        step="0.01"
                        className={`form-control ${errors.porcentajeGanancia ? 'is-invalid' : ''}`}
                        {...register('porcentajeGanancia')}
                      />
                      <span className="input-group-text fw-bold">%</span>
                      {errors.porcentajeGanancia ? <div className="invalid-feedback fw-semibold">{errors.porcentajeGanancia.message}</div> : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 p-4 pt-0">
                <button type="button" className="btn btn-outline-secondary fw-bold" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success fw-bold" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Guardar activo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}
