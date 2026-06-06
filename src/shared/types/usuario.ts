export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  avatarUrl?: string;
  fechaCreacion: string;
  notificaciones: boolean;
}