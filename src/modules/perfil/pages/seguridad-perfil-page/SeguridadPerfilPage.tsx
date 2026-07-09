import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
  const [success, setSuccess] = useState(false);

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

  const onSubmit = async () => {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 500);
    });
    setSuccess(true);
    reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
    window.setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="card border-0 shadow-sm p-4 bg-white">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="fw-bold text-dark m-0">Cambiar Contraseña de Acceso</h4>
        <i className="bi bi-shield-lock text-secondary fs-3" />
      </div>

      {success ? (
        <div className="alert alert-success border-0 shadow-sm mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2" /> ¡Contraseña modificada exitosamente!
        </div>
      ) : null}

      <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label fw-semibold">Contraseña Actual</label>
            <input
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
            <label className="form-label fw-semibold">Nueva Contraseña</label>
            <input
              type="password"
              className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
              placeholder="••••••••"
              {...register('newPassword')}
            />
            {errors.newPassword ? <div className="invalid-feedback fw-semibold">{errors.newPassword.message}</div> : null}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Confirmar Nueva Contraseña</label>
            <input
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
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              Actualizando Contraseña...
            </>
          ) : (
            <>
              <i className="bi bi-key" /> Cambiar Contraseña
            </>
          )}
        </button>
      </form>
    </div>
  );
}
