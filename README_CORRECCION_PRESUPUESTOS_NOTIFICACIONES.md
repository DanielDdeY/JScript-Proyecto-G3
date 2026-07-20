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
