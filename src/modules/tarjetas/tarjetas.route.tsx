import { Navigate, type RouteObject } from 'react-router-dom';
import { TarjetaPage } from './pages/TarjetaPage';
import { AgregarTarjetaPage } from './pages/agregar-tarjeta-page/AgregarTarjetaPage';
import { ListarTarjetaPage } from './pages/listar-tarjeta-page/ListarTarjetaPage';

export const tarjetasRoutes: RouteObject = {
  path: 'tarjetas',
  element: <TarjetaPage />,
  children: [
    { index: true, element: <Navigate to="listar" replace /> },
    { path: 'agregar', element: <AgregarTarjetaPage /> },
    { path: 'listar', element: <ListarTarjetaPage /> },
  ],
};
