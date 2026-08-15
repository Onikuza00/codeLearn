# 🧠 RULES — Conocimiento vivo del stack de Pau

> Este archivo guarda todo lo que NO es obvio: bugs conocidos, plugins de paga,
> versiones específicas, convenciones, y decisiones técnicas.
>
> **Los agentes de IA deben leer esto antes de generar código para Pau.**

---

## 🎞️ GSAP

⚠️ **IMPORTANTE**: Casi todas las IA tienen información DESACTUALIZADA. Creen que SplitText y MorphSVG son de paga (Club GSAP) porque eso era cierto en GSAP 2.x. **Desde GSAP 3.13+ TODOS los plugins son gratuitos.**

**Fuente oficial:** https://gsap.com/docs/v3/Installation?tab=cdn&module=esm&require=false&plugins=SplitText

| Plugin | Disponible | Cómo cargarlo |
|--------|-----------|---------------|
| **Core** | ✅ Gratis | CDN público `gsap.min.js` |
| **ScrollTrigger** | ✅ Gratis | CDN público `ScrollTrigger.min.js` |
| **TextPlugin** | ✅ Gratis | CDN público `TextPlugin.min.js` |
| **SplitText** | ✅ **Gratis** (v3.13+) | CDN público `SplitText.min.js` |
| **MorphSVGPlugin** | ✅ **Gratis** (v3.13+) | CDN público `MorphSVGPlugin.min.js` |
| **Todos los plugins** | ✅ Gratis en npm y CDN | Ver docs oficiales |

### CDN que Pau usa (versión actual: 3.15)
```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/SplitText.min.js"></script>
```

### Patrones que usa Pau en producción
- **Lenis + GSAP**: Siempre con `lenis.on('scroll', ScrollTrigger.update)` y `gsap.ticker.add()`
- **MatchMedia**: Rutas de animación COMPLETAMENTE distintas para mobile y desktop (`gsap.matchMedia()`)
- **SplitText**: Siempre usar el de GSAP (`SplitText.min.js`), es gratuito desde v3.13+
- **Scroll horizontal con pin**: Calcular distancia dinámicamente con `scrollWidth - clientWidth`

---

## 🎨 CSS / Diseño

### Variables Pau
- Sistema de espaciado basado en múltiplos de 8px: `--s-1: 0.5rem` a `--s-16: 8rem`
- Z-index en capas: `--z-back: -1`, `--z-header: 1000`, `--z-overlay: 2000`, `--z-toast: 100000`
- Transiciones: `--t-fast`, `--t-normal`, `--t-slow`
- Tipografía: Fraunces para hero, Albert Sans para cuerpo

---

## 🐘 Symfony

*(Para llenar a medida que aparezcan gotchas)*

---

## 📚 mkdocs-material — Documentación técnica

### Estructura de navegación
- `mkdocs.yml` usa `navigation.tabs` + `navigation.sections` para tabs arriba y sidebar por sección.
- Para agrupar páginas hijas: `"Nombre del bloque"`: `- Subpágina: path/to/file.md`
- Cada tab del nav es un grupo; el sidebar solo se muestra cuando estás dentro de ese grupo.

### Estilos personalizados (`extra.css`)
- **Colores por sección**: definir clase en el h1 vía `{# .section-algo }` (requiere `attr_list` en mkdocs.yml). CSS usa `h1.section-algo` con gradient text + proportional underline.
- **Norma de títulos (08/08/2026)** — aplicar en TODA documentación nueva de ahora en adelante:
  - **h1 general de cada bloque** → degradado propio por bloque vía `{: .section-<bloque> }` en el h1 (`attr_list`). Ej: bloque Arrays = `section-arrays` azul `#0284c7 → #38bdf8`. Cada bloque tiene UN color que se reutiliza en TODAS sus páginas.
  - **Títulos de método/tema dentro del bloque** (h2) → NO usan el degradado del bloque. Usan la clase doble `{: .method-title .method-<nombre> }` con:
    - Texto: degradado gris sutil unificado `#d6d6d6 → #636b6b` (todos los métodos iguales).
    - Nombre clave (el `code` del método) → degradado **amarillo** `#f9d423 → #ff8c00`.
    - Icono SVG moderno (estilo lucide) en **gris sólido `#6b6b6b` SIN degradado**, referencial a la acción, vía `::before` con `data:image/svg+xml`.
    - Línea inferior degradada fina (`#b8b8b8 → #7a8484`).
    - Título corto y conciso (frase que referencia el crédito clave del tema).
  - Reglas: la clase `method-title` NO lleva `section-*`; los h2 que no son de método (subsecciones) NO llevan `method-title`. Iconos siempre en gris sólido, sin degradado.
  - Reutilizables: para repetir en otro bloque basta copiar el CSS de `method-title` + `method-<nombre>`; para un bloque nuevo, copiar `section-<bloque>` con otro color.
- **Admonitions personalizadas**: clases CSS para cada tecnología: `.architecture`, `.twig`, `.live`, `.stimulus` — cada una con `border-left-color`, fondo del `admonition-title` y color del `::before` icon.
- **Probado**: la sintaxis `!!! tip "Tít" { .clase }` se usa con `attr_list`, pero si no funciona, ir a HTML directo: `<div class="admonition twig"><p class="admonition-title">Tít</p><p>Contenido</p></div>`.

### Comandos
- `mkdocs serve` corre desde la raíz del proyecto (`C:\xampp\htdocs\codeLearn\`), no desde subdirectorios.

---

## 🔧 Convenciones de código

### Generales
- **Idioma con Pau**: español rioplatense (voseo argentino). Solo en conversación directa.
- **Idioma documentación** (`docs/`): español neutro de España.
- **Idioma UI copy** (textos en pantalla, botones, labels): español neutro de España.
- **Idioma código** (variables, funciones, clases, comentarios): inglés (como hasta ahora).
- **Idioma commits**: español (conventional commits pero en español, ej: `feat: añadido sistema de cards`).
- **Commits**: conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `test:`, `chore:`)
- **Sin atribución AI**: nunca agregar "Co-Authored-By"
- **Nombres**: camelCase para variables/funciones, PascalCase para clases
- **Archivos**: kebab-case (`mi-componente.js`, `estilos-principales.css`)
- **Comentarios**: en catalán/castellano para código de aprendizaje, inglés para producción
- **Sin comentarios obvios**: no describir QUÉ hace el código (se lee solo), explicar POR QUÉ se hace así

### CSS
- **Mobile First SIEMPRE.** Estilos base sin media query para mobile, `min-width` para breakpoints superiores. No usar `max-width` a menos que sea una excepción justificada. Si una IA genera código desktop-first, CORREGIRLA.
- **Una sola media query por sección.** Agrupar TODOS los overrides responsive de una sección en UNA sola media query. Nada de `.hero` a 768px por un lado y `.hero` a 1024px por otro. Ejemplo:

  ```css
  /* ❌ MAL: media queries de la misma sección dispersas */
  @media (width >= 768px) { .hero { font-size: 2rem; } }
  @media (width >= 1024px) { .hero { font-size: 3rem; } .hero__title { width: 80%; } }
  @media (width >= 768px) { .hero__cta { padding: 1rem; } }

  /* ✅ BIEN: una sola media query por sección con todo dentro */
  @media (width >= 768px) {
    .hero { font-size: 2rem; }
    .hero__title { width: 90%; }
    .hero__cta { padding: 1rem; }
  }
  @media (width >= 1024px) {
    .hero { font-size: 3rem; }
    .hero__title { width: 80%; }
  }
  ```

  Las clases de una misma sección conviven en el mismo bloque de media query, no se dispersan por el archivo. Si una sección necesita 3 breakpoints, tenés 3 bloques, no 9 bloques mezclados con otras secciones.

- **Archivos separados, jamás en HTML.** Prohibido CSS inline (`style=""`) o embebido (`<style>`) en HTML. Excepción: prototipos rápidos de aprendizaje.
- **Usar `var()` siempre** que la variable exista en `:root`. No escribir valores mágicos cuando hay una variable definida.
- **Sin `!important`** sin comentario al lado explicando por qué es necesario.
- **Clases semánticas**, no de estilo. Usar `.btn-primary`, no `.azul-oscuro`.
- **`prefers-reduced-motion`** en animaciones: respetar la preferencia del usuario. Las animaciones deben poder desactivarse vía CSS y GSAP.

### JavaScript
- **Funciones de <= 20 líneas**. Si pasa, dividir. Cada función hace UNA cosa.
- **`const` por defecto, `let` solo cuando reasignás. `var` prohibido.**
- **Early returns**: validar primero, ejecutar después. Nada de anidamientos profundos.
- **Nombres semánticos**: `getUserData()` no `getData()`. `isActive` no `flag`.
- **Sin código muerto**: no dejar `console.log`, comentarios gigantes ni funciones sin usar.

### Patrones Flexbox que Pau usa
- Header con logo-izq + enlaces-centro + botón-der: `header { display: flex; justify-content: space-between; align-items: center; }` + `nav { flex: 1; display: flex; justify-content: center; }`.
- Para centrar en ambos ejes: `display: flex; justify-content: center; align-items: center;`.
- `gap` en vez de `margin` en los items.
- `flex: 1` para reparto equitativo de espacio.
- NO usar `margin-left: 1rem` en enlaces cuando ya hay `gap` — rompe el centrado.
- NO usar `100vw` en contenedores flex — usar `100%` (evita scroll horizontal).
- NO usar altura fija (`height: 20vh`) en header — dejar que el contenido lo determine.

### Grid — el combo que Pau tiene que memorizar
- `repeat(auto-fit, minmax(250px, 1fr))` = galería responsive SIN media queries.
- `grid-template-areas` es la forma más legible de definir layouts completos.
- `1 / -1` en grid-column = ocupa todo el ancho.
- Diferencia clave: `auto-fill` crea columnas vacías, `auto-fit` las colapsa. Usar `auto-fit` siempre.

### Errores comunes detectados en ejercicios
- `margin-left: 0 auto` no existe — confundir `margin-left` con `margin: 0 auto`.
- `transition: .5 ease-in-out` — falta la `s` en `.5s`.
- `border: 0.5 grey solid` — `0.5` sin unidad no es válido.
- `box-sizing: 0` — debe ser `box-sizing: border-box;`, no `0`.
- `font-family: "Sans-serif"` — debe ser `sans-serif` (minúscula, sin comillas).
- `grid-template-areas: "card" "card2"` — cada FILA va entre comillas dobles: `"card card2"`, no cada celda individual.
- `repeat (3, 1fr)` con espacio antes de `(` — no válido, debe ser `repeat(3, 1fr)`.
- `@media (width < 400)` sin unidad — debe ser `(width < 400px)`.
- `box-shadow: 1px 5px 10px(#000)` — no se usa coma ni paréntesis así. Debe ser `box-shadow: 0 4px 12px rgba(0,0,0,0.15)`.
- `grid-direction: column` — no existe. Usar `grid-template-columns: 1fr`.
- Hijos del grid deben ser DIRECTOS del contenedor que define `grid-template-areas`.

---

## 💾 Reglas de guardado

| ¿Qué? | ¿Dónde? | ¿Cuándo? |
|-------|---------|----------|
| Plan de la próxima sesión | `docs/planning/index.md` | **Se actualiza cada vez**, no se crean nuevas secciones. Plantilla base: plan del día, ejercicios/temario, carencias a practicar |
| Diario de aprendizaje | `docs/waytoCode/` por fecha | Al decir "guarda" / "guardalo" o al final de cada sesión |
| Memoria del agente | Engram | Al decir "guarda"/"guardalo"; cada ~8 instrucciones; al terminar de documentar un **bloque entero** de teoría (no una lección suelta); al registrar los resultados de un **bloque de ejercicios**; al modificar el roadmap/hoja de ruta o tomar una **decisión importante** |
| Cambio SDD completo (feature planificada) | `openspec/changes/` | Automático al crear/archivar un cambio |
| Cambio arquitectónico o de configuración del propio proyecto (hooks, convenciones fijas, tooling, `settings.json`) | `openspec/changes/archive/` | En el momento del cambio — `proposal.md` (qué + por qué) siempre, `design.md` solo si hubo alternativas evaluadas. Va directo a `archive/`, no queda "en curso". Añadir su fila a `openspec/changes/archive/CHANGELOG.md` en el MISMO paso |
| Commit al repo | git | Cada ~1h de sesión (preguntar antes) |
| Push / rebase / revert | — | **SÓLO cuando Pau lo ordene explícitamente** |

### Horario de Pau
- Finde intensivo: 12h un día
- Semana: 3h x 3 días

---

## 🎯 Plan de aprendizaje (julio 2026)

### Enfoque general
- Consolidar fundamentos: CSS > JS Vanilla > PHP antes de meter más frameworks
- Rotación estructurada: 70% tiempo en base (CSS/JS/PHP), 30% en frameworks (Symfony/Vue)
- Findes intensivos: 12h sábado + 12h domingo para proyectos integradores
- Semana: 3-4h x 3 días para práctica focalizada

### Objetivos de verano
1. **CSS**: maquetación fluida sin IA, `:has()`, Container Queries, `@layer`
2. **JS Vanilla**: lógica, DOM, fetch, arrays — sin frameworks ni IA
3. **PHP**: sintaxis, PDO, formularios — lo básico sólido
4. **Symfony**: mantener hábito con rotación 30%
5. **PortfolioPC**: terminar proyecto como carta de presentación

### Agosto completo disponible — planificar más adelante

---

## 👨‍🏫 Rol mentor en sesiones de aprendizaje

> Este bloque define cómo actúa el mentor cuando Pau está en modo aprendizaje (assessment, ejercicios, corrección, práctica deliberada). No aplica en modo planificación u orquestración SDD.

### Contrato mentor-alumno

- **Nada gratuito**. Las recompensas ("bien", "aprobado", "pasamos al siguiente") solo llegan cuando Pau realmente se las gana. No se regalan.
- **Estricto, no permisivo**. Exigencia acorde al nivel de Pau — no lo voy a medir con vara de senior, pero tampoco voy a aplaudir lo mínimo.
- **Consolidación al 100%**. No se avanza al siguiente tema hasta que:
  - Los conceptos teóricos están claros (Pau los explica con sus palabras)
  - Los ejercicios se resuelven con 0 errores o casi
  - No hay "lagunas" evidentes en la práctica
- **Si falla, se repite**. Un ejercicio mal no se saltea. Se corrige, se entiende por qué, y se hace otra vez hasta que salga solo.
- **Priorizar entendimiento sobre código**. Pau tiene que entender QUÉ hace y POR QUÉ funciona, no solo copiar la solución.
- **Sin vibcoding**. Si Pau pide que le escriba código que debería escribir él, el mentor frena y pregunta: "¿Seguro que querés que lo escriba yo o preferís intentarlo?"

### Cuándo aplica

- ✅ Assessment y exámenes
- ✅ Ejercicios prácticos (CSS, JS, PHP)
- ✅ Corrección conjunta de ejercicios
- ✅ Práctica deliberada sin IA
- ❌ NO aplica en planificación de sesiones
- ❌ NO aplica en orquestración SDD (changes, specs, tasks)

---

## 📝 Cómo actualizar esto

Cuando descubras una gotcha nueva (algo que te hizo perder tiempo):
1. Agregala acá con fecha
2. Decime "guardá esta gotcha"
3. Yo la guardo también en Engram para futuras sesiones
