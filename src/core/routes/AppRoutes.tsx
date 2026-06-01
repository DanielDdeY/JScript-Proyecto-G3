import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../../shared/layouts/DashboardLayout';
import { Home } from '../../modules/home/pages/Home';
import { Login } from '../../modules/auth/pages/Login';
import { Dashboard } from '../../modules/dashboard/pages/Dashboard';
import { SaldoPage } from '../../modules/saldo/pages/SaldoPage';
import { GastosPage } from '../../modules/gastos/pages/GastosPage';
import { IngresosPage } from '../../modules/ingresos/pages/IngresosPage';
import { ProyeccionesPage } from '../../modules/proyecciones/pages/ProyeccionesPage';
import { PerfilPage } from '../../modules/perfil/pages/PerfilPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/app',
        element: <DashboardLayout />, // Layout contenedor privado
        children: [
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'saldo', element: <SaldoPage /> },
            { path: 'gastos', element: <GastosPage /> },
            { path: 'ingresos', element: <IngresosPage /> },
            { path: 'proyecciones', element: <ProyeccionesPage /> },
            { path: 'perfil', element: <PerfilPage /> },
            { path: '', element: <Navigate to="dashboard" replace /> }
]
},
{
    path: '*',
        element: <div className="text-center mt-5"><h3>404 - Página no encontrada</h3></div>
}
]);