# Actualización e integración React 19.2.6

## Estado

El proyecto quedó actualizado a React 19.2.6 e integrado con la rama `Avanze2`, manteniendo la estructura modular del proyecto base.

## Cambios principales

- Se integraron las páginas funcionales de Tarjetas, Gastos e Ingresos.
- Se reemplazaron páginas placeholder por formularios reales con validación.
- Se agregó validación con `react-hook-form`, `zod` y `@hookform/resolvers`.
- Se agregó `bootstrap-icons` para que los íconos usados por la rama de Gemini se vean correctamente.
- Se extendió el `WalletProvider` para manejar gastos, ingresos, bancos y mutaciones.
- Se mantuvo Clean Architecture: dominio, aplicación, infraestructura y presentación.
- Se agregó `json-server` y `concurrently` para levantar la base de datos local junto con Vite usando `npm run dev`.
- Se agregó `db.json` de ejemplo con `perfil`, `bancos`, `tarjetas`, `gastos`, `ingresos` y `proyecciones`.
- Se eliminó `package-lock.json` del ZIP para evitar rutas internas de registro npm.

## Scripts

```bash
npm install
npm run dev
```

`npm run dev` levanta dos procesos:

```bash
vite --host 0.0.0.0
json-server --watch db.json --port 4000
```

También puedes ejecutarlos por separado:

```bash
npm run dev:front
npm run api
```

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

## Variables de entorno

El proyecto usa por defecto:

```env
VITE_API_URL=http://localhost:4000
```

Si cambias el puerto de `json-server`, actualiza también esta variable.

## Estructura aplicada

```txt
src/app                  composición de rutas y providers
src/core                 configuración transversal y cliente HTTP
src/modules/wallet       dominio, casos de uso, infraestructura y provider
src/modules/tarjetas     rutas y páginas de tarjetas
src/modules/gastos       rutas y páginas de gastos
src/modules/ingresos     rutas y páginas de ingresos
src/shared               tipos, layout, componentes y utilidades reutilizables
```

## Dependencias agregadas desde la rama Avanze2

Se conservaron solo las dependencias necesarias:

```bash
react-hook-form
zod
@hookform/resolvers
bootstrap-icons
json-server
concurrently
```

No se copiaron dependencias no usadas como `@google/genai`, `express`, `motion`, `lucide-react`, `react-bootstrap`, `@tanstack/react-query` ni `dotenv`, porque aumentaban acoplamiento o peso sin ser necesarias para las páginas integradas.

## Rutas integradas

```txt
/app/tarjetas/listar
/app/tarjetas/agregar
/app/gastos/listar
/app/gastos/agregar
/app/gastos/configurar-presupuesto
/app/ingresos/listar
/app/ingresos/agregar
/app/perfil/editar
/app/perfil/seguridad
```

También se dejó compatibilidad con:

```txt
/app/gastos/presupuesto
/app/perfil/cambiar
```

## Nota para instalación

Si vuelve a salir un error con un registry interno de OpenAI o `ETIMEDOUT`, elimina `package-lock.json` y `node_modules`, y ejecuta:

```bash
npm config set registry https://registry.npmjs.org/
npm install
```
