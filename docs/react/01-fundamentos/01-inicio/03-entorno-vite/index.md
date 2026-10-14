# Entorno con Vite { .section-react .bloque-react }

> Para trabajar con React hace falta un proyecto con herramientas de compilación: algo que traduzca JSX, sirva la página en desarrollo y genere los archivos finales. Vite es la opción más directa, y un proyecto Vue también lo monta Vite, así que la estructura es casi la misma.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/GMnWXlJnbNo?start=2216" title="Setup del proyecto (desde 00:36:56) — Gentleman Programming" loading="lazy" allowfullscreen></iframe>
</div>

---

## Requisitos {: .topic-title }

Necesitas **Node.js**, el entorno que ejecuta JavaScript fuera del navegador y que trae el gestor de paquetes. La guía de Vite pide **Node 20.19+ o 22.12+**.

```bash
node -v
```

Si la versión es inferior, instala la LTS desde <https://nodejs.org>.

!!! warning "Con un Node antiguo, Vite no arranca"
    Es un requisito real. Si al crear o arrancar el proyecto aparece un error raro, comprueba primero `node -v`.

---

## Crear y arrancar {: .topic-title }

```bash
pnpm create vite@latest my-app --template react
cd my-app
pnpm install
pnpm dev
```

`create` genera la carpeta con la plantilla, `install` descarga las dependencias y `dev` arranca el servidor en **`http://localhost:5173/`** (`Ctrl + C` para detenerlo). Sin `--template`, el asistente te pregunta nombre, framework y variante; el resultado es el mismo. Con `react-ts` obtienes TypeScript (`.tsx`).

| pnpm | npm | Yarn |
|---|---|---|
| `pnpm create vite@latest my-app --template react` | `npm create vite@latest my-app -- --template react` | `yarn create vite my-app --template react` |
| `pnpm install` | `npm install` | `yarn` |
| `pnpm dev` | `npm run dev` | `yarn dev` |
| `pnpm build` | `npm run build` | `yarn build` |
| `pnpm preview` | `npm run preview` | `yarn preview` |

!!! warning "npm necesita un `--` extra"
    En npm 7 o superior, sin el doble guion (`-- --template react`) npm se queda la opción y no llega al asistente.

El `package.json` generado incluye estos scripts:

| Script | Qué hace |
|---|---|
| `dev` | Servidor de desarrollo con recarga instantánea |
| `build` | Genera la versión optimizada en `dist/` |
| `preview` | Sirve en local lo que hay en `dist/` |
| `lint` | Revisa el código con oxlint |

---

## Qué se ha creado y cuándo {: .topic-title }

| Comando | Qué aparece |
|---|---|
| `pnpm create vite@latest ...` | La carpeta `my-app/` con los archivos de la **plantilla** |
| `pnpm install` | `node_modules/` y el **lockfile** (`pnpm-lock.yaml`; `package-lock.json` con npm) |
| `pnpm dev` | Nada nuevo en disco: Vite sirve desde `src/` y recarga al guardar |
| `pnpm build` | La carpeta `dist/` con la versión de producción |

```text
my-app/
├── node_modules/        ← pnpm install
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/          (hero.png, react.svg, vite.svg)
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── .oxlintrc.json
├── index.html
├── package.json
├── pnpm-lock.yaml       ← pnpm install
└── vite.config.js
```

| Archivo | Para qué sirve | Equivalente en Vue |
|---|---|---|
| `index.html` | Página única; tiene el `<div id="root">` y carga `main.jsx` | `index.html` (`<div id="app">`) |
| `src/main.jsx` | Arranca React: crea la raíz y dibuja `<App />` | `src/main.js` |
| `src/App.jsx` | Componente raíz; de aquí cuelga la interfaz | `src/App.vue` |
| `src/*.css` | Estilos globales y del componente raíz | `src/assets/main.css` |
| `src/assets/` | Recursos que **importas** desde el código | `src/assets/` |
| `public/` | Archivos servidos tal cual, sin pasar por Vite | `public/` |
| `vite.config.js` | Configuración de Vite; registra el plugin de React | `vite.config.js` (plugin de Vue) |
| `package.json` | Nombre, scripts y dependencias | `package.json` |
| `.oxlintrc.json` | Reglas del linter (`pnpm lint`) | `eslint.config.js`, si lo eliges |

!!! info "La plantilla cambia con el tiempo"
    Los nombres exactos varían entre versiones de `create-vite`; tutoriales antiguos muestran ESLint o `vite.svg` en `public/`. Lo estable es la estructura: `index.html`, `src/`, `public/` y la configuración.

---

## Flujo de arranque {: .topic-title }

```html
<!-- index.html -->
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

```jsx
// src/main.jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

1. El navegador pide `index.html` y encuentra el `<div id="root">` vacío.
2. El `<script type="module">` carga `main.jsx`.
3. `main.jsx` toma ese `div` con `createRoot` y `render` dibuja dentro `<App />`.
4. `App.jsx` devuelve el JSX raíz y de ahí cuelga todo lo demás.

| En Vue | En React |
|---|---|
| `<div id="app">` | `<div id="root">` |
| `createApp(App).mount("#app")` | `createRoot(...).render(<App />)` |
| `App.vue` | `App.jsx` |

Es lo mismo que se hace a mano en [React sin dependencias](../05-react-sin-dependencias/index.md), ahora con módulos gestionados por Vite en vez de un CDN.

---

## Qué tocas y qué no {: .topic-title }

| Zona | Regla |
|---|---|
| `src/` | **Tu código**: componentes, estilos e imágenes |
| `index.html` | Se edita poco: título, idioma, favicon, metaetiquetas |
| `vite.config.js`, `package.json` | Al añadir plugins, scripts o dependencias; mejor con el comando del gestor |
| `node_modules/`, lockfile | **No se editan**: los gestiona `pnpm` |
| `dist/` | Resultado de `pnpm build`; se regenera |

---

## Tips y gotchas {: .topic-title }

!!! tip "Puerto ocupado"
    Si el 5173 está en uso, Vite elige otro e imprime la URL real. Fíjate siempre en la que muestra la terminal.

!!! warning "`preview` no es un servidor de desarrollo"
    Sirve lo que ya está en `dist/`: si cambias código y no ejecutas `pnpm build`, verás la versión anterior.

!!! warning "El `<div id="root">` tiene que existir"
    Si lo renombras o lo borras, `getElementById('root')` devuelve `null` y la pantalla queda en blanco.

!!! tip "`public/` o `src/assets/`"
    Si **importas** el archivo, va en `src/assets/` (Vite lo procesa y añade un hash). Si necesita su nombre exacto (`favicon.svg`, `robots.txt`), va en `public/` con ruta absoluta (`/favicon.svg`).

!!! tip "`.jsx` para archivos con JSX"
    Vite también acepta JSX en `.js`, pero la convención es `.jsx`: se ve de un vistazo qué archivos son componentes.

!!! warning "`node_modules` no se sube al repositorio"
    Se regenera con `pnpm install`; comprueba que está en `.gitignore` antes del primer commit.

!!! info "Fast Refresh y doble renderizado"
    Al guardar, el navegador se actualiza sin recargar y sin perder el estado. La plantilla envuelve la app en `<StrictMode>`, que en desarrollo ejecuta los componentes dos veces para detectar errores: un mensaje repetido es normal.

!!! warning "No uses Create React App"
    La documentación oficial de React indica que está descontinuado. Un tutorial que empiece con `npx create-react-app` está desactualizado; para apps completas React recomienda hoy un framework, y Vite sigue siendo buena opción para aprender y para SPA.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| Vite — Primeros pasos | <https://vite.dev/guide/> |
| Vite — Recursos estáticos (`public/` frente a `src/`) | <https://vite.dev/guide/assets> |
| Plantilla `template-react` | <https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react> |
| React — Empezar un nuevo proyecto | <https://es.react.dev/learn/start-a-new-react-project> |
| JSCamp (midudev) — Instalación de Vite | <https://jscamp.dev/introduccion-a-react/instalacion-vite> |
| JSCamp (midudev) — Vite: empaquetador moderno | <https://jscamp.dev/introduccion-a-react/vite> |
| JSCamp (midudev) — Fast Refresh | <https://jscamp.dev/introduccion-a-react/fast-refresh-update-state> |
