import type { Id } from './id';

export interface Usuario {
  id: Id;
  nombre: string;
  email: string;
  avatarUrl?: string;
  password?: string;
  fechaCreacion?: string;
  notificaciones?: boolean;
}

export type UsuarioPerfil = Pick<Usuario, 'id' | 'nombre' | 'email' | 'avatarUrl'>;
