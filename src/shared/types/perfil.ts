import type { Id } from './id';
import type { Usuario, UsuarioPerfil } from './usuario';

export interface PerfilBase {
  id?: Id;
  usuarioId?: Id;
  saldoTotal: number;
}

export interface Perfil extends PerfilBase, Omit<UsuarioPerfil, 'id'> {
  usuario?: Usuario;
}

export type PerfilPersistido = PerfilBase & Partial<Omit<UsuarioPerfil, 'id'>>;
