# Arquitectura CSS { .section-arquitectura .bloque-css }

> CSS escala mal por defecto. Sin organización, un proyecto grande se vuelve ingobernable: especificidad cruzada, estilos que se pisan, clases que no sabes si se usan. **Arquitectura CSS** es cómo escribes CSS que no explote cuando crece.

---

## ¿Qué problema resuelven?

Escribir CSS es fácil. **Mantenerlo** es lo difícil. Sin convenciones ni estructura:

- Un archivo de 3000 líneas
- Nombres de clase como `.left`, `.red`, `.big`
- `!important` por todos lados porque no sabes qué pisa qué

Las herramientas de arquitectura CSS ponen orden en el caos:

| Herramienta | Para qué |
|-------------|----------|
| **Variables nativas** | Centralizar valores (colores, espaciado, tipografía) |
| **BEM** | Nombrar clases de forma predecible y escalable |
| **`@layer`** | Controlar explícitamente qué estilos ganan sin depender de especificidad |
| **CSS Nesting** | Anidar selectores nativo, sin preprocesador |

---

## Temario

| Temario | Concepto |
|---------|----------|
| [**Variables nativas**](02-variables/index.md) | Custom properties, scope, fallback, dark mode |
| [**BEM**](bem.md) | Metodología de nomenclatura |
| [**CSS Layers**](03-layers/index.md) | Control de cascada por capas |
| [**CSS Nesting**](04-nesting/index.md) | Anidar selectores nativo, sin preprocesador |

---

## 📖 Referencias

- 📘 **BEM — Documentación oficial** — https://getbem.com/
- 📘 **MDN — CSS Layers** — https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
- 🎥 **midudev — Cómo organizar CSS** — https://www.youtube.com/watch?v=lFZc3bqWLo0
