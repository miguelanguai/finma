# Pendiente de implementar

## 1. Módulo objetivo (frontend completo)

El backend tiene CRUD completo para `Objetivo` y `MapCategoriaObjetivo`,
pero en el frontend no existe nada. Hay que crear:

- `frontend/src/app/objetivo/objetivo.ts` — modelo TypeScript
- `frontend/src/app/objetivo/objetivo-service.ts`
- `frontend/src/app/objetivo/objetivo-list/` — componente lista con CRUD
- `frontend/src/app/objetivo/objetivo-edit/` — diálogo creación/edición
- Ruta `/objetivo` en `app.routes.ts`
- Entrada en `header.ts`

---

## 2. Bugs en movimiento-list y movimiento-edit

| Archivo | Problema |
| ------- | -------- |
| `movimiento-list.ts` | `imports[]` no incluye `ConfirmDialogModule` ni `ToastModule` |
| `movimiento-list.html` | Faltan `<p-confirmDialog>` y `<p-toast>` en la plantilla |
| `movimiento-list.ts` | Header del diálogo hardcodeado como `"select"` |
| `movimiento-edit.html` | Botón siempre dice "Crear", debería ser condicional |
| `movimiento-edit.html` | `p-select` usa `optionValue="id"` pero el modelo tipifica `periodo` y `categoria` como objetos — la selección previa no se restaura al editar |

---

## 3. Bug en map-cat-per-service

`getMapGastoTotal` llama con `http.get` pero el endpoint
`MapPeriodoCategoriaView3` espera `POST`. La llamada siempre devuelve 405.

Archivo: `frontend/src/app/periodo/map-cat-per-service.ts`

---

## 4. Detalles menores

| Archivo | Detalle |
| ------- | ------- |
| `periodo-list.ts` | Header del diálogo hardcodeado como `"select"` |
| `periodo-list.ts` | `showDeletePeriodoDialog` llama `ngOnInit()` y luego `getPeriodos()` redundantemente |
| `movimiento-list.ts` | Mismo patrón redundante en el delete |
