Crea un nuevo módulo Angular para la entidad `$ARGUMENTS` siguiendo exactamente las convenciones del proyecto Finma.

El nombre de carpetas y archivos debe estar en minúsculas con guiones (kebab-case). El nombre de clases en PascalCase. Todo el código en español.

Genera los siguientes archivos en `frontend/src/app/<modulo>/`:

**`<modulo>.ts`** — Modelo/interfaz TypeScript
- Clase con constructor que acepta parámetros opcionales con valores por defecto
- Mismo patrón que `Categoria`: campos tipados, constructor con sobrecarga, defaults con `??`

**`<modulo>-service.ts`** — Servicio HTTP
- `@Injectable({ providedIn: 'root' })`
- Inyecta `HttpClient`
- Métodos CRUD: `get<Entidades>()`, `get<Entidad>ById(id)`, `save<Entidad>(entidad)`, `delete<Entidad>(entidad)`
- Las URLs apuntan a `http://localhost:8000/<modulo>/` (con `/id/` para operaciones por id)
- `save` usa PUT si la entidad tiene id, POST si no lo tiene

**`<modulo>-list/<modulo>-list.ts`** — Componente lista
- Componente standalone con `selector: 'app-<modulo>-list'`
- Importa los módulos PrimeNG necesarios (TableModule, ButtonModule, ToastModule, ConfirmDialogModule)
- Providers: `DialogService`, `MessageService`, `ConfirmationService`
- Inyecta el servicio de la entidad
- Métodos: `ngOnInit`, `get<Entidades>`, `showCreate<Entidad>Dialog`, `showDelete<Entidad>Dialog`
- Sigue el patrón de `CategoriaList`: abre `DynamicDialog` con el componente edit, recoge el resultado en `onClose` y llama al servicio

**`<modulo>-list/<modulo>-list.html`** — Template lista
- Tabla PrimeNG (`p-table`) con las columnas de la entidad
- Botones de crear (cabecera), editar y eliminar (columna de acciones)
- `p-toast` y `p-confirmDialog` al inicio

**`<modulo>-edit/<modulo>-edit.ts`** — Componente edición (DynamicDialog)
- Componente standalone que recibe datos vía `DynamicDialogConfig`
- Si recibe una entidad existente, rellena el formulario para edición; si no, crea una nueva
- Al confirmar llama a `DynamicDialogRef.close(entidad)` con la entidad actualizada

**`<modulo>-edit/<modulo>-edit.html`** — Template edición
- Formulario con campos PrimeNG (InputText, InputNumber, Dropdown según el tipo)
- Botones Cancelar y Guardar

Tras crear los archivos, indica al usuario los pasos manuales:
1. Añadir la ruta en `frontend/src/app/app.routes.ts`:
   `{ path: '<modulo>', component: <Entidad>List }`
2. Añadir el enlace de navegación en `frontend/src/app/core/header/header.html`
