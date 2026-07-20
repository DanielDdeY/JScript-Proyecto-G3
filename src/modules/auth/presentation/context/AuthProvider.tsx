import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import { authLocalRepository } from '../../infrastructure/authLocalRepository';
import type { AuthRepository, AuthSession, LoginCredentials, RegisterCredentials } from '../../domain/authRepository';

interface AuthProviderProps {
  children: ReactNode;
  repository?: AuthRepository;
}

export interface AuthContextValue {
  usuario: AuthSession | null;
  autenticado: boolean;
  cargando: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  logout: () => void;
  actualizarPassword: (newPassword: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children, repository = authLocalRepository }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<AuthSession | null>(() => repository.getSession());
  const [cargando, setCargando] = useState(false);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setCargando(true);
      try {
        const session = await repository.login(credentials);
        setUsuario(session);
      } finally {
        setCargando(false);
      }
    },
    [repository],
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      setCargando(true);
      try {
        await repository.register(credentials);
      } finally {
        setCargando(false);
      }
    },
    [repository],
  );

  const logout = useCallback(() => {
    repository.logout();
    setUsuario(null);
  }, [repository]);

  const resetPassword = useCallback(
    async (email: string, newPassword: string) => {
      setCargando(true);
      try {
        await repository.resetPassword(email, newPassword);
      } finally {
        setCargando(false);
      }
    },
    [repository],
  );

  const actualizarPassword = useCallback(
    async (newPassword: string) => {
      if (!usuario) throw new Error('No hay una sesión activa.');
      await repository.updatePassword(usuario.id, newPassword);
    },
    [repository, usuario],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      usuario,
      autenticado: Boolean(usuario),
      cargando,
      login,
      register,
      resetPassword,
      logout,
      actualizarPassword,
    }),
    [actualizarPassword, cargando, login, register, resetPassword, logout, usuario],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
