# 🧠 GOTCHAS — Conocimiento vivo del stack de Pau

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
- **Hero entrance**: Usar `elastic.out()` para entradas llamativas
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
- **Admonitions personalizadas**: clases CSS para cada tecnología: `.architecture`, `.twig`, `.live`, `.stimulus` — cada una con `border-left-color`, fondo del `admonition-title` y color del `::before` icon.
- **Probado**: la sintaxis `!!! tip "Tít" { .clase }` se usa con `attr_list`, pero si no funciona, ir a HTML directo: `<div class="admonition twig"><p class="admonition-title">Tít</p><p>Contenido</p></div>`.

### Comandos
- `mkdocs serve` corre desde la raíz del proyecto (`C:\xampp\htdocs\codeLearn\`), no desde subdirectorios.

---

## 🔧 Convenciones de código

- **Commits**: conventional commits (`feat:`, `fix:`, `docs:`, etc.)
- **Sin atribución AI**: nunca agregar "Co-Authored-By"
- **Nombres**: camelCase para variables/funciones, PascalCase para clases
- **Comentarios**: en catalán/castellano para código de aprendizaje, inglés para producción
- **CSS: Mobile First SIEMPRE.** Todo CSS debe escribirse mobile-first: estilos base sin media query para mobile, `min-width` para breakpoints superiores. No usar `max-width` a menos que sea una excepción justificada. Si una IA genera código desktop-first, CORREGIRLA.
- **CSS: archivos separados, jamás en HTML.** Prohibido CSS inline (`style=""`) o embebido (`<style>`) en HTML. Cada proyecto tiene su archivo `.css` separado. La única excepción es un prototipo rapidísimo de una demo para aprender un concepto puntual (como los ejercicios de codeLearn). Si una IA genera CSS dentro del HTML, CORREGIRLA.

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

---

## 📝 Cómo actualizar esto

Cuando descubras una gotcha nueva (algo que te hizo perder tiempo):
1. Agregala acá con fecha
2. Decime "guardá esta gotcha"
3. Yo la guardo también en Engram para futuras sesiones
