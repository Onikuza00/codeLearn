# Bloque 1 — CSS Moderno: `:has()`

> **Fecha inicio:** 13/06/2026
> **Estado:** Pendiente

## Objetivo

Entender y dominar el selector `:has()` de CSS — el selector relacional más potente que se ha añadido en años. Permite estilar un elemento **padre** según el estado o presencia de un **hijo**.

## Recursos

- [Midudev — Curso de CSS Completo](https://www.youtube.com/watch?v=TlJbu0BMLaY)
- [MDN: :has()](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)
- [Can I Use :has()](https://caniuse.com/css-has)

## Teoría rápida

```css
/* Selecciona un .card SOLO si contiene un <img> */
.card:has(img) {
  border: 2px solid gold;
}

/* Selecciona un formulario si algún input es inválido */
form:has(input:invalid) {
  border-color: red;
}

/* Selecciona un contenedor que tiene EXACTAMENTE 3 hijos */
.parent:has(> :nth-child(3):last-child) {
  grid-template-columns: repeat(3, 1fr);
}
```

### Casos de uso reales

| Situación | Código |
|-----------|--------|
| Card con imagen vs sin imagen | `.card:has(img) { ... }` |
| Menú activo por sección | `nav:has(a.active) { ... }` |
| Formulario con errores | `form:has(:invalid) { ... }` |
| Layout responsive sin media queries | `.grid:has(> :nth-child(4)) { ... }` |

---

## Ejercicio: Galería de Productos Adaptativa

### Enunciado

Crear una galería de productos donde **SIN MODIFICAR EL HTML** y usando solo `:has()`:

1. Las **cards que contienen imagen** se muestren con un estilo visual destacado (borde, sombra, más tamaño)
2. Las **cards SIN imagen** se vean minimalistas (centradas, sin bordes, tipografía más grande)
3. Si una card contiene la clase `.sold-out`, su opacidad baja y muestra un indicador visual SIN agregar elementos extra al HTML
4. Si el contenedor `.grid` tiene 4 o más cards, que cambie a 2 columnas automáticamente

### Archivos

- `ejercicio-has.html` — HTML base con las cards (no tocar, solo CSS)
- `ejercicio-has.css` — tu código CSS acá

### Reglas

- ❌ NO modificar el HTML
- ❌ NO usar JavaScript
- ✅ Solo CSS con `:has()`
- ✅ Podés usar selectores adicionales si hacen falta

### Para reflexionar después

- ¿Qué ventajas tiene `:has()` frente a soluciones con JavaScript?
- ¿En qué casos NO convendría usarlo? (rendimiento, especificidad)
- ¿Cómo integrarías esto en un proyecto real con muchos componentes?

---

## Valoración del Mentor

*(Espacio reservado para la revisión de Pau después de completar el ejercicio)*

**Lo que hiciste bien:**
-

**Lo que podés mejorar:**
-

**Concepto clave que aprendiste:**
-

---

## Próximo concepto

Después de `:has()`:
- Container Queries (`@container`)
- `@layer` para organización
- Proyecto integrador con los 3 conceptos
