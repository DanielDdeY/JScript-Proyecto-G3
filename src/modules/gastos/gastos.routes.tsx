import { Navigate } from 'react-router-dom';
import type {RouteObject} from 'react-router-dom';
import { GastosPage } from './pages/GastosPage';
import { AgregarGastoPage } from './pages/agregar-gasto-page/AgregarGastoPage';
import { ListarGastoPage } from './pages/listar-gasto-page/ListarGastoPage';
import { ConfigurarPresupuestoPage } from './pages/configurar-presupuesto-page/ConfigurarPresupuestoPage';

export const gastosRoutes: RouteObject = {
  path: 'gastos',
  element: <GastosPage />,
  children: [
    { path: 'agregar', element: <AgregarGastoPage /> },
    { path: 'listar', element: <ListarGastoPage /> },
    { path: 'configurar-presupuesto', element: <ConfigurarPresupuestoPage /> },
    { path: '', element: <Navigate to="listar" replace /> }
  ]
};