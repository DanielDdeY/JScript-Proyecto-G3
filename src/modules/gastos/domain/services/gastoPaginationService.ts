import type { FiltrosWallet } from '../../../../shared/types/filtros';
import type { Gasto } from '../../../../shared/types/gasto';
import type { PaginatedResponse } from '../../../../shared/types/paginatedResponse';
import { paginacionService, type PaginacionParams } from '../../../../shared/services/paginacionService';

const estaDentroDelRango = (fecha: string, inicio?: string, fin?: string) => {
  if (inicio && fecha < inicio) return false;
  if (fin && fecha > fin) return false;
  return true;
};

export const gastoPaginationService = {
  filtrar(gastos: Gasto[], filtros: FiltrosWallet): Gasto[] {
    return gastos
      .filter((gasto) => estaDentroDelRango(gasto.fecha, filtros.rangoFecha.inicio, filtros.rangoFecha.fin))
      .filter((gasto) => !filtros.importancia || filtros.importancia === 'TODAS' || gasto.categoria.importancia === filtros.importancia)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  },

  paginar(gastos: Gasto[], filtros: FiltrosWallet, paginacion: PaginacionParams): PaginatedResponse<Gasto> {
    return paginacionService.paginar(this.filtrar(gastos, filtros), paginacion);
  },
};
