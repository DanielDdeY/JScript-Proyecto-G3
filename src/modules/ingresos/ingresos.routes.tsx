import { Navigate, type RouteObject } from 'react-router-dom';
import { IngresosPage } from './pages/IngresosPage';
import { AgregarIngresoPage } from './pages/agregar-ingreso-page/AgregarIngresoPage';
import { ListarIngresoPage } from './pages/listar-ingreso-page/ListarIngresoPage';

export const ingresosRoutes: RouteObject = {
  path: 'ingresos',
  element: <IngresosPage />,
  children: [
    { index: true, element: <Navigate to="listar" replace /> },
    { path: 'agregar', element: <AgregarIngresoPage /> },
    { path: 'listar', element: <ListarIngresoPage /> },
  ],
};
