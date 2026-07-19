import type { MetaAhorro } from '../../../../shared/types/meta';

export type NuevaMetaAhorro = Omit<MetaAhorro, 'id' | 'completada'> & {
  completada?: boolean;
};

export interface MetasRepository {
  listarMetas(): Promise<MetaAhorro[]>;
  crearMeta(meta: NuevaMetaAhorro): Promise<MetaAhorro>;
  actualizarMeta(meta: MetaAhorro): Promise<MetaAhorro>;
  eliminarMeta(id: string): Promise<void>;
}
