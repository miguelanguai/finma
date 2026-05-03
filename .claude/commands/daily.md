---
description: Revisión diaria del estado del proyecto Finma
allowed-tools: [Bash, Read]
---

Muestra un resumen del estado actual del proyecto para empezar la sesión de trabajo.

## Instrucciones

Ejecuta los siguientes pasos en orden y presenta la información de forma clara:

1. **Últimos commits:**
   ```bash
   git log --oneline -5
   ```

2. **Cambios sin commitear:**
   ```bash
   git status --short
   ```

3. **Tickets pendientes:** lee `docs/pendiente.md` y lista los ítems marcados como pendientes o en progreso.

4. **Siguiente paso sugerido:** basándote en el estado actual (commits recientes + pendientes), sugiere la tarea más prioritaria para esta sesión de trabajo. Ten en cuenta que la siguiente feature grande es **Presupuestos**.

Presenta todo en un formato compacto y accionable, sin texto de relleno.
