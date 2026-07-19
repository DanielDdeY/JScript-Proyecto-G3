import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Banco } from '../../../shared/types/banco';
import type { Prestamo } from '../../../shared/types/prestamo';
import { crearDetalleCuotasPrestamo, generarCuotasPrestamo } from '../domain/services/prestamoService';

const prestamoSchema = z
  .object({
    bancoId: z.string().min(1, { message: 'Selecciona un banco' }),
    montoAprobado: z.coerce.number().positive({ message: 'El monto aprobado debe ser mayor que cero' }),
    deudaRestante: z.coerce.number().nonnegative({ message: 'La deuda restante no puede ser negativa' }),
    fechaDesembolso: z.string().min(1, { message: 'Ingresa la fecha de desembolso' }),
    fechaPrimerVencimiento: z.string().min(1, { message: 'Ingresa la primera fecha de vencimiento' }),
    cuotasTotales: z.coerce.number().int().positive({ message: 'Las cuotas totales deben ser mayores que cero' }),
    cuotasPagadas: z.coerce.number().int().nonnegative({ message: 'Las cuotas pagadas no pueden ser negativas' }),
    montoPorCuota: z.coerce.number().positive({ message: 'El monto por cuota debe ser mayor que cero' }),
  })
  .superRefine((data, context) => {
    if (data.cuotasPagadas > data.cuotasTotales) {
      context.addIssue({
        code: 'custom',
        path: ['cuotasPagadas'],
        message: 'Las cuotas pagadas no pueden ser mayores que las cuotas totales',
      });
    }

    if (data.deudaRestante > data.montoAprobado) {
      context.addIssue({
        code: 'custom',
        path: ['deudaRestante'],
        message: 'La deuda restante no puede superar el monto aprobado',
      });
    }
  });

type PrestamoFormInput = z.input<typeof prestamoSchema>;
type PrestamoFormValues = z.output<typeof prestamoSchema>;

interface AgregarPrestamoModalProps {
  abierto: boolean;
  bancos: Banco[];
  onClose: () => void;
  onGuardar: (prestamo: Omit<Prestamo, 'id'>) => Promise<void>;
}

const today = () => new Date().toISOString().substring(0, 10);

export function AgregarPrestamoModal({ abierto, bancos, onClose, onGuardar }: AgregarPrestamoModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PrestamoFormInput, unknown, PrestamoFormValues>({
    resolver: zodResolver(prestamoSchema),
    defaultValues: {
      bancoId: '',
      montoAprobado: 0,
      deudaRestante: 0,
      fechaDesembolso: today(),
      fechaPrimerVencimiento: today(),
      cuotasTotales: 12,
      cuotasPagadas: 0,
      montoPorCuota: 0,
    },
  });

  useEffect(() => {
    if (!abierto) {
      reset({
        bancoId: '',
        montoAprobado: 0,
        deudaRestante: 0,
        fechaDesembolso: today(),
        fechaPrimerVencimiento: today(),
        cuotasTotales: 12,
        cuotasPagadas: 0,
        montoPorCuota: 0,
      });
    }
  }, [abierto, reset]);

  const onSubmit = async (data: PrestamoFormValues) => {
    const banco = bancos.find((item) => String(item.id) === data.bancoId);
    if (!banco) return;

    await onGuardar({
      banco,
      montoAprobado: data.montoAprobado,
      deudaRestante: data.deudaRestante,
      fechaDesembolso: data.fechaDesembolso,
      cuotasPagadas: data.cuotasPagadas,
      cuotasTotales: data.cuotasTotales,
      detalleCuotas: crearDetalleCuotasPrestamo(data.cuotasTotales, data.cuotasPagadas, data.montoPorCuota, banco.tcea),
      cuotas: generarCuotasPrestamo({
        cuotasTotales: data.cuotasTotales,
        cuotasPagadas: data.cuotasPagadas,
        montoPorCuota: data.montoPorCuota,
        fechaPrimerVencimiento: data.fechaPrimerVencimiento,
      }),
    });

    onClose();
  };

  if (!abierto) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header bg-danger text-white border-0 rounded-top-4">
              <div>
                <h5 className="modal-title fw-bold">Agregar Préstamo</h5>
                <p className="mb-0 small text-white-50">Registra la deuda y genera sus cuotas mensuales.</p>
              </div>
              <button type="button" className="btn-close btn-close-white" aria-label="Cerrar" onClick={onClose} />
            </div>

            <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Banco</label>
                    <select className={`form-select ${errors.bancoId ? 'is-invalid' : ''}`} {...register('bancoId')}>
                      <option value="">-- Selecciona --</option>
                      {bancos.map((banco) => (
                        <option key={String(banco.id)} value={String(banco.id)}>
                          {banco.nombre} · TCEA {banco.tcea}% · Seguro {banco.seguroDesgravamen}
                        </option>
                      ))}
                    </select>
                    {errors.bancoId ? <div className="invalid-feedback fw-semibold">{errors.bancoId.message}</div> : null}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Fecha de desembolso</label>
                    <input type="date" className={`form-control ${errors.fechaDesembolso ? 'is-invalid' : ''}`} {...register('fechaDesembolso')} />
                    {errors.fechaDesembolso ? <div className="invalid-feedback fw-semibold">{errors.fechaDesembolso.message}</div> : null}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Monto aprobado</label>
                    <div className="input-group">
                      <span className="input-group-text fw-bold">S/.</span>
                      <input type="number" step="0.01" className={`form-control ${errors.montoAprobado ? 'is-invalid' : ''}`} {...register('montoAprobado')} />
                      {errors.montoAprobado ? <div className="invalid-feedback fw-semibold">{errors.montoAprobado.message}</div> : null}
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Deuda restante</label>
                    <div className="input-group">
                      <span className="input-group-text fw-bold">S/.</span>
                      <input type="number" step="0.01" className={`form-control ${errors.deudaRestante ? 'is-invalid' : ''}`} {...register('deudaRestante')} />
                      {errors.deudaRestante ? <div className="invalid-feedback fw-semibold">{errors.deudaRestante.message}</div> : null}
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold">Cuotas totales</label>
                    <input type="number" className={`form-control ${errors.cuotasTotales ? 'is-invalid' : ''}`} {...register('cuotasTotales')} />
                    {errors.cuotasTotales ? <div className="invalid-feedback fw-semibold">{errors.cuotasTotales.message}</div> : null}
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold">Cuotas pagadas</label>
                    <input type="number" className={`form-control ${errors.cuotasPagadas ? 'is-invalid' : ''}`} {...register('cuotasPagadas')} />
                    {errors.cuotasPagadas ? <div className="invalid-feedback fw-semibold">{errors.cuotasPagadas.message}</div> : null}
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold">Monto por cuota</label>
                    <div className="input-group">
                      <span className="input-group-text fw-bold">S/.</span>
                      <input type="number" step="0.01" className={`form-control ${errors.montoPorCuota ? 'is-invalid' : ''}`} {...register('montoPorCuota')} />
                      {errors.montoPorCuota ? <div className="invalid-feedback fw-semibold">{errors.montoPorCuota.message}</div> : null}
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Primer vencimiento</label>
                    <input type="date" className={`form-control ${errors.fechaPrimerVencimiento ? 'is-invalid' : ''}`} {...register('fechaPrimerVencimiento')} />
                    {errors.fechaPrimerVencimiento ? <div className="invalid-feedback fw-semibold">{errors.fechaPrimerVencimiento.message}</div> : null}
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 p-4 pt-0">
                <button type="button" className="btn btn-outline-secondary fw-bold" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-danger fw-bold" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Guardar préstamo'}
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
