import { zodResolver } from '@hookform/resolvers/zod';
import { useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useWallet } from '../../../wallet/presentation/hooks/useWallet';

const perfilSchema = z.object({
  nombre: z
    .string()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    .max(50, { message: 'El nombre es demasiado largo' }),
  email: z.string().min(1, { message: 'El correo electrónico es requerido' }).email({ message: 'Ingrese un correo electrónico válido' }),
  avatarUrl: z.string().optional(),
});

type PerfilFormValues = z.infer<typeof perfilSchema>;

export function EditarPerfilPage() {
  const { perfil, actualizarPerfil, cargando } = useWallet();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PerfilFormValues>({
    resolver: zodResolver(perfilSchema),
    values: {
      nombre: perfil?.nombre ?? '',
      email: perfil?.email ?? '',
      avatarUrl: perfil?.avatarUrl ?? '',
    },
  });

  const avatarPreview = watch('avatarUrl');

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setValue('avatarUrl', reader.result, { shouldDirty: true, shouldValidate: true });
      }
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: PerfilFormValues) => {
    await actualizarPerfil({
      nombre: data.nombre,
      email: data.email,
      avatarUrl: data.avatarUrl?.trim() || undefined,
    });
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
        <div>
          <h4 className="fw-bold text-dark m-0">Editar Datos de Perfil</h4>
          <p className="text-muted small mb-0 mt-1">
            El perfil usa los datos del usuario vinculado, así evitamos duplicar nombre, correo y avatar.
          </p>
        </div>
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

          <div className="col-12">
            <label className="form-label fw-semibold">Avatar / Foto de perfil</label>
            <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Vista previa del avatar"
                  className="rounded-circle border"
                  style={{ width: '76px', height: '76px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                  style={{ width: '76px', height: '76px' }}
                >
                  {perfil.nombre.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-grow-1">
                <input type="hidden" {...register('avatarUrl')} />
                <input
                  type="file"
                  accept="image/*"
                  className={`form-control ${errors.avatarUrl ? 'is-invalid' : ''}`}
                  onChange={handleAvatarChange}
                />
                {errors.avatarUrl ? <div className="invalid-feedback fw-semibold">{errors.avatarUrl.message}</div> : null}
                <div className="form-text">La imagen se guarda como base64 en la base local para esta versión.</div>
              </div>
            </div>
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
