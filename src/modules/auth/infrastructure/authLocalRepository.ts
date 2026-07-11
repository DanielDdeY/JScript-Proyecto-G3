import { httpClient } from '../../../core/services/alovaClient';
import type { Id } from '../../../shared/types/id';
import type { PerfilPersistido } from '../../../shared/types/perfil';
import type { Usuario } from '../../../shared/types/usuario';
import type { AuthRepository, AuthSession, LoginCredentials } from '../domain/authRepository';

const AUTH_STORAGE_KEY = 'vizcash.auth.session';

const ENDPOINTS = {
  perfil: '/perfil',
  usuarios: '/usuarios',
  usuarioById: (id: Id) => `/usuarios/${id}`,
} as const;

const obtenerListaOpcional = async <TItem>(endpoint: string): Promise<TItem[]> => {
  try {
    return await httpClient.get<TItem[]>(endpoint);
  } catch {
    return [];
  }
};

const obtenerOpcional = async <TItem>(endpoint: string): Promise<TItem | null> => {
  try {
    return await httpClient.get<TItem>(endpoint);
  } catch {
    return null;
  }
};

const toSession = (usuario: Usuario): AuthSession => ({
  id: usuario.id,
  nombre: usuario.nombre,
  email: usuario.email,
  avatarUrl: usuario.avatarUrl,
});

const guardarSesion = (session: AuthSession) => {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

const limpiarSesion = () => {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const authLocalRepository: AuthRepository = {
  getSession(): AuthSession | null {
    try {
      const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);
      return rawSession ? (JSON.parse(rawSession) as AuthSession) : null;
    } catch {
      limpiarSesion();
      return null;
    }
  },

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password.trim();

    const usuarios = await obtenerListaOpcional<Usuario>(`${ENDPOINTS.usuarios}?email=${encodeURIComponent(email)}`);
    const usuario = usuarios[0];

    if (usuario) {
      if (usuario.password && usuario.password !== password) {
        throw new Error('Correo o contraseña incorrectos.');
      }

      const session = toSession(usuario);
      guardarSesion(session);
      return session;
    }

    const perfil = await obtenerOpcional<PerfilPersistido>(ENDPOINTS.perfil);
    if (perfil?.email?.toLowerCase() === email && password.length > 0) {
      const session: AuthSession = {
        id: perfil.usuarioId ?? perfil.id ?? 'perfil-local',
        nombre: perfil.nombre ?? 'Usuario',
        email: perfil.email,
        avatarUrl: perfil.avatarUrl,
      };
      guardarSesion(session);
      return session;
    }

    throw new Error('Correo o contraseña incorrectos.');
  },

  logout(): void {
    limpiarSesion();
  },

  async updatePassword(userId: Id, newPassword: string): Promise<void> {
    await httpClient.patch<Usuario, Partial<Usuario>>(ENDPOINTS.usuarioById(userId), { password: newPassword });
  },
};
