# Proposal: fix-mkdocs-serve-wdac

## Intent

El hook `SessionStart` (`~/.claude/hooks/codelearn-sessionstart.sh`) autoarranca `mkdocs serve` en segundo plano al empezar sesión en codeLearn, para que la doc esté servida en `http://127.0.0.1:8000` sin acción manual. Desde una actualización reciente de Windows, ese arranque falla en silencio: una directiva de Control de aplicaciones (Windows Defender Application Control / Smart App Control) bloquea la ejecución directa de `mkdocs.exe`, con el error "Una directiva de Control de aplicaciones bloqueó este archivo". El proceso muere al instante, sin log útil, y el puerto 8000 nunca queda escuchando.

Diagnosticado en sesión: `mkdocs build --strict` invocado directo también falla con el mismo error, mientras que `python -m mkdocs build --strict` funciona sin problema — la directiva bloquea el binario `mkdocs.exe` concreto, no `python.exe`, que sí está permitido.

## Scope

### In Scope
- `~/.claude/hooks/codelearn-sessionstart.sh`: cambiar `nohup mkdocs serve ...` por `nohup python -m mkdocs serve ...`
- Persistencia en openspec (este cambio)

### Out of Scope
- Cualquier otro uso de `mkdocs` en el repo (comandos manuales, CI de GitHub Pages) — ese `mkdocs build --strict` ya se invoca desde Python en el workflow, no afectado
- La causa raíz en Windows (la propia directiva de Control de aplicaciones) — no es algo que se pueda desactivar desde el repo

## Approach

Invocar mkdocs siempre como módulo de Python (`python -m mkdocs ...`) en vez de depender del wrapper `.exe` que Windows puede bloquear. Verificado manualmente: `python -m mkdocs serve` levanta el server y `http://127.0.0.1:8000` responde 200.

## Affected Areas

| Area | Impact | Description |
|------|--------|--------------|
| `~/.claude/hooks/codelearn-sessionstart.sh` | Modified | `mkdocs serve` → `python -m mkdocs serve` |

## Rollback Plan

Revertir la línea a `nohup mkdocs serve > "$LOG_FILE" 2>&1 & disown` si `python -m mkdocs` dejara de funcionar por algún motivo.

## Success Criteria

- [x] `python -m mkdocs serve` levanta el server y responde 200 en `http://127.0.0.1:8000`
- [ ] La próxima sesión nueva en codeLearn arranca con mkdocs ya servido, sin intervención manual (a confirmar por Pau)
