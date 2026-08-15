# Documentación de teoría — normas

> Normas para escribir/editar temarios de teoría bajo `docs/` (CSS, JS, Symfony, IA, etc.). No aplica a `docs/waytoCode/` (resultados de ejercicios) ni a `docs/assessment/js/ejercicios/` (montar un ejercicio) — esas tienen sus propias normas en archivos separados.

---

## Estructura y organización

- Jerarquía: **Bloque** (nav top-level, ej. CSS/JS/Symfony/Tailwind) → **Subbloque** (carpeta con `index.md`) → **Temario** (página por tema).
- Un bloque de contenido nuevo y suficientemente distinto (ej. Tailwind) es un **Bloque propio** en el nav, no un Subbloque de un bloque existente aunque estén relacionados (Tailwind no es subbloque de CSS).
- `mkdocs.yml`: `navigation.indexes` activado (el título de sección enlaza directo al `index.md`, sin fila redundante) + nav arranca **colapsado** (sin `navigation.expand`).
- Gaps esenciales detectados al revisar un tema: se anotan, pero **no se escribe contenido nuevo** hasta que el tema se dé en sesión real — mismo criterio de "no vib coding" aplicado a documentación, no adelantar lecciones que no se dieron todavía.
- Cada temario cierra con una sección de **Recursos/Referencias**.
- **Títulos de cada lección/temario cortos** — nada de descripciones largas en el h1 ni en los h2 de tema.
- Cortar redundancia real entre páginas, pero conservar el insight único aunque el tema se repita en otro lado.
- Fuente técnica de referencia por defecto: **midudev** (buscar transcripción/artículo antes de dar por correcta una página), respaldado con MDN/documentación oficial.

## Idioma

- **Español neutro de España** (tú/vosotros) en texto narrativo Y en comentarios de código de ejemplo. Nunca voseo rioplatense en documentación.

## Contenido — qué NO hacer

- Nunca marcar contenido como "teoría nueva / no contrastada todavía" (ni admonition ni nota al margen) — no importa si el concepto ya se usó en un proyecto real o es contenido nuevo, no se distingue explícitamente.
- No nombrar el proyecto/ejercicio puntual al explicar un concepto (ej. no decir "01_liveGallery") — usar "tu proyecto", "este proyecto", o describir el patrón de forma genérica.
- Nunca referenciar el nivel, progreso o trayectoria de aprendizaje del propio Pau en el texto (ej. "el CSS que ya dominas", "esto ya lo sabes") — los apuntes son teoría pura y genérica, reutilizable por cualquiera, no notas personalizadas a su recorrido individual.

## Diseño visual (`extra.css`)

- Intro en blockquote bajo el h1: discreto — chico, cursiva, gris, sin fondo ni sombra.
- H1 y H2 de cada página comparten el MISMO degradado unificado **por bloque** vía clase `.bloque-<nombre>` (ej. `.bloque-css`, `.bloque-js`, `.bloque-ia`) — no colores random por subtema.
- **Norma de títulos general** (norma 08/08/2026 — aplica salvo la excepción de Symfony, ver abajo):
  - H1 de cada bloque → degradado propio vía `{: .section-<bloque> }`. Un color por bloque, reutilizado en TODAS sus páginas.
  - H2 de método/tema → clase doble `{: .method-title .method-<nombre> }`: texto en degradado gris sutil `#d6d6d6 → #636b6b`, el `code` del nombre clave en degradado amarillo `#f9d423 → #ff8c00`, icono SVG estilo lucide en gris sólido `#6b6b6b` (sin degradado), línea inferior fina degradada `#b8b8b8 → #7a8484`.
  - El `<code>` inline dentro de un heading hereda el color del degradado de ese heading.
  - `method-title` nunca lleva `section-*`; las subsecciones que no son de método nunca llevan `method-title`.
- "Buenas prácticas Haz/No hagas" → tabla compacta de 2 columnas clase `.pros-cons`, no dos listas largas.
- Admonitions (`note/tip/info/warning/danger`) con criterio, solo en gotchas reales — no en cada párrafo.
- Modo claro: contenedores de contenido (code blocks, tablas, tabs, admonitions) con borde sutil + sombra chica vía `[data-md-color-scheme="default"]`, para diferenciarse del fondo blanco (en modo oscuro no hace falta, ya hay contraste).
- Admonitions personalizadas por tecnología (Symfony): clases `.architecture`, `.twig`, `.live`, `.stimulus`, cada una con `border-left-color`, fondo del `admonition-title` y color del `::before`.
- Sintaxis `!!! tipo "Tít" { .clase }` con `attr_list` — si no renderiza, usar HTML directo: `<div class="admonition clase"><p class="admonition-title">Tít</p><p>...</p></div>`.

## Symfony — excepción específica de diseño

Las páginas de Symfony siguen una variante propia (inspirada en los apuntes del profesor, Institut Montilivi, verificada en vivo con `getComputedStyle`):

- H1: `font-size: 1.6rem` (no el `2.4rem` genérico del resto del sitio), **sin** la línea decorativa `::after`.
- Los degradados de color propios por sección **se mantienen** (azul Fundamentos, índigo Arquitectura, violeta Twig/Live, magenta Stimulus) — el profesor usa gris plano, pero se conserva el degradado como diferenciador propio.
- H2 de cada tema: clase `{: .topic-title }` — color propio de sección, línea inferior 1px sólida con degradado, `display: block` (la línea ocupa el 100% del ancho), sin padding extra entre texto y línea.
- Tipografía: peso 700 en h1/h2 (no 800).
- Admonitions: usar también `!!! info` (contexto informativo sin acción a tomar) además de `example`, `tip`, `warning`, `danger`.
- Los `<div class="video-embed">` existentes nunca se tocan — este trabajo de estilo es solo CSS/estructura.

## Symfony — estructura de contenido

- La sección de **MakerBundle** (comandos `symfony console make:*`) va SIEMPRE justo después de la descripción general/intro del tema, antes de entrar en el detalle teórico.
- Cuando un ejemplo de código es una **variación de un ejemplo anterior** (añade una opción nueva al mismo patrón base): reformatear el atributo (`#[Route(...)]` u otro) en multilínea, un argumento por línea, y usar `` ```php hl_lines="N" `` para resaltar solo la línea que cambia respecto al ejemplo previo.

---

*Consolidado el 15/08/2026 desde `RULES.md` (norma de títulos 08/08/2026) + engram `pattern` #210, #222, #223, #224, #227, #119.*
