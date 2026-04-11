Ejecuta los tests del proyecto Finma y reporta los resultados.

Argumentos opcionales en `$ARGUMENTS`:
- `backend` → solo tests de Django
- `frontend` → solo tests de Angular
- (vacío) → ambos

**Tests de backend (Django)**
Ejecuta desde la carpeta `backend/`:
```
cd backend && python manage.py test
```
Reporta: número de tests, errores y fallos. Si hay fallos, muestra el traceback completo.

**Tests de frontend (Angular)**
Ejecuta desde la carpeta `frontend/`:
```
cd frontend && npx ng test --watch=false --browsers=ChromeHeadless
```
Reporta: suites ejecutadas, tests pasados/fallados. Si hay fallos, muestra el mensaje de error.

Al finalizar, muestra un resumen con:
- Estado general (todo OK / hay fallos)
- Conteo de tests por bloque (backend / frontend)
- Lista de tests fallados con su mensaje de error, si los hay
