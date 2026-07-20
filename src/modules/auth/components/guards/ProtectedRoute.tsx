import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../presentation/hooks/useAuth';

export function ProtectedRoute() {
  const { autenticado, cargando } = useAuth();
  const location = useLocation();

  if (cargando) {
    return (
      <div className="d-flex min-vh-100 align-items-center justify-content-center">
        <output className="spinner-border text-primary">
          <span className="visually-hidden">Cargando...</span>
        </output>
      </div>
    );
  }

  if (!autenticado) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
