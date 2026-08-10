# Exploration: portfolioPC-build

> **Date**: 2026-06-28  
> **Investigated by**: sdd-explore (deepseek-v4-pro)  
> **Mode**: hybrid (openspec + Engram)

---

## Current State

### Ecosistema de referencia (3 fuentes analizadas)

Existen **tres** implementaciones relacionadas con distinto grado de madurez:

| Fuente | Rol | Madurez | Paleta | Key Differentiator |
|--------|-----|---------|--------|--------------------|
| `portfolio/` (producción) | Portfolio live | Producción | `#2de2ff` cyan | Secciones sin card wrapping, glow background, stack con fill desde abajo |
| `portfolio/redesign/` | Redesign Factory-inspired | Casi completo | `#2de2ff` cyan | Card system completo + beam effect (`::before`/`::after`), AI avatar proposal |
| `codeLearn/Portfolio/` | Demo para portfolioPC | Copia del redesign | `#38bdf8` celeste | Versión simplificada (sin beam), paleta final ya aplicada, sin AI avatar |

### portfolioPC/ actual

El directorio `codeLearn/portfolioPC/` existe con 3 carpetas vacías:
- `css/` (vacío)
- `js/` (vacío)  
- `img/` (vacío)

No hay archivos. Build from scratch.

---

## Affected Areas

### Archivos de referencia (lectura — NO modificar)

| Archivo | Rol | Lo que aporta a portfolioPC |
|---------|-----|---------------------------|
| `portfolio/redesign/index.html` | HTML estructural completo | Estructura de secciones, card wrappers, data-i18n, layout de cada card |
| `portfolio/redesign/css/tokens.css` | Design tokens (cyan) | Sistema de `:root` con surface tiers, fluid scale, spacing, shape, transitions |
| `portfolio/redesign/css/style.css` | Estilos (cyan, con beam) | Sistema de cards CON beam effect, nav, hero, terminal, projects, stack, about, footer, responsive |
| `codeLearn/Portfolio/index.html` | HTML adaptado a celeste | Misma estructura que redesign, paths locales (`img/` no `../img/`) |
| `codeLearn/Portfolio/css/tokens.css` | Design tokens (celeste) | **Paleta final**: `#38bdf8`, `#888899` muted, `#555566` dim, surface `#08080c`/`#0e0e14`/`#16161e` |
| `codeLearn/Portfolio/css/style.css` | Estilos (celeste, sin beam) | **Versión simplificada**: card sin `::before`/`::after`, btn-primary text `#fff` (no `#000`), sin AI avatar |
| `portfolio/index.html` | Portfolio producción | Contenido real de proyectos, stack items (21 vs 16), estructura about |
| `portfolio/css/tokens.css` | Tokens legacy (#2de2ff) | Sistema más simple: menos tier de superficie, sin mono font, sin fluid scale |
| `portfolio/css/main.css` | Estilos legacy | Patrones legacy: nav con icono FA, sin card system, terminal standalone, stack con `data-percent` |
| `codeLearn/docs/planning/index.md` | Plan del domingo | 10 bloques con timeline, secciones a construir, formato Pau-pica-todo |
| `codeLearn/RULES.md` | Reglas del proyecto | **Mobile First mandatario**, convenciones CSS/JS/GSAP, errores comunes, spacing `--s-1` vs `--space-1` |

### Archivos a CREAR en portfolioPC/

```
portfolioPC/
├── index.html
├── css/
│   ├── tokens.css
│   └── style.css
├── js/
│   ├── main.js
│   └── translations.js
└── img/
    └── (copiar assets necesarios desde portfolio/img/)
```

---

## Approaches

### 1. Replicar codeLearn/Portfolio exactamente (port directo)

Copiar el HTML y CSS del demo azul, ajustar paths de imágenes, y ya.

- **Pros**: Rápido (30 min), ya validado visualmente, Pau ya lo conoce
- **Cons**: No es Mobile First (viola RULES.md), usa GSAP 3.12.5 en vez de 3.15, `--space-*` en vez de `--s-*`, el CSS tiene `max-width` media queries (desktop-first)
- **Effort**: Low

### 2. Reconstruir con Mobile First + mejoras (recomendado)

Partir del diseño visual del demo azul, pero reescribir el CSS desde cero con Mobile First (base = mobile, `min-width` para subir), actualizar GSAP a 3.15, y normalizar naming a `--s-*`.

- **Pros**: Cumple RULES.md, código más mantenible, Pau practica Mobile First, usa GSAP 3.15 con plugins gratuitos, oportunidad de aplicar `@layer`, `:has()`, container queries aprendidos el sábado
- **Cons**: Más tiempo (el CSS hay que reescribirlo), riesgo de introducir bugs nuevos, Pau tiene que tomar decisiones de naming
- **Effort**: Medium-High

### 3. Híbrido: HTML del demo + CSS Mobile First reescrito

Mantener la estructura HTML del demo azul (ya validada), reescribir solo el CSS con Mobile First y mejoras, actualizar JS de GSAP.

- **Pros**: Balance entre velocidad y calidad, HTML ya probado, CSS se reescribe con buenas prácticas
- **Cons**: Aún requiere reescribir ~60% del CSS, decisiones de naming pendientes
- **Effort**: Medium

---

## Recommendation

**Approach 2: Reconstruir con Mobile First + mejoras.**

### Razones

1. **RULES.md es mandatario**: "Mobile First SIEMPRE. Estilos base sin media query para mobile, min-width para breakpoints superiores. Si una IA genera código desktop-first, CORREGIRLA." — No es negociable.

2. **Oportunidad de aprendizaje**: Pau acaba de practicar `@layer`, container queries, y `:has()` el sábado. portfolioPC es el proyecto perfecto para aplicarlos en producción real.

3. **La paleta `#38bdf8` de portfolioPC es NUEVA** — no existe en ningún portfolio actual. Merece un CSS construido para ella, no un port apurado.

4. **GSAP debe actualizarse**: El código actual usa 3.12.5 vía cdnjs, pero RULES.md documenta 3.15 vía jsdelivr. Todos los plugins (SplitText, MorphSVG) son gratuitos en 3.15.

### Decisiones de diseño a tomar (para proposal/spec)

| Decisión | Opciones | Preferencia fundamentada |
|----------|----------|------------------------|
| Beam effect en cards | Sí (redesign) / No (demo azul) | **No** inicialmente — añadir complejidad visual solo si sobra tiempo. El card simple ya es enterprise-grade. |
| Naming spacing vars | `--space-1` (redesign) / `--s-1` (RULES.md) | **`--space-1`** — ya establecido en el ecosistema de referencia, más semántico que `--s-1` |
| Spacing base | 4px (redesign) / 8px (RULES.md) | **4px** — más granularidad fina para el diseño preciso que Factory.ai requiere |
| Surface tiers | `#08080c`/`#0e0e14`/`#16161e` (azul) / `#0a0a0a`/`#111111`/`#1a1a1a` (redesign) | **Azul** (`#08080c`…) — tonos ligeramente más azulados que armonizan con `#38bdf8` |
| Text muted | `#888899` (azul) / `#a3a3a3` (portfolioPC spec) | **`#a3a3a3`** — Pau lo especificó explícitamente, y tiene mejor contraste que `#888899` |
| GSAP version | 3.12.5 cdnjs / 3.15 jsdelivr | **3.15 jsdelivr** — documentado en RULES.md, plugins gratuitos |
| i18n | Sí (3 idiomas) / No (solo catalán) | **Sí** — el portfolio producción ya tiene translations.js, es valor añadido para la reunión del lunes |
| `@layer` en CSS | Sí / No | **Sí** — `@layer tokens, base, components, utilities, animations;` — práctica real de lo aprendido |

---

## Risks

1. **Mobile First requiere reescribir TODAS las media queries**. El código actual usa `@media (max-width: 768px)` en 20+ lugares. Convertir a `min-width` es un cambio estructural, no cosmético. Si Pau se saltea alguna, el diseño se rompe en desktop.

2. **GSAP TextPlugin — verificación de licencia**. RULES.md afirma que es gratuito desde 3.13+, pero el CDN de jsdelivr con `@3.15` debe verificarse. Si falla, el typewriter no funciona.

3. **Imágenes faltantes en `portfolioPC/img/`**. El demo azul referencia `img/verdures.webp`, `img/7vision.webp`, etc. Hay que copiarlas de `portfolio/img/`. Si falta alguna, la project card queda rota.

4. **Scope creep — AI avatar y features extra**. El redesign terminó con una sección `ai-avatar.html` que no estaba planeada. Mantener el scope en las 6 secciones del plan y resistir añadidos.

5. **Naming conflict `--space-*` vs `--s-*`**. RULES.md documenta `--s-1` como convención de Pau, pero el ecosistema de referencia usa `--space-1`. Esto necesita decisión explícita de Pau para no generar inconsistencia en el codebase.

6. **`prefers-reduced-motion`**. RULES.md manda respetarlo. Las animaciones GSAP deben tener un fallback o desactivarse. Si no se implementa, es una regresión de accesibilidad.

---

## Ready for Proposal

**Yes** — La exploración está completa. Las decisiones de diseño están identificadas, los riesgos mapeados, y la recomendación es clara (Approach 2).

### Lo que el orchestrator debe decirle al usuario

"Pau, exploré las 3 versiones del portfolio y el plan del domingo. La decisión más importante que tenés que tomar AHORA es: ¿reescribimos el CSS Mobile First (como manda RULES.md) o tiramos del demo azul tal cual está (que es desktop-first)? Yo recomiendo Mobile First — es más trabajo pero es la arquitectura correcta, y encima practicás `@layer` y container queries que viste ayer. Después hay 6 micro-decisiones de naming y diseño que podemos resolver en el proposal. ¿Arrancamos con Mobile First?"
