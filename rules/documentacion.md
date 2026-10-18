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
- Admonitions (`note/tip/info/warning/danger`) con criterio, solo en consejos y errores típicos reales — no en cada párrafo. **Excepción: el bloque React** (ver «React — método de documentación»), donde van en casi cada sección.
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

## React — método de documentación (norma 17/10/2026, aplica a TODO capítulo de `docs/react/`)

Modelo de referencia: `docs/react/01-fundamentos/03-componentes/01-primer-componente/` («Tu primer componente»), aprobado por Pau.

1. **Base = midudev** (JSCamp, módulos 04 y 05, + su vídeo). Se sigue su orden, ideas y ejemplos (`Saludar`, `nombre`, Miguel, Ana, Madrid…). Todo lo que él explique entra.
2. **Se complementa, nunca se sustituye:** lo que midudev no cubre y la doc oficial (es.react.dev) o los enlaces de Pau sí, se añade, colocado en el capítulo donde encaje. Si falta algo más que ayude a entender, también se añade.
3. **Siempre en el registro de midudev**, incluso lo que viene de la oficial: palabras llanas, frases cortas, una idea por frase, término definido la primera vez, analogías (HTML, funciones, Vue), ejemplo mínimo y concreto justo después de cada idea, resultado visible. No copiar ni parafrasear de cerca la redacción de la oficial (a Pau le cuesta). Ejemplos propios de la oficial (Katherine Johnson, Gallery…) se sustituyen por los de midudev.
4. **Consejos, errores típicos y avisos repartidos por el capítulo**, pegados al concepto que aclaran (`!!! tip`, `!!! warning`), en cada bloque o casi cada bloque; el bloque final «Consejos» solo recoge lo que no tiene sección propia. Nunca la palabra «gotcha».
5. **Comparación con Vue** en todo capítulo (tabla «En Vue / En React»). Lo que sea conocimiento propio y no venga de una fuente se marca al informar a Pau.
6. **Cada concepto en su sitio:** lo que es de JSX va en JSX (p. ej. paréntesis tras `return`), no en componentes.
7. **Lo que midudev hace de forma poco real** (react.html con CDN y Babel en el navegador) se deja como nota breve enlazando al capítulo donde ya se explica, y el ejemplo principal usa el proyecto de Vite.
8. **Fuentes: texto real, nunca resumen.** Nunca `WebFetch` para leer una lección: bajar el HTML con `curl`, limpiarlo a texto y leerlo con `Read`; a los subagentes se les pasa esa ruta. Tras redactar, contrastar con la fuente y no fiarse del informe del subagente.
9. **Al terminar, informar a Pau** de qué se añadió que NO está en midudev y sí en la oficial (por capítulo), y de las afirmaciones sin fuente (sobre todo Vue).
10. **Flujo completo en cada ejemplo** (Pau, 17/10/2026): nunca enseñar solo la función y lo que devuelve. Mostrar de principio a fin: el componente en su archivo, dónde se usa (`App.jsx` completo con el `import`), qué recibe o hace React por dentro (p. ej. el objeto `{ nombre: "Miguel" }` que llega como `props`) y el resultado (HTML). Si no se ve de dónde sale un valor, el ejemplo no vale.
11. **Alcance:** hacer solo el capítulo o las secciones que Pau pide en ese momento, paso a paso. No ampliar a otros capítulos ni mover contenido entre bloques sin que lo pida; ante la duda, preguntar una sola cosa.
12. Capítulo completo antes que breve cuando eso implique incluir todos los ejemplos de midudev; aun así, sin repetir reglas varias veces ni relleno.

## Python — método de documentación (norma 17/10/2026, aplica a TODO capítulo de `docs/python/`)

Modelo de estructura y tono: el de React (ver arriba), adaptado a Python. Primer pilar redactado: `docs/python/01-fundamentos/`.

1. **Hilo principal = apuntes del Institut Montilivi (ASIX)** (`apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/` y `/python/`). Se sigue su orden de temas. Todo lo que expliquen entra.
2. **Se contrasta SIEMPRE con la documentación oficial** (`docs.python.org/3/`: tutorial, library, reference). Las imprecisiones de los apuntes se corrigen en el capítulo (con aviso breve si ayuda a entender) y se informan a Pau. Lo que los apuntes no cubren y la oficial sí (venv, `match`, `enumerate`, `zip`…), se añade donde encaje.
3. **Tono midudev**, no el seco del curso ni el denso de la oficial: palabras llanas, frases cortas, una idea por frase, término definido en negrita la primera vez, analogías, ejemplo mínimo justo tras cada idea. No copiar ni parafrasear de cerca ninguna de las dos fuentes.
4. **Código y nombres:** identificadores y archivos en inglés (`temperature`, `chat_toy.py`), comentarios y textos en español de España. Primera línea de cada bloque: `# archivo.py`. Hilo de ejemplos del pilar 01: un «prompt builder / chat de juguete» (modelo, temperatura, system prompt, f-strings, bucles sobre mensajes).
5. **Cada ejemplo se ejecuta de verdad** con Python y la salida pegada en el capítulo es la real (si se acorta un traceback, se marca con `...`). Para `input()` se simula la entrada y se muestra lo que vería la terminal.
6. **Flujo completo en cada ejemplo** (igual que en React): «1. El script», «2. Cómo se ejecuta», «3. Qué pasa por dentro», «4. La salida».
7. **Estructura del capítulo:** h1 con `{ .section-python .bloque-python }`, blockquote de 1-2 frases, h2 con `{: .topic-title }` separados por `---`, `!!! tip` / `!!! warning` pegados al concepto (el título del warning dice el error), sección `## Python en IA` (consejos, errores y cómo aparece al llamar a un LLM, montar prompts o RAG), tabla «En JS / En Python» (la comparación del bloque es con JavaScript), tip final «Consejos» solo con lo que no tiene sección propia y `## Recursos`.
8. **Recursos con fuente exacta:** tabla `| Recurso | Enlace |` con dos grupos rotulados, «Apuntes de la escuela» (URL exacta de la página, título en el texto y ancla de la sección si existe) y «Documentación oficial» (página de `docs.python.org/3/` + ancla de la sección, nunca el índice). Cada URL y cada ancla se comprueban antes de darlas por buenas. Si un tema no tiene fuente en los apuntes, se dice en la fila.
9. **Cada capítulo con su propio hilo:** no repetir lo explicado en capítulos anteriores; enlazar con rutas relativas. Entre 120 y 250 líneas aproximadamente, sin relleno.
10. **Fuentes: texto real, nunca resumen** (igual que React): `curl` + limpieza a texto + `Read`; nunca `WebFetch` para leer una lección.
11. **Al terminar, informar a Pau** de: qué se añadió que NO está en los apuntes, qué afirmaciones no tienen fuente (sobre todo las de IA y las comparaciones con JavaScript), y qué errores de los apuntes se corrigieron.
12. Nunca la palabra «gotcha»; nunca nombrar el ejercicio concreto ni el nivel o progreso del lector.

## Symfony — estructura de contenido

- La sección de **MakerBundle** (comandos `symfony console make:*`) va SIEMPRE justo después de la descripción general/intro del tema, antes de entrar en el detalle teórico.
- Cuando un ejemplo de código es una **variación de un ejemplo anterior** (añade una opción nueva al mismo patrón base): reformatear el atributo (`#[Route(...)]` u otro) en multilínea, un argumento por línea, y usar `` ```php hl_lines="N" `` para resaltar solo la línea que cambia respecto al ejemplo previo.

---

*Consolidado el 15/08/2026 desde `RULES.md` (norma de títulos 08/08/2026) + engram `pattern` #210, #222, #223, #224, #227, #119.*
