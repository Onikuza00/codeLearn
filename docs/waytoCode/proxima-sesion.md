# 🎯 Próxima sesión

> Esta página se sobreescribe al final de cada sesión con el plan de la siguiente. No es historial — para eso está el registro diario (año → mes → semana) y `GOTCHAS.md` para el registro de fallos acumulado.

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

## 📅 Plan — próxima sesión (fin de semana 26-27/09)

### Domingo 27/09 (12 h)

1. **Mañana: seguir con el repaso de DOM hasta dominarlo**, sin pistas y con el criterio de poda de siempre (bien y sin ayuda). Quedan `filtrarUsuariosPorTexto` y `activarPanelLateral`, más lo que siga en Repaso urgente (nº 1, 3, 4, 7, 10, 11, 12, 16). Antes de empezar, confirmar en el navegador los tests de los ejercicios del 21, 23, 24 y 26/09.
2. **Si el DOM queda dominado** (Repaso urgente sin puntos vivos o con pocos), pasar a la **documentación de `fetch`** y todo lo necesario para trabajar con él (`async/await`, promesas, errores, JSON). Si no, se sigue con DOM: no se avanza a `fetch` sin dominarlo.
3. **Tarde: terminar el curso de la API de Claude.** Faltan MCP review y el quiz, y las secciones siguientes: Claude Code, Agents and workflows y Final assessment.

**Cuatro hábitos a aplicar** (salen de las debilidades detectadas el 23/09):

1. **Trazar antes de decir «listo»:** un caso concreto del enunciado, línea a línea, en una tabla.
2. **Leer el enunciado y el HTML enteros** y hacer una lista de 2-4 cosas que tienen que ocurrir antes de la primera línea.
3. **Preguntar qué es cada cosa** al usar un punto: elemento, texto, número, evento o booleano.
4. **Releer el bloque entero y ejecutar el test en el navegador** antes de avisar.

**Ritmo esta semana:** sábado 26 y domingo 27 con **12 h cada día** para estudiar. Entre semana, en casa: JS.

**Desde octubre:** sábado y domingo (12 h cada día) para sacar el certificado del curso de API de Claude (48 de 84 sesiones antes del 26/09; ese día se documentaron unas 20 más, contador por comprobar en Skilljar); entre semana sigue JS.

**Objetivo único:** cerrar lo que queda de JS para empezar React cuanto antes.

**Siguiente tanda (DOM, antes de `fetch`), sin pistas**, dirigida a los fallos que siguen en Repaso urgente. Al cerrar cada bloque se mira Repaso urgente y se poda lo que sale bien y sin ayuda. Candidatos:

- **nº 7** (leer en el momento del evento) y **nº 4** (`dataset`/`getAttribute` como texto): contadores y `aria-expanded`.
- **nº 11 y nº 12** (elemento frente a valor, `=` frente a `===`): checkboxes, contadores y colecciones.
- **nº 1** (cada rama deja los dos estados): validaciones con span de error.
- **nº 10** (`contains`, en vigilancia): un ejercicio con clic fuera, como `activarPanelLateral`.
- **nº 3** (`x++`) y **nº 16** (`insertBefore`): no salieron hoy.
- Quedan `filtrarUsuariosPorTexto` (Refuerzo 2) y `activarPanelLateral` (card «Refuerzo»).
- Confirmar en el navegador los tests de los días 21, 23, 24 y 26/09.
- Arreglar los enunciados del Bloque 2: nº 5 (`validarRangoNumerico`: la función se llama cada vez que cambia el valor, no escucha eventos) y nº 10 (quitar la referencia a «la tabla de hoy»).

**JS después:** repaso de **`fetch`** y `async/await`, cuando el DOM esté consolidado.

**React:** empieza en cuanto el bloque JS esté cerrado, sin esperar a octubre.

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
- **Poda de Repaso urgente al cerrar cada sesión** (desde el 23/09): un error que ya no persiste se saca de Repaso urgente (JS/DOM o Symfony). Se comprueba contra el resultado real del día, no de memoria.
- **Registro el mismo día:** daily log + esta página se actualizan al cierre de cada sesión, no al día siguiente.

---

## ⏳ Pendiente de escribir en docs

- **«Un voter no filtra listados»** en [Voters](/symfony/02-seguridad/05-voters/) — está la dirección contraria, no ésta.
- **Cola, worker, handler y qué significa asíncrono** — el vocabulario del componente, no solo el patrón.
