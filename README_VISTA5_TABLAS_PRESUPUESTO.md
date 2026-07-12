# Cambios: Vista 5 y corrección final de presupuesto

## Presupuestos

- En **Gastos > Configurar presupuesto** ahora solo se administran los límites por categoría del mes actual.
- La sección **Límites por categoría establecidos** muestra únicamente el mes actual.
- Si cambia el mes y el usuario todavía no modificó los límites por categoría, se heredan los últimos límites configurados y solo cambia el mes visible.
- Cada límite permitido tiene botón **Modificar** para cargarlo en el formulario y actualizarlo.
- En **Saldo > Separar para que no se use**, la lista de límites mensuales guardados tiene botón **Eliminar** al lado de **Modificar**.
- Eliminar un límite mensual no borra los límites por categoría; si el mismo registro también contiene categorías, solo se pone `totalAsignado` en 0.

## Vista 5: Tabla paginada del sistema

Se implementó paginación con `PaginatedResponse<T>` y `PaginacionMeta` para que las páginas no muestren todos los registros a la vez.

### Gastos `/app/gastos/listar`

- Barra lateral de filtros por rango de fechas e importancia de categoría: `Alta | Media | Baja`.
- Se eliminó `tarjetaId` de `FiltrosWallet`.
- La tabla usa `PaginatedResponse<Gasto>`.
- Muestra 10 gastos por página.
- Incluye botones `[Anterior] [1] [2] [Siguiente]` y texto tipo: `Mostrando 10 de 18 registros totales`.
- Cada fila sigue abriendo el modal de detalle del gasto.

### Ingresos `/app/ingresos/listar`

- Se creó arquitectura propia para ingresos: repository, service, context y hook.
- Barra lateral de filtros por rango de fechas y fuente: `Sueldo | Freelance | Inversiones | Venta | Premio | Otros`.
- La tabla usa `PaginatedResponse<Ingreso>`.
- Muestra 10 ingresos por página.
- Columnas: Fecha, Descripción, Fuente de Ingreso y Monto.

## Archivos destacados

- `src/shared/types/filtros.ts`
- `src/shared/types/paginatedResponse.ts`
- `src/shared/types/paginacionMeta.ts`
- `src/shared/services/paginacionService.ts`
- `src/shared/components/pagination/Paginacion.tsx`
- `src/modules/gastos/domain/services/gastoPaginationService.ts`
- `src/modules/ingresos/domain/services/ingresoPaginationService.ts`
- `src/modules/ingresos/presentation/context/IngresosProvider.tsx`
