export interface AmigoDeudor {
  nombreId: string; // Puede ser el nombre o el ID del contacto
  montoDeuda: number;
  estado: 'PENDIENTE' | 'PAGADO';
}