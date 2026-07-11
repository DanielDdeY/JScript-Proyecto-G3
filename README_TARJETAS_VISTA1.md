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
