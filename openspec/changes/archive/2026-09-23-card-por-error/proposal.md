# Proposal: card-por-error

## Intent

Hasta ahora, en el daily log, los fallos de un ejercicio se listaban como bullets (`- **❌ Fallo N:**`) y luego se mostraba un único bloque `!!! failure` con el código de Pau y una sola `🧠 Lección` para todo el ejercicio. Con varios errores por ejercicio, cada error quedaba diluido y su lección se mezclaba con las demás.

Pau pidió (23/09/2026) que, desde ese día, **cada error documentado vaya en una card independiente**.

Segunda norma del mismo día: **al cerrar cada sesión, si un error ya no persiste, se saca de Repaso Urgente** (JS/DOM o Symfony). Así esas páginas solo listan lo que sigue reincidiendo y no crecen sin límite.

## Scope

### In Scope
- `rules/ejercicios-resultados.md`: sección "Ejercicios CON fallos" reescrita — un `!!! failure "❌ Fallo N — título"` por error, con su fragmento de código y su propia `🧠 Lección`.
- `rules/ejercicios-resultados.md`, sección "Cierre del bloque": poda de Repaso Urgente al cerrar sesión.
- Memoria de proyecto (feedback) para que la norma se aplique en sesiones futuras.

### Out of Scope
- Reescribir los daily logs anteriores (la norma rige "desde hoy"; el del 21/09 queda como está).
- El orden ✅ antes de ❌ (sigue pendiente, ver `proxima-sesion.md`).

## Approach

Una card = un error = un código = una lección. El bloque `!!! success` con la versión corregida sigue siendo uno por ejercicio.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `rules/ejercicios-resultados.md` | Modified | Nueva regla de card por error |

## Rollback Plan

Revertir el cambio en `rules/ejercicios-resultados.md` (volver a bullets + bloque único).
