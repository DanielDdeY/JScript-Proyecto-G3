import { Navigate, type RouteObject } from 'react-router-dom';
import { SaldoPage } from './pages/SaldoPage';
import { ConversionSaldoPage } from './pages/conversion-saldo-page/ConversionSaldoPage';
import { SeparacionSaldoPage } from './pages/separacion-saldo-page/SeparacionSaldoPage';

export const saldoRoutes: RouteObject = {
  path: 'saldo',
  element: <SaldoPage />,
  children: [
    { index: true, element: <Navigate to="convertir" replace /> },
    { path: 'convertir', element: <ConversionSaldoPage /> },
    { path: 'separar', element: <SeparacionSaldoPage /> },
  ],
};
