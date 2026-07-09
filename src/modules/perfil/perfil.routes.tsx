import { Navigate, type RouteObject } from 'react-router-dom';
import { PerfilPage } from './pages/PerfilPage';
import { EditarPerfilPage } from './pages/editar-perfil-page/EditarPerfilPage';
import { SeguridadPerfilPage } from './pages/seguridad-perfil-page/SeguridadPerfilPage';

export const perfilRoutes: RouteObject = {
  path: 'perfil',
  element: <PerfilPage />,
  children: [
    { index: true, element: <Navigate to="editar" replace /> },
    { path: 'editar', element: <EditarPerfilPage /> },
    { path: 'seguridad', element: <SeguridadPerfilPage /> },
    { path: 'cambiar', element: <Navigate to="../seguridad" replace /> },
  ],
};
