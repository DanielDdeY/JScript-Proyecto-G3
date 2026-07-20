import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';

export function Register() {
  return (
    <main className="vizcash-register-page">
      {/* ── Panel Izquierdo/Derecho (Brand / Hero) ────────────────────── */}
      <section className="vizcash-login-hero">
        <div className="vizcash-blob-1" />
        <div className="vizcash-blob-2" />
        
        <div className="vizcash-hero-content">
          <span className="vizcash-hero-badge">✦ Únete a Vizcash</span>
          <h1 className="vizcash-hero-title">
            Comienza tu viaje<br />
            hacia el éxito.
          </h1>
          <p className="vizcash-hero-subtitle">
            Crea tu cuenta gratuita y toma el control total de tus finanzas en minutos. ¡Es rápido y seguro!
          </p>
        </div>
      </section>

      {/* ── Panel Formulario ────────────────────────── */}
      <section className="vizcash-login-form-container" aria-labelledby="register-title">
        <div className="vizcash-login-card">
          <header className="vizcash-brand-header">
            <div className="vizcash-brand-icon" aria-hidden="true">
              <i className="bi bi-wallet2" />
            </div>
            <h2 className="vizcash-brand-title">Vizcash</h2>
          </header>

          <h2 id="register-title" className="vizcash-login-title">
            Crea tu cuenta
          </h2>
          <p className="vizcash-login-subtitle">
            Ingresa tus datos para empezar a gestionar tu dinero.
          </p>

          <RegisterForm />

          <p className="vizcash-register-link">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
