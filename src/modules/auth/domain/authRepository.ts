import type { Id } from '../../../shared/types/id';
import type { UsuarioPerfil } from '../../../shared/types/usuario';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthSession extends UsuarioPerfil {
  id: Id;
}

export interface AuthRepository {
  getSession(): AuthSession | null;
  login(credentials: LoginCredentials): Promise<AuthSession>;
  logout(): void;
  updatePassword(userId: Id, newPassword: string): Promise<void>;
}
