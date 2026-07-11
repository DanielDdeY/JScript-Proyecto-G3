import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { OrigenGasto } from '../../../../shared/types/gasto';
import type { Tarjeta } from '../../../../shared/types/tarjeta';
import { formatCurrencyPen } from '../../../../shared/utils/formatters';
import { idsIguales } from '../../../../shared/utils/ids';
import { obtenerNombreBanco, obtenerUltimosDigitos } from '../../../../shared/utils/tarjetaUtils';
import { useWallet } from '../../../wallet/presentation/hooks/useWallet';

const gastoSchema = z
  .object({
    monto: z.coerce.number().positive({ message: 'El monto debe ser un número positivo mayor que cero' }),
    fecha: z.string().min(1, { message: 'La fecha es requerida' }),
    origen: z.enum(['EFECTIVO', 'TARJETA']),
    tarjetaId: z.string().optional(),
    categoriaNombre: z.string().min(1, { message: 'Debe seleccionar una categoría' }),
    importancia: z.enum(['Alta', 'Media', 'Baja']),
    descripcion: z
      .string()
      .min(3, { message: 'La descripción debe tener al menos 3 caracteres' })
      .max(100, { message: 'La descripción no puede exceder los 100 caracteres' }),
  })
  .superRefine((data, context) => {
    if (data.origen === 'TARJETA' && !data.tarjetaId) {
      context.addIssue({
        code: 'custom',
        path: ['tarjetaId'],
        message: 'Debe seleccionar una tarjeta cuando el gasto sale de una tarjeta',
      });
    }
  });

type GastoFormInput = z.input<typeof gastoSchema>;
type GastoFormValues = z.output<typeof gastoSchema>;

const today = () => new Date().toISOString().substring(0, 10);

const buscarTarjeta = (tarjetas: Tarjeta[], tarjetaId?: string) =>
  tarjetas.find((tarjeta) => idsIguales(tarjeta.id, tarjetaId));

export function AgregarGastoPage() {
  const { tarjetas, agregarGasto, cargando } = useWallet();
  const [success, setSuccess] = useState(false);
  const [balanceWarning, setBalanceWarning] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GastoFormInput, unknown, GastoFormValues>({
    resolver: zodResolver(gastoSchema),
    defaultValues: {
      monto: 0,
      fecha: today(),
      origen: 'EFECTIVO',
      tarjetaId: '',
      categoriaNombre: 'Alimentación',
      importancia: 'Alta',
      descripcion: '',
    },
  });

  const selectedOrigen = watch('origen');
  const selectedTarjetaId = watch('tarjetaId');
  const inputMonto = Number(watch('monto') ?? 0);

  const selectedTarjeta = useMemo(
    () => buscarTarjeta(tarjetas, selectedTarjetaId),
    [selectedTarjetaId, tarjetas],
  );

  useEffect(() => {
    if (selectedOrigen === 'TARJETA' && selectedTarjeta && inputMonto > 0 && selectedTarjeta.saldo < inputMonto) {
      setBalanceWarning(
        `Atención: el saldo disponible en esta tarjeta (${formatCurrencyPen(selectedTarjeta.saldo)}) es menor que el gasto.`,
      );
      return;
    }

    setBalanceWarning(null);
  }, [inputMonto, selectedOrigen, selectedTarjeta]);

  const onSubmit = async (data: GastoFormValues) => {
    const origen = data.origen as OrigenGasto;
    const tarjeta = origen === 'TARJETA' ? buscarTarjeta(tarjetas, data.tarjetaId) : undefined;

    await agregarGasto({
      monto: data.monto,
      fecha: data.fecha,
      categoria: {
        nombre: data.categoriaNombre,
        importancia: data.importancia,
      },
      origen,
      tarjetaId: tarjeta?.id,
      descripcion: data.descripcion,
    });

    setSuccess(true);
    reset({
      monto: 0,
      fecha: today(),
      origen: 'EFECTIVO',
      tarjetaId: '',
      categoriaNombre: 'Alimentación',
      importancia: 'Alta',
      descripcion: '',
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
        <h4 className="fw-bold text-dark m-0">Registrar Nuevo Gasto</h4>
        <i className="bi bi-cart-plus text-danger fs-3" />
      </div>

      {success ? (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
          <i className="bi bi-check-circle-fill" />
          <div>¡Gasto registrado exitosamente! El saldo total se actualizó.</div>
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
            <label className="form-label fw-semibold">Fecha del Gasto</label>
            <input
              type="date"
              className={`form-control form-control-lg ${errors.fecha ? 'is-invalid' : ''}`}
              {...register('fecha')}
            />
            {errors.fecha ? <div className="invalid-feedback fw-semibold">{errors.fecha.message}</div> : null}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Origen del dinero</label>
            <select className={`form-select ${errors.origen ? 'is-invalid' : ''}`} {...register('origen')}>
              <option value="EFECTIVO">Efectivo</option>
              <option value="TARJETA">Tarjeta / Cuenta vinculada</option>
            </select>
            {errors.origen ? <div className="invalid-feedback fw-semibold">{errors.origen.message}</div> : null}
            <div className="form-text">
              Puedes registrar gastos en efectivo aunque no tengas tarjetas agregadas.
            </div>
          </div>

          {selectedOrigen === 'TARJETA' ? (
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Tarjeta / Cuenta de Origen</label>
              <select className={`form-select ${errors.tarjetaId ? 'is-invalid' : ''}`} {...register('tarjetaId')}>
                <option value="">-- Seleccione una cuenta --</option>
                {tarjetas.map((tarjeta) => (
                  <option key={String(tarjeta.id)} value={String(tarjeta.id)}>
                    {obtenerNombreBanco(tarjeta)} (**** {obtenerUltimosDigitos(tarjeta.numero)}) - Disponible:{' '}
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
              {balanceWarning ? (
                <div className="text-warning small fw-bold mt-1 d-flex align-items-center gap-1">
                  <i className="bi bi-exclamation-triangle-fill" /> {balanceWarning}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Categoría</label>
            <select
              className={`form-select ${errors.categoriaNombre ? 'is-invalid' : ''}`}
              {...register('categoriaNombre')}
            >
              <option value="Alimentación">Alimentación</option>
              <option value="Transporte">Transporte</option>
              <option value="Servicios">Servicios</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Entretenimiento">Entretenimiento</option>
              <option value="Salud">Salud</option>
              <option value="Otros">Otros</option>
            </select>
            {errors.categoriaNombre ? (
              <div className="invalid-feedback fw-semibold">{errors.categoriaNombre.message}</div>
            ) : null}
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold">Nivel de Prioridad del Gasto</label>
            <div className="d-flex flex-column flex-md-row gap-3 mt-1">
              <div className="form-check">
                <input className="form-check-input" type="radio" id="priorityAlta" value="Alta" {...register('importancia')} />
                <label className="form-check-label fw-semibold text-danger" htmlFor="priorityAlta">
                  Alta (Indispensable)
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" id="priorityMedia" value="Media" {...register('importancia')} />
                <label className="form-check-label fw-semibold text-warning" htmlFor="priorityMedia">
                  Media (Ajustable)
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" id="priorityBaja" value="Baja" {...register('importancia')} />
                <label className="form-check-label fw-semibold text-success" htmlFor="priorityBaja">
                  Baja (Opcional)
                </label>
              </div>
            </div>
            {errors.importancia ? <div className="text-danger small fw-semibold mt-1">{errors.importancia.message}</div> : null}
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold">Descripción / Detalle</label>
            <input
              type="text"
              className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
              placeholder="Ej. Almuerzo familiar, suscripción de Netflix, etc."
              {...register('descripcion')}
            />
            {errors.descripcion ? <div className="invalid-feedback fw-semibold">{errors.descripcion.message}</div> : null}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-danger w-100 fw-bold py-2.5 mt-4 d-flex align-items-center justify-content-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              Registrando Gasto...
            </>
          ) : (
            <>
              <i className="bi bi-wallet2" /> Guardar Transacción
            </>
          )}
        </button>
      </form>
    </div>
  );
}
