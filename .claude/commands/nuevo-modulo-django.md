Crea un nuevo módulo Django para la entidad `$ARGUMENTS` siguiendo exactamente las convenciones del proyecto Finma.

El nombre del módulo y de los archivos debe estar en minúsculas y en español. El nombre de la entidad (clase) debe estar en PascalCase.

Genera los siguientes archivos en `backend/<modulo>/`:

**models.py**
- Clase que extiende `django.db.models.Model`
- Campos coherentes con la entidad solicitada
- Método `__str__` descriptivo

**repositories.py**
- Clase `<Entidad>Repository` con logger
- Métodos: `find_all`, `find_by_id`, `save`, `delete`
- Misma estructura que `CategoriaRepository`: manejo de `DoesNotExist` con logger en `find_by_id`

**services.py**
- Clase `<Entidad>Service` que instancia el repositorio en `__init__`
- Métodos: `find_all`, `find_by_id`, `save`, `update`, `delete`
- `save` y `update` reciben `dict` y construyen la entidad antes de llamar al repo

**serializers.py**
- `<Entidad>ReadSerializer` y `<Entidad>WriteSerializer` usando `rest_framework.serializers.ModelSerializer`

**views.py**
- Clase `<Entidad>View(APIView)` con métodos `get`, `post`, `put`, `delete`
- Mismo patrón que `CategoriaView`: usa el serializer Read para GET y Write para POST/PUT
- `get` acepta `<entidad>_id: int = None` y devuelve lista o elemento según corresponda

**urls.py**
- `urlpatterns` con las rutas `/<modulo>/` y `/<modulo>/<id>/` apuntando a `<Entidad>View`

Tras crear los archivos, indica al usuario los pasos manuales que quedan:
1. Añadir `'<modulo>'` a `INSTALLED_APPS` en `backend/root/settings.py`
2. Incluir las urls del módulo en `backend/root/urls.py` con `path('<modulo>/', include('<modulo>.urls'))`
3. Ejecutar `python manage.py makemigrations <modulo>` y `python manage.py migrate`
