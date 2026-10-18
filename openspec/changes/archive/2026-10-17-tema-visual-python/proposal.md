# Tema visual del bloque Python

## Qué

- `extra.css`: clases `.section-python` / `.bloque-python` (h1, h2 de tema, chip "Definición", `code` en título) con degradado azul → amarillo del logo de Python (azul `#387EB8 → #366994`, amarillo `#FFE052 → #FFC331`).
- Modo claro: el amarillo sobre blanco da ~1.4:1, así que el degradado va de `#366994` (5.8:1) a `#A87F00` (3.7:1). Modo oscuro: `#387EB8 → #FFD43B` (3.0:1 → 9.2:1 sobre el fondo slate). Variables `--python-from/--python-to` en `:root` y `[data-md-color-scheme="slate"]`.
- Logo bicolor oficial en `docs/assets/python-logo.svg` (dos serpientes, degradados del logo). En el menú se usa como `background-image` base64 (`nav-icon--python`, activado por `nav-toggle.js`), no como `mask-image`, porque una máscara es monocolor y perdería azul/amarillo.
- Shortcode `:fontawesome-brands-python:` con `.python-icon` (azul base `#3776AB`) en la tabla de `docs/index.md`; `site_description` menciona Python.
- Solo andamiaje visual: los capítulos y la entrada en `nav:` llegan después, con el contenido.

## Por qué

Cada bloque tiene identidad visual propia (un color por bloque). Se prepara la de Python antes de escribir contenido, siguiendo el patrón de React.
