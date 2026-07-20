import type { PortafolioInversiones } from '../../../shared/types/portafolioInversiones';
import type { InversionesRepository } from '../domain/repositories/inversionesRepository';

export const listarInversiones = (repository: InversionesRepository): Promise<PortafolioInversiones[]> =>
  repository.listarPortafolios();
