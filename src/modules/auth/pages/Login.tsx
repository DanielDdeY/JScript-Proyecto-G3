import { Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

export function Login() {
  return (
    <div className="container py-5" style={{ maxWidth: '420px' }}>
      <h3 className="mb-4">Login</h3>
      <LoginForm />
      <p className="text-muted small mt-3">
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </div>
  );
}
