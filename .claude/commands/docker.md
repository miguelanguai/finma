---
description: Gestiona el entorno Docker de Finma (up | down | logs | rebuild)
argument-hint: "up | down | logs | rebuild"
allowed-tools: [Bash]
---

Gestiona el entorno Docker de Finma.

El usuario ha invocado el comando con: $ARGUMENTS

## Instrucciones

Ejecuta la acción correspondiente al argumento recibido:

| Argumento | Comando |
|-----------|---------|
| `up` | `docker compose up -d` |
| `down` | `docker compose down` |
| `logs` | `docker compose logs --tail=50 -f` |
| `rebuild` | `docker compose up -d --build` |

- Si no se pasa argumento, muestra los cuatro disponibles y pregunta cuál ejecutar.
- Tras ejecutar, informa del resultado (servicios levantados, puertos accesibles, etc.).
- Para `up` y `rebuild`, recuerda al usuario las URLs disponibles:
  - Backend: http://localhost:8000
  - Frontend: http://localhost:8081
