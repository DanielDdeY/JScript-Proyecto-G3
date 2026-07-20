import { zodResolver } from '@hookform/resolvers/zod';
import { useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useWallet } from '../../../wallet/presentation/hooks/useWallet';

const perfilSchema = z.object({
  nombre:    z.string().min(3, { message: 'Mínimo 3 caracteres' }).max(50, { message: 'Nombre demasiado largo' }),
  email:     z.string().min(1, { message: 'El correo es requerido' }).email({ message: 'Correo inválido' }),
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
      nombre:    perfil?.nombre ?? '',
      email:     perfil?.email ?? '',
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
      nombre:    data.nombre,
      email:     data.email,
      avatarUrl: data.avatarUrl?.trim() || undefined,
    });
    setSuccess(true);
    window.setTimeout(() => setSuccess(false), 3000);
  };

  if (cargando || !perfil) {
    return (
      <div className="min-h-loading">
        <output className="spinner-border text-primary">
          <span className="visually-hidden">Cargando...</span>
        </output>
      </div>
    );
  }

  const inicialNombre = perfil.nombre.charAt(0).toUpperCase();

  return (
    <div
      className="card border-0 shadow-sm"
      style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border)' }}
    >
      {/* ── Header de sección ─────────────────────────────── */}
      <div
        style={{
          background:    'var(--color-bg-alt)',
          borderBottom:  '1px solid var(--color-border)',
          padding:       '28px 28px 56px',
          position:      'relative',
          overflow:      'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ margin: 0, color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Cuenta de usuario
          </p>
          <h3 style={{ margin: '4px 0 0', color: 'var(--color-text)', fontWeight: 800, fontSize: '1.6rem' }}>
            Editar Perfil
          </h3>
        </div>
      </div>

      {/* ── Avatar flotante ───────────────────────────────── */}
      <div style={{ padding: '0 28px', marginTop: -36 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                style={{
                  width:        84,
                  height:       84,
                  borderRadius: 'var(--radius-full)',
                  objectFit:    'cover',
                  border:       '4px solid var(--color-surface)',
                  boxShadow:    'var(--shadow-sm)',
                  background:   'var(--color-bg)',
                }}
              />
            ) : (
              <div
                style={{
                  width:          84,
                  height:         84,
                  borderRadius:   'var(--radius-full)',
                  background:     'var(--color-primary-light)',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  color:          'var(--color-primary)',
                  fontWeight:     800,
                  fontSize:       '2rem',
                  border:         '4px solid var(--color-surface)',
                  boxShadow:      'var(--shadow-sm)',
                }}
              >
                {inicialNombre}
              </div>
            )}
          </div>
          <div style={{ paddingBottom: 8 }}>
            <p style={{ margin: 0, fontWeight: 700, color: 'var(--color-text)', fontSize: '1.1rem' }}>
              {perfil.nombre}
            </p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              {perfil.email}
            </p>
          </div>
        </div>
      </div>

      {/* ── Formulario ────────────────────────────────────── */}
      <div style={{ padding: '24px 28px 28px' }}>
        {success ? (
          <div
            style={{
              background:   'var(--color-success-bg)',
              border:       '1px solid #A3D4B2',
              borderRadius: 'var(--radius-sm)',
              padding:      '12px 16px',
              marginBottom: 20,
              display:      'flex',
              alignItems:   'center',
              gap:          8,
              color:        'var(--color-success-text)',
              fontWeight:   600,
              fontSize:     '0.875rem',
            }}
            role="alert"
          >
            <i className="bi bi-check-circle-fill" />
            ¡Perfil actualizado con éxito!
          </div>
        ) : null}

        <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
          <div className="row g-3">
            {/* Nombre */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold" htmlFor="perfil-nombre" style={{ color: 'var(--color-text)', fontSize: '0.85rem' }}>
                Nombre de usuario
              </label>
              <input
                id="perfil-nombre"
                type="text"
                className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                placeholder="Tu nombre"
                {...register('nombre')}
              />
              {errors.nombre ? <div className="invalid-feedback fw-semibold">{errors.nombre.message}</div> : null}
            </div>

            {/* Email */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold" htmlFor="perfil-email" style={{ color: 'var(--color-text)', fontSize: '0.85rem' }}>
                Correo electrónico
              </label>
              <input
                id="perfil-email"
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="correo@ejemplo.com"
                {...register('email')}
              />
              {errors.email ? <div className="invalid-feedback fw-semibold">{errors.email.message}</div> : null}
            </div>

            {/* Avatar upload */}
            <div className="col-12">
              <label className="form-label fw-semibold" htmlFor="perfil-avatar" style={{ color: 'var(--color-text)', fontSize: '0.85rem' }}>
                Foto de perfil
              </label>
              <input type="hidden" {...register('avatarUrl')} />
              <input
                id="perfil-avatar"
                type="file"
                accept="image/*"
                className={`form-control ${errors.avatarUrl ? 'is-invalid' : ''}`}
                onChange={handleAvatarChange}
              />
              {errors.avatarUrl ? <div className="invalid-feedback fw-semibold">{errors.avatarUrl.message}</div> : null}
              <div className="form-text" style={{ color: 'var(--color-text-soft)', fontSize: '0.775rem' }}>
                La imagen se guarda localmente en formato base64.
              </div>
            </div>
          </div>

          {/* Botón guardar */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-100 fw-bold py-2 mt-4 d-flex align-items-center justify-content-center gap-2"
            style={{ borderRadius: 'var(--radius-full)', fontSize: '0.95rem' }}
          >
            {isSubmitting ? (
              <>
                <output className="spinner-border spinner-border-sm" aria-hidden="true" />
                Guardando...
              </>
            ) : (
              <>
                <i className="bi bi-check2-all" />{' '}Guardar cambios
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
