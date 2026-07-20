import type { Id } from '../../../shared/types/id';
import type { UsuarioPerfil } from '../../../shared/types/usuario';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  nombre: string;
  email: string;
  password: string;
}

export interface AuthSession extends UsuarioPerfil {
  id: Id;
}

export interface AuthRepository {
  getSession(): AuthSession | null;
  login(credentials: LoginCredentials): Promise<AuthSession>;
  register(credentials: RegisterCredentials): Promise<void>;
  resetPassword(email: string, newPassword: string): Promise<void>;
  logout(): void;
  updatePassword(userId: Id, newPassword: string): Promise<void>;
}
