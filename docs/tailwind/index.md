# Tailwind CSS

Framework CSS utility-first: compone estilos con clases utilitarias predefinidas directamente en el HTML, en vez de escribir reglas CSS propias para cada componente.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/R5EXap3vNDA" title="Tailwind CSS — vídeo base de inicio" loading="lazy" allowfullscreen></iframe>
</div>

- [Fundamentos](00-fundamentos/index.md) — Utility-first, anatomía de una clase, configuración v4
- [Sistema de diseño](01-sistema-diseno/index.md) — Espaciado, dimensiones, colores, tipografía
- [Layout](02-layout/index.md) — Flexbox, Grid, posición y overflow
- [Responsive & estados](03-responsive-estados/index.md) — Breakpoints, pseudo-clases, group/peer
- [Efectos visuales](04-efectos-visuales/index.md) — Sombras, filtros, mask, transforms, transiciones
- [Interactividad y accesibilidad](05-interactividad-accesibilidad/index.md) — Cursor, scroll, formularios, sr-only, SVG

---

## Instalación

Dos caminos según para qué se use: uno para proyectos reales, otro solo para probar clases rápido.

### CLI / Vite — para producción

Es la vía real. Instala Tailwind como dependencia, procesa los archivos y genera un CSS final con solo las clases que se usan de verdad.

**0. Inicializar el proyecto** (si todavía no existe `package.json`):

```bash
pnpm init
```

**1. Instalar Tailwind** — según si el proyecto usa Vite o no:

=== "Vanilla — CLI directo"

    ```bash
    pnpm add tailwindcss @tailwindcss/cli
    ```

    Sin bundler, la propia CLI compila el CSS. Se añade como script en `package.json`:

    ```json
    {
      "scripts": {
        "dev": "tailwindcss -i ./src/input.css -o ./dist/output.css --watch"
      }
    }
    ```

    ```bash
    pnpm run dev
    ```

    !!! tip "Alternativa rápida: `pnpx`, sin instalar nada permanente"
        `pnpx @tailwindcss/cli -i ./input.css -o ./output.css` ejecuta el CLI una sola vez, sin añadirlo al `package.json` — útil para probar rápido. `pnpm add` (arriba) es la vía normal para un proyecto real, porque deja el paquete instalado y permite usar `--watch` desde un script.

=== "Con Vite"

    ```bash
    pnpm add tailwindcss @tailwindcss/vite
    ```

    ```js
    // vite.config.js
    import tailwindcss from '@tailwindcss/vite';

    export default {
      plugins: [tailwindcss()],
    };
    ```

**2. El punto de partida es el mismo en ambos casos:**

```css
/* src/input.css (o style.css con Vite) */
@import "tailwindcss";
```

Con esto ya hay acceso a todas las utility classes en el HTML/JS — no hace falta declarar qué archivos escanear, Tailwind v4 detecta el contenido automáticamente.

!!! note "Norma: CLI/Vite para producción"
    Cualquier proyecto que vaya a mantenerse o entregarse se monta así desde el principio — nunca con el CDN. Para un proyecto sin bundler (vanilla), la vía CLI directa es la que corresponde — no hace falta Vite si no se usa ya por otro motivo.

### Play CDN — para prototipar

Un `<script>` que compila Tailwind en el navegador, en tiempo real. Cero instalación:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

!!! warning "Nunca en producción"
    El CDN compila TODO el framework en el navegador de cada visitante — sin purgar clases no usadas, sin optimizar. Sirve para probar una idea rápida o seguir un tutorial, no para un sitio real.

!!! note "Norma: CDN solo para prototipar"
    El uso del CDN se limita a probar una idea rápido o seguir un ejercicio puntual. Cualquier proyecto que vaya a mantenerse o entregarse se monta con CLI/Vite desde el principio.

    ```html
    <script src="https://cdn.tailwindcss.com"></script>
    ```

!!! tip "Extensión recomendada: Tailwind CSS IntelliSense"
    Extensión oficial para VS Code — autocompletado de utility classes, previsualización del color al pasar el cursor sobre una clase, y aviso cuando dos clases entran en conflicto entre sí. Útil tanto con CLI/Vite como con el CDN.

### Comparativa

| | CLI/Vite | Play CDN |
|---|---|---|
| Instalación | `npm install` + config | Un `<script>` |
| CSS final | Solo las clases que se usan, optimizado | Todo el framework, sin optimizar |
| Uso | Proyectos reales | Prototipar, aprender |

---

## 📖 Referencias

- 📘 **Documentación oficial — Tailwind CSS** — https://tailwindcss.com/docs
