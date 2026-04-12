---
description: Crea un nuevo issue en el repo miguelanguai/finma con título, cuerpo y etiqueta opcionales
argument-hint: "<título>" [cuerpo] [label]
allowed-tools: [Bash, Read]
---

Crea un issue en el repositorio GitHub `miguelanguai/finma`.

El usuario ha invocado el comando con: $ARGUMENTS

## Instrucciones

1. **Parsea los argumentos** tal como los escribió el usuario. El formato esperado es:
   - Solo título: `/nuevo-ticket "Título del ticket"`
   - Con cuerpo: `/nuevo-ticket "Título" "Cuerpo descriptivo"`
   - Con label: `/nuevo-ticket "Título" "Cuerpo" enhancement`
   - Si no se pasa cuerpo, genera uno coherente basado en el título y el contexto del proyecto (app de gestión de finanzas personales con Angular + Django).

2. **Infiere la etiqueta** si no se proporciona explícitamente:
   - Usar `bug` si el título contiene palabras como "bug", "error", "fallo", "fix", "corregir"
   - Usar `enhancement` para nuevas funcionalidades o mejoras
   - Omitir label si no hay una clara

3. **Crea el issue** ejecutando:
   ```bash
   gh issue create \
     --repo miguelanguai/finma \
     --title "<título>" \
     --body "<cuerpo>" \
     [--label "<label>"]
   ```

4. **Añade el issue al project board Finma** (proyecto #8):
   ```bash
   gh project item-add 8 --owner miguelanguai --url <url-issue>
   ```

5. **Tras crear el issue**, muestra al usuario el número y URL del issue creado y confirma que se añadió al board.

## Contexto del proyecto

- Repo: `miguelanguai/finma`
- App de gestión de gastos: backend Django + frontend Angular
- Módulos existentes: `categoria`, `periodo`, `movimiento`, `objetivo`
- Issues existentes relevantes: #12 (Objetivo), #10 (Movimiento), #9 (Categoria), #13 (Landing Page), #14 (Análisis)
- El cuerpo del issue debe escribirse en español
