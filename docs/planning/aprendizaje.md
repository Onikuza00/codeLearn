# Próxima Sesión

> Sección dinámica — se actualiza después de cada sesión con lo que queda pendiente.

## Resumen

Último repaso a CSS con lo aprendido hoy (18/07). Cerramos el examen NomadStay y hacemos dos ejercicios nuevos para consolidar conceptos que hoy no tocamos.

## Pendiente inmediato

### 1. Terminar examen NomadStay

| Sección | Conceptos | Estado |
|---------|-----------|--------|
| Destinos | Grid 1→3 cols + CQ + `:has()` con badge | ❌ Sin CSS |
| Testimonios | Flex wrap, avatar circular `object-fit: cover` | ❌ Sin CSS |
| Footer | Grid 1→3 cols, fondo oscuro | ❌ Sin CSS |
| Revisión final | Todo el examen completo | ❌ Pendiente |

### 2. Ejercicio: Landing page Flexbox + Grid (auto-fit + areas)

> 📁 `CSS/bloque-2/01-landing/` — `index.html` + `style.css`
> ⏱ 40 min

Ejercicio del [ejercicio activo](/waytoCode/ejercicio/) que cubre:
- Header con flexbox (logo + nav + btn)
- Hero con flexbox centrado + gradient
- **Features con `auto-fit` + `minmax(280px, 1fr)`** — tarjetas responsive sin media query
- **Pricing con `grid-template-areas`** y card Popular destacada
- Gallery con `auto-fit` + `aspect-ratio: 1`
- Footer con flexbox

**Bonus:** `:has()` en features (hover desvanece las demás cards)

### 3. Ejercicio extra: Container Queries

Ejercicio específico de CQ:
- Misma card en contenedor ancho (row) y estrecho (column)
- `container-type: inline-size`
- `@container (min-width: ...)`

### 4. `:has()` aplicado a más contextos

| Contexto | Qué practicar |
|----------|--------------|
| 🌙 **Día / Noche** | Un `<body>` o contenedor con clase `.dark` y selectores tipo `.card:has(.btn-dark)`, o un toggle que cambie variables con `:has()` |
| 📋 **Formulario** | `:has(:invalid)` para estilar el contenedor cuando hay errores. `:has(:checked)` para resaltar opciones seleccionadas |
| 🏷️ **Badge** | El que ya hacemos en destinos del examen |
| 🃏 **Cards** | Hover en galería que atenúa las demás (bonus del landing) |

### 5. Transiciones

Repaso general: propiedades concretas (nunca `all`), timing functions, `prefers-reduced-motion`.

### Carencias a reforzar

| Carencia | Cómo se trabaja |
|----------|-----------------|
| HTML ↔ CSS conexión | Verificar clases al terminar cada sección |
| `auto-fit` + `minmax` | Features del landing + gallery |
| `grid-template-areas` | Pricing del landing |
| Container Queries | Ejercicio específico + destinos del examen |
| `:has()` en más contextos | Badge + formulario + día/noche + galería |
| Transiciones | Todas las secciones, verificar sin `all` |
| Typos en nombres CSS | Repaso visual antes de dar por terminado |

## Criterio de avance

Si el examen sale ≥ 8/10 y los dos ejercicios están correctos, avanzamos a **Fase 2: `@layer`**.
