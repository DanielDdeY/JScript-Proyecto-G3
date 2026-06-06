import { Navigate } from 'react-router-dom';
import type {RouteObject} from 'react-router-dom';
import { SaldoPage } from './pages/SaldoPage';
import { ConversionSaldoPage } from './pages/conversion-saldo-page/ConversionSaldoPage';
import { SeparacionSaldoPage } from './pages/separacion-saldo-page/SeparacionSaldoPage';


export const saldolRoutes: RouteObject = {
  path: 'saldo',
  element: <SaldoPage />,
  children: [
    { path: 'convertir', element: <ConversionSaldoPage /> },
    { path: 'separar', element: <SeparacionSaldoPage /> },
    { path: '', element: <Navigate to="" replace /> }
  ]
};