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
