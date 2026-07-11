import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../presentation/hooks/useAuth';

export function PublicRoute() {
  const { autenticado } = useAuth();

  if (autenticado) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
}
