# Proposal: fases-sdd

## Intent

Completar el primer artículo pendiente del temario de SDD en `docs/sdd/index.md`. La tabla de fases existe pero no hay página de detalle que explique cada fase con profundidad, ejemplos concretos, ni el mapeo con las 13 fases reales de la empresa de Pau.

## Scope

### In Scope
- Crear `docs/sdd/fases.md` con explicación detallada de cada fase SDD
- Diagrama de dependencias (DAG) entre fases
- Mapeo SDD ↔ 13 fases de la empresa de Pau
- Enlaces a recursos y referencias

### Out of Scope
- Modificar `docs/sdd/index.md` u otra documentación existente
- Crear las demás páginas del temario (`comparativa.md`, `orchestrator.md`, etc.)
- Cambios en código o configuración del proyecto

## Capabilities

### New Capabilities
- `sdd-docs`: Documentación de aprendizaje sobre metodología SDD en codeLearn

### Modified Capabilities
- None

## Approach

Página educativa en Markdown para MkDocs Material. Contenido en español, estructura con encabezados por fase, tabla resumen, diagrama ASCII/Mermaid para el DAG, y sección de mapeo con las fases de la empresa. Sin dependencias técnicas — solo documentación.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `docs/sdd/fases.md` | New | Página nueva con detalle de cada fase SDD |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Contenido desactualizado si SDD evoluciona | Low | Página enlazada desde index.md, fácil de actualizar |
| Mapeo con fases de empresa incompleto | Medium | Pau puede corregir el mapeo después; marcar como "v1" |

## Rollback Plan

Eliminar `docs/sdd/fases.md`. No afecta ningún otro archivo ni funcionalidad.

## Dependencies

- `docs/sdd/index.md` (temario existente, enlace a `fases.md`)

## Success Criteria

- [ ] `docs/sdd/fases.md` existe y es accesible desde `docs/sdd/index.md`
- [ ] Cada fase SDD tiene: objetivo, qué produce, duración estimada, ejemplo concreto
- [ ] Diagrama DAG de dependencias incluido
- [ ] Mapeo SDD ↔ 13 fases de la empresa presente
- [ ] Renderiza correctamente en MkDocs Material
