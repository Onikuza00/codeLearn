# Proposal: changelog-context-injection

## Intent

Tras registrar cambios arquitectónicos en `openspec/` (ver `hook-codelearn-session`), Pau preguntó cómo se garantiza tener "pleno contexto y memoria de todos los cambios hechos y evolución" en cada sesión. La respuesta honesta era: no había garantía — leer `openspec/` seguía siendo una acción bajo demanda, el mismo problema que motivó el hook original con engram.

Cargar el historial completo de cada cambio (`proposal.md`/`design.md` de cada carpeta) en cada sesión no escala: hoy son 2-3 cambios, pero crecerá, e inflaría el contexto sin necesidad la mayoría de las veces. Se optó por un índice corto (una línea por cambio) que sí se puede cargar siempre, dejando el detalle completo para consulta bajo demanda.

## Scope

### In Scope
- `openspec/changes/archive/CHANGELOG.md`: índice de una línea por cambio archivado
- Ampliar `~/.claude/hooks/codelearn-session.sh` para inyectar el contenido completo del changelog en `additionalContext` cuando detecta sesión nueva
- Regla escrita (`RULES.md` + `CLAUDE.md`): añadir fila al changelog en el mismo paso de archivar un cambio

### Out of Scope
- Cargar el detalle completo (`proposal.md`/`design.md`) de cada cambio automáticamente — sigue siendo bajo demanda
- Truncar/paginar el changelog cuando crezca mucho (queda como límite conocido, se resuelve cuando haga falta)

## Capabilities

### New Capabilities
- `tooling-automation`: se amplía con inyección automática del historial de cambios

### Modified Capabilities
- `hook-codelearn-session` (2026-08-15) — el hook ahora también inyecta el changelog

## Approach

Índice Markdown plano, git-versionado, actualizado a mano en cada archivado. El hook lo lee con `cat` (mecánico, sin criterio) y lo concatena al `additionalContext` ya existente solo en la rama de "sesión nueva" — en la misma sesión no hace falta repetirlo.

## Affected Areas

| Area | Impact | Description |
|------|--------|--------------|
| `openspec/changes/archive/CHANGELOG.md` | New | Índice de cambios |
| `~/.claude/hooks/codelearn-session.sh` | Modified | Lee y adjunta el changelog en sesión nueva |
| `RULES.md` / `CLAUDE.md` | Modified | Regla de actualizar el changelog al archivar |
| `docs/ia/claude/03-automatizaciones/` | Modified | Documentación de uso actualizada en ambos temas |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| El changelog crece indefinidamente y el contexto inyectado se vuelve caro | Medium (a largo plazo) | Documentado como límite conocido; cuando ocurra, recortar a las últimas N entradas |
| Se archiva un cambio sin añadir su fila al changelog (regla escrita, no forzada por código) | Medium | Mismo tipo de riesgo que la regla de nav — mitigado por ser una instrucción explícita y corta de seguir |

## Rollback Plan

Revertir el cambio en `codelearn-session.sh` (quitar la lectura del changelog) y opcionalmente borrar `CHANGELOG.md`. No afecta a los cambios ya archivados ni a sus `proposal.md`/`design.md`.

## Dependencies

- `hook-codelearn-session` (2026-08-15) ya activo

## Success Criteria

- [x] `CHANGELOG.md` existe con las entradas de los cambios ya archivados
- [x] El hook inyecta el changelog completo solo en sesión nueva (probado con pipe-test)
- [x] En la misma sesión, no se repite el changelog (probado)
- [x] Regla de actualizar el changelog al archivar, escrita en `RULES.md` y `CLAUDE.md`
- [x] Documentado en `docs/ia/claude/03-automatizaciones/`
