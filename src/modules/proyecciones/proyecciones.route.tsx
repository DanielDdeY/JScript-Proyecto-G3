import { Navigate, type RouteObject } from 'react-router-dom';
import { ProyeccionesPage } from './pages/ProyeccionesPage';
import { AgregarMetasPage } from './pages/agregar-metas-page/AgregarMetasPage';
import { Inversiones } from './pages/inversiones-page/Inversiones';
import { ListarMetasPage } from './pages/listar-metas-page/ListarMetasPage';
import { Prestamos } from './pages/prestamos-page/Prestamos';
import { Proyecciones } from './pages/proyecciones-page/Proyecciones';

export const proyeccionesRoutes: RouteObject = {
  path: 'proyecciones',
  element: <ProyeccionesPage />,
  children: [
    { index: true, element: <Navigate to="listar" replace /> },
    { path: 'agregar', element: <AgregarMetasPage /> },
    { path: 'inversiones', element: <Inversiones /> },
    { path: 'listar', element: <ListarMetasPage /> },
    { path: 'prestamos', element: <Prestamos /> },
    { path: 'proyecciones', element: <Proyecciones /> },
  ],
};
