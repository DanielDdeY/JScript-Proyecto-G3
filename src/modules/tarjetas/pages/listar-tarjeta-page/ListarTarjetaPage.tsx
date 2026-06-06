import React from 'react';

export const ListarTarjetaPage: React.FC = () => {
  return (
    <div className="card p-4 border-0 shadow-sm bg-white animate__animated animate__fadeIn">
      <h4 className="text-dark fw-bold mb-2">Lista ordenada de Tarjetas</h4>
      <p className="text-success fw-semibold">¡Funciona correctamente!</p>
      <span className="text-muted small">Se muestran las tarjestas y aplicara filtros</span>
    </div>
  );
};