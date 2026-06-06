import React from 'react';

import { Outlet, Link, useLocation } from 'react-router-dom';

export const GastosPage: React.FC = () => {
  const location = useLocation();

  // Función auxiliar para resaltar de azul el botón de la sub-ruta activa
  const getButtonClass = (path: string) => {
    const isActive = location.pathname.includes(path);
    return `btn ${isActive ? 'btn-primary' : 'btn-outline-primary'} fw-semibold`;
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div className="card p-4 border-0 shadow-sm bg-white">
        <h3 className="text-dark fw-bold mb-3">Módulo de Gastos</h3>
        
        {/* Fila de Botones de Acceso */}
        <div className="d-flex flex-wrap gap-2">
          <Link to="agregar" className={getButtonClass('agregar')}>
            Agregar Gasto
          </Link>
          <Link to="listar" className={getButtonClass('listar')}>
            Historial de Gastos
          </Link>
          <Link to="configurar-presupuesto" className={getButtonClass('configurar-presupuesto')}>
            Configurar Presupuesto
          </Link>
        </div>
      </div>

      <div className="w-100">
        <Outlet />
      </div>
    </div>
  );
};