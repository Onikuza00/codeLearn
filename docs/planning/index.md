# 🗺️ Plan de aprendizaje — Agosto 2026

> Mes completo disponible · Mañanas 5-6h · 5 días/semana

---

## 🧠 Tu contexto actual

| Stack | Dónde estás | Lo que sabés | Lo que te falta |
|-------|:-----------:|--------------|-----------------|
| **Vue** | Intermedio | Componentes, templates, reactive data, directives | Entender qué hace Vue por debajo (reactividad = getters/setters) |
| **Symfony** | Intermedio | MVC, routing, Doctrine, JWT, Twig | PHP OOP sólido, tests |
| **CSS** | **8/10** | Flex, Grid, BEM, CQ, `:has()`, `@layer`, GSAP | Tailwind, CSS Nesting |
| **JS puro** | **5.5/10** | Loops, split/join, includes, indexOf, early returns | Métodos arrays, objetos como estructuras, callbacks, closures, async |

**El diagnóstico:** Vue y Symfony te enseñaron "qué se puede hacer", pero no "cómo funciona por dentro". Para React y Node necesitás el *cómo funciona*.

---

## 🎯 Meta de agosto: JS 7.5/10 + Tailwind

Cada concepto JS está elegido porque **mapea directamente** a React o Node:

| Concepto JS | Para qué sirve en React | Para qué sirve en Node |
|------------|------------------------|------------------------|
| `map`/`filter`/`reduce` | Renderizar listas en JSX | Procesar arrays de datos |
| Objetos + spreads | Props, useState, manejo de estado inmutable | Config, request/response |
| Callbacks + closures | useEffect, event handlers, hooks | Async patterns, middleware |
| Promises + async/await | fetch, efectos secundarios | El CORE de Node |
| Destructuring | Props `{nombre, precio}` | `require`, modules |
| Modules import/export | Cualquier componente React | Cualquier archivo Node |

---

## 📐 Estructura semanal

| Día | Tema | Horas |
|-----|------|:-----:|
| **Lunes** | 🔵 JS — Arrays + métodos (base para React lists) | ~5h |
| **Martes** | 🟢 CSS + Tailwind | ~5h |
| **Miércoles** | 🔵 JS — Objetos + callbacks (base para React props/hooks) | ~5h |
| **Jueves** | 🟢 CSS + Tailwind (proyecto) | ~5h |
| **Viernes** | 🔵 JS — DOM + async (base para Node/efectos) | ~5h |

### Ritmo diario

```
🕐 0:00–0:30  Warm-up JS (drills de errores recurrentes)
🕐 0:30–3:30  Core topic del día
🕐 3:30–4:00  ☕ Corte
🕐 4:00–5:00  Proyecto / Consolidación
🕐 5:00–5:30  Review + daily log
```

---

## 📅 Semana 1 — Arrays + métodos (React lists) (3 - 7 agosto)

| Día | Concepto | Por qué sirve | Proyecto |
|-----|----------|---------------|----------|
| **Lun** 🔵 | Arrays: `map`, `filter`, `forEach` | **React**: `{datos.map(x => <li>{x}</li>)}` | Terminar E9-E10, refactor ejercicios viejos con métodos |
| **Mar** 🟢 | Tailwind: utility-first, spacing, colors | **React**: Tailwind es el stack por defecto con React | Mini-tarjeta de producto con TW |
| **Mié** 🔵 | `slice` vs `splice`, spread operator `[...arr]`, mutabilidad | **React**: estado inmutable, nunca mutar arrays | Sistema de carrito sin mutar original |
| **Jue** 🟢 | Tailwind: flexbox, grid, responsive | **React**: layout responsivo en componentes | Hero responsive con TW |
| **Vie** 🔵 | DOM básico + combinar con métodos array | **React**: entender cómo React renderiza listas sin vanilla | Renderizar catálogo en HTML desde array |

### 🧠 Concepto clave de la semana
> **"No mutar, crear nuevo"** — Es lo único que tenés que saber para entender useState.

---

## 📅 Semana 2 — Objetos + callbacks (React hooks/props) (10 - 14 agosto)

| Día | Concepto | Por qué sirve | Proyecto |
|-----|----------|---------------|----------|
| **Lun** 🔵 | Objetos: clave-valor, `Object.keys/values/entries`, spread en objetos | **React**: `setState({...obj, key: val})`, props | Sistema de puntuación con objetos |
| **Mar** 🟢 | Tailwind: componentes, `@apply`, diseño system | **React**: así se piensan los componentes en React | Biblioteca de componentes TW |
| **Mié** 🔵 | Funciones como valor, callbacks, closures | **React**: `onClick={handleClick}`, `useEffect` depende de closures | Temporizador + contadores |
| **Jue** 🟢 | CSS Nesting + Tailwind combinados | **Vue SFC**: `<style scoped>` ya usa nesting | Componente TW con nesting |
| **Vie** 🔵 | `reduce`, `find`, `some`, `every` | **Node**: procesamiento de datos, validaciones, ETL ligero | Pipeline de transformación de datos |

### 🧠 Concepto clave de la semana
> **"Las funciones son valores"** — Cuando entiendas esto, `onClick={handleClick}` deja de ser magia.

---

## 📅 Semana 3 — DOM + async (Node y efectos) (17 - 21 agosto)

| Día | Concepto | Por qué sirve | Proyecto |
|-----|----------|---------------|----------|
| **Lun** 🔵 | Promises, `fetch`, `async/await` | **Node**: toda la stdlib es async. **React**: useEffect + fetch | Cargar datos de API pública |
| **Mar** 🟢 | Tailwind landing page completa | **Portfolio**: tener una landing 100% TW | Landing propia |
| **Mié** 🔵 | DOM: crear elementos, eventos, formularios | **React**: entender por qué React virtualiza el DOM | Formulario con feedback en tiempo real |
| **Jue** 🟢 | CSS moderno: `subgrid`, `text-wrap`, `scroll-snap` | **CSS**: cerrar CSS moderno, subir a 8.5/10 | Galería con scroll-snap |
| **Vie** 🔵 | Proyecto: unir fetch + DOM + métodos | **Node + React**: el flujo completo (datos → transformar → renderizar) | Dashboard con API externa |

### 🧠 Concepto clave de la semana
> **"Async no es magia, es un timer que ejecuta una función después"** — Cuando clicks y fetches compartan el mismo modelo mental, Node no te da miedo.

---

## 📅 Semana 4 — Mini-proyecto integrador (24 - 28 agosto)

**Unir TODO:** Tailwind + JS puro + fetch + DOM.

Las ideas están pensadas para que el código se parezca a una app React sin React:

| Día | Qué | Por qué |
|-----|-----|---------|
| **Lun** 🔵 | Planificar + estructura de datos | **React**: pensar en componentes y estado antes de escribir |
| **Mar** 🟢 | Maquetar con Tailwind | **React**: así se empieza cualquier proyecto |
| **Mié** 🔵 | Lógica JS (filtros, búsqueda, ordenación) | **React**: la lógica es la misma, cambia el render |
| **Jue** 🟢 | Refinar UI + responsive | **CSS+TW**: cerrar el mes |
| **Vie** 🔵 | Evaluación + decidir septiembre | ¿Estoy listo para React? |

### Ideas para el proyecto
- **Catálogo de productos** con fetch, filtros, búsqueda, carrito → calcado a lo que sería una app React
- **Dashboard de clima** con API gratuita → datos externos + renderizado condicional
- **Clon minimalista de Trello** con drag (opcional) → estado como array de objetos

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

```
Lun  🔵 JS (arrays → React lists)
Mar  🟢 TW + CSS
Mié  🔵 JS (objetos + funciones → React hooks/props)  
Jue  🟢 TW + CSS (proyecto)
Vie  🔵 JS (DOM + async → Node)
```

**Fines de semana:** Recuperación, proyecto personal, o planificar. Sin presiones.
