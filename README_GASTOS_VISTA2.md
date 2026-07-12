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
