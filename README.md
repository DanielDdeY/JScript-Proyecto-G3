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
