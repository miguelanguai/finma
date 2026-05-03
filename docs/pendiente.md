# Pendiente de implementar

## Estado del board (2026-04-27)

| Issue | Título | Estado |
| ----- | ------ | ------ |
| #13 | Landing Page | Done |
| #14 | Análisis | Done |
| #38 | Exportación de movimientos | Done |
| #39 | Filtros y búsqueda en movimientos | Done |
| #40 | Comparativa entre períodos en análisis | Done |
| #42 | Inversiones | To Do (draft) |
| #43 | Perfil Docker | To Do (draft) |

---

## Hoja de ruta — orden de implementación

| Orden | Prioridad | Título |
| ----- | --------- | ------ |
| 1 | Alta | Diseño frontend (ver sección) |
| 3 | Draft | Inversiones |
| 4 | Draft | Perfil Docker |

---

## Detalle de tickets pendientes

### 1. Inversiones (draft)

Nuevo módulo para registrar activos de inversión.

Ideas iniciales:
- Entidad `Inversion` (nombre, tipo, precio_compra, cantidad, fecha_compra)
- Soporte para: acciones, fondos indexados, cripto, depósitos
- Precio actual: entrada manual o integración con API externa (ej. Yahoo Finance)
- Vista de rentabilidad: (precio_actual - precio_compra) / precio_compra

Pendiente de especificación completa.

---

### 2. Perfil Docker (draft)

Optimización del entorno de contenedores para despliegue en producción.

Ideas iniciales:
- Nginx con Certbot para HTTPS
- Variables de entorno separadas por entorno (`local` / `dev` / `prod`)
- Health checks en `docker-compose.yml`
- Imagen de producción optimizada (multi-stage build)

Pendiente de especificación completa.

---

## Diseño frontend

Stack visual actual: **Angular standalone + PrimeNG 21 + Chart.js + PrimeIcons**.

El objetivo es consolidar una identidad visual coherente antes de añadir más módulos.

---

### Sistema de diseño

#### Paleta de colores

Usar el sistema de temas de PrimeNG (`@primeuix/themes`). Definir en `styles.css` o en un preset propio:

| Token | Uso | Valor propuesto |
| ----- | --- | --------------- |
| `primary` | Acciones principales, enlaces activos | Azul índigo (#4F46E5) |
| `success` | Ingresos, objetivos cumplidos | Verde (#22C55E) |
| `danger` | Gastos, alertas de presupuesto | Rojo (#EF4444) |
| `warn` | Presupuesto próximo al límite | Ámbar (#F59E0B) |
| `surface` | Fondos de tarjeta | Gris neutro claro |

Soporte para modo oscuro mediante `prefers-color-scheme` o toggle manual en el header.

#### Tipografía

- Fuente: `Inter` (Google Fonts) — legible y neutral para datos numéricos.
- Escala: `text-sm` para tablas, `text-base` para cuerpo, `text-xl/2xl` para KPIs.

#### Espaciado y layout

- Grid de 12 columnas con `PrimeNG Grid` o CSS Grid nativo.
- Gutter estándar: `1rem` (16px).
- Padding de página: `1.5rem` lateral, `1rem` vertical.

---

### Navegación

Estado actual: header simple con links de texto.

Propuesta:
- **Sidebar colapsable** (ancho 240px expandido, 64px colapsado) con iconos PrimeNG.
- Header superior fijo con: logo, selector de período activo (global), toggle tema, avatar/perfil.
- El selector de período en el header alimenta un servicio compartido (`PeriodoActivo`) que los componentes consumen vía `inject()`.

Rutas y entradas del sidebar:

| Icono | Etiqueta | Ruta |
| ----- | -------- | ---- |
| `pi-home` | Inicio | `/` |
| `pi-arrows-v` | Movimientos | `/movimiento` |
| `pi-chart-bar` | Análisis | `/analisis` |
| `pi-chart-line` | Inversiones | `/inversion` |
| `pi-tags` | Categorías | `/categoria` |
| `pi-calendar` | Períodos | `/periodo` |
| `pi-bullseye` | Objetivos | `/objetivo` |

---

### Páginas — estado y mejoras pendientes

#### `/` — Landing / Dashboard

Estado actual: KPIs, últimos movimientos, resumen de objetivos, accesos rápidos, gráfico de categorías, balance general.

Mejoras:
- Reordenar tarjetas en grid responsive (2 columnas en tablet, 1 en móvil).
- KPIs con variación respecto al período anterior (flecha ↑↓ + porcentaje).

#### `/movimiento` — Lista de movimientos

Estado actual: tabla con filtros, búsqueda, exportación Excel.

Mejoras:
- Vista compacta vs vista cómoda (toggle densidad).
- Paginación del lado del servidor si el volumen crece.
- Indicador de categoría con chip de color.

#### `/analisis` — Análisis

Estado actual: gráficos por categoría + comparativa entre períodos.

Mejoras:
- Añadir vista de evolución mensual (línea temporal de ingresos/gastos).
- Integrar vista de semáforo sobre gráficos de categoría (usando `MapPeriodoCategoria`).

#### `/inversion` — Inversiones (draft)

Diseño propuesto:
- Tabla de posiciones con columnas: nombre, tipo, cantidad, precio compra, precio actual, rentabilidad %.
- Tarjeta de resumen: valor total de cartera, rentabilidad global.
- Gráfico de dona con distribución por tipo de activo.

---

### Componentes compartidos a crear

| Componente | Descripción |
| ---------- | ----------- |
| `PeriodoSelectorComponent` | Dropdown global de período activo, usado en el header |
| `KpiCardComponent` | Tarjeta de KPI reutilizable con valor, etiqueta y variación |
| `EmptyStateComponent` | Ilustración + mensaje cuando no hay datos |
| `ConfirmDeleteComponent` | Dialog de confirmación de borrado reutilizable |

---

### Responsive

| Breakpoint | Layout |
| ---------- | ------ |
| < 768px (móvil) | Sidebar oculto (botón hamburguesa), columnas apiladas |
| 768–1024px (tablet) | Sidebar colapsado (solo iconos) |
| > 1024px (escritorio) | Sidebar expandido |

---

### Orden de implementación del diseño

1. Configurar preset de PrimeNG con la paleta y fuente definidas.
2. Crear layout base: sidebar + header fijo + `<router-outlet>`.
3. Implementar `PeriodoSelectorComponent` en el header.
4. Migrar páginas existentes al nuevo layout.
5. Añadir `KpiCardComponent` y `EmptyStateComponent`.
6. Aplicar responsive breakpoints.
7. Añadir toggle de modo oscuro.
