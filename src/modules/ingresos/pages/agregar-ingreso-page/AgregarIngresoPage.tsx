import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { OrigenIngreso } from '../../../../shared/types/ingreso';
import { crearReincidencia, type TipoReincidencia } from '../../../../shared/types/reincidencia';
import type { Tarjeta } from '../../../../shared/types/tarjeta';
import { formatCurrencyPen } from '../../../../shared/utils/formatters';
import { idsIguales } from '../../../../shared/utils/ids';
import { obtenerNombreBanco, obtenerUltimosDigitos } from '../../../../shared/utils/tarjetaUtils';
import { useWallet } from '../../../wallet/presentation/hooks/useWallet';

const ingresoSchema = z
  .object({
    monto: z.coerce.number().positive({ message: 'El monto debe ser un número positivo mayor que cero' }),
    fecha: z.string().min(1, { message: 'La fecha es requerida' }),
    fuente: z.enum(['Sueldo', 'Freelance', 'Inversiones', 'Venta', 'Premio', 'Otros']),
    origen: z.enum(['EFECTIVO', 'TARJETA']),
    tarjetaId: z.string().optional(),
    descripcion: z
      .string()
      .min(3, { message: 'La descripción debe tener al menos 3 caracteres' })
      .max(100, { message: 'La descripción no puede exceder los 100 caracteres' }),
    tipoReincidencia: z.enum(['esMensual', 'esAnual', 'esRecurrente', 'esProbable', 'esUnico']),
  })
  .superRefine((data, context) => {
    if (data.origen === 'TARJETA' && !data.tarjetaId) {
      context.addIssue({
        code: 'custom',
        path: ['tarjetaId'],
        message: 'Debe seleccionar una tarjeta o cuenta cuando el ingreso entra por tarjeta',
      });
    }
  });

type IngresoFormInput = z.input<typeof ingresoSchema>;
type IngresoFormValues = z.output<typeof ingresoSchema>;

const today = () => new Date().toISOString().substring(0, 10);

const buscarTarjeta = (tarjetas: Tarjeta[], tarjetaId?: string) =>
  tarjetas.find((tarjeta) => idsIguales(tarjeta.id, tarjetaId));

export function AgregarIngresoPage() {
  const { tarjetas, agregarIngreso, cargando } = useWallet();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IngresoFormInput, unknown, IngresoFormValues>({
    resolver: zodResolver(ingresoSchema),
    defaultValues: {
      monto: '' as unknown as number,
      fecha: today(),
      fuente: 'Sueldo',
      origen: 'EFECTIVO',
      tarjetaId: '',
      descripcion: '',
      tipoReincidencia: 'esMensual',
    },
  });

  const selectedOrigen = watch('origen');
  const selectedTarjetaId = watch('tarjetaId');

  const selectedTarjeta = useMemo(
    () => buscarTarjeta(tarjetas, selectedTarjetaId),
    [selectedTarjetaId, tarjetas],
  );

  const onSubmit = async (data: IngresoFormValues) => {
    const origen = data.origen as OrigenIngreso;
    const tarjeta = origen === 'TARJETA' ? buscarTarjeta(tarjetas, data.tarjetaId) : undefined;

    await agregarIngreso({
      monto: data.monto,
      fecha: data.fecha,
      fuente: data.fuente,
      origen,
      tarjetaId: tarjeta?.id,
      descripcion: data.descripcion,
      reincidencia: crearReincidencia(data.tipoReincidencia as TipoReincidencia),
    });
    setSuccess(true);
    reset({
      monto: '' as unknown as number,
      fecha: today(),
      fuente: 'Sueldo',
      origen: 'EFECTIVO',
      tarjetaId: '',
      descripcion: '',
      tipoReincidencia: 'esMensual',
    });
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
              <option value="Inversiones">Inversiones / Rendimiento</option>
              <option value="Venta">Venta de Productos / Servicios</option>
              <option value="Premio">Premios / Sorteos</option>
              <option value="Otros">Otros</option>
            </select>
            {errors.fuente ? <div className="invalid-feedback fw-semibold">{errors.fuente.message}</div> : null}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Origen del ingreso</label>
            <select className={`form-select ${errors.origen ? 'is-invalid' : ''}`} {...register('origen')}>
              <option value="EFECTIVO">Efectivo</option>
              <option value="TARJETA">Tarjeta / Cuenta vinculada</option>
            </select>
            {errors.origen ? <div className="invalid-feedback fw-semibold">{errors.origen.message}</div> : null}
            <div className="form-text">Indica dónde entró el dinero para actualizar correctamente el saldo.</div>
          </div>

          {selectedOrigen === 'TARJETA' ? (
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Tarjeta / Cuenta de destino</label>
              <select className={`form-select ${errors.tarjetaId ? 'is-invalid' : ''}`} {...register('tarjetaId')}>
                <option value="">-- Seleccione una cuenta --</option>
                {tarjetas.map((tarjeta) => (
                  <option key={String(tarjeta.id)} value={String(tarjeta.id)}>
                    {obtenerNombreBanco(tarjeta)} (**** {obtenerUltimosDigitos(tarjeta.numero)}) - Saldo actual:{' '}
                    {formatCurrencyPen(tarjeta.saldo)}
                  </option>
                ))}
              </select>
              {errors.tarjetaId ? (
                <div className="invalid-feedback fw-semibold">{errors.tarjetaId.message}</div>
              ) : null}
              {tarjetas.length === 0 ? (
                <div className="text-muted small mt-1">No hay tarjetas registradas, cambia el origen a efectivo.</div>
              ) : null}
              {selectedTarjeta ? (
                <div className="text-success small fw-semibold mt-1">
                  El saldo de esta tarjeta aumentará desde {formatCurrencyPen(selectedTarjeta.saldo)}.
                </div>
              ) : null}
            </div>
          ) : null}

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

          <div className="col-12">
            <div className="border rounded-4 p-3 bg-light">
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-arrow-repeat text-success" />
                <label className="form-label fw-bold m-0">Reincidencia del ingreso</label>
              </div>
              <p className="text-muted small mb-3">
                Esta marca ayudará a proyectar ingresos mensuales, anuales, recurrentes, probables o únicos.
              </p>
              <div className="row g-2">
                {[
                  ['esMensual', 'Mensual'],
                  ['esAnual', 'Anual'],
                  ['esRecurrente', 'Recurrente'],
                  ['esProbable', 'Probable'],
                  ['esUnico', 'Único'],
                ].map(([value, label]) => (
                  <div key={value} className="col-12 col-md">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        id={`ingreso-${value}`}
                        value={value}
                        {...register('tipoReincidencia')}
                      />
                      <label className="form-check-label" htmlFor={`ingreso-${value}`}>
                        {label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              {errors.tipoReincidencia ? (
                <div className="text-danger small fw-semibold mt-1">{errors.tipoReincidencia.message}</div>
              ) : null}
            </div>
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
