export interface Gasto {
  id: string;
  monto: number;
  fecha: string; 
  tarjetaId: string; 
  descripcion?: string;
}