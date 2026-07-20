import { httpClient } from '../../../core/services/alovaClient';
import type { Id } from '../../../shared/types/id';
import type { PerfilPersistido } from '../../../shared/types/perfil';
import type { Usuario } from '../../../shared/types/usuario';
import type { AuthRepository, AuthSession, LoginCredentials, RegisterCredentials } from '../domain/authRepository';

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
      
      // Sincronizar el perfil singleton de db.json con el nuevo usuario logueado
      try {
        const perfil = await obtenerOpcional<PerfilPersistido>(ENDPOINTS.perfil);
        if (perfil) {
          await httpClient.patch<PerfilPersistido, Partial<PerfilPersistido>>(ENDPOINTS.perfil, {
            nombre: usuario.nombre,
            email: usuario.email,
            usuarioId: usuario.id
          });
        }
      } catch {
        // Ignorar si el perfil no existe
      }

      guardarSesion(session);
      return session;
    }

    // Por compatibilidad, intentamos iniciar sesión usando el perfil estático
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

  async register(credentials: RegisterCredentials): Promise<void> {
    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password.trim();
    const nombre = credentials.nombre.trim();

    const usuarios = await obtenerListaOpcional<Usuario>(`${ENDPOINTS.usuarios}?email=${encodeURIComponent(email)}`);
    if (usuarios.length > 0) {
      throw new Error('El correo electrónico ya está registrado.');
    }

    await httpClient.post<Usuario, Omit<Usuario, 'id'>>(ENDPOINTS.usuarios, {
      nombre,
      email,
      password,
    });
    // No iniciamos sesión automáticamente, solo registramos
  },

  logout(): void {
    limpiarSesion();
  },

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const emailLower = email.trim().toLowerCase();
    const usuarios = await obtenerListaOpcional<Usuario>(`${ENDPOINTS.usuarios}?email=${encodeURIComponent(emailLower)}`);
    const usuario = usuarios[0];
    
    if (!usuario) {
      throw new Error('No existe ninguna cuenta asociada a este correo.');
    }

    await httpClient.patch<Usuario, Partial<Usuario>>(ENDPOINTS.usuarioById(usuario.id), { password: newPassword });
  },

  async updatePassword(userId: Id, newPassword: string): Promise<void> {
    await httpClient.patch<Usuario, Partial<Usuario>>(ENDPOINTS.usuarioById(userId), { password: newPassword });
  },
};
