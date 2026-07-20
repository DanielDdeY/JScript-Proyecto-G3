import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '../../../auth/presentation/hooks/useAuth';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, { message: 'La contraseña actual debe tener al menos 6 caracteres' }),
    newPassword: z.string().min(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres' }),
    confirmPassword: z.string().min(6, { message: 'Debe confirmar su nueva contraseña' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas nuevas no coinciden',
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function SeguridadPerfilPage() {
  const { actualizarPassword } = useAuth();
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordFormValues) => {
    setFormError(null);
    try {
      await actualizarPassword(data.newPassword);
      setSuccess(true);
      reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
      window.setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'No se pudo actualizar la contraseña.');
    }
  };

  return (
    <div className="card border-0 shadow-sm p-4 bg-white">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="fw-bold text-dark m-0">Cambiar Contraseña de Acceso</h4>
        <i className="bi bi-shield-lock text-secondary fs-3" />
      </div>

      {formError ? (
        <div className="alert alert-danger border-0 shadow-sm mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2" />{' '}{formError}
        </div>
      ) : null}

      {success ? (
        <div className="alert alert-success border-0 shadow-sm mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2" />{' '}¡Contraseña modificada exitosamente!
        </div>
      ) : null}

      <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label fw-semibold" htmlFor="seguridad-current-password">Contraseña Actual</label>
            <input
              id="seguridad-current-password"
              type="password"
              className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
              placeholder="••••••••"
              {...register('currentPassword')}
            />
            {errors.currentPassword ? (
              <div className="invalid-feedback fw-semibold">{errors.currentPassword.message}</div>
            ) : null}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold" htmlFor="seguridad-new-password">Nueva Contraseña</label>
            <input
              id="seguridad-new-password"
              type="password"
              className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
              placeholder="••••••••"
              {...register('newPassword')}
            />
            {errors.newPassword ? <div className="invalid-feedback fw-semibold">{errors.newPassword.message}</div> : null}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold" htmlFor="seguridad-confirm-password">Confirmar Nueva Contraseña</label>
            <input
              id="seguridad-confirm-password"
              type="password"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              placeholder="••••••••"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword ? (
              <div className="invalid-feedback fw-semibold">{errors.confirmPassword.message}</div>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-secondary w-100 fw-bold py-2.5 mt-4 d-flex align-items-center justify-content-center gap-2"
        >
          {isSubmitting ? (
            <>
              <output className="spinner-border spinner-border-sm" aria-hidden="true" />
              Actualizando Contraseña...
            </>
          ) : (
            <>
              <i className="bi bi-key" />{' '}Cambiar Contraseña
            </>
          )}
        </button>
      </form>
    </div>
  );
}
