# Tema visual del bloque React

## Qué

- `extra.css`: clases `.section-react` / `.bloque-react` (h1, h2 de tema, chip "Definición", `code` en título) con degradado del logo de React `#61DAFB → #149ECA`.
- Modo claro: el tramo se oscurece a `#149ECA → #0B7BA3` (el `#61DAFB` sobre blanco da ~1.5:1). Modo oscuro: colores del logo tal cual. Se resuelve con variables `--react-from/--react-to` en `:root` y `[data-md-color-scheme="slate"]`.
- Los 83 `.md` de `docs/react/` llevan `{ .section-react .bloque-react }` en el h1 (misma sintaxis que JS).
- Icono del logo (SVG real de Font Awesome brands, incluido en mkdocs-material) en el menú vía `mask-image` base64 + `nav-toggle.js` (`nav-icon--react`), en cian fijo `#61DAFB` (`--react-logo`), y shortcode en `docs/index.md` y `docs/react/index.md`, sustituyendo el emoji.

## Por qué

Cada bloque tiene identidad visual propia (un color por bloque); React era el único sin ella. La regla del proyecto exige SVG real, nunca emoji.
