# Proposal: formato-repaso-urgente

## Intent

Las páginas Repaso urgente (JS/DOM y Symfony) mostraban el código como bloques sueltos, con el error primero y el código bueno después, distinto al daily log. Pau pidió (26/09/2026) el mismo formato de cards que los daily: primero el código bueno en una card `✅`, luego cada error en su propia card `❌`, y que los avisos (tip, danger, warning, reincidencias) se queden como estaban.

## Scope

### In Scope
- `rules/ejercicios-resultados.md`: sección nueva «Formato de las páginas Repaso urgente» y regla explícita de que el `✅` va antes que los `❌`.
- `docs/waytoCode/repaso-urgente-js.md` reformateado a ese formato.

### Out of Scope
- `repaso-urgente-symfony.md` y demás páginas de repaso: se reformatean cuando se toquen.
- Daily anteriores.

## Approach

El hook `codelearn-docs-norms.sh` ya enruta cualquier `.md` bajo `docs/waytocode/` a `rules/ejercicios-resultados.md`, así que la norma nueva se inyecta también al editar Repaso urgente. No hace falta tocar el hook.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `rules/ejercicios-resultados.md` | Modified | Formato de Repaso urgente y orden ✅ antes de ❌ |
| `docs/waytoCode/repaso-urgente-js.md` | Modified | Código en cards success/failure |

## Rollback Plan

Revertir ambos archivos.
