import { useContext } from 'react';
import { NotificacionesContext } from '../context/NotificacionesProvider';

export function useNotificaciones() {
  const context = useContext(NotificacionesContext);

  if (!context) {
    throw new Error('useNotificaciones debe usarse dentro de NotificacionesProvider');
  }

  return context;
}
