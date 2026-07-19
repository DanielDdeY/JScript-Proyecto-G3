import type { Reincidencia } from '../types/reincidencia';

const ETIQUETAS: Array<[keyof Reincidencia, string]> = [
  ['esMensual', 'Mensual'],
  ['esAnual', 'Anual'],
  ['esRecurrente', 'Recurrente'],
  ['esProbable', 'Probable'],
  ['esUnico', 'Único'],
];

export const obtenerEtiquetasReincidencia = (reincidencia?: Partial<Reincidencia>): string[] => {
  if (!reincidencia) return ['Sin definir'];

  const etiquetas = ETIQUETAS.filter(([clave]) => Boolean(reincidencia[clave])).map(([, etiqueta]) => etiqueta);
  return etiquetas.length > 0 ? etiquetas : ['Sin definir'];
};
