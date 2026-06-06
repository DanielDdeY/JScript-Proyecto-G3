import { Navigate } from 'react-router-dom';
import type {RouteObject} from 'react-router-dom';
import { IngresosPage } from './pages/IngresosPage';
import { AgregarIngresoPage } from './pages/agregar-ingreso-page/AgregarIngresoPage';
import { ListarIngresoPage } from './pages/listar-ingreso-page/ListarIngresoPage';


export const ingresosRoutes: RouteObject = {
  path: 'ingresos',
  element: <IngresosPage />,
  children: [
    { path: 'agregar', element: <AgregarIngresoPage /> },
    { path: 'listar', element: <ListarIngresoPage /> },
    { path: '', element: <Navigate to="listar" replace /> }
  ]
};