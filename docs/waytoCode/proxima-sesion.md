# 🎯 Próxima sesión

> Esta página se sobreescribe al final de cada sesión con el plan de la siguiente. No es historial — para eso está el registro diario (año → mes → semana) y `GOTCHAS.md` para el registro de fallos acumulado.

---

## Estado tras el domingo 18/10 (sesión cerrada antes de tiempo)

**Sesión cortada por falta de concentración; se retoma el finde que viene.** Python: repaso con el vídeo «Curso completo de Python desde cero» (`TkN2i-_4N4g`). Hechas 2 páginas de `01-fundamentos/01-inicio/` (Qué es Python, Primer script y REPL). **Siguiente página sin vídeo aún:** Entorno venv y pip (capítulos «IDEs y entornos de desarrollo» 0:13:43 e «Intérprete» 0:18:08, lo decide Pau). Mecánica: Pau da sección y minuto; el vídeo va incrustado bajo la introducción (`<div class="video-embed">`, `?start=` en segundos) y como fila «Vídeo de apoyo» en Recursos. No se puede leer el contenido hablado (subtítulos 404): hay que pegar transcripción si se quiere contenido nuevo.

**E5 cerrado** (De desarrollo a producción): notas corregidas tras dos fallos (creer que el build quita los `console.log`; sacar conclusiones de un `dist/` obsoleto). Detalle en el [registro del domingo 18](/waytoCode/2026/10/semana-2/2026-10-18/). Estado en el banco: ✅ Completado.

**Siguiente:** E6, «Formulario de suscripción: del HTML al JSX» (subbloque 1.2 JSX, primero de sus cinco). Pau iba a decir qué dos cosas darían error al copiar el HTML tal cual a un componente. El plan del día es mitad React, mitad Python (pendiente de empezar).

**Sigue pendiente:** los cierres de E4 (`Ex14.jsx`, nombres cruzados, colores de las tarjetas) y lo que se lista en el estado del 17/10.

---

## Estado tras el sábado 17/10

**React, pilar 1 (Fundamentos) CERRADO.** Detalle en el [registro del sábado 17](/waytoCode/2026/10/semana-2/2026-10-17/).

| Subbloque | Capítulos |
|---|---|
| 1.1 Inicio | Qué es React y por qué; React sin JSX; Entorno con Vite |
| 1.2 JSX | JSX desde cero; JSX con llaves; Fragments; Estilos en JSX |
| 1.3 Componentes | Tu primer componente; Componentes vs funciones; Importar y exportar; Un componente real: JobCard; Migrar un proyecto a componentes |
| 1.4 Props | Props; Valores por defecto y spread (`children` descartado) |
| 1.5 Estilaje (borradores) | CSS en React (con `clsx`); Tailwind en React; CSS Modules |

**Decisiones de hoy:**

- **Renderizado condicional descartado** de Fundamentos (a Pau no le aportaba). Se quitaron las referencias colgadas en otros capítulos. `.map()` con `key` se queda **sin sitio**: decidir si va en el pilar 2 junto a la lección «Keys» de midudev.
- **Estilaje: Tailwind es el estándar** (State of CSS 2026: sigue siendo el referente; sin cifras de CSS Modules). Orden: CSS en React (mecánica) → Tailwind → CSS Modules (última opción). `clsx` se explica una sola vez, en CSS en React, paso a paso en cards.
- **Eventos va en el pilar 2** (2.1), antes de `useState`, como en JSCamp.
- **Banco de ejercicios** nuevo: `docs/assessment/react/ejercicios/index.html` (enlazado en `nav.js`), **25 ejercicios, cinco por subbloque** de Fundamentos, agrupados en cards plegables dentro de la card del día y orientados a landings y aplicaciones (hero, pie, banner de oferta, planes de precios, testimonios, insignias…). Más Tailwind que CSS. **Sin hacer todavía.** No tiene runner ni live-reload (no hay tests automáticos): el estado queda en «Pendiente».

**Ejercicios hechos hoy (4 de 25):** E1 (proyecto base Vite + Tailwind en `Frontend/assessment/React/ejercicios-react/`), E2 (`index.html` y logo), E3 (Hero sin JSX) y E4 (Ventajas dos formas, **cerrado con pendientes**: falta `Ex14.jsx`, los nombres de los archivos están cruzados y los colores de las dos tarjetas no coinciden). Fallos y lecciones en el [registro del sábado 17](/waytoCode/2026/10/semana-2/2026-10-17/) y en [Repaso urgente — React](/waytoCode/repaso-urgente-react/). Añadido un `!!! danger` en «React sin JSX» sobre el 2.º argumento de `createElement` (`null` si no hay props: error en desarrollo, elemento vacío en producción).

**Plan de Pau para mañana (18/10):** continuar los ejercicios por donde se quedaron (regex, según dijo; confirmar cuáles) y **empezar Python**.

**Norma nueva, repaso urgente de React:** una card por fallo, ordenada y coloreada por reincidencia (🟢 1 · 🟡 2 · 🟠 3 · 🔴 4+ ejercicios) con los tipos `rep-verde`/`rep-amarillo`/`rep-naranja`/`rep-rojo` de `extra.css`; sin niveles. Pau quiere este estilo siempre. Detalle en `openspec/changes/archive/2026-10-17-repaso-react-por-reincidencia/`.

**Pendiente:**

- **Seguir con los ejercicios desde el E5** (último del subbloque 1 Inicio) y anotar fallos en el registro del día. Vigilar si reincide `class`/`className` y el reparto props/hijos de `createElement`.
- **Vídeo de CSS en React** (midulive, desde 1:02:50) sin poder leerlo (los subtítulos de YouTube vienen vacíos): cuando Pau pegue los capítulos, ajustar «CSS en React» a su orden.
- **Podar la duplicación** del ternario entre «CSS en React» y «Tailwind en React».
- **Revisar por Pau:** los tres borradores de Estilaje, «Estilos en JSX» (1.2) y «Componentes puros» (2.2).
- **Orden de JobCard y Migrar:** están en 1.3 pero usan props (1.4). Valorar moverlos tras 1.4.
- **Menciones adelantadas en 1.3** (`return null`, estado, CSS Modules y un `{children}` suelto en «Un componente real»), que Pau dejó «de momento».
- **Sin verificar:** comparaciones con Vue (conocimiento propio), que React congela las props en desarrollo, los comandos de Vite/Tailwind y los ejemplos de Estilaje en un proyecto real.
- Siguiente pilar: **2 Estado** (Eventos → useState). Luego, TypeScript como bloque propio y «React con TypeScript».
- Tema nuevo (sin daily) media hora antes del reset de cuota: sigue sin hacerse.

---

## Estado tras el domingo 27/09

**DOM cerrado (mañana):** tanda final contra reincidencias sin fallos (`filtrarUsuariosPorTexto`, `activarPanelLateral`, `validarCodigoPostal`). Poda: salen nº 1, 10, 15, 17 (probados hoy) y nº 3, 8, 14 (auditoría, sin reincidencia en +1 mes). Se queda el nº 18. `docs/waytoCode/repaso-urgente-js.md` se reseteó a 0 — DOM consolidado, los 4 niveles quedan como estructura fija para las reincidencias del bloque de Asincronía en adelante.

**Reordenado el temario de Asincronía:** `04-fetch` usaba `await` sin haberlo explicado — se intercambió con `05-async-await`. Orden real: callbacks → promesas → promesas avanzado → **async/await → fetch** → websockets → capa de API → SSE.

**Nuevo banco de ejercicios:** `docs/assessment/js/ejercicios/05-asincronia/dia-20-asincronia.html` (enlazado en `nav.js`, sección "🔄 Asincronía"). Bloque 1 (Promesas, 5 ejercicios: `pedirUsuario`, `mostrarUsuario`, `procesarPedido`, `pedirConFallback`, `buscarProductos`) y Bloque 2 (Promesas avanzado, 5 ejercicios: `obtenerUsuarioConCache`, `cargarDashboard`, `cargarCarrito`, `cargarWidgets`, `cargarConLimite`) completos y documentados en el [registro del domingo 27](/waytoCode/2026/09/semana-3/2026-09-27/). Live-reload activado en la ficha (mismo mecanismo que `dia-19-dom`, movido a `js/ejercicios/live-reload.js` compartido).

**Nueva reincidencia en Repaso urgente (Nivel 1):** `Promise.all()`/`allSettled()` devuelven un array, no un objeto — reincidió en `cargarDashboard` y `cargarCarrito`, mismo bloque, mismo día.

**Toda la carpeta `docs/assessment/js/ejercicios/` reorganizada** en subcarpetas por bloque (`01-basico`, `02-arrays`, `03-objetos`, `04-dom`, `05-asincronia`), espejo de `docs/js/`. Todas las rutas (nav.js, index.html, progreso.html, daily logs de agosto) corregidas.

**Normas nuevas establecidas hoy** (ver también «Normas vigentes» abajo): revisar cada ejercicio automáticamente al decir "listo" (sin esperar a que se pregunte); mezclar contenido ya dominado en cada ejercicio nuevo, casos de uso web reales, pensando en preparar React; reincidencia en sesión larga (12h) = bloque distinto cuenta igual que día distinto; poda de Repaso urgente solo con los números, sin justificación larga por punto; iconos SVG reales (Material) en vez de emoji, técnica base64+mask-image para `nav:` de mkdocs.

**Sesión 2 (tarde/noche) — Curso de la API de Claude CERRADO.** Reescritos a JS los 4 docs de MCP que habían quedado en Python (`13-mcp/03` a `06`, con el SDK oficial `@modelcontextprotocol/sdk`, `McpServer`/`registerTool`/`registerResource`/`registerPrompt` + Zod), con sus descripciones y mensajes de error traducidos al castellano. Nueva página `13-mcp/07-mejoras-claude-code` (cliente MCP integrado en Claude Code, `claude mcp add`, integraciones populares). Módulo nuevo completo `14-agentes-y-flujos-de-trabajo/` (índice + paralelización, encadenamiento, enrutamiento, agentes y herramientas, inspección del entorno) — la lección corta "Workflows vs agents" se fusionó como cierre del índice en vez de página aparte, por solapar con la intro. `mkdocs build --strict` limpio en ambos cambios. Insignia de LinkedIn redactada: **RAG sí lo construyó Pau desde cero** (`IA/practica/Claude/RAG/rag.js`); **MCP NO** — fue solo la teoría del curso, no hay carpeta MCP en su práctica local.

---

## Estado tras el sábado 26/09

**Consolidación de DOM contra los fallos de Repaso urgente.** Trece ejercicios hechos y documentados en el [registro del sábado 26](/waytoCode/2026/09/semana-3/2026-09-26/): del Bloque 2 los nº 2 a 6 y 10, y de «Refuerzo 2 · Reincidencias» `alternarDetalleAccesible`, `sincronizarCheckMaestro`, `activarPopoverConCierreFuera`, `activarContadorConTope`, `marcarPestanaActiva`, `cerrarNotificacionesYContar` y `activarFiltroEtiquetas`. Diez con fallos corregidos y tres sin fallos. La segunda tanda (E8, E9, E10 y `activarFiltroEtiquetas`) fue **sin pistas**: solo se dice si va bien, cuando lo pide, y qué falla, sin el porqué.

**Poda de Repaso urgente JS:**

- **Salen:** nº 2 (`&&`/`||`, por la mañana) y, en la segunda tanda, **nº 5** (`classList` sin punto), **nº 6** (`toggle` con force), **nº 13** (exclusividad frente a cierre independiente) y **nº 19** (`NodeList` sin `filter`/`every`). Salieron bien y sin ayuda en `activarFiltroEtiquetas` y `cerrarNotificacionesYContar`.
- **En vigilancia:** nº 10 (`contains`). Salió limpio una vez; sale con otro acierto.
- **Siguen:** nº 1, 4, 7, 11 y 12 (más el fallo 42 del nº 11, que volvió).
- **Nuevo:** nº 18 («¿quién llama a mi función y cuándo?»).
- **Sin probar hoy:** nº 3, 8, 12, 14, 15, 16, 17 y 18.

**Criterio para podar** (acordado con Pau): un fallo sale de Repaso urgente solo si sale **bien y sin ayuda** en un ejercicio que lo provoque; que pase el test tras mi explicación no cuenta. Por eso, desde la segunda tanda, no se dan pistas.

**Quedan de la tanda:** `filtrarUsuariosPorTexto` (Refuerzo 2) y `activarPanelLateral` (card «Refuerzo», la del 23/08).

**Teoría nueva:** el selector de atributo `[data-x="valor"]`, en [Selección de elementos](/js/04-dom/01-seleccion/). Faltaba y el ejercicio `activarFiltroEtiquetas` lo pedía.

Tests de los ejercicios de hoy **sin confirmar en el navegador**, igual que los del 21, 23 y 24/09.

**Herramienta nueva:** las páginas de ejercicios se re-ejecutan al guardar el archivo de soluciones, sin recargar (`live-reload.js`). Editar el HTML o el runner sí exige F5.

**Formato nuevo:** Repaso urgente usa las mismas cards que los daily (✅ primero, un ❌ por error, los avisos tal cual). Está en `rules/ejercicios-resultados.md`.

**Curso de API de Claude (últimas 3 h):** documentadas unas 20 lecciones, agrupando las cortas: RAG (BM25 y `Retriever`), **Features de Claude** (extended thinking, imágenes, PDF, citas, prompt caching, code execution y Files API) y **MCP** (presentación, clientes, proyecto y herramientas, inspector y cliente, recursos y prompts). Quedan **MCP review** y el quiz, y las secciones siguientes: Claude Code, Agents and workflows y Final assessment. El contador (48/84) hay que comprobarlo en Skilljar. Detalle en el [registro del sábado 26](/waytoCode/2026/09/semana-3/2026-09-26/).

---

## Estado tras el jueves 24/09

**Repaso urgente de DOM, tercera sesión (2 h).** `moverArriba` cerrado con un solo fallo conceptual (`insertBefore` invertido, reincidencia del fallo 65). `activarAcordeonExclusivo` a medias: listener, guard, flag `abierto` (`=== "true"`) y `forEach` sobre `.faq-item` escritos; **falta el cuerpo del `forEach`** (una sola condición «¿debe quedar visible esta respuesta?» para `hidden` y `aria-expanded`). Detalle en el [registro del jueves 24](/waytoCode/2026/09/semana-3/2026-09-24/).

Test de `moverArriba` **sin confirmar en el navegador**, igual que los de los días 21 y 23.

---

## Estado tras el miércoles 23/09

**Repaso urgente de DOM, segunda sesión.** Seis ejercicios de `dia-19-dom` hechos con corrección sobre el código real: `filtrarPorNombreOCategoria`, `activarStepperConLimite`, `validarPrecioEnRango`, `validarTelefonoExacto`, `activarFiltroCategorias` y `moverAbajo`. Detalle, con una card por fallo, en el [registro del miércoles 23](/waytoCode/2026/09/semana-3/2026-09-23/).

Lo que más se repitió: `includes` con los papeles al revés, el parámetro del listener tratado como elemento (es el **evento**), lo que cambia en cada evento leído fuera del listener, `&&` en vez de `||` e `insertBefore` con el orden invertido. Los tests de los seis y los cuatro del lunes siguen **sin confirmar en el navegador**.

Teoría nueva: [Métodos básicos](/js/01-basico/08-metodos-basicos/) (números y strings, por categoría con ejemplos).

---

## 📅 Plan — próxima sesión

**React (desde el 14/10):** seguir con 1.4 (redactar `children`) y pasar a 1.5 Renderizado (condicional y listas con `key`, que arranca con la sección «Datos desde un array»). Después, el pilar 2 (Estado). Aplicar siempre el método de `rules/documentacion.md` («React — método de documentación») y, antes de escribir, bajar el texto real de la lección de JSCamp y de `es.react.dev`. TypeScript va como bloque propio tras los pilares 1 y 2, y luego «React con TypeScript».

**JS, fecha sin fijar todavía:** seguir el bloque de Asincronía por `docs/js/05-asincronia/`, en orden — toca **Bloque 3, async/await** (teoría en `04-async-await/index.md`). Mismo patrón que los dos bloques anteriores: proponer la tabla de ejercicios primero y esperar confirmación antes de montar nada, casos de uso web reales, mezclando contenido ya dominado (arrays, objetos, callbacks, DOM), pensando en lo que luego se reutiliza en React. Revisar cada ejercicio en cuanto se diga "listo", sin esperar a que se pregunte.

**Curso de la API de Claude: CERRADO** (evaluación final aprobada, 27/09). No queda nada pendiente de este curso.

**Objetivo único:** cerrar lo que queda de JS (Asincronía completa) para empezar React cuanto antes.

**Sin prioridad esta semana:** implementar `BM25Index` y `Retriever` en la práctica del RAG (la teoría ya está documentada); Symfony (próximo bloque a confirmar contra el plan real).

**Deferred, no empezar sin pedirlo explícito:** Flujo Landing Pages, Flujo SaaS con IA.

---

## ⚠️ Normas vigentes

- **Todo ejercicio cierra con fase de maquetación responsive en Tailwind**, sea del track que sea. Se describe cómo debe verse, nunca las clases.
- **Enunciados autocontenidos:** paso a paso, sin dar nada por sentado, sin tecnicismos sin definir, sin referencias a ejercicios anteriores.
- **Teoría en `docs/` antes de cualquier ejercicio** — salvo excepción puntual pedida explícitamente.
- **Un concepto nuevo por ejercicio.**
- **Tono:** concepto en palabras llanas primero, una idea por frase; respuestas cortas, sin enrollarse.
- **Disciplina — media corrección:** arreglar una parte y decir «¿así?» sin releer es el fallo que más pesa. Releer el bloque entero antes de dar algo por hecho.
- **Leer el enunciado y el HTML entero antes de escribir**, y apuntar lo que debe ocurrir (en `activarFiltroCategorias` faltó rotar el botón activo por no leerlo entero).
- **Daily log — una card por error** (desde el 23/09): cada error en su propio `!!! failure "❌ Fallo N — título"`, con su código real, `// ❌` y su propia `🧠 Lección`. Los ejercicios sin fallos van en cuadrícula de totales. Nada de typos ni de notas meta sobre cómo se escribió el log. En cada ejercicio va primero el ✅ código corregido y debajo las cards de fallo.
- **Poda de Repaso urgente al cerrar cada sesión** (desde el 23/09): un error que ya no persiste se saca de Repaso urgente (JS/DOM o Symfony). Se comprueba contra el resultado real del día, no de memoria. **Poda: solo los números** (desde el 27/09) — sin justificación larga por punto.
- **Reincidencia en sesión larga** (desde el 27/09): un mismo patrón que reaparece en un **bloque distinto** dentro del mismo día ya cuenta como reincidencia — no hace falta esperar a un día de calendario distinto.
- **Revisar cada ejercicio al terminarlo** (desde el 27/09): en cuanto se dice "listo", se revisa el código sin esperar a que se pregunte.
- **Ejercicios nuevos: casos web + mezcla + React** (desde el 27/09): cada bloque nuevo, casos de uso web reales, mezclando contenido ya dominado (arrays, objetos, callbacks, DOM), pensando en lo que se reutiliza en React (estado `{ cargando, error, datos }`, listas con `.map()`, inmutabilidad). Proponer la tabla de ejercicios y esperar confirmación antes de montar nada.
- **Live-reload en toda ficha nueva** (desde el 27/09): el runner expone `ejecutarTodo()` como función global; `<script src="../live-reload.js">` justo después del runner.
- **Registro el mismo día:** daily log + esta página se actualizan al cierre de cada sesión, no al día siguiente.

---

## ⏳ Pendiente de escribir en docs

- **«Un voter no filtra listados»** en [Voters](/symfony/02-seguridad/05-voters/) — está la dirección contraria, no ésta.
- **Cola, worker, handler y qué significa asíncrono** — el vocabulario del componente, no solo el patrón.
