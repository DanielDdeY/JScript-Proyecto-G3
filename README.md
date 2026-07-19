# Vizcash Nacional - React 19.2.6

Proyecto React actualizado a React 19.2.6, organizado por módulos y preparado para crecer con bajo acoplamiento entre capas.

## Requisitos

- Node.js 20.19+ o 22.12+
- npm

## Instalación limpia

```bash
npm config set registry https://registry.npmjs.org/
npm install
```

## Ejecutar frontend y base de datos local

```bash
npm run dev
```

Ese comando levanta en paralelo:

- Frontend Vite: `http://localhost:5173`
- API local JSON Server: `http://localhost:4000`

También puedes correrlos por separado:

```bash
npm run dev:front
npm run api
```

## Credenciales de prueba

La base de datos local incluye un usuario inicial vinculado al perfil:

- Correo: `daniel@mibilletera.edu.pe`
- Contraseña: `123456`

## Cambios principales de esta versión

- Login rediseñado como pantalla inicial de Vizcash Nacional.
- Guards de rutas:
  - rutas privadas protegidas por sesión,
  - rutas públicas redirigen al dashboard si ya hay sesión activa.
- Menú de usuario desde el círculo/avatar del Navbar:
  - Ver perfil,
  - Cerrar sesión.
- Perfil fuera del menú principal de módulos.
- Relación uno a uno entre `usuario` y `perfil`:
  - `usuario` guarda nombre, correo y avatar,
  - `perfil` guarda datos financieros como `saldoTotal` y referencia `usuarioId`,
  - la app sigue consumiendo un `perfil` hidratado para no romper las pantallas.
- Gastos ahora permiten origen en efectivo o tarjeta.
- Al agregar una tarjeta se guarda en `db.json`, se hidrata con su banco y se muestra correctamente en la lista.
- La lectura de tarjetas ya no depende de `_expand=banco`; se compone manualmente para evitar fallos con IDs string o cambios de JSON Server.

## Scripts disponibles

```json
{
  "dev": "concurrently \"vite --host 0.0.0.0\" \"json-server --watch db.json --port 4000\"",
  "dev:front": "vite --host 0.0.0.0",
  "api": "json-server --watch db.json --port 4000",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "typecheck": "tsc --noEmit"
}
```
# Actualización e integración React 19.2.6

## Versión

El proyecto queda fijado en:

- `react`: `19.2.6`
- `react-dom`: `19.2.6`

## Arquitectura aplicada

Se mantiene una organización por módulos, separando responsabilidades:

- `src/app`: proveedores y rutas globales.
- `src/core`: configuración y cliente HTTP.
- `src/modules`: funcionalidades de negocio.
- `src/shared`: tipos, utilidades, componentes compartidos y layouts.

Principios aplicados:

- Clean Architecture: dominio, aplicación, infraestructura y presentación separadas en los módulos principales.
- SOLID: servicios y repositorios dependen de contratos, no de implementaciones directas.
- Modularidad: cada funcionalidad vive en su propio módulo.
- Baja dependencia entre módulos: las páginas consumen hooks o casos de uso, no detalles de HTTP.
- Alta cohesión: cada módulo concentra lo que pertenece a su dominio.

## Integración solicitada

### Autenticación

Se agregó un módulo de autenticación local con:

- `AuthProvider`,
- `useAuth`,
- `ProtectedRoute`,
- `PublicRoute`,
- repositorio local `authLocalRepository`.

La sesión se guarda en `localStorage` bajo la clave `vizcash.auth.session`.

### Base de datos

La base se normalizó para evitar repetición entre usuario y perfil:

```json
"usuarios": [
  {
    "id": "user-1",
    "nombre": "Pepito",
    "email": "daniel@mibilletera.edu.pe",
    "avatarUrl": "",
    "password": "123456"
  }
],
"perfil": {
  "id": "perfil-1",
  "usuarioId": "user-1",
  "saldoTotal": 12450.75
}
```

La app sigue usando `perfil`, pero el repositorio lo hidrata combinando `perfil` + `usuario`.

### Gastos

Ahora `tarjetaId` es opcional. Un gasto puede registrarse con:

- `origen: "EFECTIVO"`, sin tarjeta,
- `origen: "TARJETA"`, con `tarjetaId`.

Cuando el gasto usa tarjeta, se descuenta también del saldo de la tarjeta. Cuando usa efectivo, solo afecta el saldo total del perfil.

### Tarjetas

Se corrigió la carga de tarjetas para que aparezcan en la lista después de agregarlas. La solución fue no depender de `tarjetas?_expand=banco`, sino cargar `tarjetas` y `bancos` por separado y unirlos dentro del repositorio.

## Instalación

```bash
npm config set registry https://registry.npmjs.org/
npm install
npm run dev
```


## Actualización previa a Proyecciones

- Se agregó el type `Reincidencia` con `esMensual`, `esAnual`, `esRecurrente`, `esProbable` y `esUnico`.
- Los formularios de nuevo gasto e ingreso ahora guardan la reincidencia para que el módulo de proyecciones pueda distinguir movimientos únicos, recurrentes o probables.
- `db.json` ya no incluye la tabla `suscripciones`; los gastos recurrentes se manejan desde `gastos[].reincidencia`.
- En Proyecciones se prepararon las páginas: `Inversiones`, `Préstamos` y `Proyecciones`.

# Vista 1 - Carrusel de Tarjetas

Implementación agregada sobre el módulo `src/modules/tarjetas` siguiendo una separación por capas:

- `domain/repositories`: contrato `TarjetasRepository`.
- `domain/services`: reglas de presentación y normalización de tarjetas, banco, línea de crédito y ciclo de facturación.
- `application`: casos de uso `listarTarjetas`, `listarBancos` y `crearTarjeta`.
- `infrastructure`: adaptador `createTarjetasWalletRepository`, que conecta el módulo de tarjetas con la fuente de datos actual de la billetera sin acoplar los componentes al provider global.
- `presentation/context` y `presentation/hooks`: `TarjetasProvider` y `useTarjetas`.
- `components`: carrusel, barra de línea de crédito y modales de detalle.

## Funciones visibles

- Carrusel grande en `/app/tarjetas/listar`.
- Tarjetas con banco, tipo, últimos cuatro dígitos, saldo y línea de crédito.
- Barra verde para línea disponible y roja para línea utilizada.
- Aviso de ciclo de facturación con cierre y pago mínimo.
- Botón `Detalles` con modal de información general.
- Botones internos para ver modal de `Banco`, `CicloFacturacion` y `LineaCredito` sin mostrar el `id`.
- Formulario de agregar tarjeta actualizado para registrar datos completos cuando el tipo es `CREDITO`.

## Base de datos

Se normalizó `cicloFacturacion.Facturado` a `cicloFacturacion.montoFacturado` en `db.json` para que coincida con el type `CicloFacturacion`.

# Vista 2 - Modal de Detalles de un Gasto

## Cambios incluidos

- Se implementó una arquitectura modular para `src/modules/gastos` con capas:
  - `application`: casos de uso para listar gastos y actualizar deudores.
  - `domain`: contrato del repositorio y servicios de presentación del gasto.
  - `infrastructure`: repositorio HTTP basado en `json-server`.
  - `presentation`: contexto y hook `useGastos`.
  - `components`: tabla de gastos y modal de detalle.

## Funcionalidad

- En `Gastos > Listar Gastos`, cada fila es clickeable.
- Al seleccionar un gasto se abre un modal central con:
  - descripción,
  - monto total,
  - fecha,
  - categoría,
  - prioridad,
  - origen del dinero,
  - información de cuotas si existe `detalleCuotas`,
  - información de gasto compartido si existe `gastoCompartido`.
- Si el gasto tiene deudores, se muestran avatares redondos y un botón por persona:
  - verde para `PAGADO`,
  - naranja para `PENDIENTE`.
- Al presionar el botón del deudor, cambia su estado y se persiste en `db.json` mediante `PUT /gastos/:id`.

## Categoría Prestaciones

Se agregó la categoría `Prestaciones` en el formulario de nuevo gasto.
Cuando se selecciona esta categoría, aparece el campo obligatorio:

```txt
Nombre de la persona a quien prestaste
```

Ese dato se guarda dentro del gasto en:

```json
"prestacion": {
  "nombrePersona": "Andrea"
}
```

No se crea un usuario nuevo; solo se guarda el nombre en el gasto.

## Datos agregados a la BD

Se añadieron ejemplos en `db.json`:

- `g-4`: gasto compartido "Cena de Fin de Ciclo" con cuotas y deudores Carlos/María.
- `g-5`: gasto de categoría `Prestaciones` con persona vinculada.

# Vista 3 - Panel de Control de Gastos (Saldo)

## Ruta agregada

- `/app/saldo/presupuesto`

La ruta se agregó en `src/modules/saldo/saldo.routes.tsx` y aparece como tercer botón en `SaldoPage.tsx`.

## Arquitectura implementada

Se agregó una estructura limpia para presupuesto dentro de `src/modules/saldo`:

- `application/listarPresupuestos.ts`
- `domain/repositories/presupuestoSaldoRepository.ts`
- `domain/services/presupuestoSaldoService.ts`
- `infrastructure/presupuestoSaldoAlovaRepository.ts`
- `presentation/context/PresupuestoSaldoProvider.tsx`
- `presentation/hooks/usePresupuestoSaldo.ts`
- `components/PresupuestoCategoriaProgress.tsx`
- `components/AlertaPresupuestoCard.tsx`
- `pages/presupuesto-saldo-page/PresupuestoSaldoPage.tsx`

## Notificaciones

Se agregó el módulo `src/modules/notificaciones` con:

- `domain/models/notificacion.ts`
- `domain/repositories/notificacionesRepository.ts`
- `domain/services/notificacionService.ts`
- `infrastructure/notificacionesAlovaRepository.ts`
- `presentation/context/NotificacionesProvider.tsx`
- `presentation/hooks/useNotificaciones.ts`
- `components/BotonNotificaciones.tsx`

El botón de campana aparece junto al perfil en el Navbar. Muestra un círculo rojo con la cantidad de notificaciones y despliega un panel al presionarlo.

## Notificaciones incluidas por ahora

- Presupuesto: categorías que superan el 90% de su límite.
- Tarjetas: pagos mínimos próximos a vencer en los siguientes 7 días.

Prestamos queda preparado para una siguiente vista, pero todavía no se activa porque esa sección aún no fue implementada.

## Base de datos

Se actualizaron los datos de `presupuestos` en `db.json` para probar:

- Alimentación: supera 90%.
- Transporte: 50% de uso.
- Entretenimiento y Prestaciones como ejemplos adicionales.

También se ajustó el día de pago de la tarjeta de crédito de ejemplo para que pueda mostrarse una notificación de pago próximo.

# Corrección de Saldo, presupuestos y conversión

## Cambios realizados

- `Saldo > Separar para que no se use` ahora solo administra el límite mensual general.
- `Gastos > Configurar presupuesto` administra únicamente límites por categoría.
- El `Total límite mensual` que se muestra en Gastos sale del límite general configurado en Saldo.
- `Saldo > Controlar presupuesto` calcula cuánto se ha gastado y cuánto falta para llegar a los límites usando los gastos reales del mes.
- `Saldo > Convertir la plata` permite seleccionar una tarjeta y convertir su saldo en soles a dólar, euro y yen con tasas estáticas.
- La pantalla de conversión muestra la advertencia: "Importante: esta es una aproximación, no una conversión real".
- Las notificaciones conservan el botón `X` para descartarlas y se guardan en `localStorage`.

## Validación

Se validó con:

```bash
npm run typecheck
npm run build
```

Ambos comandos pasaron correctamente antes de limpiar `node_modules`, `dist` y `package-lock.json` para entregar el ZIP.

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

# Corrección de presupuestos y notificaciones

## Qué se corrigió

- Los presupuestos ya no usan valores inventados de `gastadoSoles` guardados en `db.json`.
- Los límites salen de `Gastos > Configurar presupuesto` y también pueden configurarse desde `Saldo > Separar para que no se use`.
- La página `Saldo > Controlar presupuesto` calcula el gasto real sumando los registros de `gastos` del mes y comparándolos contra los límites configurados en `presupuestos`.
- Cada barra muestra cuánto se gastó y cuánto queda para llegar al límite.
- Las notificaciones de presupuesto se generan con la misma lógica: límite configurado + gastos reales del mes.
- El panel de notificaciones ahora tiene una `X` para descartar cada notificación. Las descartadas se guardan en `localStorage` para que no reaparezcan al recargar.

## Módulo agregado

Se agregó el módulo reutilizable:

```txt
src/modules/presupuestos
```

Incluye:

```txt
components/PresupuestoLimitesManager.tsx
domain/repositories/presupuestosRepository.ts
domain/services/presupuestoService.ts
infrastructure/presupuestosAlovaRepository.ts
presentation/context/PresupuestosProvider.tsx
presentation/hooks/usePresupuestos.ts
```

## Rutas afectadas

- `/app/gastos/configurar-presupuesto`
- `/app/saldo/separar`
- `/app/saldo/presupuesto`

## Datos de prueba

En `db.json` se dejó un presupuesto de junio 2026 con límite total S/. 1500. Los gastos reales del mes hacen que:

- Alimentación supere el 90% del límite.
- Transporte quede al 50% del límite.

Esto permite probar las barras y las notificaciones.

# Vista de Préstamos e Inversiones

## Cambios aplicados

- Se eliminó `src/shared/types/programaRecompensa.ts`.
- Se eliminó `src/shared/types/detalleCuotas.ts` y se reemplazó por `src/shared/types/detallecuotas.ts` para mantener el type de cuotas sin conservar el archivo anterior.
- `prestamo.ts` ahora usa `detallecuotas.ts` y `cuotaPrestamo.ts`.
- Se agregó arquitectura para préstamos e inversiones:
  - `application`
  - `domain/repositories`
  - `domain/services`
  - `infrastructure`
  - `presentation/context`
  - `presentation/hooks`
  - `components`

## Préstamos

La página `/app/proyecciones/prestamos` muestra:

- Botón **Agregar Préstamo**.
- Tarjetas estilizadas por préstamo.
- Banco, TCEA y seguro de desgravamen.
- Barra de progreso por cuotas pagadas sobre cuotas totales.
- Comparación entre `montoAprobado` y `deudaRestante`.
- Cuota actual con número, monto, fecha de vencimiento y estado.
- El estado de la cuota cambia al hacer clic sobre la etiqueta.

## Inversiones

La página `/app/proyecciones/inversiones` muestra:

- Resumen del portafolio.
- Riesgo calculado usando `rendimientoHistorico.ts`:
  - Menor a 10%: BAJO.
  - De 10% a 25%: MEDIO.
  - Mayor a 25%: ALTO.
- Comparación entre `capitalInvertido` y `valorActual`.
- Ganancia neta calculada en frontend.
- Badge positivo/negativo según resultado.

## Base de datos

Se actualizó `db.json` para que `prestamos` tenga:

- `detalleCuotas`
- `cuotas`
- `cuotasPagadas`
- `cuotasTotales`

También se ampliaron los datos de `inversiones` para visualizar mejor la pantalla.

# Proyecciones predictivas

Se implementó la página `/app/proyecciones/proyecciones` con un cálculo predictivo basado en:

- saldo actual del perfil;
- ingresos y gastos con `Reincidencia`;
- préstamos con cuotas pendientes;
- tarjetas de crédito con deuda usada;
- inversiones usando el último rendimiento histórico registrado;
- metas registradas con `Meta`.

## Reglas aplicadas

- `esMensual`: monto × meses futuros.
- `esRecurrente`: se comporta como mensual.
- `esAnual`: se cuenta por cada ocurrencia anual dentro del rango proyectado.
- `esProbable`: se considera el 50% del monto para evitar resultados aleatorios en cada render.
- `esUnico`: solo se considera si la fecha única cae dentro del rango futuro consultado.
- Préstamos: se descuentan las cuotas pendientes hasta el mes consultado, sin superar las cuotas disponibles.
- Tarjetas de crédito: se descuenta la deuda usada de la línea de crédito de manera mensual usando el pago mínimo o el monto facturado como referencia.
- Inversiones: solo se suma la ganancia o pérdida generada, no el capital completo invertido.

## Estructura agregada

```txt
src/modules/proyecciones/application/calcularProyeccion.ts
src/modules/proyecciones/application/obtenerDatosProyeccion.ts
src/modules/proyecciones/domain/models/proyeccionPredictiva.ts
src/modules/proyecciones/domain/repositories/proyeccionesRepository.ts
src/modules/proyecciones/domain/services/proyeccionPredictivaService.ts
src/modules/proyecciones/infrastructure/proyeccionesAlovaRepository.ts
src/modules/proyecciones/presentation/context/ProyeccionesProvider.tsx
src/modules/proyecciones/presentation/hooks/useProyecciones.ts
src/modules/proyecciones/components/ProyeccionFiltro.tsx
src/modules/proyecciones/components/ResumenProyeccionCard.tsx
src/modules/proyecciones/components/DesgloseProyeccion.tsx
src/modules/proyecciones/components/DetalleMovimientosProyeccion.tsx
src/modules/proyecciones/components/MetasProyectadas.tsx
src/modules/proyecciones/components/LineaTiempoProyeccion.tsx
```

## IDs de tarjetas

Se agregó el formatter/utilidad `generarIdConPrefijo` en:

```txt
src/shared/utils/ids.ts
```

Al agregar una tarjeta, ya no se genera un ID aleatorio. Ahora se busca el mayor ID existente con formato `tj-n` y se crea el siguiente:

```txt
tj-1, tj-2, tj-3, tj-4...
```

Ejemplo: si el último ID válido es `tj-3`, la siguiente tarjeta se guarda como `tj-4`.
