import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export const PerfilPage: React.FC = () => {
  const location = useLocation();

  const getButtonClass = (path: string) => {
    const isActive = location.pathname.includes(path);
    return `btn ${isActive ? 'btn-primary' : 'btn-outline-primary'} fw-semibold`;
  };

  return (
    <div className="d-flex flex-column gap-4">

      <div className="card p-4 border-0 shadow-sm bg-white">
        <h3 className="text-dark fw-bold mb-3">Edita tu perfil</h3>
        
        <div className="d-flex flex-wrap gap-2">
          <Link to="editar" className={getButtonClass('editar')}>
            Editar Perfil
          </Link>
          <Link to="cambiar" className={getButtonClass('cambiar')}>
            Cambiar contraseña 
          </Link>
        </div>
      </div>

      <div className="w-100">
        <Outlet />
      </div>
    </div>
  );
};