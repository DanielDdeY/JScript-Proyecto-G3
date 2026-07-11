import { Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

export function Login() {
  return (
    <main className="vizcash-login-page">
      <section className="vizcash-login-card" aria-labelledby="login-title">
        <header className="vizcash-brand-header">
          <div className="vizcash-phone-logo" aria-hidden="true">
            <div className="vizcash-phone-screen">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div>
            <h1 className="vizcash-brand-title">Vizcash</h1>
            <p className="vizcash-brand-subtitle">Nacional</p>
          </div>
        </header>

        <h2 id="login-title" className="vizcash-login-title">
          Inicia sesión
        </h2>

        <LoginForm />

        <p className="vizcash-register-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </section>
    </main>
  );
}
