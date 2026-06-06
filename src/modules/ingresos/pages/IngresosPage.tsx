import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export const IngresosPage: React.FC = () => {
  const location = useLocation();

  const getButtonClass = (path: string) => {
    const isActive = location.pathname.includes(path);
    return `btn ${isActive ? 'btn-primary' : 'btn-outline-primary'} fw-semibold`;
  };

  return (
    <div className="d-flex flex-column gap-4">

      <div className="card p-4 border-0 shadow-sm bg-white">
        <h3 className="text-dark fw-bold mb-3">Módulo de Ingresos</h3>
        
        {/* Fila de Botones de Acceso */}
        <div className="d-flex flex-wrap gap-2">
          <Link to="agregar" className={getButtonClass('agregar')}>
            Agregar Ingreso
          </Link>
          <Link to="listar" className={getButtonClass('listar')}>
            Listar Ingresos
          </Link>
        </div>
      </div>

      <div className="w-100">
        <Outlet />
      </div>
    </div>
  );
};