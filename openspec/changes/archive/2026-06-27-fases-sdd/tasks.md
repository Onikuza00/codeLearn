# Tasks: fases-sdd

## Review Workload Forecast

| Campo | Valor |
|-------|-------|
| Líneas estimadas cambiadas | ~250-350 |
| Riesgo presupuesto 400 líneas | Low |
| Chained PRs recomendados | No |
| Split sugerido | Single PR |
| Estrategia de entrega | single-pr |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Phase 1: Prerrequisito — Configurar Mermaid en mkdocs.yml

- [x] **T1** — Modificar `mkdocs.yml`: reemplazar `- pymdownx.superfences` por la versión con `custom_fences` para Mermaid (ver diseño, sección `mkdocs.yml Change Detail`). Criterio: `mkdocs build` sin errores, bloque ` ```mermaid ` renderiza como diagrama.
- [x] **T1.1** — Ejecutar `mkdocs build` y verificar que no hay warnings ni errores tras el cambio de configuración.

## Phase 2: Documentación — Crear docs/sdd/fases.md

- [x] **T2.1** — Crear `docs/sdd/fases.md` con: título (`# Fases de SDD — Detalle`), introducción de 2-3 líneas con contexto y enlace de vuelta a `index.md`.
- [x] **T2.2** — Agregar sección "Diagrama de dependencias (DAG)" con bloque ` ```mermaid ` tipo `flowchart LR` que conecte: init → explore → propose → spec → design → tasks → apply → verify → archive. Incluir `!!! note` admonition aclarando que `sdd-init` es one-time.
- [x] **T2.3** — Agregar sección "Las 9 fases" con un `##` por fase (init, explore, propose, spec, design, tasks, apply, verify, archive). Cada fase debe incluir: **Objetivo** (1 frase), **Artifact que produce**, **Duración estimada**, **Quién ejecuta**, **Dependencias**, y **Ejemplo codeLearn** concreto. Agregar `!!! tip` admonitions donde aporten valor práctico.
- [x] **T2.4** — Agregar sección "Mapeo SDD ↔ Fases de la empresa" con tabla de columnas: Fase SDD, Fase(s) empresa, Notas. Etiquetar como "v1 — mapeo preliminar" con `!!! warning` admonition. Mapear las 9 fases SDD contra las ~13 fases del workflow de Pau (PRD → Deploy).
- [x] **T2.5** — Agregar sección "Recursos adicionales" con enlaces a: gentle-ai, Engram, OpenSpec. Usar `!!! info` admonition.
- [x] **T2.6** — Verificar contenido: todas las fases tienen los 6 campos requeridos (objetivo, artifact, duración, ejecutor, ejemplo, dependencias). El orden de fases coincide con la tabla del `index.md`.
- [x] **T2.7** — Verificar build final: `mkdocs build` sin errores, inspección visual de que el diagrama Mermaid y las admonitions renderizan correctamente en navegador.

## Estado inicial

Todas las tareas están **pendientes** (`[ ]`). Ninguna completada.
