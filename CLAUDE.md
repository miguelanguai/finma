# Finma — Aplicación de gestión de gastos y finanzas

## Stack

| Capa | Tecnología |
| ---- | ---------- |
| Backend | Django 5.1 + Django REST Framework |
| Frontend | Angular (standalone components) |
| Base de datos | PostgreSQL (local/docker) · SQLite (dev sin docker) |
| Servidor web | Nginx (producción vía Docker) |
| Contenedores | Docker Compose |

## Comandos esenciales

```bash
# Frontend (desarrollo)
ng serve                        # http://localhost:4200

# Backend (desarrollo)
cd backend
python manage.py runserver      # http://localhost:8000

# Docker (todos los servicios)
docker compose up -d
# backend  → http://localhost:8000
# frontend → http://localhost:8081
# postgres → puerto 8080 (pgAdmin u otro cliente)
```

## Variables de entorno

El proyecto lee un archivo `.env` en la raíz. Variables requeridas:

```text
PROFILE=local          # local | dev | prod
SECRET_KEY=...
POSTGRES_DB=...
POSTGRES_USER=...
POSTGRES_PASSWORD=...
POSTGRES_HOST=...
POSTGRES_PORT=...
```

- `PROFILE=local` → usa PostgreSQL + DEBUG activado
- Cualquier otro valor → usa SQLite + DEBUG desactivado

## Arquitectura

### Backend (`backend/`)

Estructura de cada módulo Django:

```text
<modulo>/
  models.py       # entidades
  repositories.py # acceso a datos (capa de repositorio)
  services.py     # lógica de negocio
  views.py        # endpoints REST
  urls.py         # rutas del módulo
```

Módulos existentes y sus entidades principales:

| Módulo | Entidades |
| ------ | --------- |
| `categoria` | `Categoria` (árbol jerárquico, gasto/ingreso) |
| `periodo` | `Periodo`, `MapPeriodoCategoria` |
| `movimiento` | `Movimiento`, `MovimientoExcel` (importación batch) |
| `objetivo` | `Objetivo` (meta de ahorro), `MapCategoriaObjetivo` |

API REST base: `http://localhost:8000/<modulo>/`

### Frontend (`frontend/src/app/`)

Angular con componentes standalone organizados por módulo:

```text
<modulo>/
  <modulo>.ts              # modelo/interfaz TypeScript
  <modulo>-service.ts      # llamadas HTTP al backend
  <modulo>-list/           # componente lista
  <modulo>-edit/           # componente creación/edición
```

Rutas principales:

| Ruta | Componente |
| ---- | ---------- |
| `/` | `LandingPage` |
| `/periodo` | `PeriodoList` |
| `/categoria` | `CategoriaList` |
| `/movimiento` | `MovimientoList` |

## Convenciones

- El código y los nombres de entidades están en **español**.
- Cada módulo Django separa responsabilidades en capas:
  `repositories → services → views`.
- Los componentes Angular siguen el patrón `<modulo>-list` / `<modulo>-edit`.
- Tests unitarios junto al archivo que prueban (`*.spec.ts`).
