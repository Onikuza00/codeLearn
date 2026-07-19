# Selectores CSS avanzados { .section-selectores }

> Los selectores son el corazón de CSS: **cómo agarrás elementos del DOM** para aplicarles estilos. Acá vamos más allá de clases y IDs con selectores relacionales modernos.

---

## ¿Qué problema resuelven?

Las clases como `.card` ya saben a qué elemento apuntar. Pero a veces necesitás condiciones:

- "Esta card que CONTIENE una imagen"
- "Este input que está INVALIDO"
- "Esta sección que NO tiene imágenes"

Para eso existen los **selectores relacionales** como `:has()` y `:not()`.

---

## Bloques

| Bloque | Concepto | Estado |
|--------|----------|--------|
| `:has()` | Seleccionar un elemento según lo que CONTIENE | ✅ Completo |

---

## Próximos

- `:not()` — negación lógica
- `:is()` / `:where()` — agrupar selectores con distinta especificidad
- `:nth-child()` avanzado — patrones complejos

---

## 📖 Referencias

- 📘 **MDN — Selectores CSS** — https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors
- 🎥 **midudev — Selectores CSS** — https://www.youtube.com/watch?v=3sPROx7lBmE
