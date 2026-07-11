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
