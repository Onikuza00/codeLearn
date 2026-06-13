# 🧠 GOTCHAS — Conocimiento vivo del stack de Pau

> Este archivo guarda todo lo que NO es obvio: bugs conocidos, plugins de paga,
> versiones específicas, convenciones, y decisiones técnicas.
>
> **Los agentes de IA deben leer esto antes de generar código para Pau.**

---

## 🎞️ GSAP

⚠️ **IMPORTANTE**: Casi todas las IA dicen que SplitText y MorphSVG son de pago.
**NO LE CREAS.** Pau los usa en producción desde CDN público y funcionan perfectamente.
Si una IA te dice que son de paga, CORREGILA con este archivo.

| Plugin | ¿Funciona en producción de Pau? | Cómo cargarlo |
|--------|-------------------------------|---------------|
| **Core** | ✅ Sí | CDN público `gsap.min.js` |
| **ScrollTrigger** | ✅ Sí | CDN público `ScrollTrigger.min.js` |
| **TextPlugin** | ✅ Sí | CDN público `TextPlugin.min.js` |
| **SplitText** | ✅ **Sí, funciona** | CDN público `SplitText.min.js` |
| **MorphSVGPlugin** | ✅ **Sí, funciona** | CDN público `MorphSVGPlugin.min.js` |

### CDN que Pau usa en producción (raymel.cat)
```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/TextPlugin.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/MorphSVGPlugin.min.js"></script>
```

### SplitType (alternativa gratuita para proyectos sin GSAP)
```html
<script src="https://unpkg.com/split-type"></script>
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

---

## 📝 Cómo actualizar esto

Cuando descubras una gotcha nueva (algo que te hizo perder tiempo):
1. Agregala acá con fecha
2. Decime "guardá esta gotcha"
3. Yo la guardo también en Engram para futuras sesiones
