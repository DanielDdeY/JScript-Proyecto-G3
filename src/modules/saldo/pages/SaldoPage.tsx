import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export const SaldoPage: React.FC = () => {
  const location = useLocation();

  const getButtonClass = (path: string) => {
    const isActive = location.pathname.includes(path);
    return `btn ${isActive ? 'btn-primary' : 'btn-outline-primary'} fw-semibold`;
  };

  return (
    <div className="d-flex flex-column gap-4">

      <div className="card p-4 border-0 shadow-sm bg-white">
        <h3 className="text-dark fw-bold mb-3">Proyecciones a futuro</h3>
        
        <div className="d-flex flex-wrap gap-2">
          <Link to="convertir" className={getButtonClass('agregar')}>
            Convertir la plata
          </Link>
          <Link to="separar" className={getButtonClass('listar')}>
            Separar para que no se use 
          </Link>
        </div>
      </div>

      <div className="w-100">
        <Outlet />
      </div>
    </div>
  );
};