# SDD — Spec-Driven Development

## ¿Qué es SDD?

**Spec-Driven Development** (Desarrollo Guiado por Especificaciones) es una metodología de ingeniería de software donde las especificaciones escritas y estructuradas actúan como la fuente única de verdad y el motor principal del desarrollo.

El código pasa a ser un **subproducto** generado (mayoritariamente por IA) a partir de las especificaciones.

### Los 3 pilares

1. **La Especificación es ejecutable** — No es un texto pasivo. Es un archivo estructurado (.md, YAML, OpenAPI) que un agente de IA puede leer y traducir directamente a código.
2. **Inversión del esfuerzo (Pensar > Picar)** — El 80% del tiempo va a diseñar y definir, no a picar código sintáctico.
3. **El código es efímero, el Spec es eterno** — Si hay que cambiar de stack (PHP → Node, JS → TS), se cambia la spec y se regenera el código. No se modifica código a mano.

---

## ¿Por qué SDD en CodeLearn?

Porque Pau programa sin IA no es lo mismo que Pau programa **con** IA. SDD te da un marco para:

- No arrancar a codear sin tener claro QUÉ hay que hacer
- Separar "estoy explorando" de "estoy implementando"
- No olvidarte casos borde
- Poder retomar un cambio semanas después sin perder contexto
- Que la IA haga lo que mejor sabe (generar código mecánico) y tú hagas lo que mejor sabes (decidir, diseñar, corregir)

---

## Las fases de SDD

```
Explorar → Proponer → Especificar → Diseñar → Tasks → Aplicar → Verificar → Archivar
```

Cada fase tiene un objetivo ÚNICO y no se puede saltar.

| Fase | ¿Qué hace? | Duración |
|------|-----------|:--------:|
| **sdd-init** | Prepara el proyecto para trabajar con SDD | 1 vez |
| **sdd-explore** | Investiga el código existente, entiende el contexto | 5-10 min |
| **sdd-propose** | Define QUÉ cambio y POR QUÉ (intención) | 5-10 min |
| **sdd-spec** | Escribe requisitos detallados con casos de uso | 10-15 min |
| **sdd-design** | Decide CÓMO se implementa técnicamente | 10-15 min |
| **sdd-tasks** | Divide el cambio en tareas atómicas | 5 min |
| **sdd-apply** | Implementa las tareas una por una | La que lleve |
| **sdd-verify** | Valida que funciona contra las specs | 5-10 min |
| **sdd-archive** | Cierra el cambio, guarda lo aprendido | 5 min |

---

## Herramientas del ecosistema

| Herramienta | Rol |
|------------|-----|
| **[gentle-ai](https://github.com/Gentleman-Programming/gentle-ai)** | Arquitectura IA orquestada con metodología SDD |
| **Engram** | Memoria persistente entre sesiones (SQLite local) |
| **OpenSpec** | Memoria persistente de especificaciones en archivos .md |
| **OpenCode / Antigravity** | IDE multi-coding |

---

## Temario — lo que iremos viendo

1. [Fase a fase: cómo funciona cada una](fases.md)
2. [SDD vs metodologías tradicionales](comparativa.md)
3. [El rol del Orchestrator](orchestrator.md)
4. [Cómo personalizar SDD para un proyecto real](personalizar.md)
5. [Caso práctico: SDD en el trabajo de Pau](caso-practico.md)

---

> *"Es muy controlado, te frena, te hace preguntas, parametrizas todo — eso es lo que más me gusta."* — Pau
