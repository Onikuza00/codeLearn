# Configuración de OpenSpec { .bloque-ia }

> Guía de uso de OpenSpec en este proyecto: qué hace, cómo funciona su ciclo de fases, cómo recupera el estado de un cambio y dónde está todo. No es teoría de SDD en general — es la referencia de cómo está montado aquí.

---

## Qué hace

Registra **cada cambio real** del proyecto (features, pero también cambios arquitectónicos o de configuración como hooks o convenciones) con su intención, alcance y — cuando aplica — diseño, tareas y verificación. No sustituye a engram ni a `RULES.md`: es el sitio donde queda el **porqué** de un cambio concreto, versionado en git, no solo la regla final que resulta de él.

## Dónde se encuentra

Todo vive bajo `openspec/`, en la raíz del proyecto:

| Ruta | Qué contiene |
|---|---|
| `openspec/config.yaml` | Contexto del proyecto (stack, idiomas, comandos de test) y reglas por fase |
| `openspec/changes/<slug>/` | Cambios **en curso** — features planificadas que aún no se archivaron |
| `openspec/changes/archive/<fecha>-<slug>/` | Cambios **cerrados** — el historial completo, con su porqué |
| `openspec/changes/archive/CHANGELOG.md` | Índice de una línea por cambio archivado — la evolución completa, de un vistazo |
| `openspec/specs/<dominio>/spec.md` | Specs **vivas** por capability (ej. `hero`, `footer`, `sdd`, `learning-plan`) — el estado actual de cada dominio, no el historial |

## Cómo funciona el ciclo completo

Para una feature planificada, el cambio pasa por fases, cada una ejecutada por un skill dedicado:

```
sdd-init (una vez) → sdd-explore → sdd-propose → sdd-spec → sdd-design
  → sdd-tasks → sdd-apply → sdd-verify → sdd-archive
```

| Fase | Skill | Produce |
|---|---|---|
| Explorar | `sdd-explore` | Investigación del problema/código existente |
| Proponer | `sdd-propose` | `proposal.md` — intención, alcance, riesgos |
| Especificar | `sdd-spec` | Requisitos formales (delta specs) |
| Diseñar | `sdd-design` | `design.md` — decisiones de arquitectura con alternativas consideradas |
| Desglosar | `sdd-tasks` | `tasks.md` — checklist de trabajo |
| Implementar | `sdd-apply` | Código, marcando tareas completadas |
| Verificar | `sdd-verify` | `verify-report.md` — contraste contra specs/design/tasks |
| Archivar | `sdd-archive` | Mueve el cambio a `archive/`, sincroniza `openspec/specs/` |

`sdd-status` muestra el estado de un cambio activo; `sdd-continue` retoma automáticamente la siguiente fase pendiente.

## Versión reducida — cambios de configuración/arquitectura

No todo cambio necesita el ciclo completo. Para un hook, una convención nueva o un ajuste de `settings.json` (no una feature con usuarios/pantallas), alcanza con:

- `proposal.md` — qué cambió y por qué, siempre
- `design.md` — solo si hubo alternativas evaluadas de verdad
- Directo a `archive/`, sin pasar por `changes/` "en curso" — porque el cambio ya está hecho y probado a mano, no es trabajo planificado a futuro

Ejemplo real aplicado: `openspec/changes/archive/2026-08-15-hook-codelearn-session/` documenta el hook de la [página anterior](../01-hook-inicio/index.md) con esta versión reducida.

**Regla al archivar**: añadir una fila en `openspec/changes/archive/CHANGELOG.md` en el MISMO paso — igual que la regla de nav en `mkdocs.yml`. Un cambio archivado sin fila en el changelog no aparece en el resumen que se inyecta al iniciar sesión (siguiente sección).

## Cómo recupera el estado

OpenSpec **no usa engram**. El estado de un cambio es literal: los propios archivos `.md` bajo `openspec/changes/` son la fuente de verdad, versionados en git. `sdd-status` y `sdd-continue` funcionan leyendo esos archivos directamente del filesystem, no una base de datos de memoria — por eso el cambio es exportable con el repo, aunque no haya ninguna sesión de engram cargada.

Eso sí, tener los archivos ahí no garantiza que se lean — leer `openspec/` sigue siendo una acción bajo demanda (`Glob`/`Read`), no algo que ocurra solo. Por eso el [hook de inicio](../01-hook-inicio/index.md) inyecta el contenido completo de `CHANGELOG.md` cada vez que arranca una sesión nueva: es un `cat` mecánico (sin criterio de por medio), así que puede hacerlo el propio hook en vez de depender de que la conversación toque el tema. El detalle completo de un cambio puntual (`proposal.md`/`design.md`) sigue siendo bajo demanda — solo el índice se carga siempre.

!!! tip "Por qué esto resuelve el problema de portabilidad"
    Engram vive fuera del repo (memoria del agente, no viaja con `git clone`). Un cambio en `openspec/` sí viaja, porque son archivos normales dentro del proyecto — por eso es la capa elegida para registrar el "porqué" de cada decisión importante, y no solo confiar en la memoria de sesión.

!!! note "Cuándo NO usar OpenSpec"
    Contenido de teoría o ejercicios que sigue un patrón ya existente no necesita una entrada — eso sigue yendo directo a `docs/` + engram, como siempre. OpenSpec es para cambios sobre el propio proyecto (herramientas, arquitectura, configuración), no para el contenido de aprendizaje del día a día.
