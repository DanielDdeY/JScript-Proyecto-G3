# 📱 Vizcash Nacional - Billetera Móvil y Gestor de Finanzas Personales

Vizcash Nacional es una plataforma avanzada de gestión financiera personal, diseñada bajo los principios de Clean Architecture y SOLID. El sistema permite a los usuarios administrar su flujo de caja, proyectar escenarios financieros, gestionar portafolios de inversión y controlar líneas de crédito a través de una interfaz de usuario modular, altamente cohesiva y de bajo acoplamiento construida con React 19.2.6.

---

## 🏗 Arquitectura y Patrones de Diseño

El proyecto ha sido estructurado meticulosamente para garantizar la escalabilidad, mantenibilidad y separación de responsabilidades (Separation of Concerns). Se implementa una organización por dominios (módulos), aislando la lógica de negocio de los detalles de infraestructura.

- Clean Architecture: Separación estricta entre Dominio, Aplicación, Infraestructura y Presentación dentro de cada módulo.
- SOLID: Los servicios y repositorios dependen de abstracciones (interfaces/contratos) en lugar de implementaciones concretas.
- Baja Dependencia (Low Coupling):** Las vistas (Páginas/Componentes) interactúan exclusivamente con Casos de Uso (Hooks) y no con la capa de red o infraestructura (HTTP/APIs).
- Alta Cohesión: Cada módulo concentra de manera exclusiva los artefactos que pertenecen a su propio contexto delimitado (Bounded Context).

---

## 📁 Estructura del Proyecto

El código fuente está distribuido lógicamente de la siguiente manera:

```text
src/
├── app/          # Proveedores de estado global, enrutador y configuración de inicialización.
├── core/         # Configuraciones transversales del sistema y clientes HTTP (e.g., Alova/Axios).
├── modules/      # Contextos delimitados de negocio (Auth, Tarjetas, Gastos, Presupuesto, etc.).
└── shared/       # Componentes agnósticos, interfaces (types), utilidades y layouts compartidos.
```

---

## ⚙️ Requisitos del Entorno

Para garantizar la correcta ejecución y compilación del proyecto, el entorno de desarrollo debe cumplir con las siguientes especificaciones:

- **Entorno de ejecución:** Node.js v20.19+ o v22.12+
- **Gestor de paquetes:** npm
- **TypeScript:** Configurado en modo estricto para la validación de tipos (`tsc`).

---

## 🚀 Instalación y Despliegue Local

Siga los siguientes pasos para levantar el entorno de desarrollo, el cual incluye tanto la aplicación cliente (Frontend Vite) como la API simulada (JSON Server).

1. Configuración del registro e instalación de dependencias:
   ```bash
   npm config set registry https://registry.npmjs.org/
   npm install
   ```

2. **Ejecución concurrente del sistema (Frontend + Backend local):**
   ```bash
   npm run dev
   ```
   *Este comando expone los siguientes puertos:*
   - 🌐 Frontend (Vite): `http://localhost:5173`
   - 🗄️ API Local (JSON Server): `http://localhost:4000`

### Ejecución Aislada (Opcional)
Si requiere ejecutar los servicios en terminales independientes:
- Levantar servidor de desarrollo: `npm run dev:front`
- Levantar mock de base de datos: `npm run api`

---

## 🔐 Credenciales de Acceso (Entorno de Pruebas)

La base de datos local (`db.json`) ha sido aprovisionada con un usuario de pruebas estándar, pre-hidratado con datos financieros y configuraciones iniciales.

- Usuario: `Pepito`
- Contraseña: `123456`

---

## 🛠 Comandos y Scripts Disponibles

El archivo `package.json` incluye los siguientes scripts automatizados:

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia Vite y JSON Server simultáneamente usando `concurrently`. |
| `npm run dev:front` | Inicia únicamente el servidor de desarrollo del frontend (Vite). |
| `npm run api` | Inicia el mock de la base de datos RESTful con JSON Server en el puerto 4000. |
| `npm run build` | Ejecuta la verificación de tipos (`tsc -b`) y empaqueta la aplicación para producción. |
| `npm run preview` | Levanta un servidor estático para previsualizar el build de producción. |
| `npm run typecheck` | Valida la integridad estática del código TypeScript sin emitir archivos compilados. |

---

## 🧩 Descripción de Componentes y Módulos del Sistema

El ecosistema de Vizcash Nacional está compuesto por módulos interdependientes a nivel de negocio, pero desacoplados a nivel de software.

### 1. Autenticación y Perfilamiento
- Mecanismo: Gestión de sesión persistida vía `localStorage` con interceptores de rutas (`ProtectedRoute`, `PublicRoute`).
- Modelo de Datos: Relación 1:1 normalizada entre la entidad `Usuario` (credenciales, identidad) y `Perfil` (estados financieros).
- Hidratación: El repositorio unifica automáticamente el Perfil y Usuario para evitar el renderizado de estados parciales.

### 2. Gestión de Flujo de Caja (Ingresos y Gastos)
- Motor de Transacciones: Soporta el registro de operaciones con origen dinámico (Efectivo y Tarjeta).
- Gastos Compartidos y Préstamos: Permite subdividir gastos mediante matrices de deudores (`PAGADO`/`PENDIENTE`), y enlazar préstamos informales sin requerir la creación de entidades de usuario adicionales.
- Paginación Avanzada: Renderizado asíncrono con envoltorios `PaginatedResponse<T>` y `PaginacionMeta` para mitigar la sobrecarga en el DOM (10 registros por página), complementado con filtros multidimensionales (fechas, fuentes, relevancia).

### 3. Tarjetas y Líneas de Crédito
- Interfaz (Vista Carrusel): Visualización interactiva del portafolio de tarjetas de crédito/débito.
- Métricas Calculadas: Renderizado en tiempo real de la capacidad de endeudamiento (línea utilizada vs disponible) y ciclos de facturación.
- Normalización de IDs: Utilidad `generarIdConPrefijo` integrada en el dominio para garantizar llaves foráneas consistentes en transacciones de la base de datos (e.g., `tj-1`, `tj-2`).

### 4. Control de Presupuesto y Saldos
- Asignación Dinámica: Administración de límites presupuestarios globales y sub-límites categorizados por mes.
- Motor de Cómputo: Procesamiento de gastos en tiempo real frente a los límites definidos, con herencia automática de configuraciones en cambios de ciclo mensual.
- Conversor de Divisas: Módulo de transformación de saldos aproximados a monedas de reserva (USD, EUR, JPY).

### 5. Inversiones y Amortización de Préstamos
- **Inversiones:** Panel de portafolio que evalúa el rendimiento histórico (ROI) calculando automáticamente el nivel de riesgo (Bajo, Medio, Alto) y la varianza del capital invertido frente al valor actual.
- **Préstamos:** Seguimiento estructurado del costo de deuda, calculando la TCEA (Tasa de Costo Efectivo Anual), seguros de desgravamen y mapeo del cronograma de pagos mediante interfaces de `CuotaPrestamo`.

### 6. Sistema de Proyecciones Predictivas
- Motor de Inferencia: Algoritmo de proyección a futuro del saldo del perfil basado en múltiples tensores:
  - Vectores de transacciones por factor de **Reincidencia** (Mensual, Anual, Recurrente, Probable [ponderado al 50% para reducir ruido estocástico] y Único).
  - Tasas de amortización de deuda en tarjetas y cuotas de préstamos pendientes.
  - Proyección de rendimiento constante de inversiones.

### 7. Sistema de Notificaciones
- Integrado al Event Loop del usuario, monitorea métricas en segundo plano.
- Triggers Actuales: Notificación de umbral de saturación de presupuesto (alerta al 90% de ejecución) y advertencias de proximidad de vencimiento (7 días) para pagos mínimos de tarjetas de crédito.
- Persistencia local de estados descartados para evitar bloqueos iterativos de la experiencia de usuario.
