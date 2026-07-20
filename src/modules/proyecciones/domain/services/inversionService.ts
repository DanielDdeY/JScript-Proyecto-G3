import type { ActivoInversion } from '../../../../shared/types/activoInversion';
import type { PortafolioInversiones } from '../../../../shared/types/portafolioInversiones';
import type { RendimientoHistorico } from '../../../../shared/types/rendimientoHistorico';

export type RiesgoCalculado = 'BAJO' | 'MEDIO' | 'ALTO';

export const obtenerUltimoRendimiento = (historial: RendimientoHistorico[]): number => {
  const ultimo = [...historial].sort((a, b) => a.fecha.localeCompare(b.fecha)).at(-1);
  return ultimo?.porcentajeGanancia ?? 0;
};

export const calcularRiesgoPorcentaje = (porcentaje: number): RiesgoCalculado => {
  if (porcentaje < 10) return 'BAJO';
  if (porcentaje <= 25) return 'MEDIO';
  return 'ALTO';
};

export const calcularRiesgoPortafolio = (portafolio: PortafolioInversiones): RiesgoCalculado => {
  if (portafolio.activos.length === 0) return 'BAJO';
  const promedioRendimiento =
    portafolio.activos.reduce((total, activo) => total + obtenerUltimoRendimiento(activo.historial), 0) /
    portafolio.activos.length;
  return calcularRiesgoPorcentaje(promedioRendimiento);
};

export const calcularGananciaActiva = (activo: ActivoInversion): number =>
  activo.valorActual - activo.capitalInvertido;

export const calcularPorcentajeGananciaActiva = (activo: ActivoInversion): number => {
  if (!activo.capitalInvertido) return 0;
  return (calcularGananciaActiva(activo) / activo.capitalInvertido) * 100;
};

export const calcularTotalesPortafolio = (portafolio: PortafolioInversiones) => {
  const capitalInvertido = portafolio.activos.reduce((total, activo) => total + activo.capitalInvertido, 0);
  const valorActual = portafolio.activos.reduce((total, activo) => total + activo.valorActual, 0);
  return {
    capitalInvertido,
    valorActual,
    gananciaNeta: valorActual - capitalInvertido,
  };
};
