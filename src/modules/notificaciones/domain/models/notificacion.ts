export type TipoNotificacion = 'PRESUPUESTO' | 'TARJETA' | 'PRESTAMO';
export type NivelNotificacion = 'INFO' | 'ADVERTENCIA' | 'PELIGRO';

export interface Notificacion {
  id: string;
  tipo: TipoNotificacion;
  nivel: NivelNotificacion;
  titulo: string;
  mensaje: string;
  fecha: string;
  enlace?: string;
}
