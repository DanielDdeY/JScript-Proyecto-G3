import type { DatosProyeccion } from '../models/proyeccionPredictiva';

export interface ProyeccionesRepository {
  obtenerDatosProyeccion(): Promise<DatosProyeccion>;
}
