export interface ProgramaRecompensa {
  id: string;
  tarjetaId: string;
  tipo: 'CASHBACK' | 'MILLAS' | 'PUNTOS';
  saldoAcumulado: number;
  equivalenciaEnSoles: number; // Para mostrar cuánto valen sus puntos en dinero real
}