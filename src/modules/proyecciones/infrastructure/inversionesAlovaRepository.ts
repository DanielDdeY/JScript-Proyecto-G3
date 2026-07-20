import { httpClient } from '../../../core/services/alovaClient';
import type { ActivoInversion } from '../../../shared/types/activoInversion';
import type { PortafolioInversiones } from '../../../shared/types/portafolioInversiones';
import { calcularRiesgoPortafolio } from '../domain/services/inversionService';
import type { InversionesRepository, NuevoActivoInversion } from '../domain/repositories/inversionesRepository';

const ENDPOINTS = {
  inversiones: '/inversiones',
  portafolioById: (id: string) => `/inversiones/${id}`,
} as const;

const generarId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const normalizarPortafolio = (portafolio: PortafolioInversiones): PortafolioInversiones => {
  const portafolioConId = {
    ...portafolio,
    id: portafolio.id ?? `portafolio-${portafolio.idUsuario}`,
    activos: portafolio.activos ?? [],
  };

  return {
    ...portafolioConId,
    riesgo: calcularRiesgoPortafolio(portafolioConId),
  };
};

const construirActivo = (activo: NuevoActivoInversion): ActivoInversion => ({
  ...activo,
  id: generarId('inv'),
  historial: activo.historial ?? [],
});

const listarPortafolios = async (): Promise<PortafolioInversiones[]> => {
  const portafolios = await httpClient.get<PortafolioInversiones[]>(ENDPOINTS.inversiones);
  return portafolios.map(normalizarPortafolio);
};

export const inversionesAlovaRepository: InversionesRepository = {
  listarPortafolios,

  async agregarActivo(idUsuario: string, activo: NuevoActivoInversion): Promise<PortafolioInversiones> {
    const portafolios = await listarPortafolios();
    const activoNuevo = construirActivo(activo);
    const portafolioExistente = portafolios.find((portafolio) => portafolio.idUsuario === idUsuario);

    if (!portafolioExistente) {
      const nuevoPortafolio: PortafolioInversiones = normalizarPortafolio({
        id: `portafolio-${idUsuario}`,
        idUsuario,
        riesgo: 'BAJO',
        activos: [activoNuevo],
      });

      return httpClient.post<PortafolioInversiones, PortafolioInversiones>(ENDPOINTS.inversiones, nuevoPortafolio);
    }

    const portafolioActualizado = normalizarPortafolio({
      ...portafolioExistente,
      activos: [...portafolioExistente.activos, activoNuevo],
    });

    return httpClient.put<PortafolioInversiones, PortafolioInversiones>(
      ENDPOINTS.portafolioById(String(portafolioActualizado.id)),
      portafolioActualizado,
    );
  },
};
