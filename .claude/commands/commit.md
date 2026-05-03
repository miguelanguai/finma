---
description: Redacta y ejecuta un commit siguiendo el formato de commits de Finma
allowed-tools: [Bash, Read]
---

Redacta y ejecuta un commit siguiendo el formato Finma:
`<tipo>(<modulo>): <emoji_gitmoji> <descripción en español>`

## Instrucciones

1. **Comprueba si hay cambios staged:**
   ```bash
   git diff --staged
   ```
   Si no hay nada staged, muestra `git status` y avisa al usuario de que debe hacer `git add` primero. Para aquí.

2. **Analiza el diff staged** e infiere:
   - **tipo**: `feat` | `fix` | `style` | `refactor` | `test` | `docs` | `chore`
   - **modulo**: nombre del módulo afectado (`categoria`, `periodo`, `movimiento`, `objetivo`, `presupuesto`, etc.). Si afecta a varios, usa el más relevante. Si es config/infra, usa `config`.
   - **emoji**: según el tipo (ver tabla)
   - **descripción**: frase corta en español, imperativo, sin punto final

   | Tipo | Emoji |
   |------|-------|
   | feat | `:sparkles:` |
   | fix | `:bug:` |
   | style | `:lipstick:` |
   | refactor | `:recycle:` |
   | test | `:white_check_mark:` |
   | docs | `:memo:` |
   | chore | `:wrench:` |

3. **Propón el mensaje** al usuario y pide confirmación explícita antes de ejecutar el commit.

4. **Ejecuta el commit** solo si el usuario confirma:
   ```bash
   git commit -m "<tipo>(<modulo>): <emoji> <descripción>"
   ```

5. Muestra el hash del commit resultante.
