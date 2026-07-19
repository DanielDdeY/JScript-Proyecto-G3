import type { DatosProyeccion, ProyeccionFiltros, ResultadoProyeccion } from '../domain/models/proyeccionPredictiva';
import { calcularProyeccionPredictiva } from '../domain/services/proyeccionPredictivaService';

export const calcularProyeccion = (
  datos: DatosProyeccion,
  filtros: ProyeccionFiltros,
): ResultadoProyeccion => calcularProyeccionPredictiva(datos, filtros);
