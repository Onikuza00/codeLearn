# OpenSpec

> El criterio de CUÁNDO usarlo ya vive en [Normas globales](../01-normas-globales/index.md). Esta página es el CÓMO: qué es, para qué sirve, cómo se configura y qué hace exactamente una vez que decidiste que un proyecto lo necesita.

---

## Qué es

OpenSpec es la capa de persistencia de la metodología SDD (Spec-Driven Development): registra cada cambio real de un proyecto — features, pero también cambios de configuración o arquitectura — en archivos `.md` normales, versionados en git. No es una base de datos ni un servicio externo: es texto plano que vive dentro del propio repo.

## Para qué sirve

- Guarda el **porqué** de un cambio, no solo el resultado final — el código dice QUÉ se hizo, OpenSpec dice POR QUÉ.
- Permite retomar un cambio semanas después sin reconstruir el contexto de memoria.
- Es **portable**: al ser archivos normales del repo, viajan con un `git clone` a cualquier máquina — a diferencia de una memoria de sesión, que se queda en el equipo donde se generó.

## Cómo se configura

Se monta una única vez, con `sdd-init`, después de haber decidido (paso 1) que el proyecto lo necesita. Crea esta estructura en la raíz:

| Ruta | Qué contiene |
|---|---|
| `openspec/config.yaml` | Contexto del proyecto (stack, idiomas, comandos de test) y reglas por fase |
| `openspec/changes/<slug>/` | Cambios **en curso** — trabajo planificado que aún no se cerró |
| `openspec/changes/archive/<fecha>-<slug>/` | Cambios **cerrados**, con su historial completo |
| `openspec/specs/<dominio>/spec.md` | Specs **vivas** por capability — el estado actual de ese dominio, no el historial |

`sdd-init` lee el stack real del repo para rellenar `config.yaml` — por eso no se puede ejecutar antes de que el proyecto exista con contenido.

### `config.yaml`

No es una copia de tu `AGENTS.md`/`CLAUDE.md`. Es una síntesis con dos bloques de origen distinto:

| Bloque | De dónde sale | Para qué sirve |
|---|---|---|
| `context` | Resumen que `sdd-init` deriva de tu `AGENTS.md`/`CLAUDE.md` y del propio repo (stack, idioma, comandos de test) | Da a las fases de SDD el contexto mínimo para trabajar, sin releer todo el repo en cada fase |
| `rules` | Nuevo — no existe en ningún archivo previo al ejecutar `sdd-init` | Define el comportamiento concreto de cada fase: qué debe llevar un `design.md`, qué comando de test correr en `apply`/`verify`, qué criterio sigue una `proposal` |

??? example "Ejemplo de config.yaml"
    ```yaml
    context: |
      Proyecto: [qué es, en una línea]
      Stack: [lenguaje, framework]
      Comandos de test: [comando real del repo]

    rules:
      design:
        - [criterio de diseño propio de este proyecto]
      apply:
        tdd: true
        test_command: "..."
      verify:
        test_command: "..."
        coverage_threshold: 0
      archive:
        - Mover a archive/ al completar el cambio
        - Guardar lecciones aprendidas
    ```

## El ciclo completo

Para un cambio que sí lo necesita (según el criterio del paso 1), el trabajo pasa por fases, cada una con su propósito único:

```
Explorar → Proponer → Especificar → Diseñar → Tareas → Aplicar → Verificar → Archivar
```

| Fase | Produce |
|---|---|
| Explorar | Investigación del problema o del código existente |
| Proponer | Intención, alcance y riesgos del cambio |
| Especificar | Requisitos formales |
| Diseñar | Decisiones de arquitectura, con alternativas consideradas |
| Tareas | Checklist de trabajo atómico |
| Aplicar | El código en sí, marcando tareas completadas |
| Verificar | Contraste del resultado contra specs/diseño/tareas |
| Archivar | Mueve el cambio a `archive/`, sincroniza las specs vivas |

## Versión reducida

No todo cambio que pasa por OpenSpec necesita las 8 fases. Para un ajuste de configuración o arquitectura que sigue un patrón ya existente (el caso "no" o intermedio del criterio del paso 1), alcanza con:

- `proposal.md` — qué cambió y por qué, siempre
- `design.md` — solo si hubo alternativas reales evaluadas
- Directo a `archive/`, sin pasar por "en curso" — porque el cambio ya está hecho y probado a mano, no es trabajo futuro planificado

## Cómo recupera el estado

OpenSpec no depende de memoria de sesión: los propios archivos `.md` bajo `openspec/changes/` son la fuente de verdad. Retomar un cambio es leer esos archivos del filesystem, no consultar una base de datos — por eso sigue siendo exportable con el repo aunque no haya ninguna sesión previa cargada.

!!! tip "Por qué esto importa para la portabilidad"
    Un servidor de memoria persistente (tipo `engram`) vive fuera del repo — no viaja con un `git clone`. Un cambio en `openspec/` sí viaja, porque son archivos normales dentro del proyecto. Por eso es la capa elegida para registrar decisiones importantes de un proyecto, no solo confiar en la memoria de sesión.

!!! note "Ejemplo real aplicado"
    Este mismo proyecto documenta cómo tiene montado OpenSpec en la práctica en [Configuración de OpenSpec](../../../ia/claude/03-automatizaciones/02-openspec/index.md) — sirve como caso de estudio concreto de todo lo de arriba.

---

## Checklist

- [ ] `sdd-init` se ejecutó después de tener el repo con contenido real, no antes
- [ ] `openspec/config.yaml` refleja el stack real del proyecto
- [ ] Sabes distinguir cuándo un cambio va por el ciclo completo y cuándo por la versión reducida
- [ ] Ningún cambio importante del proyecto queda sin su `proposal.md`, aunque sea la versión mínima
