import type { ActivoInversion } from '../../../../shared/types/activoInversion';
import type { PortafolioInversiones } from '../../../../shared/types/portafolioInversiones';

export type NuevoActivoInversion = Omit<ActivoInversion, 'id'>;

export interface InversionesRepository {
  listarPortafolios(): Promise<PortafolioInversiones[]>;
  agregarActivo(idUsuario: string, activo: NuevoActivoInversion): Promise<PortafolioInversiones>;
}
