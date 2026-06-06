import { Navigate } from 'react-router-dom';
import type {RouteObject} from 'react-router-dom';
import { PerfilPage } from './pages/PerfilPage';
import { EditarPerfilPage } from './pages/editar-perfil-page/EditarPerfilPage';
import { SeguridadPerfilPage } from './pages/seguridad-perfil-page/SeguridadPerfilPage';


export const perfilRoutes: RouteObject = {
  path: 'perfil',
  element: <PerfilPage />,
  children: [
    { path: 'editar', element: <EditarPerfilPage /> },
    { path: 'cambiar', element: <SeguridadPerfilPage /> },
    { path: '', element: <Navigate to="editar" replace /> }
  ]
};