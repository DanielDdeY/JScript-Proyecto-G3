export interface Banco {
  id: string;
  nombre: string;
  logoUrl?: string;
  tcea: number; // Porcentaje de la Tasa de Costo Efectivo Anual (ej. 85.5)
  tiemposDePagoMeses: number[]; // Arreglo de plazos permitidos (ej. [6, 12, 24, 36])
  seguroDesgravamen: 'A' | 'B'|'C';
}