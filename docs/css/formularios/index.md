# Formularios { .section-formularios .bloque-css }

> Estilizar controles nativos (`select`, `input`, checkboxes/radios) sin perder su comportamiento ni su accesibilidad.

---

## ¿Qué es "Formularios"? {: .topic-title }

Los controles de formulario (`<select>`, `<input>`, `<textarea>`) traen su propio aspecto visual, dibujado por el navegador — no por CSS normal. Personalizarlos requiere técnicas específicas (`appearance`, pseudo-clases de estado como `:focus`/`:invalid`) que no aparecen al maquetar el resto de una página.

- **appearance: none**: quita el estilo nativo del navegador para poder rediseñar desde cero
- Y más que irán apareciendo

---

## Bloques

| Bloque | Concepto | Estado |
|--------|----------|--------|
| [**Select personalizado**](01-select-personalizado/index.md) | `appearance: none` + flecha SVG custom | ✅ Nuevo |
| [**Agrupar opciones: `optgroup`**](02-optgroup/index.md) | `<optgroup>`, `<hr>`, accesibilidad | ✅ Nuevo |

---

## Referencias

- 📘 [MDN — appearance](https://developer.mozilla.org/es/docs/Web/CSS/appearance)
- 📘 [MDN — Styling web forms](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Styling_web_forms)
