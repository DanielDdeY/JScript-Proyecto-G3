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
