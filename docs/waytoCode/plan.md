# 🗺️ Plan de aprendizaje — Agosto 2026

> 5h/día lunes a viernes (9:00–14:00) + 6h sábado y domingo (8:00–14:00) (~37h/semana) · Objetivo: empleabilidad real en Girona/Barcelona

---

## 🎯 Por qué este plan (contexto real, 08/08/2026)

Se terminaron las prácticas. La empresa ofreció continuidad, pero sin senior que guíe y con contrato de pocas horas — se toma como puente mientras se busca activamente, no como destino. El mes ya no es "avanzar cómodo": es consolidar lo que abre puertas reales, más lo que pide el trabajo actual mientras dura el puente.

**Lo que dice el mercado (investigado 08/08/2026):**

| Mercado | Qué piden | Lectura |
|---|---|---|
| **Girona** (chico) | Vue + PHP/Symfony + APIs (oferta real de HAYS, ago-2026) | Es el stack que ya domino — no bloquea |
| **Barcelona** (grande) | React/Vue/Angular intercambiables, TS + Node casi siempre con React | Más volumen de ofertas, pide ampliar |
| Transversal | JS/TS sólido, Git, portfolio/GitHub demostrable | Pesa tanto como el framework de moda |
| CSS | Tailwind gana terreno a Bootstrap (~2.5x más listados en ofertas nuevas) | No es secundario a JS/React — misma prioridad |

**Decisión de stack:** ampliar a React + Node (no reemplaza Vue/Symfony, que ya está sólido). Maximiza opciones en ambos mercados sin abandonar lo que ya es empleable en Girona.

**Segundo objetivo, no negociable:** el jefe del contrato puente pidió consolidar **Symfony + Messenger + integración RAG + webhooks**. No tiene plazo fijo, pero espera progreso constante — entra como track paralelo dentro de las 37h/semana, sin dominar el tiempo total.

**Fuera del roadmap (ya resuelto o pospuesto):**
- **Portfolio/CV** — ya está hecho, no consume horas de este plan.
- **TypeScript** — no lleva bloque propio; se introduce liviano dentro de las semanas de React (tipar props/estado una vez que el componente ya funciona en JS puro).

**Calendario de arranque:** domingo 09/08 = repaso general de todo lo dado hasta ahora. El ritmo nuevo (37h/semana) arranca el lunes 10/08.

---

## 🧠 Tu contexto actual

| Stack | Dónde estás | Lo que sabés | Lo que te falta |
|-------|:-----------:|--------------|-----------------|
| **Vue** | Intermedio | Componentes, templates, reactive data, directives | Entender qué hace Vue por debajo (reactividad = getters/setters) |
| **Symfony** | Intermedio | MVC, routing, Doctrine, JWT, Twig | Messenger, integración RAG, webhooks (pedido del jefe) |
| **CSS** | **8/10** | Flex, Grid, BEM, CQ, `:has()`, `@layer`, GSAP | Tailwind (arranca directo), CSS Nesting (repaso corto previo) |
| **JS puro** | **5.5/10** | Loops, split/join, includes, indexOf, early returns | Métodos arrays, objetos como estructuras, callbacks, closures, async |

**El diagnóstico:** Vue y Symfony te enseñaron "qué se puede hacer", pero no "cómo funciona por dentro". Para React y Node necesitás el *cómo funciona*. Para CSS, la base ya es sólida — Tailwind es traducir lo que ya sabés a utility classes, no aprender de cero.

---

## 🎯 Metas de agosto

Cada concepto JS está elegido porque **mapea directamente** a React o Node:

| Concepto JS | Para qué sirve en React | Para qué sirve en Node |
|------------|------------------------|------------------------|
| `map`/`filter`/`reduce` | Renderizar listas en JSX | Procesar arrays de datos |
| Objetos + spreads | Props, useState, manejo de estado inmutable | Config, request/response |
| Callbacks + closures | useEffect, event handlers, hooks | Async patterns, middleware |
| Promises + async/await | fetch, efectos secundarios | El CORE de Node |
| Destructuring | Props `{nombre, precio}` | `require`, modules |
| Modules import/export | Cualquier componente React | Cualquier archivo Node |

| Meta | Nivel objetivo |
|---|---|
| JS puro | 5.5/10 → 7.5/10 |
| CSS | 8/10 → 8.5/10 + Tailwind funcional |
| Symfony (Messenger/RAG/webhooks) | Progreso constante, sin nota — lo pide el trabajo |

---

## 📐 Estructura semanal

**Horas:** 5h lunes a viernes + 6h sábado y domingo = ~37h/semana.

**Reparto de temas:** no hay un día fijo para JS, CSS/Tailwind o Symfony. Cada sesión arranca revisando `GOTCHAS.md` y el daily log anterior — si hay algo pendiente o un patrón en "necesito reforzar" bloqueando el siguiente ejercicio, eso va primero. Sin bloqueos, se sigue la progresión de las 4 semanas de abajo. Symfony entra ~1-2 veces por semana (≈8-9h totales) para sostener progreso constante sin desplazar el objetivo principal (JS/React/Tailwind).

### Estructura fija de cada sesión (siempre, sin excepción)

1. **Repaso de teoría + fallos anteriores** — refrescar lo relevante de `GOTCHAS.md` antes de tocar nada nuevo.
2. **Contenido del día** — core topic + proyecto/consolidación.
3. **Teoría nueva → a los docs** — si aparece un concepto nuevo, se documenta en `docs/` con la convención ya establecida (h1 degradado por bloque, h2 method-title en `code`).
4. **Cierre: links a referencias oficiales** — en español si existen, al final de la sesión/daily log.

### Ritmo — sesión de 5h (lunes a viernes, 9:00–14:00)

```
🕐 9:00–9:30    Repaso teoría + fallos anteriores (GOTCHAS.md)
🕐 9:30–12:00   Core topic del día
🕐 12:00–12:30  ☕ Corte
🕐 12:30–13:30  Proyecto / Consolidación
🕐 13:30–14:00  Review + daily log + refs oficiales
```

### Ritmo — sesión de 6h (sábado y domingo, 8:00–14:00)

```
🕐 8:00–8:30    Repaso teoría + fallos anteriores (GOTCHAS.md)
🕐 8:30–11:30   Core topic (bloque extendido)
🕐 11:30–12:00  ☕ Corte
🕐 12:00–13:30  Proyecto / Consolidación
🕐 13:30–14:00  Review + daily log + refs oficiales
```

---

## 📅 Semana 1 — Arrays + métodos (React lists)

*(en curso — cierra con el repaso general del domingo 09/08)*

**Progresión de conceptos** (sin día fijo, orden orientativo):
`map` / `filter` / `forEach` → `slice` vs `splice` + spread (inmutabilidad) → `reduce` (numérico, con condición, con objeto acumulador) → DOM básico combinado con arrays.

**Estado real (08/08):** reduce numérico y con condición cerrado (✅). Pendiente: reduce con objeto acumulador.

**Proyectos:** refactor de ejercicios viejos con métodos de array · sistema de carrito sin mutar el original · renderizar catálogo en HTML desde un array.

### 🧠 Concepto clave de la semana
> **"No mutar, crear nuevo"** — Es lo único que tenés que saber para entender `useState`.

---

## 📅 Semana 2 — Objetos + callbacks (React hooks/props)

*(10 – 16 agosto)*

**Progresión de conceptos:**
Objetos: clave-valor, `Object.keys/values/entries`, spread en objetos → funciones como valor, callbacks, closures → `reduce`, `find`, `some`, `every` → **Tailwind**: utility-first, spacing, colors, flexbox/grid, componentes + `@apply` → repaso corto de CSS Nesting antes de encarar `@apply` en serio.

**TypeScript (liviano):** una vez que un componente/función funciona en JS puro, tipar sus props/parámetros — sin bloque propio, solo como capa encima de lo ya hecho.

**Proyectos:** sistema de puntuación con objetos · temporizador + contadores · mini-tarjeta de producto y biblioteca de componentes con Tailwind.

### Día a día acordado (borrador ajustable — 10-16/08)

| Día | Horario | Foco principal | Detalle / proyecto |
|---|---|---|---|
| **Lun 10/08** | 9-14h (5h) | 🔵 JS — cerrar pendiente Semana 1 + Objetos | Reduce con objeto acumulador (si quedó del repaso del 09/08) → `Object.keys/values/entries`, spread en objetos |
| **Mar 11/08** | 9-14h (5h) | 🔵 JS — Callbacks + closures | Funciones como valor · proyecto: temporizador + contadores |
| **Mié 12/08** | 9-14h (5h) | 🟣 Symfony — día completo | Repaso fundamentos (MVC/Doctrine/JWT) + arranque Messenger |
| **Jue 13/08** | 9-14h (5h) | 🔵 JS — cierre bloque objetos | `reduce`/`find`/`some`/`every` + repaso corto CSS Nesting (prep para `@apply`) |
| **Vie 14/08** | 9-14h (5h) | 🟢 Tailwind — fundamentals | Utility-first, spacing, colors, flex/grid · proyecto: mini-tarjeta de producto |
| **Sáb 15/08** | 8-14h (6h) | 🟢 Tailwind — componentes | `@apply`, sistema de diseño · proyecto: biblioteca de componentes TW |
| **Dom 16/08** | 8-14h (6h) | 🟣 Symfony (3.5h) + Review semanal (2.5h) | Consolidar Messenger / arrancar integración RAG → cierre: TypeScript liviano + review de la semana |

Symfony queda en ~8.5h esta semana (miércoles completo + bloque del domingo). Se puede correr un día si algo se traba — no es rígido, sigue las reglas de reparto dinámico de arriba.

### 🧠 Concepto clave de la semana
> **"Las funciones son valores"** — Cuando entiendas esto, `onClick={handleClick}` deja de ser magia.

---

## 📅 Semana 3 — DOM + Symfony + Tailwind velocidad

*(17 – 23 agosto)*

> **Decisión explícita (16/08):** React, GSAP y Node.js quedan en CERO hasta septiembre — no se toca nada de eso esta semana, ni siquiera priming. Foco cerrado en tres materias.

**Progresión de conceptos:**
DOM: `querySelector`, `textContent`, `addEventListener`, cambiar estilos desde JS → crear elementos, formularios, eventos de input (sin `fetch`/`async` todavía, eso es Semana 4+ o septiembre) → **Symfony**: cerrar Twig pendiente del 12/08, luego Formularios y Servicios (plan real, PDF 17 bloques) → **Tailwind**: maquetaciones más complejas que las de la Semana 2, foco en velocidad de ejecución, no en teoría nueva.

**Proyectos:** mini ejercicios DOM (botón que hace algo al clickearlo, filtro de productos visual) · validador de formulario visual con feedback en tiempo real (email + contraseña) · maquetaciones Tailwind cronometradas.

**Disponibilidad real confirmada (16/08):** 9:00–14:00 entre semana (5h/día), probablemente 1-2 días libres sueltos entre semana, y fin de semana ampliado a 12h sábado + 12h domingo (8:00–20:00) — total ~40-44h la semana, muy por encima del resto de semanas de agosto. Las jornadas largas de fin de semana van repartidas en bloques con cortes, no una sola materia corrida.

### Día a día acordado (borrador ajustable — 17-23/08)

| Día | Horario | Foco principal | Detalle |
|---|---|---|---|
| **Lun 17/08** | 9-14h (5h) | 🟣 Symfony | Cerrar Twig pendiente (12/08) + arrancar Formularios |
| **Mar 18/08** | 9-14h (5h) | 🔵 JS — DOM intro | `querySelector`, `textContent`, `addEventListener`, cambiar estilos · mini ejercicio: botón con acción al click |
| **Mié 19/08** | 9-14h (5h) | 🟢 Tailwind — velocidad | Maquetación avanzada, tanda nueva más compleja que la Semana 2 |
| **Jue 20/08** | 9-14h (5h) | 🟣 Symfony | Servicios |
| **Vie 21/08** | flexible | — | Candidato a día libre (de los 1-2 sueltos); si se trabaja, buffer para lo que se haya atrasado |
| **Sáb 22/08** | 8-20h (12h, en bloques) | 🔵 JS/DOM + 🟢 Tailwind | Ejercicios mezclados de DOM y Tailwind en la misma sesión, no bloques separados |
| **Dom 23/08** | 8-20h (12h, en bloques) | 🟣 Symfony + 🔵 repaso + cierre | Servicios (Service Container) · repaso de formulario (DOM) · cierre de semana + planificación Semana 4 |

### 🧠 Concepto clave de la semana
> **"El DOM es donde tu lógica JS se vuelve visible"** — hasta ahora todo vivía en funciones que devolvían valores; esta semana esos valores empiezan a cambiar lo que se ve en pantalla.

---

## 📅 Semana 4 — Mini-proyecto integrador

*(24 – 31 agosto)*

**Unir TODO:** Tailwind + JS puro + fetch + DOM, pensado para que el código se parezca a una app React sin React.

**Progresión:** planificar estructura de datos → maquetar con Tailwind → lógica JS (filtros, búsqueda, ordenación) → refinar UI + responsive → evaluación y decisión de septiembre.

### Ideas para el proyecto
- **Catálogo de productos** con fetch, filtros, búsqueda, carrito → calcado a lo que sería una app React
- **Dashboard de clima** con API gratuita → datos externos + renderizado condicional
- **Clon minimalista de Trello** con drag (opcional) → estado como array de objetos

---

## 🔧 Track paralelo — Symfony + Messenger + RAG + webhooks

*(pedido del jefe, ~8-9h/semana repartidas en 1-2 sesiones, sin día fijo)*

No compite con el objetivo principal — corre en paralelo, con progreso visible cada semana en vez de nota final.

**Progresión de conceptos (a validar/ajustar con lo que pida el trabajo real):**
1. Repaso de fundamentos ya sólidos (MVC, Doctrine, JWT) — solo lo justo para engranar con lo nuevo.
2. **Messenger:** buses de mensajes, handlers, colas async, reintentos.
3. **Integración RAG:** cómo el backend Symfony consume/orquesta un pipeline de retrieval (embeddings, búsqueda vectorial, contexto hacia el LLM).
4. **Webhooks:** endpoints de recepción, validación de firma, idempotencia, manejo de reintentos/fallos.

*(Este bloque se ajusta sesión a sesión según lo que pida el trabajo — no sigue una fecha cerrada como los bloques de JS/CSS.)*

---

## 📊 Criterios realistas para pasar a React

Más que nota numérica, esto:

| Criterio | Lo mide |
|----------|---------|
| Resolvés un ejercicio nuevo sin ayuda | Sesiones de código |
| Usás `map/filter/find` natural, sin caer en `for` | Code review |
| 3 sesiones sin off-by-one ni splice/slice | Registro de errores |
| Hacés fetch + render sin drama | Proyecto semana 4 |
| Explicás qué es un closure | Conversación |

✅ **4/5** → React no te va a costar. Si llegás con 3/5, estás cerca igual.

---

## 🔄 Recordatorio semanal

No hay patrón fijo por día — el tema de cada sesión se decide revisando `GOTCHAS.md` y el daily log anterior (pendientes y patrones a reforzar primero, progresión de semanas si no hay bloqueos, Symfony 1-2 veces por semana). 5h lunes-viernes, 6h sábado-domingo, todos los días activos.
