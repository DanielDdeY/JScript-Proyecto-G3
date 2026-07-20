import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../presentation/hooks/useAuth';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, { message: 'Ingresa tu correo' }).email({ message: 'Correo inválido' }),
  newPassword: z.string().min(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const { resetPassword, cargando } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
      newPassword: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setFormError(null);
    setSuccess(false);
    try {
      await resetPassword(values.email, values.newPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'No se pudo restablecer la contraseña.');
    }
  };

  return (
    <form className="vizcash-login-form" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
      {formError ? <div className="alert alert-danger py-2 mb-2">{formError}</div> : null}
      {success ? (
        <div className="alert alert-success py-2 mb-2 fw-semibold">
          ¡Contraseña restablecida! Redirigiendo al login...
        </div>
      ) : null}

      <div>
        <label className="vizcash-form-label" htmlFor="fp-email">
          Correo electrónico registrado
        </label>
        <input
          id="fp-email"
          className={`vizcash-input form-control ${errors.email ? 'is-invalid' : ''}`}
          type="email"
          autoComplete="email"
          disabled={success}
          {...register('email')}
        />
        {errors.email ? <div className="invalid-feedback fw-semibold">{errors.email.message}</div> : null}
      </div>

      <div>
        <label className="vizcash-form-label" htmlFor="fp-password">
          Nueva Contraseña
        </label>
        <div className="position-relative">
          <input
            id="fp-password"
            className={`vizcash-input form-control pe-5 ${errors.newPassword ? 'is-invalid' : ''}`}
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            disabled={success}
            {...register('newPassword')}
          />
          <button
            type="button"
            className="vizcash-password-toggle"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            disabled={success}
          >
            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
          </button>
          {errors.newPassword ? <div className="invalid-feedback fw-semibold">{errors.newPassword.message}</div> : null}
        </div>
      </div>

      <div className="text-center pt-2">
        <button type="submit" disabled={isSubmitting || cargando || success} className="vizcash-login-button">
          {isSubmitting || cargando ? 'Restableciendo...' : 'Restablecer contraseña'}
        </button>
      </div>
    </form>
  );
}
