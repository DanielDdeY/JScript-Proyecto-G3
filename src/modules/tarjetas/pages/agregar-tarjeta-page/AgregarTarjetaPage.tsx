import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useWallet } from '../../../wallet/presentation/hooks/useWallet';
import { idsIguales } from '../../../../shared/utils/ids';

const tarjetaSchema = z.object({
  bancoId: z.string().min(1, { message: 'Debe seleccionar un banco emisor' }),
  numero: z
    .string()
    .length(4, { message: 'Debe ingresar exactamente los últimos 4 dígitos' })
    .regex(/^\d+$/, { message: 'Solo se permiten caracteres numéricos' }),
  saldo: z.coerce.number().min(0, { message: 'El saldo inicial no puede ser negativo' }),
  tipo: z.enum(['DEBITO', 'CREDITO']),
});

type TarjetaFormValues = z.infer<typeof tarjetaSchema>;

export function AgregarTarjetaPage() {
  const { bancos, agregarTarjeta, cargando } = useWallet();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TarjetaFormValues>({
    resolver: zodResolver(tarjetaSchema),
    defaultValues: {
      bancoId: '',
      numero: '',
      saldo: 0,
      tipo: 'DEBITO',
    },
  });

  const onSubmit = async (data: TarjetaFormValues) => {
    const banco = bancos.find((item) => idsIguales(item.id, data.bancoId));

    if (!banco) return;

    await agregarTarjeta({
      bancoId: banco.id,
      numero: data.numero,
      saldo: data.saldo,
      tipo: data.tipo,
    });

    setSuccess(true);
    reset({ bancoId: '', numero: '', saldo: 0, tipo: 'DEBITO' });
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
        <h4 className="fw-bold text-dark m-0">Vincular Nueva Tarjeta / Cuenta</h4>
        <i className="bi bi-credit-card-2-front text-primary fs-1" />
      </div>

      {success ? (
        <div className="alert alert-success border-0 shadow-sm" role="alert">
          <i className="bi bi-check-circle-fill me-2" /> ¡Tarjeta vinculada con éxito! Ahora puedes seleccionarla para tus gastos.
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
