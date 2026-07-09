import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';

export function Register() {
  return (
    <div className="container py-5" style={{ maxWidth: '420px' }}>
      <h3 className="mb-4">Registro</h3>
      <RegisterForm />
      <p className="text-muted small mt-3">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}
