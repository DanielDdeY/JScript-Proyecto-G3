export interface Meta {
  id: string;
  nombre: string;
  montoObjetivo: number;
  montoActual: number;
  fechaLimite?: string;
  completada: boolean;
}

export type MetaAhorro = Meta;
