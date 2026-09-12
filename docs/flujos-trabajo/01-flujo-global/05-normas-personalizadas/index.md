# Normas personalizadas

> Reglas concretas y técnicas de un proyecto — normas de diseño y maquetación, por ejemplo — que no caben ni en el `AGENTS.md` general ni en ningún skill. Viven en su propio archivo `.md`, y algo (un hook, un skill, una mención directa) lo lee cuando hace falta.

---

## Cuándo se justifica un archivo propio

!!! note "Criterio"
    Cuando la regla es concreta y técnica (no un criterio general de comportamiento) Y se va a repetir en cada tarea del mismo tipo — ej. "mobile-first siempre", "solo Tailwind, nunca CSS a mano", "usar `clamp()` para tipografía fluida". Si es un criterio general de una vez, va en `AGENTS.md`; si es una regla técnica repetible, va en su propio archivo.

!!! tip "Ejemplo real de este mismo proyecto"
    El hook de diseño (paso 3) ya asume que existe `docs/design-system.md` y lo lee — pero nunca se explicó cómo se escribe ese archivo. Es exactamente el caso que resuelve esta página.

!!! danger "Lo que NO hay que hacer"
    Nunca duplicar la regla dentro del script del hook o dentro del propio skill. El archivo `.md` es la única fuente de verdad — el hook/skill solo la lee, igual que el resto de esta guía (single source of truth, ya visto en Hooks y en OpenSpec).

---

## Arquitectura básica del archivo

!!! example "Estructura mínima recomendada"
    Corto y concreto, nunca prosa larga — el agente lo va a leer literal en cada disparo, no es documentación para humanos:

    1. **Regla** — una frase, sin ambigüedad ("Mobile-first: base sin media query = mobile, `min-width` para subir")
    2. **Ejemplo correcto** — un bloque de código mínimo que la cumple
    3. **Qué evitar** — el error típico que la regla previene, en una frase

!!! info "Por qué así y no como un README"
    Un README explica para que un humano entienda el porqué. Este archivo existe para que el agente lo aplique sin interpretarlo — cuanto más ambiguo o largo, más fácil que lo ignore o lo aplique a medias.

---

## Quién lo usa

!!! note "El agente, no tú directamente"
    Igual que `codegraph`: tú no lo abres para consultarlo cada vez. Lo lee el mecanismo que lo referencia — un hook (caso del diseño), un skill, o una mención directa en `AGENTS.md` ("las normas de diseño están en `docs/design-system.md`").

!!! tip "Puede tener más de un lector"
    El mismo `design-system.md` lo puede leer el hook de diseño bajo demanda Y el skill `design-taste-frontend` (si se le dice explícitamente dónde mirar) — no hace falta un archivo por consumidor.

---

## Cómo se programa — el patrón de lectura

!!! example "El mecanismo NUNCA lleva la regla escrita dentro"
    ```bash
    norms_file="$cwd/docs/design-system.md"

    if [ -f "$norms_file" ]; then
      norms="$(cat "$norms_file")"
    else
      norms="No hay normas de diseño definidas todavía en $norms_file."
    fi
    ```
    Mismo script ya visto en [Hooks → Diseño bajo demanda](../03-hooks/index.md#2-diseno-bajo-demanda). Si el archivo no existe, avisa — nunca falla en silencio ni inventa una regla por su cuenta.

## Cuándo se ejecuta

!!! note "No en cada mensaje — solo cuando el disparador correspondiente se activa"
    Si lo lee un hook (`UserPromptSubmit` con el comando `/diseño`, por ejemplo), se ejecuta solo en ese momento. Si lo lee un skill contextual, cuando el skill se activa. El archivo en sí no "corre" nunca — es pasivo, solo texto que otro mecanismo decide cuándo leer.

---

## Ejemplo real: normas de maquetación

??? example "docs/design-system.md — esqueleto genérico"
    ```markdown
    # Normas de maquetación

    ## Mobile-first
    Regla: base sin media query = mobile. `min-width` para subir a tablet/desktop. Nunca `max-width` salvo excepción justificada.
    Correcto: `.card { padding: 1rem; } @media (min-width: 768px) { .card { padding: 2rem; } }`
    Evitar: escribir el layout de escritorio primero y "arreglarlo" para mobile después.

    ## Solo Tailwind, nunca CSS a mano
    Regla: toda maquetación usa utilidades de Tailwind. Ningún archivo `.css` propio salvo tokens en `:root` o casos que Tailwind no cubre.
    Correcto: `class="flex flex-col gap-4 md:flex-row md:gap-8"`
    Evitar: `<div style="display:flex">` o un `.css` nuevo para algo que ya tiene utilidad.

    ## Medidas responsivas
    Regla: unidades relativas (`rem`, `%`, `clamp()`) para tipografía y espaciados — nunca `px` fijos en texto.
    Correcto: `text-[clamp(1rem,2vw,1.5rem)]`
    Evitar: tamaños de fuente en `px` que no escalan entre breakpoints.
    ```

---

## Checklist

- [ ] La regla es concreta y técnica, no un criterio general — si es general, va en `AGENTS.md`
- [ ] El archivo tiene regla + ejemplo correcto + qué evitar, nada de prosa larga
- [ ] Algo lo referencia explícitamente (hook, skill o `AGENTS.md`) — un archivo que nadie lee no sirve de nada
- [ ] El mecanismo que lo usa LEE el archivo, nunca duplica la regla dentro de su propio código
