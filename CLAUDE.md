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

## Commits

Formato: `<tipo>(<modulo>): <emoji_gitmoji> <descripción en español>`

| Tipo | Emoji | Uso |
| ---- | ----- | --- |
| `feat` | `:sparkles:` | Nueva funcionalidad |
| `fix` | `:bug:` | Corrección de bug |
| `style` | `:lipstick:` | Cambios visuales / CSS |
| `refactor` | `:recycle:` | Reestructuración sin cambio funcional |
| `test` | `:white_check_mark:` | Añadir o corregir tests |
| `docs` | `:memo:` | Documentación |
| `chore` | `:wrench:` | Tareas de mantenimiento / config |

Ejemplo: `feat(presupuesto): :sparkles: añadir listado de presupuestos`

## Tests

- **Backend:** cada `services.py` debe tener su `test_<modulo>.py` con casos básicos (CRUD y casos de error).
- **Frontend:** spec mínimo por componente: que renderice correctamente y que llame al servicio esperado.
- Los archivos de test van junto al archivo que prueban (`test_<modulo>.py` en backend, `*.spec.ts` en frontend).

## Error handling (backend)

**Repositorio** — try/except específico, `logger.error()` y devolver `None`. Re-raise solo en errores críticos (p.ej. fallo de conexión a DB):

```python
import logging
logger = logging.getLogger(__name__)

def find_by_id(self, id: int) -> Entidad | None:
    try:
        return Entidad.objects.get(pk=id)
    except Entidad.DoesNotExist as error:
        logger.error(error)
        return None
```

**Vista** — comprobar el resultado del servicio y devolver la respuesta HTTP apropiada. La validación se delega a los serializers:

```python
# GET / DELETE → 200 si existe, 404 si no
entidad = self.service.find_by_id(id)
if entidad:
    return Response(serializer.data, status=status.HTTP_200_OK)
return Response({"error": "Entidad no encontrada"}, status=status.HTTP_404_NOT_FOUND)

# POST → 201 si válido, 400 si falla validación
serializer = EntidadWriteSerializer(data=request.data)
if serializer.is_valid():
    self.service.save(serializer.validated_data)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

Códigos HTTP usados: `200` GET/DELETE ok · `201` POST ok · `400` validación fallida · `404` recurso no encontrado.
Estructura de error: `{"error": "Descripción en español"}`.
