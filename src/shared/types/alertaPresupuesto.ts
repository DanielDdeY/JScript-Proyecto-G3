export interface AlertaPresupuesto {
  tipo: 'PELIGRO' | 'ADVERTENCIA';
  mensaje: string;
  fechaEmision: string;
}