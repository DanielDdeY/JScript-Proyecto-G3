export interface Reincidencia {
  esMensual: boolean;
  esAnual: boolean;
  esRecurrente: boolean;
  esProbable: boolean;
  esUnico: boolean;
}

export type TipoReincidencia = keyof Reincidencia;

export const reincidenciaUnica: Reincidencia = {
  esMensual: false,
  esAnual: false,
  esRecurrente: false,
  esProbable: false,
  esUnico: true,
};

export const crearReincidencia = (tipo: TipoReincidencia): Reincidencia => ({
  esMensual: tipo === 'esMensual',
  esAnual: tipo === 'esAnual',
  esRecurrente: tipo === 'esRecurrente',
  esProbable: tipo === 'esProbable',
  esUnico: tipo === 'esUnico',
});
