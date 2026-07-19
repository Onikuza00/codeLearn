# Arquitectura CSS { .section-arquitectura }

> CSS escala mal por defecto. Sin organización, un proyecto grande se vuelve ingobernable: especificidad cruzada, estilos que se pisan, clases que no sabés si se usan. **Arquitectura CSS** es cómo escribís CSS que no explote cuando crece.

---

## ¿Qué problema resuelven?

Escribir CSS es fácil. **Mantenerlo** es lo difícil. Sin convenciones ni estructura:

- Un archivo de 3000 líneas
- Nombres de clase como `.left`, `.red`, `.big`
- `!important` por todos lados porque no sabés qué pisa qué

Las herramientas de arquitectura CSS ponen orden en el caos:

| Herramienta | Para qué |
|-------------|----------|
| **BEM** | Nombrar clases de forma predecible y escalable |
| **`@layer`** | Controlar explícitamente qué estilos ganan sin depender de especificidad |
| **Variables nativas** | Centralizar valores (colores, espaciado, tipografía) |

---

## Bloques

| Bloque | Concepto | Estado |
|--------|----------|--------|
| **BEM** | Metodología de nomenclatura | ✅ Nuevo |
| **CSS Layers** | Control de cascada por capas | Pendiente |

---

## 📖 Referencias

- 📘 **BEM — Documentación oficial** — https://getbem.com/
- 📘 **MDN — CSS Layers** — https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
- 🎥 **midudev — Cómo organizar CSS** — https://www.youtube.com/watch?v=lFZc3bqWLo0
