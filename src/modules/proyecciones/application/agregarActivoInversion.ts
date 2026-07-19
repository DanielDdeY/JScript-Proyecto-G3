import type { PortafolioInversiones } from '../../../shared/types/portafolioInversiones';
import type { InversionesRepository, NuevoActivoInversion } from '../domain/repositories/inversionesRepository';

export const agregarActivoInversion = (
  repository: InversionesRepository,
  idUsuario: string,
  activo: NuevoActivoInversion,
): Promise<PortafolioInversiones> => repository.agregarActivo(idUsuario, activo);
