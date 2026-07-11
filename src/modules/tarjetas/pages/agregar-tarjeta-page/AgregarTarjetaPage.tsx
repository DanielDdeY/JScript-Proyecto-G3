import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import type { CicloFacturacion } from '../../../../shared/types/cicloFacturacion';
import type { LineaCredito } from '../../../../shared/types/lineaCredito';
import { idsIguales } from '../../../../shared/utils/ids';
import { useTarjetas } from '../../presentation/hooks/useTarjetas';

const optionalNumber = () =>
  z.preprocess(
    (value) => (value === '' || value === null ? undefined : value),
    z.coerce.number().optional(),
  );

const tarjetaSchema = z
  .object({
    bancoId: z.string().min(1, { message: 'Debe seleccionar un banco emisor' }),
    numero: z
      .string()
      .length(4, { message: 'Debe ingresar exactamente los últimos 4 dígitos' })
      .regex(/^\d+$/, { message: 'Solo se permiten caracteres numéricos' }),
    saldo: z.coerce.number().min(0, { message: 'El saldo inicial no puede ser negativo' }),
    tipo: z.enum(['DEBITO', 'CREDITO']),
    limiteTotal: optionalNumber(),
    lineaDisponible: optionalNumber(),
    lineaUtilizada: optionalNumber(),
    diaCorte: optionalNumber(),
    diaPago: optionalNumber(),
    mesActual: z.string().optional(),
    montoFacturado: optionalNumber(),
    pagoMinimo: optionalNumber(),
  })
  .superRefine((data, context) => {
    if (data.tipo !== 'CREDITO') return;

    const camposObligatorios = [
      ['limiteTotal', data.limiteTotal, 'Ingresa el límite total de la línea de crédito'],
      ['lineaDisponible', data.lineaDisponible, 'Ingresa la línea disponible'],
      ['lineaUtilizada', data.lineaUtilizada, 'Ingresa la línea utilizada'],
      ['diaCorte', data.diaCorte, 'Ingresa el día de corte'],
      ['diaPago', data.diaPago, 'Ingresa el día de pago'],
      ['montoFacturado', data.montoFacturado, 'Ingresa el monto facturado'],
      ['pagoMinimo', data.pagoMinimo, 'Ingresa el pago mínimo'],
    ] as const;

    camposObligatorios.forEach(([path, value, message]) => {
      if (typeof value !== 'number' || Number.isNaN(value)) {
        context.addIssue({ code: 'custom', path: [path], message });
      }
    });

    if (typeof data.limiteTotal === 'number' && data.limiteTotal <= 0) {
      context.addIssue({ code: 'custom', path: ['limiteTotal'], message: 'El límite total debe ser mayor que cero' });
    }

    if (typeof data.lineaDisponible === 'number' && data.lineaDisponible < 0) {
      context.addIssue({ code: 'custom', path: ['lineaDisponible'], message: 'La línea disponible no puede ser negativa' });
    }

    if (typeof data.lineaUtilizada === 'number' && data.lineaUtilizada < 0) {
      context.addIssue({ code: 'custom', path: ['lineaUtilizada'], message: 'La línea utilizada no puede ser negativa' });
    }

    if (
      typeof data.limiteTotal === 'number' &&
      typeof data.lineaDisponible === 'number' &&
      typeof data.lineaUtilizada === 'number' &&
      data.lineaDisponible + data.lineaUtilizada > data.limiteTotal
    ) {
      context.addIssue({
        code: 'custom',
        path: ['lineaDisponible'],
        message: 'La línea disponible y utilizada no pueden superar el límite total',
      });
    }

    if (typeof data.diaCorte === 'number' && (data.diaCorte < 1 || data.diaCorte > 31)) {
      context.addIssue({ code: 'custom', path: ['diaCorte'], message: 'El día de corte debe estar entre 1 y 31' });
    }

    if (typeof data.diaPago === 'number' && (data.diaPago < 1 || data.diaPago > 31)) {
      context.addIssue({ code: 'custom', path: ['diaPago'], message: 'El día de pago debe estar entre 1 y 31' });
    }
  });

type TarjetaFormInput = z.input<typeof tarjetaSchema>;
type TarjetaFormValues = z.output<typeof tarjetaSchema>;

const obtenerMesActual = () => new Date().toISOString().slice(0, 7);

export function AgregarTarjetaPage() {
  const { bancos, agregarTarjeta, cargando } = useTarjetas();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const valoresIniciales = useMemo<TarjetaFormInput>(
    () => ({
      bancoId: '',
      numero: '',
      saldo: 0,
      tipo: 'DEBITO',
      limiteTotal: undefined,
      lineaDisponible: undefined,
      lineaUtilizada: undefined,
      diaCorte: 15,
      diaPago: 5,
      mesActual: obtenerMesActual(),
      montoFacturado: 0,
      pagoMinimo: 0,
    }),
    [],
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TarjetaFormInput, unknown, TarjetaFormValues>({
    resolver: zodResolver(tarjetaSchema),
    defaultValues: valoresIniciales,
  });

  const tipoTarjeta = useWatch({ control, name: 'tipo' });

  const onSubmit = async (data: TarjetaFormValues) => {
    const banco = bancos.find((item) => idsIguales(item.id, data.bancoId));

    if (!banco) return;

    const lineaCredito: LineaCredito | undefined =
      data.tipo === 'CREDITO'
        ? {
            limiteTotal: data.limiteTotal ?? 0,
            lineaDisponible: data.lineaDisponible ?? 0,
            lineaUtilizada: data.lineaUtilizada ?? 0,
          }
        : undefined;

    const cicloFacturacion: CicloFacturacion | undefined =
      data.tipo === 'CREDITO'
        ? {
            diaCorte: data.diaCorte ?? 15,
            diaPago: data.diaPago ?? 5,
            mesActual: data.mesActual || obtenerMesActual(),
            montoFacturado: data.montoFacturado ?? 0,
            pagoMinimo: data.pagoMinimo ?? 0,
          }
        : undefined;

    await agregarTarjeta({
      bancoId: banco.id,
      numero: data.numero,
      saldo: data.saldo,
      tipo: data.tipo,
      lineaCredito,
      cicloFacturacion,
    });

    setSuccess(true);
    reset(valoresIniciales);
    navigate('/app/tarjetas/listar', { state: { message: '¡Tarjeta vinculada con éxito!' } });
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
        <h4 className="fw-bold text-dark m-0">Vincular Nueva Tarjeta / Cuenta</h4>
        <i className="bi bi-credit-card-2-front text-primary fs-1" />
      </div>

      {success ? (
        <div className="alert alert-success border-0 shadow-sm" role="alert">
          <i className="bi bi-check-circle-fill me-2" /> ¡Tarjeta vinculada con éxito! Ahora puedes revisarla en el carrusel.
        </div>
      ) : null}

      {bancos.length === 0 ? (
        <div className="alert alert-warning">
          No hay bancos cargados en la base de datos. Revisa la colección <strong>bancos</strong> en <strong>db.json</strong>.
        </div>
      ) : null}

      <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Banco Emisor</label>
            <select className={`form-select ${errors.bancoId ? 'is-invalid' : ''}`} {...register('bancoId')}>
              <option value="">-- Seleccione un banco --</option>
              {bancos.map((banco) => (
                <option key={String(banco.id)} value={String(banco.id)}>
                  {banco.nombre} (TCEA: {banco.tcea}%)
                </option>
              ))}
            </select>
            {errors.bancoId ? <div className="invalid-feedback fw-semibold">{errors.bancoId.message}</div> : null}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Tipo de Cuenta</label>
            <select className={`form-select ${errors.tipo ? 'is-invalid' : ''}`} {...register('tipo')}>
              <option value="DEBITO">Débito / Cuenta de Ahorros</option>
              <option value="CREDITO">Crédito / Línea de Crédito</option>
            </select>
            {errors.tipo ? <div className="invalid-feedback fw-semibold">{errors.tipo.message}</div> : null}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Últimos 4 Dígitos de la Tarjeta</label>
            <input
              type="text"
              maxLength={4}
              className={`form-control ${errors.numero ? 'is-invalid' : ''}`}
              placeholder="Ej. 1234"
              {...register('numero')}
            />
            {errors.numero ? <div className="invalid-feedback fw-semibold">{errors.numero.message}</div> : null}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Saldo Inicial / Disponible</label>
            <div className="input-group">
              <span className="input-group-text fw-bold">S/.</span>
              <input
                type="number"
                step="0.01"
                className={`form-control fw-bold ${errors.saldo ? 'is-invalid' : ''}`}
                placeholder="0.00"
                {...register('saldo')}
              />
              {errors.saldo ? <div className="invalid-feedback fw-semibold">{errors.saldo.message}</div> : null}
            </div>
          </div>
        </div>

        {tipoTarjeta === 'CREDITO' ? (
          <section className="border rounded-4 p-3 p-md-4 mt-4 bg-light-subtle">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0">Datos de crédito y facturación</h5>
              <span className="badge bg-primary-subtle text-primary">Opciones avanzadas</span>
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">Límite total</label>
                <input type="number" step="0.01" className={`form-control ${errors.limiteTotal ? 'is-invalid' : ''}`} {...register('limiteTotal')} />
                {errors.limiteTotal ? <div className="invalid-feedback fw-semibold">{errors.limiteTotal.message}</div> : null}
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">Línea disponible</label>
                <input type="number" step="0.01" className={`form-control ${errors.lineaDisponible ? 'is-invalid' : ''}`} {...register('lineaDisponible')} />
                {errors.lineaDisponible ? <div className="invalid-feedback fw-semibold">{errors.lineaDisponible.message}</div> : null}
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">Línea utilizada</label>
                <input type="number" step="0.01" className={`form-control ${errors.lineaUtilizada ? 'is-invalid' : ''}`} {...register('lineaUtilizada')} />
                {errors.lineaUtilizada ? <div className="invalid-feedback fw-semibold">{errors.lineaUtilizada.message}</div> : null}
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label fw-semibold">Día de corte</label>
                <input type="number" className={`form-control ${errors.diaCorte ? 'is-invalid' : ''}`} {...register('diaCorte')} />
                {errors.diaCorte ? <div className="invalid-feedback fw-semibold">{errors.diaCorte.message}</div> : null}
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label fw-semibold">Día de pago</label>
                <input type="number" className={`form-control ${errors.diaPago ? 'is-invalid' : ''}`} {...register('diaPago')} />
                {errors.diaPago ? <div className="invalid-feedback fw-semibold">{errors.diaPago.message}</div> : null}
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label fw-semibold">Mes actual</label>
                <input type="month" className="form-control" {...register('mesActual')} />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label fw-semibold">Pago mínimo</label>
                <input type="number" step="0.01" className={`form-control ${errors.pagoMinimo ? 'is-invalid' : ''}`} {...register('pagoMinimo')} />
                {errors.pagoMinimo ? <div className="invalid-feedback fw-semibold">{errors.pagoMinimo.message}</div> : null}
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">Monto facturado</label>
                <input type="number" step="0.01" className={`form-control ${errors.montoFacturado ? 'is-invalid' : ''}`} {...register('montoFacturado')} />
                {errors.montoFacturado ? <div className="invalid-feedback fw-semibold">{errors.montoFacturado.message}</div> : null}
              </div>
            </div>
          </section>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || bancos.length === 0}
          className="btn btn-primary w-100 fw-bold py-2.5 mt-4 d-flex align-items-center justify-content-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              Vinculando Cuenta...
            </>
          ) : (
            <>
              <i className="bi bi-link-45deg" /> Vincular Tarjeta
            </>
          )}
        </button>
      </form>
    </div>
  );
}
