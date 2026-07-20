import type { Gasto } from '../../../../shared/types/gasto';
import type { Ingreso } from '../../../../shared/types/ingreso';
import type { MetaAhorro } from '../../../../shared/types/meta';
import type { Perfil } from '../../../../shared/types/perfil';
import type { PortafolioInversiones } from '../../../../shared/types/portafolioInversiones';
import type { Prestamo } from '../../../../shared/types/prestamo';
import type { Tarjeta } from '../../../../shared/types/tarjeta';

export interface ProyeccionFiltros {
  mes: number;
  anio: number;
}

export interface DatosProyeccion {
  perfil: Perfil | null;
  ingresos: Ingreso[];
  gastos: Gasto[];
  prestamos: Prestamo[];
  tarjetas: Tarjeta[];
  inversiones: PortafolioInversiones[];
  metas: MetaAhorro[];
}

export interface MovimientoProyectado {
  id: string;
  descripcion: string;
  tipo: 'INGRESO' | 'GASTO';
  montoBase: number;
  factorAplicado: number;
  montoProyectado: number;
  regla: string;
}

export interface ObligacionProyectada {
  id: string;
  descripcion: string;
  tipo: 'PRESTAMO' | 'TARJETA_CREDITO';
  montoProyectado: number;
  cuotasContadas: number;
  cuotasDisponibles: number;
}

export interface InversionProyectada {
  id: string;
  activo: string;
  valorActual: number;
  porcentajeMensual: number;
  gananciaOPerdida: number;
  valorProyectado: number;
}

export interface MetaProyectada {
  id: string;
  nombre: string;
  montoObjetivo: number;
  montoActual: number;
  cumplida: boolean;
  fechaCumplimientoEstimada?: string;
  mensaje: string;
}

export interface ProyeccionDesglose {
  saldoActual: number;
  totalIngresos: number;
  totalGastos: number;
  totalPrestamos: number;
  totalTarjetasCredito: number;
  totalGananciaInversiones: number;
  movimientosIngresos: MovimientoProyectado[];
  movimientosGastos: MovimientoProyectado[];
  obligaciones: ObligacionProyectada[];
  inversiones: InversionProyectada[];
}

export interface ProyeccionMensualPunto {
  periodo: string;
  saldoProyectado: number;
}

export interface ResultadoProyeccion {
  tiempo: string;
  monto: number;
  porcentaje: string;
  fechaObjetivo: string;
  mesesProyectados: number;
  desglose: ProyeccionDesglose;
  metas: MetaProyectada[];
  lineaTiempo: ProyeccionMensualPunto[];
}
