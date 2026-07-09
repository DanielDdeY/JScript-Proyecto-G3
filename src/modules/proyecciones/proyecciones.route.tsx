import { Navigate, type RouteObject } from 'react-router-dom';
import { ProyeccionesPage } from './pages/ProyeccionesPage';
import { AgregarMetasPage } from './pages/agregar-metas-page/AgregarMetasPage';
import { AnualProyeccionPage } from './pages/anual-proyeccion-page/AnualProyeccionPage';
import { ListarMetasPage } from './pages/listar-metas-page/ListarMetasPage';
import { MensualProyeccionPage } from './pages/mensual-proyeccion-page/MensualProyeccionPage';

export const proyeccionesRoutes: RouteObject = {
  path: 'proyecciones',
  element: <ProyeccionesPage />,
  children: [
    { index: true, element: <Navigate to="listar" replace /> },
    { path: 'agregar', element: <AgregarMetasPage /> },
    { path: 'anual', element: <AnualProyeccionPage /> },
    { path: 'listar', element: <ListarMetasPage /> },
    { path: 'mensual', element: <MensualProyeccionPage /> },
  ],
};
