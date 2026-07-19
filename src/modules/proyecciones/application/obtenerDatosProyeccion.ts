import type { DatosProyeccion } from '../domain/models/proyeccionPredictiva';
import type { ProyeccionesRepository } from '../domain/repositories/proyeccionesRepository';

export const obtenerDatosProyeccion = (repository: ProyeccionesRepository): Promise<DatosProyeccion> =>
  repository.obtenerDatosProyeccion();
