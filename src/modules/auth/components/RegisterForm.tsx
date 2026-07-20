import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../presentation/hooks/useAuth';

const registerSchema = z.object({
  nombre: z.string().min(2, { message: 'Ingresa tu nombre' }),
  email: z.string().min(1, { message: 'Ingresa tu correo' }).email({ message: 'Correo inválido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register: registerAuth, cargando } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setFormError(null);
    try {
      await registerAuth(values);
      // Redirigir al login después del registro
      navigate('/login', { replace: true });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'No se pudo crear la cuenta.');
    }
  };

  return (
    <form className="vizcash-login-form" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
      {formError ? <div className="alert alert-danger py-2 mb-2">{formError}</div> : null}

      <div>
        <label className="vizcash-form-label" htmlFor="reg-nombre">
          Nombre completo
        </label>
        <input
          id="reg-nombre"
          className={`vizcash-input form-control ${errors.nombre ? 'is-invalid' : ''}`}
          type="text"
          autoComplete="name"
          {...register('nombre')}
        />
        {errors.nombre ? <div className="invalid-feedback fw-semibold">{errors.nombre.message}</div> : null}
      </div>

      <div>
        <label className="vizcash-form-label" htmlFor="reg-email">
          Correo electrónico
        </label>
        <input
          id="reg-email"
          className={`vizcash-input form-control ${errors.email ? 'is-invalid' : ''}`}
          type="email"
          autoComplete="email"
          {...register('email')}
        />
        {errors.email ? <div className="invalid-feedback fw-semibold">{errors.email.message}</div> : null}
      </div>

      <div>
        <label className="vizcash-form-label" htmlFor="reg-password">
          Contraseña
        </label>
        <div className="position-relative">
          <input
            id="reg-password"
            className={`vizcash-input form-control pe-5 ${errors.password ? 'is-invalid' : ''}`}
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
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
          {isSubmitting || cargando ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </div>
    </form>
  );
}
