import { Navigate, type RouteObject } from 'react-router-dom';
import { GastosPage } from './pages/GastosPage';
import { AgregarGastoPage } from './pages/agregar-gasto-page/AgregarGastoPage';
import { ConfigurarPresupuestoPage } from './pages/configurar-presupuesto-page/ConfigurarPresupuestoPage';
import { ListarGastoPage } from './pages/listar-gasto-page/ListarGastoPage';

export const gastosRoutes: RouteObject = {
  path: 'gastos',
  element: <GastosPage />,
  children: [
    { index: true, element: <Navigate to="listar" replace /> },
    { path: 'listar', element: <ListarGastoPage /> },
    { path: 'agregar', element: <AgregarGastoPage /> },
    { path: 'configurar-presupuesto', element: <ConfigurarPresupuestoPage /> },
    { path: 'presupuesto', element: <Navigate to="../configurar-presupuesto" replace /> },
  ],
};
