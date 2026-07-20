import { Link } from 'react-router-dom';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';

export function ForgotPassword() {
  return (
    <main className="vizcash-login-page">
      {/* ── Panel Izquierdo (Brand / Hero) ────────────────────── */}
      <section className="vizcash-login-hero">
        <div className="vizcash-blob-1" />
        <div className="vizcash-blob-2" />
        
        <div className="vizcash-hero-content">
          <span className="vizcash-hero-badge">✦ Seguridad Vizcash</span>
          <h1 className="vizcash-hero-title">
            Recupera tu acceso<br />
            rápidamente.
          </h1>
          <p className="vizcash-hero-subtitle">
            Restablece tu contraseña de forma segura y continúa administrando tus finanzas sin interrupciones.
          </p>
        </div>
      </section>

      {/* ── Panel Derecho (Formulario) ────────────────────────── */}
      <section className="vizcash-login-form-container" aria-labelledby="fp-title">
        <div className="vizcash-login-card vizcash-slide-in-right">
          <header className="vizcash-brand-header">
            <div className="vizcash-brand-icon" aria-hidden="true">
              <i className="bi bi-shield-lock" />
            </div>
            <h2 className="vizcash-brand-title">Vizcash</h2>
          </header>

          <h2 id="fp-title" className="vizcash-login-title">
            Restablecer Contraseña
          </h2>
          <p className="vizcash-login-subtitle">
            Ingresa tu correo y una nueva contraseña.
          </p>

          <ForgotPasswordForm />

          <p className="vizcash-register-link">
            ¿Recordaste tu contraseña? <Link to="/login">Volver al inicio de sesión</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
