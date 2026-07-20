import type { FiltrosIngresos } from '../../../../shared/types/filtros';
import type { Ingreso } from '../../../../shared/types/ingreso';
import type { PaginatedResponse } from '../../../../shared/types/paginatedResponse';
import { paginacionService, type PaginacionParams } from '../../../../shared/services/paginacionService';

const estaDentroDelRango = (fecha: string, inicio?: string, fin?: string) => {
  if (inicio && fecha < inicio) return false;
  if (fin && fecha > fin) return false;
  return true;
};

export const ingresoPaginationService = {
  filtrar(ingresos: Ingreso[], filtros: FiltrosIngresos): Ingreso[] {
    return ingresos
      .filter((ingreso) => estaDentroDelRango(ingreso.fecha, filtros.rangoFecha.inicio, filtros.rangoFecha.fin))
      .filter((ingreso) => !filtros.fuente || filtros.fuente === 'TODAS' || ingreso.fuente === filtros.fuente)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  },

  paginar(ingresos: Ingreso[], filtros: FiltrosIngresos, paginacion: PaginacionParams): PaginatedResponse<Ingreso> {
    return paginacionService.paginar(this.filtrar(ingresos, filtros), paginacion);
  },
};
