# Skills

> Un skill es una instrucción empaquetada que el agente carga solo cuando el contexto encaja — no vive en el prompt de cada mensaje. La mayoría de los que necesitas ya existen en global (`~/.claude/skills/`) y funcionan en cualquier proyecto sin configuración extra. Un skill **de este proyecto** solo se justifica cuando ves un flujo repetirse 3+ veces de forma idéntica — nunca el día 1, por adivinanza (criterio ya explicado en el [índice de Flujo Global](../index.md)).

---

## Skills instalados hoy

Verificado leyendo el `SKILL.md` de cada uno — la fila "Instalación" distingue entre los que gestiona una sola herramienta (mismo comando para todos) y los que se instalaron a mano, uno por uno.

| Categoría | Skills | Para qué sirve |
|---|---|---|
| SDD / metodología | `sdd-init`, `sdd-explore`, `sdd-propose`, `sdd-spec`, `sdd-design`, `sdd-tasks`, `sdd-apply`, `sdd-verify`, `sdd-archive`, `sdd-onboard` | Todo el ciclo de Spec-Driven Development — ver [SDD](../../../sdd/index.md), no se repite aquí |
| Git / colaboración | `branch-pr`, `chained-pr`, `issue-creation`, `work-unit-commits`, `comment-writer` | Crear PRs e issues con checks previos, partir cambios grandes en PRs encadenados, planear commits como unidades revisables, redactar comentarios de review |
| Revisión de código | `judgment-day` | Revisión adversarial a ciegas con dos jueces independientes, para cambios que lo justifican |
| Documentación | `cognitive-doc-design` | Diseñar docs que se entienden rápido — orden de lectura, tablas en vez de prosa, checklist |
| Meta — gestión de skills | `skill-creator`, `skill-improver`, `skill-registry` | Crear un skill nuevo con formato válido, auditar/mejorar uno existente, mantener el índice de skills disponibles |
| Diseño / UI | `design-taste-frontend`, `ss-review` | Evitar diseño genérico en landings/portfolios partiendo del brief real; revisar cumplimiento de design tokens y accesibilidad |
| Testing | `go-testing` | Patrones de test en Go — **no aplica a tu stack actual** (JS/PHP/Symfony), instalado pero sin uso hoy |

??? example "Cómo se instala cada grupo"
    **SDD, Git/colaboración, Revisión, Documentación, Meta, Testing** — todos llevan `author: gentleman-programming` en su `SKILL.md`: son una sola familia de herramienta, un solo comando para todos.
    ```powershell
    gentle-ai install   # primera vez
    gentle-ai sync      # tras actualizar el CLI, para traer skills nuevos o cambiados
    ```

    **Diseño / UI** (`design-taste-frontend`, `ss-review`) no llevan esa metadata — son de repos externos, instalación manual: clonar/copiar la carpeta del skill dentro de `~/.claude/skills/`. `ss-review`, por ejemplo, viene del repo `bitjaru/styleseed`.

!!! tip "Por qué la mayoría son globales y no de proyecto"
    Git, revisión de código, documentación y meta-gestión de skills son necesidades que se repiten igual en cualquier repo — por eso tiene sentido decidirlos una vez, en `~/.claude/skills/`, y no reescribirlos por proyecto. Un skill de proyecto solo aparece cuando algo es específico de ESE repo y no del resto de tu trabajo.

---

## Diseño/UI

Tres skills en juego — dos generan código, una solo audita. Las dos primeras sí se pisarían si estuvieran las dos activas para el mismo tipo de proyecto; la tercera es de solo lectura y no choca con ninguna.

### `design-taste-frontend` (instalado)

!!! note "Para cuándo"
    Landing pages, portfolios y rediseños donde YA existe un brief visual — tu caso real de trabajo con la diseñadora (Canva + fuentes/colores/animaciones por sección).

!!! tip "Cómo se ejecuta"
    Sin comando. Es contextual — se activa solo en cuanto la tarea huele a ese tipo de interfaz.

!!! example "Qué hay que decirle"
    Nada obligatorio más allá del propio encargo. Para afinar el resultado: palabras de estilo ("minimalista", "estilo Linear", "brutalista"), referencias (URLs, capturas), a quién va dirigido, o marca/logo/colores si ya existen.

!!! info "Qué hace con eso"
    Antes de escribir código, declara en una línea cómo ha entendido el encargo (ej. *"Reading this as: landing SaaS para compradores técnicos, lenguaje minimalista estilo Linear..."*) y solo entonces genera. Si el encargo es ambiguo, hace UNA pregunta, nunca varias.

### `impeccable` (candidato)

!!! note "Para cuándo"
    Apps, dashboards o SaaS donde NADIE te da un brief visual de antemano — tu caso del lado Symfony+RAG, sin diseñadora de por medio.

!!! tip "Cómo se ejecuta"
    Por comando explícito, `/impeccable <comando>`. Primero `/impeccable init` una sola vez por proyecto; después, según la fase, `craft` (construir), `audit`/`critique` (revisar contra sus 61 reglas), `polish` (afinar).

!!! example "Qué hay que decirle"
    Solo en el `init` — es una entrevista conversacional donde el agente pregunta qué construyes, para quién, qué stack, y si es "brand" (marketing) o "product" (app/dashboard). El resto de comandos ya no vuelven a preguntar, leen `PRODUCT.md`.

!!! info "Qué hace con eso"
    Guarda esas respuestas en `PRODUCT.md` (y `DESIGN.md` si existe) y las usa en cada comando posterior sin repetir la entrevista.

### `web-design-guidelines` (Vercel)

!!! note "Para cuándo"
    Después de escribir o maquetar cualquier interfaz, en cualquier stack — landing o SaaS, da igual. Es una pasada de revisión, no una fase de construcción.

!!! tip "Cómo se ejecuta"
    A demanda, tú decides cuándo pedirla — nunca se dispara sola ni escribe código.

!!! example "Qué hay que decirle"
    Solo qué archivo o carpeta revisar.

!!! info "Qué hace con eso"
    Descarga en el momento las guías oficiales de Vercel y reporta hallazgos en formato `archivo:línea` contra 100+ reglas (accesibilidad, semántica HTML, foco, formularios, i18n).

??? example "Instalación de web-design-guidelines"
    ```powershell
    npx skills add vercel-labs/agent-skills --skill web-design-guidelines
    ```

!!! tip "Por qué esta sí se puede sumar sin generar ruido"
    Al ser de solo lectura, no le disputa a `design-taste-frontend` ninguna decisión de diseño — audita el resultado ya escrito contra estándares generales (HTML/CSS/ARIA), sin dictar cómo debe verse. `ss-review` audita contra TU propio design system; esta audita contra el consenso general del sector. Checklists complementarias, no rivales.

---

## GSAP

Oficial de GreenSock, 8 skills en un solo paquete instalable (no se eligen por separado). De los 8, con timelines, ScrollTrigger, SplitText y MorphSVG como uso real, importan 5:

| Skill | Cubre | Relevante hoy |
|---|---|---|
| `gsap-core` | API base: `gsap.to/from/fromTo`, easing, duration, stagger | ✅ — base de todo lo demás |
| `gsap-timeline` | Secuenciación: position parameter, labels, nesting, playback | ✅ — tus timelines |
| `gsap-scrolltrigger` | Scroll-linked: pinning, scrub, triggers, refresh/cleanup | ✅ — tu uso principal |
| `gsap-plugins` | ScrollToPlugin, Flip, Draggable, Observer, **SplitText**, **MorphSVG** y más | ✅ — aquí están SplitText y MorphSVG |
| `gsap-performance` | Transforms vs layout props, will-change, batching, tips de ScrollTrigger | ✅ — relevante por el volumen de scroll+SplitText |
| `gsap-utils` | `clamp`, `mapRange`, `wrap`, `pipe`... helpers genéricos | — ni pega ni estorba |
| `gsap-react` | `useGSAP`, refs, `gsap.context()`, SSR | — no usas React todavía |
| `gsap-frameworks` | Vue, Svelte: lifecycle, scoping, cleanup | — no aplica a tu stack |

??? example "Instalación"
    ```powershell
    # dentro de Claude Code
    /plugin marketplace add greensock/gsap-skills
    ```

!!! tip "Por qué se instala entero aunque 3 de los 8 no se usen todavía"
    El paquete no se puede instalar skill a skill — es todo o nada. Pero como cada skill solo carga contexto cuando se dispara, tener `gsap-react`/`gsap-frameworks` ahí sin usar no cuesta nada hasta que empieces con React (objetivo futuro, no actual).

---

## PHP / RAG

El repo tiene 67 skills en total, pero se instalan uno a uno con `--skill <nombre>` — no hace falta traer los otros 66. Ambos candidatos son contextuales: se activan solos, sin comando, igual que `design-taste-frontend`.

### `php-pro`

!!! note "Para cuándo"
    Construir aplicaciones PHP 8.3+ modernas — Symfony/Doctrine (también cubre Laravel/Eloquent, pero eso no te aplica a ti), APIs REST/GraphQL, DTOs tipados.

!!! tip "Cómo se ejecuta"
    Sin comando. Contextual — se activa solo en cuanto la tarea es de PHP/Symfony.

!!! example "Qué hay que decirle"
    Nada especial — describe la tarea de backend como siempre.

!!! info "Qué hace con eso"
    Fuerza `declare(strict_types=1)`, tipado completo, PSR-12, **PHPStan nivel 9** antes de entregar, DI en vez de estado global, protección SQLi/XSS, hashing bcrypt/argon2, config por `.env`, y mínimo 80% de cobertura con PHPUnit/Pest. No solapa con los hooks de lint que ya tienes — esos comprueban sintaxis y estilo, esto es análisis estático semántico.

### `rag-architect`

!!! note "Para cuándo"
    Diseñar o construir un pipeline RAG — chunking, embeddings, vector DB, hybrid search, reranking, evaluación. Tu caso del lado Symfony+IA local.

!!! tip "Cómo se ejecuta"
    Sin comando. Contextual — se activa por palabras clave ("RAG", "vector search", "embeddings", "semantic search"...).

!!! example "Qué hay que decirle"
    Nada especial — describe el requisito de retrieval/RAG como siempre.

!!! info "Qué hace con eso"
    Guía la elección de vector DB (Pinecone, Weaviate, Chroma, pgvector, Qdrant) con sus trade-offs, estrategia de chunking, hybrid search con BM25, reranking, y evaluación con métricas reales (precision@k, recall@k, MRR, NDCG, RAGAS) además de aislamiento multi-tenant.

??? example "Instalación (una sola skill cada vez, sin arrastrar las otras 66)"
    ```powershell
    npx skills add https://github.com/jeffallan/claude-skills --skill php-pro
    npx skills add https://github.com/jeffallan/claude-skills --skill rag-architect
    ```

---

## Checklist

- [ ] `gentle-ai --version` responde antes de asumir que la familia gentle-ai está instalada
- [ ] Los skills de Diseño/UI (`design-taste-frontend`, `ss-review`) están copiados a mano en `~/.claude/skills/`, no esperados de `gentle-ai sync`
- [ ] Ningún skill de proyecto todavía — se escribe cuando un flujo se repite 3+ veces, no antes
