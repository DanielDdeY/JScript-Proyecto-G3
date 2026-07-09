import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useWallet } from '../../../wallet/presentation/hooks/useWallet';

const perfilSchema = z.object({
  nombre: z
    .string()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    .max(50, { message: 'El nombre es demasiado largo' }),
  email: z.string().min(1, { message: 'El correo electrónico es requerido' }).email({ message: 'Ingrese un correo electrónico válido' }),
});

type PerfilFormValues = z.infer<typeof perfilSchema>;

export function EditarPerfilPage() {
  const { perfil, actualizarPerfil, cargando } = useWallet();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PerfilFormValues>({
    resolver: zodResolver(perfilSchema),
    values: {
      nombre: perfil?.nombre ?? '',
      email: perfil?.email ?? '',
    },
  });

  const onSubmit = async (data: PerfilFormValues) => {
    await actualizarPerfil(data);
    setSuccess(true);
    window.setTimeout(() => setSuccess(false), 3000);
  };

  if (cargando || !perfil) {
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
        <h4 className="fw-bold text-dark m-0">Editar Datos de Perfil</h4>
        <i className="bi bi-person-bounding-box text-secondary fs-3" />
      </div>

      {success ? (
        <div className="alert alert-success border-0 shadow-sm mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2" /> ¡Perfil actualizado con éxito!
        </div>
      ) : null}

      <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Nombre de Usuario</label>
            <input type="text" className={`form-control ${errors.nombre ? 'is-invalid' : ''}`} {...register('nombre')} />
            {errors.nombre ? <div className="invalid-feedback fw-semibold">{errors.nombre.message}</div> : null}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Correo Electrónico</label>
            <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} {...register('email')} />
            {errors.email ? <div className="invalid-feedback fw-semibold">{errors.email.message}</div> : null}
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
              Guardando Cambios...
            </>
          ) : (
            <>
              <i className="bi bi-check2-all" /> Guardar Cambios
            </>
          )}
        </button>
      </form>
    </div>
  );
}
