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
- **SplitText alternativo**: Usar `SplitType` (librería gratuita: `https://unpkg.com/split-type`) para proyectos sin Club GSAP
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

## 🔧 Convenciones de código

- **Commits**: conventional commits (`feat:`, `fix:`, `docs:`, etc.)
- **Sin atribución AI**: nunca agregar "Co-Authored-By"
- **Nombres**: camelCase para variables/funciones, PascalCase para clases
- **Comentarios**: en catalán/castellano para código de aprendizaje, inglés para producción
- **CSS: Mobile First SIEMPRE.** Todo CSS debe escribirse mobile-first: estilos base sin media query para mobile, `min-width` para breakpoints superiores. No usar `max-width` a menos que sea una excepción justificada. Si una IA genera código desktop-first, CORREGIRLA.

---

## 📝 Cómo actualizar esto

Cuando descubras una gotcha nueva (algo que te hizo perder tiempo):
1. Agregala acá con fecha
2. Decime "guardá esta gotcha"
3. Yo la guardo también en Engram para futuras sesiones
