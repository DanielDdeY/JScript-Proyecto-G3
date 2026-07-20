import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, type FormEvent, type ReactNode } from 'react';
import { useForm, type FieldErrors, type UseFormRegister } from 'react-hook-form';
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
type RegistroPrestamo = UseFormRegister<PrestamoFormInput>;
type ErroresPrestamo = FieldErrors<PrestamoFormInput>;

interface AgregarPrestamoModalProps {
  readonly abierto: boolean;
  readonly bancos: Banco[];
  readonly onClose: () => void;
  readonly onGuardar: (prestamo: Omit<Prestamo, 'id'>) => Promise<void>;
}

interface PrestamoFormProps {
  readonly bancos: Banco[];
  readonly register: RegistroPrestamo;
  readonly errors: ErroresPrestamo;
  readonly isSubmitting: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

interface PrestamoCampoProps {
  readonly register: RegistroPrestamo;
  readonly errors: ErroresPrestamo;
}

const today = () => new Date().toISOString().substring(0, 10);

const valoresInicialesPrestamo = (): PrestamoFormInput => ({
  bancoId: '',
  montoAprobado: 0,
  deudaRestante: 0,
  fechaDesembolso: today(),
  fechaPrimerVencimiento: today(),
  cuotasTotales: 12,
  cuotasPagadas: 0,
  montoPorCuota: 0,
});

const crearPrestamoDesdeFormulario = (data: PrestamoFormValues, banco: Banco): Omit<Prestamo, 'id'> => ({
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

function CampoBancoPrestamo({ bancos, register, errors }: PrestamoCampoProps & Readonly<{ bancos: Banco[] }>) {
  return (
    <div className="col-12 col-md-6">
      <label className="form-label fw-semibold" htmlFor="prestamo-banco">Banco</label>
      <select id="prestamo-banco" className={`form-select ${errors.bancoId ? 'is-invalid' : ''}`} {...register('bancoId')}>
        <option value="">-- Selecciona --</option>
        {bancos.map((banco) => (
          <option key={String(banco.id)} value={String(banco.id)}>
            {banco.nombre} · TCEA {banco.tcea}% · Seguro {banco.seguroDesgravamen}
          </option>
        ))}
      </select>
      {errors.bancoId ? <div className="invalid-feedback fw-semibold">{errors.bancoId.message}</div> : null}
    </div>
  );
}

function CampoFechaDesembolso({ register, errors }: PrestamoCampoProps) {
  return (
    <div className="col-12 col-md-6">
      <label className="form-label fw-semibold" htmlFor="prestamo-fecha-desembolso">Fecha de desembolso</label>
      <input id="prestamo-fecha-desembolso" type="date" className={`form-control ${errors.fechaDesembolso ? 'is-invalid' : ''}`} {...register('fechaDesembolso')} />
      {errors.fechaDesembolso ? <div className="invalid-feedback fw-semibold">{errors.fechaDesembolso.message}</div> : null}
    </div>
  );
}

function CampoDineroPrestamo({ id, label, error, children }: Readonly<{ id: string; label: string; error?: string; children: ReactNode }>) {
  return (
    <div className="col-12 col-md-6">
      <label className="form-label fw-semibold" htmlFor={id}>{label}</label>
      <div className="input-group">
        <span className="input-group-text fw-bold">S/.</span>
        {children}
        {error ? <div className="invalid-feedback fw-semibold">{error}</div> : null}
      </div>
    </div>
  );
}

function CampoMontoAprobado({ register, errors }: PrestamoCampoProps) {
  return (
    <CampoDineroPrestamo id="prestamo-monto-aprobado" label="Monto aprobado" error={errors.montoAprobado?.message}>
      <input id="prestamo-monto-aprobado" type="number" step="0.01" className={`form-control ${errors.montoAprobado ? 'is-invalid' : ''}`} {...register('montoAprobado')} />
    </CampoDineroPrestamo>
  );
}

function CampoDeudaRestante({ register, errors }: PrestamoCampoProps) {
  return (
    <CampoDineroPrestamo id="prestamo-deuda-restante" label="Deuda restante" error={errors.deudaRestante?.message}>
      <input id="prestamo-deuda-restante" type="number" step="0.01" className={`form-control ${errors.deudaRestante ? 'is-invalid' : ''}`} {...register('deudaRestante')} />
    </CampoDineroPrestamo>
  );
}

function CampoCuotaNumero({ id, label, name, error, register }: Readonly<{ id: string; label: string; name: 'cuotasTotales' | 'cuotasPagadas'; error?: string; register: RegistroPrestamo }>) {
  return (
    <div className="col-12 col-md-4">
      <label className="form-label fw-semibold" htmlFor={id}>{label}</label>
      <input id={id} type="number" className={`form-control ${error ? 'is-invalid' : ''}`} {...register(name)} />
      {error ? <div className="invalid-feedback fw-semibold">{error}</div> : null}
    </div>
  );
}

function CampoMontoPorCuota({ register, errors }: PrestamoCampoProps) {
  return (
    <div className="col-12 col-md-4">
      <label className="form-label fw-semibold" htmlFor="prestamo-monto-cuota">Monto por cuota</label>
      <div className="input-group">
        <span className="input-group-text fw-bold">S/.</span>
        <input id="prestamo-monto-cuota" type="number" step="0.01" className={`form-control ${errors.montoPorCuota ? 'is-invalid' : ''}`} {...register('montoPorCuota')} />
        {errors.montoPorCuota ? <div className="invalid-feedback fw-semibold">{errors.montoPorCuota.message}</div> : null}
      </div>
    </div>
  );
}

function CampoPrimerVencimiento({ register, errors }: PrestamoCampoProps) {
  return (
    <div className="col-12 col-md-6">
      <label className="form-label fw-semibold" htmlFor="prestamo-primer-vencimiento">Primer vencimiento</label>
      <input id="prestamo-primer-vencimiento" type="date" className={`form-control ${errors.fechaPrimerVencimiento ? 'is-invalid' : ''}`} {...register('fechaPrimerVencimiento')} />
      {errors.fechaPrimerVencimiento ? <div className="invalid-feedback fw-semibold">{errors.fechaPrimerVencimiento.message}</div> : null}
    </div>
  );
}

function CamposPrestamo({ bancos, register, errors }: Readonly<PrestamoCampoProps & { bancos: Banco[] }>) {
  return (
    <div className="row g-3">
      <CampoBancoPrestamo bancos={bancos} register={register} errors={errors} />
      <CampoFechaDesembolso register={register} errors={errors} />
      <CampoMontoAprobado register={register} errors={errors} />
      <CampoDeudaRestante register={register} errors={errors} />
      <CampoCuotaNumero id="prestamo-cuotas-totales" label="Cuotas totales" name="cuotasTotales" error={errors.cuotasTotales?.message} register={register} />
      <CampoCuotaNumero id="prestamo-cuotas-pagadas" label="Cuotas pagadas" name="cuotasPagadas" error={errors.cuotasPagadas?.message} register={register} />
      <CampoMontoPorCuota register={register} errors={errors} />
      <CampoPrimerVencimiento register={register} errors={errors} />
    </div>
  );
}

function PrestamoForm({ bancos, register, errors, isSubmitting, onClose, onSubmit }: PrestamoFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="modal-body p-4">
        <CamposPrestamo bancos={bancos} register={register} errors={errors} />
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
  );
}

export function AgregarPrestamoModal({ abierto, bancos, onClose, onGuardar }: AgregarPrestamoModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PrestamoFormInput, unknown, PrestamoFormValues>({
    resolver: zodResolver(prestamoSchema),
    defaultValues: valoresInicialesPrestamo(),
  });

  useEffect(() => {
    if (!abierto) reset(valoresInicialesPrestamo());
  }, [abierto, reset]);

  const onSubmit = async (data: PrestamoFormValues) => {
    const banco = bancos.find((item) => String(item.id) === data.bancoId);
    if (!banco) return;

    await onGuardar(crearPrestamoDesdeFormulario(data, banco));
    onClose();
  };

  if (!abierto) return null;

  return (
    <>
      <dialog open className="modal fade show d-block" aria-modal="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header bg-danger text-white border-0 rounded-top-4">
              <div>
                <h5 className="modal-title fw-bold">Agregar Préstamo</h5>
                <p className="mb-0 small text-white-50">Registra la deuda y genera sus cuotas mensuales.</p>
              </div>
              <button type="button" className="btn-close btn-close-white" aria-label="Cerrar" onClick={onClose} />
            </div>

            <PrestamoForm
              bancos={bancos}
              register={register}
              errors={errors}
              isSubmitting={isSubmitting}
              onClose={onClose}
              onSubmit={(event) => void handleSubmit(onSubmit)(event)}
            />
          </div>
        </div>
      </dialog>
      <div className="modal-backdrop fade show" />
    </>
  );
}
