import { useContext } from 'react';
import { ProyeccionesContext } from '../context/ProyeccionesProvider';

export function useProyecciones() {
  const context = useContext(ProyeccionesContext);

  if (!context) {
    throw new Error('useProyecciones debe usarse dentro de ProyeccionesProvider');
  }

  return context;
}
