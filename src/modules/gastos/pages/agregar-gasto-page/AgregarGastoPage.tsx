import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useForm, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { z } from 'zod';
import type { OrigenGasto } from '../../../../shared/types/gasto';
import { crearReincidencia, type TipoReincidencia } from '../../../../shared/types/reincidencia';
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
    nombrePrestadoA: z.string().optional(),
    importancia: z.enum(['Alta', 'Media', 'Baja']),
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
        message: 'Debe seleccionar una tarjeta cuando el gasto sale de una tarjeta',
      });
    }

    if (data.categoriaNombre === 'Prestaciones' && !data.nombrePrestadoA?.trim()) {
      context.addIssue({
        code: 'custom',
        path: ['nombrePrestadoA'],
        message: 'Debes ingresar el nombre de la persona a quien prestaste el dinero',
      });
    }
  });

type GastoFormInput = z.input<typeof gastoSchema>;
type GastoFormValues = z.output<typeof gastoSchema>;
type RegistroGasto = UseFormRegister<GastoFormInput>;
type ErroresGasto = FieldErrors<GastoFormInput>;

interface CampoFormularioProps {
  readonly register: RegistroGasto;
  readonly errors: ErroresGasto;
}

interface CampoTarjetaProps extends CampoFormularioProps {
  readonly tarjetas: Tarjeta[];
  readonly balanceWarning: string | null;
}

interface FormularioGastoProps extends CampoFormularioProps {
  readonly tarjetas: Tarjeta[];
  readonly selectedOrigen: GastoFormValues['origen'];
  readonly selectedCategoria: string;
  readonly balanceWarning: string | null;
  readonly isSubmitting: boolean;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const today = () => new Date().toISOString().substring(0, 10);

const valoresIniciales = (): GastoFormInput => ({
  monto: '' as unknown as number,
  fecha: today(),
  origen: 'EFECTIVO',
  tarjetaId: '',
  categoriaNombre: 'Alimentación',
  nombrePrestadoA: '',
  importancia: 'Alta',
  descripcion: '',
  tipoReincidencia: 'esUnico',
});

const buscarTarjeta = (tarjetas: Tarjeta[], tarjetaId?: string) =>
  tarjetas.find((tarjeta) => idsIguales(tarjeta.id, tarjetaId));

function EstadoCargaGasto() {
  return (
    <div className="text-center p-5">
      <output className="spinner-border text-primary">
        <span className="visually-hidden">Cargando...</span>
      </output>
    </div>
  );
}

function AlertaExito() {
  return (
    <div className="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
      <i className="bi bi-check-circle-fill" />
      <div>¡Gasto registrado exitosamente! El saldo total se actualizó.</div>
    </div>
  );
}

function CampoMonto({ register, errors }: CampoFormularioProps) {
  return (
    <div className="col-12 col-md-6">
      <label className="form-label fw-semibold" htmlFor="gasto-monto">Monto</label>
      <div className="input-group">
        <span className="input-group-text fw-bold">S/.</span>
        <input
          id="gasto-monto"
          type="number"
          step="0.01"
          className={`form-control form-control-lg fw-bold ${errors.monto ? 'is-invalid' : ''}`}
          placeholder="0.00"
          {...register('monto')}
        />
        {errors.monto ? <div className="invalid-feedback fw-semibold">{errors.monto.message}</div> : null}
      </div>
    </div>
  );
}

function CampoFecha({ register, errors }: CampoFormularioProps) {
  return (
    <div className="col-12 col-md-6">
      <label className="form-label fw-semibold" htmlFor="gasto-fecha">Fecha del Gasto</label>
      <input
        id="gasto-fecha"
        type="date"
        className={`form-control form-control-lg ${errors.fecha ? 'is-invalid' : ''}`}
        {...register('fecha')}
      />
      {errors.fecha ? <div className="invalid-feedback fw-semibold">{errors.fecha.message}</div> : null}
    </div>
  );
}

function CampoOrigen({ register, errors }: CampoFormularioProps) {
  return (
    <div className="col-12 col-md-6">
      <label className="form-label fw-semibold" htmlFor="gasto-origen">Origen del dinero</label>
      <select id="gasto-origen" className={`form-select ${errors.origen ? 'is-invalid' : ''}`} {...register('origen')}>
        <option value="EFECTIVO">Efectivo</option>
        <option value="TARJETA">Tarjeta / Cuenta vinculada</option>
      </select>
      {errors.origen ? <div className="invalid-feedback fw-semibold">{errors.origen.message}</div> : null}
      <div className="form-text">Puedes registrar gastos en efectivo aunque no tengas tarjetas agregadas.</div>
    </div>
  );
}

function CampoTarjeta({ register, errors, tarjetas, balanceWarning }: CampoTarjetaProps) {
  return (
    <div className="col-12 col-md-6">
      <label className="form-label fw-semibold" htmlFor="gasto-tarjeta">Tarjeta / Cuenta de Origen</label>
      <select id="gasto-tarjeta" className={`form-select ${errors.tarjetaId ? 'is-invalid' : ''}`} {...register('tarjetaId')}>
        <option value="">-- Seleccione una cuenta --</option>
        {tarjetas.map((tarjeta) => (
          <option key={String(tarjeta.id)} value={String(tarjeta.id)}>
            {obtenerNombreBanco(tarjeta)} (**** {obtenerUltimosDigitos(tarjeta.numero)}) - Disponible:{' '}
            {formatCurrencyPen(tarjeta.saldo)}
          </option>
        ))}
      </select>
      {errors.tarjetaId ? <div className="invalid-feedback fw-semibold">{errors.tarjetaId.message}</div> : null}
      {tarjetas.length === 0 ? <div className="text-muted small mt-1">No hay tarjetas registradas, cambia el origen a efectivo.</div> : null}
      {balanceWarning ? <AdvertenciaSaldo mensaje={balanceWarning} /> : null}
    </div>
  );
}

function AdvertenciaSaldo({ mensaje }: Readonly<{ mensaje: string }>) {
  return (
    <div className="text-warning small fw-bold mt-1 d-flex align-items-center gap-1">
      <i className="bi bi-exclamation-triangle-fill" />
      {mensaje}
    </div>
  );
}

function CampoCategoria({ register, errors }: CampoFormularioProps) {
  return (
    <div className="col-12 col-md-6">
      <label className="form-label fw-semibold" htmlFor="gasto-categoria">Categoría</label>
      <select id="gasto-categoria" className={`form-select ${errors.categoriaNombre ? 'is-invalid' : ''}`} {...register('categoriaNombre')}>
        <option value="Alimentación">Alimentación</option>
        <option value="Transporte">Transporte</option>
        <option value="Servicios">Servicios</option>
        <option value="Tecnología">Tecnología</option>
        <option value="Entretenimiento">Entretenimiento</option>
        <option value="Salud">Salud</option>
        <option value="Prestaciones">Prestaciones</option>
        <option value="Otros">Otros</option>
      </select>
      {errors.categoriaNombre ? <div className="invalid-feedback fw-semibold">{errors.categoriaNombre.message}</div> : null}
    </div>
  );
}

function CampoPrestacion({ register, errors }: CampoFormularioProps) {
  return (
    <div className="col-12 col-md-6">
      <label className="form-label fw-semibold" htmlFor="gasto-prestado-a">Nombre de la persona a quien prestaste</label>
      <input
        id="gasto-prestado-a"
        type="text"
        className={`form-control ${errors.nombrePrestadoA ? 'is-invalid' : ''}`}
        placeholder="Ej. Carlos Ramos"
        {...register('nombrePrestadoA')}
      />
      {errors.nombrePrestadoA ? <div className="invalid-feedback fw-semibold">{errors.nombrePrestadoA.message}</div> : null}
      <div className="form-text">Solo se guarda el nombre dentro del gasto, no crea un usuario nuevo.</div>
    </div>
  );
}

function CampoPrioridad({ register, errors }: CampoFormularioProps) {
  return (
    <fieldset className="col-12">
      <legend className="form-label fw-semibold fs-6">Nivel de Prioridad del Gasto</legend>
      <div className="d-flex flex-column flex-md-row gap-3 mt-1">
        <RadioPrioridad id="priorityAlta" value="Alta" className="text-danger" label="Alta (Indispensable)" register={register} />
        <RadioPrioridad id="priorityMedia" value="Media" className="text-warning" label="Media (Ajustable)" register={register} />
        <RadioPrioridad id="priorityBaja" value="Baja" className="text-success" label="Baja (Opcional)" register={register} />
      </div>
      {errors.importancia ? <div className="text-danger small fw-semibold mt-1">{errors.importancia.message}</div> : null}
    </fieldset>
  );
}

function RadioPrioridad({ id, value, label, className, register }: Readonly<{ id: string; value: string; label: string; className: string; register: RegistroGasto }>) {
  return (
    <div className="form-check">
      <input className="form-check-input" type="radio" id={id} value={value} {...register('importancia')} />
      <label className={`form-check-label fw-semibold ${className}`} htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

function CampoDescripcion({ register, errors }: CampoFormularioProps) {
  return (
    <div className="col-12">
      <label className="form-label fw-semibold" htmlFor="gasto-descripcion">Descripción / Detalle</label>
      <input
        id="gasto-descripcion"
        type="text"
        className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
        placeholder="Ej. Almuerzo familiar, suscripción de Netflix, etc."
        {...register('descripcion')}
      />
      {errors.descripcion ? <div className="invalid-feedback fw-semibold">{errors.descripcion.message}</div> : null}
    </div>
  );
}

function CampoReincidencia({ register, errors }: CampoFormularioProps) {
  return (
    <fieldset className="col-12">
      <div className="border rounded-4 p-3 bg-light">
        <div className="d-flex align-items-center gap-2 mb-2">
          <i className="bi bi-arrow-repeat text-primary" />
          <legend className="form-label fw-bold m-0 fs-6">Reincidencia del gasto</legend>
        </div>
        <p className="text-muted small mb-3">
          Esta información servirá para calcular proyecciones futuras sin mezclar gastos únicos con gastos recurrentes.
        </p>
        <div className="row g-2">
          {REINCIDENCIAS.map(({ value, label }) => (
            <div key={value} className="col-12 col-md">
              <div className="form-check">
                <input className="form-check-input" type="radio" id={`gasto-${value}`} value={value} {...register('tipoReincidencia')} />
                <label className="form-check-label" htmlFor={`gasto-${value}`}>{label}</label>
              </div>
            </div>
          ))}
        </div>
        {errors.tipoReincidencia ? <div className="text-danger small fw-semibold mt-1">{errors.tipoReincidencia.message}</div> : null}
      </div>
    </fieldset>
  );
}

const REINCIDENCIAS: ReadonlyArray<{ value: TipoReincidencia; label: string }> = [
  { value: 'esMensual', label: 'Mensual' },
  { value: 'esAnual', label: 'Anual' },
  { value: 'esRecurrente', label: 'Recurrente' },
  { value: 'esProbable', label: 'Probable' },
  { value: 'esUnico', label: 'Único' },
];

function BotonGuardar({ isSubmitting }: Readonly<{ isSubmitting: boolean }>) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="btn btn-danger w-100 fw-bold py-2.5 mt-4 d-flex align-items-center justify-content-center gap-2"
    >
      {isSubmitting ? (
        <>
          <output className="spinner-border spinner-border-sm" aria-hidden="true" />
          Registrando Gasto...
        </>
      ) : (
        <>
          <i className="bi bi-wallet2" />{' '}Guardar Transacción
        </>
      )}
    </button>
  );
}

function FormularioGasto({
  register,
  errors,
  tarjetas,
  selectedOrigen,
  selectedCategoria,
  balanceWarning,
  isSubmitting,
  onSubmit,
}: FormularioGastoProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="row g-3">
        <CampoMonto register={register} errors={errors} />
        <CampoFecha register={register} errors={errors} />
        <CampoOrigen register={register} errors={errors} />
        {selectedOrigen === 'TARJETA' ? <CampoTarjeta register={register} errors={errors} tarjetas={tarjetas} balanceWarning={balanceWarning} /> : null}
        <CampoCategoria register={register} errors={errors} />
        {selectedCategoria === 'Prestaciones' ? <CampoPrestacion register={register} errors={errors} /> : null}
        <CampoPrioridad register={register} errors={errors} />
        <CampoDescripcion register={register} errors={errors} />
        <CampoReincidencia register={register} errors={errors} />
      </div>
      <BotonGuardar isSubmitting={isSubmitting} />
    </form>
  );
}

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
    defaultValues: valoresIniciales(),
  });

  const selectedOrigen = watch('origen');
  const selectedTarjetaId = watch('tarjetaId');
  const selectedCategoria = watch('categoriaNombre');
  const inputMonto = Number(watch('monto') ?? 0);

  const selectedTarjeta = useMemo(
    () => buscarTarjeta(tarjetas, selectedTarjetaId),
    [selectedTarjetaId, tarjetas],
  );

  useEffect(() => {
    const noTieneSaldoSuficiente = selectedOrigen === 'TARJETA' && selectedTarjeta && inputMonto > 0 && selectedTarjeta.saldo < inputMonto;

    setBalanceWarning(
      noTieneSaldoSuficiente
        ? `Atención: el saldo disponible en esta tarjeta (${formatCurrencyPen(selectedTarjeta.saldo)}) es menor que el gasto.`
        : null,
    );
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
      reincidencia: crearReincidencia(data.tipoReincidencia as TipoReincidencia),
      prestacion: data.categoriaNombre === 'Prestaciones' ? { nombrePersona: data.nombrePrestadoA?.trim() ?? '' } : undefined,
    });

    setSuccess(true);
    reset(valoresIniciales());
    window.setTimeout(() => setSuccess(false), 4000);
  };

  if (cargando) return <EstadoCargaGasto />;

  return (
    <div className="card border-0 shadow-sm p-4 bg-white">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="fw-bold text-dark m-0">Registrar Nuevo Gasto</h4>
        <i className="bi bi-cart-plus text-danger fs-3" />
      </div>
      {success ? <AlertaExito /> : null}
      <FormularioGasto
        register={register}
        errors={errors}
        tarjetas={tarjetas}
        selectedOrigen={selectedOrigen}
        selectedCategoria={selectedCategoria}
        balanceWarning={balanceWarning}
        isSubmitting={isSubmitting}
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      />
    </div>
  );
}
