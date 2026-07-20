import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../presentation/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().min(1, { message: 'Ingresa tu correo electrónico' }).email({ message: 'Correo electrónico inválido' }),
  password: z.string().min(1, { message: 'Ingresa tu contraseña' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LocationState {
  from?: {
    pathname?: string;
  };
}

export function LoginForm() {
  const { login, cargando } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      await login(values);
      const state = location.state as LocationState | null;
      navigate(state?.from?.pathname ?? '/app/dashboard', { replace: true });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'No se pudo iniciar sesión.');
    }
  };

  return (
    <form className="vizcash-login-form" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
      {formError ? <div className="alert alert-danger py-2 mb-2">{formError}</div> : null}

      <div>
        <label className="vizcash-form-label" htmlFor="login-email">
          Correo electrónico
        </label>
        <input
          id="login-email"
          className={`vizcash-input form-control ${errors.email ? 'is-invalid' : ''}`}
          type="email"
          autoComplete="email"
          aria-label="Correo electrónico"
          {...register('email')}
        />
        {errors.email ? <div className="invalid-feedback fw-semibold">{errors.email.message}</div> : null}
      </div>

      <div>
        <label className="vizcash-form-label" htmlFor="login-password">
          Contraseña
        </label>
        <div className="position-relative">
          <input
            id="login-password"
            className={`vizcash-input form-control pe-5 ${errors.password ? 'is-invalid' : ''}`}
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            aria-label="Contraseña"
            {...register('password')}
          />
          <button
            type="button"
            className="vizcash-password-toggle"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
          </button>
          {errors.password ? <div className="invalid-feedback fw-semibold">{errors.password.message}</div> : null}
        </div>
      </div>

      <div className="text-center pt-2">
        <button type="submit" disabled={isSubmitting || cargando} className="vizcash-login-button">
          {isSubmitting || cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </div>
    </form>
  );
}
