import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Dashboard } from '../../modules/dashboard/pages/Dashboard';
import { gastosRoutes } from '../../modules/gastos/gastos.routes';
import { Home } from '../../modules/home/pages/Home';
import { ingresosRoutes } from '../../modules/ingresos/ingresos.routes';
import { perfilRoutes } from '../../modules/perfil/perfil.routes';
import { proyeccionesRoutes } from '../../modules/proyecciones/proyecciones.route';
import { saldoRoutes } from '../../modules/saldo/saldo.routes';
import { tarjetasRoutes } from '../../modules/tarjetas/tarjetas.route';
import { Login } from '../../modules/auth/pages/Login';
import { Register } from '../../modules/auth/pages/Register';
import { DashboardLayout } from '../../shared/layouts/DashboardLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/app',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      saldoRoutes,
      gastosRoutes,
      ingresosRoutes,
      tarjetasRoutes,
      proyeccionesRoutes,
      perfilRoutes,
    ],
  },
  {
    path: '*',
    element: (
      <div className="container py-5 text-center">
        <h3>404 - Página no encontrada</h3>
      </div>
    ),
  },
]);
