export type ImportanciaGasto = 'Alta' | 'Media' | 'Baja';

export interface GastoCategoria {
  nombre: string;
  importancia: ImportanciaGasto;
}
