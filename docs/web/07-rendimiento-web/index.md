# Rendimiento web { .section-web }

> El rendimiento no es «que la página pese poco»: es que el usuario **vea** contenido pronto, que **responda** cuando toca algo, y que no le **salte** la pantalla mientras lee. Esas tres cosas se miden, y por eso se pueden discutir con datos en lugar de con opiniones.

---

## Core Web Vitals { .topic-title }

Tres métricas que Google usa y que resumen bien la experiencia real:

| Métrica | Qué mide | Bien | Mal |
|---|---|---|---|
| **LCP** *(Largest Contentful Paint)* | Cuándo aparece el elemento visible más grande | < 2,5 s | > 4 s |
| **INP** *(Interaction to Next Paint)* | Cuánto tarda la página en responder a una interacción | < 200 ms | > 500 ms |
| **CLS** *(Cumulative Layout Shift)* | Cuánto se mueve el contenido de sitio mientras carga | < 0,1 | > 0,25 |

!!! tip "Las tres apuntan a causas distintas"
    - **LCP malo** → recursos que bloquean el render, imágenes grandes, servidor lento.
    - **INP malo** → JavaScript ocupando el hilo principal.
    - **CLS malo** → imágenes o anuncios sin espacio reservado, fuentes que cambian de tamaño al cargar.

    Saber cuál falla te dice dónde mirar. Optimizar imágenes cuando el problema es un `bundle` de 2 MB no mejora nada.

## Qué bloquea el render { .topic-title }

El navegador no puede pintar hasta tener el HTML y el CSS. Dos reglas que explican la mayoría de los LCP malos:

**El CSS bloquea el render.** Un `<link rel="stylesheet">` detiene el pintado hasta que se descarga y procesa. Es deliberado: pintar sin estilos y luego aplicarlos produciría un parpadeo.

**El JavaScript bloquea el parseo del HTML.** Un `<script>` sin atributos para el parser, descarga, ejecuta, y solo entonces sigue.

```html
<script src="app.js"></script>          <!-- bloquea: para, descarga, ejecuta -->
<script src="app.js" defer></script>    <!-- descarga en paralelo, ejecuta al final -->
<script src="app.js" async></script>    <!-- descarga en paralelo, ejecuta al terminar -->
```

!!! tip "`defer` es la opción por defecto razonable"
    `defer` descarga en paralelo y ejecuta **cuando el HTML está completo**, respetando el orden de los scripts. `async` ejecuta en cuanto llega, en orden imprevisible: solo sirve para scripts independientes que no dependan del DOM ni de otro script, como una analítica.

    Un `<script>` sin nada al final del `<body>` era el truco antiguo; hoy `defer` en el `<head>` es mejor, porque la descarga empieza antes.

## Imágenes { .topic-title }

Suelen ser la mayor parte del peso de una página, y el LCP casi siempre es una imagen.

```html
<img
    src="foto-800.webp"
    srcset="foto-400.webp 400w, foto-800.webp 800w, foto-1600.webp 1600w"
    sizes="(min-width: 768px) 50vw, 100vw"
    width="800" height="600"
    alt="Descripción real de la imagen"
    loading="lazy"
    decoding="async">
```

| Atributo | Para qué |
|---|---|
| `srcset` + `sizes` | El navegador elige la resolución que necesita |
| **`width` y `height`** | Reservan el espacio: **evitan el CLS** |
| `loading="lazy"` | No descarga hasta que se acerca a la pantalla |
| `fetchpriority="high"` | Para la imagen del LCP: que se descargue antes que nada |

!!! danger "`loading=\"lazy\"` en la imagen principal empeora el LCP"
    Es el error más común al aplicar esta lista de recetas sin pensar. La imagen visible al cargar **no** debe ser diferida: retrasarla es retrasar justo la métrica que quieres mejorar. `lazy` va en las que están por debajo del pliegue; a la principal se le pone `fetchpriority="high"`.

!!! tip "`width` y `height` siguen haciendo falta con CSS responsive"
    Aunque la imagen se dimensione con `max-width: 100%`, esos atributos le dan al navegador la **proporción** para reservar el hueco antes de descargarla. Sin ellos, el texto de debajo salta cuando la imagen aparece. Es la causa número uno de CLS.

**Formatos:** AVIF y WebP pesan bastante menos que JPEG con la misma calidad. Se sirven con `<picture>` y respaldo para navegadores antiguos.

## Fuentes { .topic-title }

```css
@font-face {
    font-family: 'Inter';
    src: url('inter.woff2') format('woff2');
    font-display: swap;
}
```

`font-display: swap` muestra el texto **inmediatamente** con una fuente del sistema y lo cambia cuando llega la definitiva. Sin él, el texto puede quedar invisible hasta un segundo.

!!! warning "`swap` intercambia CLS por visibilidad"
    Al cambiar de fuente, el texto puede cambiar de tamaño y mover el contenido. Se mitiga eligiendo una fuente de respaldo con métricas parecidas y ajustándola con `size-adjust`, o usando `font-display: optional` cuando prefieres no arriesgar el CLS.

Y **precargar** la fuente crítica evita que se descubra tarde:

```html
<link rel="preload" href="inter.woff2" as="font" type="font/woff2" crossorigin>
```

## Red y entrega { .topic-title }

| Técnica | Qué aporta |
|---|---|
| **Compresión** (Brotli o gzip) | Reduce el texto —HTML, CSS, JS— a una fracción |
| **HTTP/2 o 3** | Varias peticiones en paralelo sobre una conexión |
| **CDN** | Sirve desde un servidor cercano al usuario |
| **[Caché](../05-cache-http/index.md) con hash en el nombre** | La visita repetida no descarga nada |
| **`preconnect`** | Abre la conexión a un dominio de terceros antes de necesitarlo |

## JavaScript { .topic-title }

Es lo que más daña el INP, porque ocupa el hilo principal y mientras tanto la página no responde.

- **Enviar menos.** Cada dependencia se paga en descarga, parseo y ejecución.
- **Dividir el paquete** (*code splitting*): cargar bajo demanda lo que no hace falta al arrancar.
- **Trocear el trabajo largo**: una tarea de 500 ms bloquea cualquier interacción durante ese tiempo.
- **Limitar los manejadores frecuentes** con *debounce* o *throttle*: `scroll`, `resize`, `input`.

!!! tip "Una librería de 300 KB para formatear fechas"
    El caso clásico. Antes de instalar algo, mirar cuánto pesa y si el navegador ya lo trae: `Intl.DateTimeFormat` y `Intl.NumberFormat` cubren formato de fechas, monedas y números en todos los idiomas, sin añadir un byte.

## Medir antes de optimizar { .topic-title }

| Herramienta | Para qué |
|---|---|
| **Lighthouse** (DevTools) | Auditoría rápida en local |
| **PageSpeed Insights** | Lo mismo, más datos reales de usuarios |
| **Pestaña Network** | Qué se descarga, en qué orden, cuánto pesa |
| **Pestaña Performance** | Dónde se va el tiempo del hilo principal |

!!! danger "Los datos de laboratorio no son los datos de campo"
    Lighthouse mide en tu máquina, con tu red. Los usuarios reales llegan con móviles modestos y conexiones peores. Una nota de 95 en local convive perfectamente con un LCP malo en campo.

    Y el orden importa: **medir, encontrar el cuello, arreglar ese, volver a medir.** Aplicar una lista de optimizaciones sin medir suele empeorar la legibilidad del código sin mover ninguna métrica.

---

## 📚 Fuentes { .topic-title }

| Fuente | Enlace |
|---|---|
| ⚡ **web.dev — Core Web Vitals** | [web.dev/articles/vitals](https://web.dev/articles/vitals) |
| 📗 **MDN — Rendimiento web** | [developer.mozilla.org/es/docs/Web/Performance](https://developer.mozilla.org/es/docs/Web/Performance) |
| 🔍 **PageSpeed Insights** | [pagespeed.web.dev](https://pagespeed.web.dev/) |
