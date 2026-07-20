import { Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

export function Login() {
  return (
    <main className="vizcash-login-page">
      {/* ── Panel Izquierdo (Brand / Hero) ────────────────────── */}
      <section className="vizcash-login-hero">
        <div className="vizcash-blob-1" />
        <div className="vizcash-blob-2" />
        
        <div className="vizcash-hero-content">
          <span className="vizcash-hero-badge">✦ Plataforma Nacional</span>
          <h1 className="vizcash-hero-title">
            Tu mundo financiero,<br />
            simplificado.
          </h1>
          <p className="vizcash-hero-subtitle">
            Controla tus gastos, planifica tus presupuestos y alcanza la libertad financiera con Vizcash. Todo en un solo lugar.
          </p>
        </div>
      </section>

      {/* ── Panel Derecho (Formulario) ────────────────────────── */}
      <section className="vizcash-login-form-container" aria-labelledby="login-title">
        <div className="vizcash-login-card">
          <header className="vizcash-brand-header">
            <div className="vizcash-brand-icon" aria-hidden="true">
              <i className="bi bi-wallet2" />
            </div>
            <h2 className="vizcash-brand-title">Vizcash</h2>
          </header>

          <h2 id="login-title" className="vizcash-login-title">
            ¡Hola de nuevo!
          </h2>
          <p className="vizcash-login-subtitle">
            Por favor, ingresa tus credenciales para continuar.
          </p>

          <LoginForm />

          <div className="d-flex flex-column align-items-center gap-2 mt-4">
            <p className="vizcash-register-link m-0">
              ¿Olvidaste tu contraseña? <Link to="/forgot-password">Recupérala aquí</Link>
            </p>
            <p className="vizcash-register-link m-0">
              ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
