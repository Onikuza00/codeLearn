# Variables nativas { .bloque-css }

> Las **custom properties** (variables CSS) centralizan valores que se repiten — colores, espaciados, tipografías — en un solo lugar. Cambias el valor una vez, se actualiza en todo el sitio.

---

## ¿Qué problema resuelven? {: .topic-title }

Sin variables, un color o un espaciado que usas 40 veces vive **copiado 40 veces**:

```css
/* ❌ Sin variables — el mismo azul repetido por todos lados */
.btn { background: #3b82f6; }
.link { color: #3b82f6; }
.badge { border-color: #3b82f6; }
```

Si mañana cambia el azul de marca, tocas 40 sitios (o te olvidas de uno).

```css
/* ✅ Con variables — un solo lugar */
:root {
    --color-primario: #3b82f6;
}

.btn { background: var(--color-primario); }
.link { color: var(--color-primario); }
.badge { border-color: var(--color-primario); }
```

---

## Sintaxis básica {: .topic-title }

```css
:root {
    --color-primario: #3b82f6;
    --espaciado-md: 1rem;
    --radio-borde: 8px;
}

.card {
    background: var(--color-primario);
    padding: var(--espaciado-md);
    border-radius: var(--radio-borde);
}
```

| Parte | Qué es |
|---|---|
| `--nombre` | Se **declara** con doble guion al principio |
| `:root` | El elemento raíz del documento — es donde se declaran las variables globales |
| `var(--nombre)` | Se **lee** con la función `var()` |

<div class="demo-box">
<p class="demo-box__label">Vista previa</p>
<div class="demo-vars-card">Card con <code>var(--color-demo)</code></div>
</div>

<style>
.demo-vars-card { --color-demo: #34D399; padding: 0.75rem 1rem; border-radius: 8px; background: var(--color-demo); color: #04321f; font-weight: 600; text-align: center; }
</style>

---

## Valor de respaldo (fallback) {: .topic-title }

`var()` acepta un segundo argumento: el valor a usar **si la variable no existe**.

```css
.btn {
    color: var(--color-texto, black);
    /*                        ↑ fallback: se usa SOLO si --color-texto no está definida */
}
```

!!! tip "Cuándo usar fallback"
    Útil cuando trabajas con componentes reutilizables (una librería, un Web Component) que pueden vivir en proyectos donde la variable todavía no fue declarada. Sin fallback, si la variable no existe, la propiedad simplemente no se aplica.

---

## Scope y cascada — las variables son CSS normal {: .topic-title }

Las custom properties **heredan y siguen la cascada** como cualquier otra propiedad CSS. Puedes redefinir una variable dentro de un selector más específico, y el nuevo valor solo aplica ahí adentro.

```css
:root {
    --color-boton: #3b82f6;
}

.tema-oscuro {
    --color-boton: #a78bfa;   /* solo cambia DENTRO de .tema-oscuro */
}

.btn {
    background: var(--color-boton);
}
```

<div class="demo-box">
<p class="demo-box__label">Vista previa — misma clase <code>.btn</code>, distinto scope</p>
<div class="demo-vars-btn">Botón normal</div>
<div class="demo-vars-scope">
  <div class="demo-vars-btn">Botón dentro de .tema-oscuro</div>
</div>
<p class="demo-box__caption">El mismo <code>var(--color-boton)</code> resuelve distinto según el scope donde se redefinió la variable.</p>
</div>

<style>
:root { --demo-color-boton: #0284c7; }
.demo-vars-scope { --demo-color-boton: #a78bfa; margin-top: 0.5rem; padding: 0.5rem; border-radius: 8px; background: rgba(0,0,0,0.04); }
.demo-vars-btn { display: inline-block; padding: 0.5rem 0.9rem; border-radius: 6px; background: var(--demo-color-boton); color: white; font-weight: 600; font-size: 0.85rem; }
</style>

!!! tip "Redefinir en vez de duplicar"
    Este es el patrón detrás de los temas (claro/oscuro, marca A/marca B): no duplicas las reglas de `.btn`, solo redefines las variables que usa dentro de un contenedor con otro scope.

---

## Variables + Media Queries — design tokens responsive {: .topic-title }

Puedes redefinir el **valor de la variable** dentro de una media query, y todo lo que la use se actualiza solo — sin tocar cada propiedad individual.

```css
:root {
    --espaciado-seccion: 1.5rem;
}

@media (min-width: 768px) {
    :root {
        --espaciado-seccion: 3rem;
    }
}

.seccion {
    padding: var(--espaciado-seccion);
}
```

> Repasa la sintaxis completa de media queries en su propio temario: [Media Queries](../../responsive/01-media-queries/index.md).

---

## Variables + `prefers-color-scheme` — dark mode real {: .topic-title }

```css
:root {
    --bg: white;
    --texto: #1a1a1a;
}

@media (prefers-color-scheme: dark) {
    :root {
        --bg: #1a1a1a;
        --texto: white;
    }
}

body {
    background: var(--bg);
    color: var(--texto);
}
```

!!! success "Dark mode sin JavaScript"
    Con variables + `prefers-color-scheme`, el modo oscuro se adapta automáticamente al sistema operativo del usuario, sin toggle ni JS. Si además quieres un botón manual, JS solo necesita sobrescribir la variable con `element.style.setProperty('--bg', '...')`.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Centraliza solo lo que se repite (colores, espaciados, tipografías) | Crear una variable para un valor que se usa una sola vez |
| Nombres semánticos por rol: `--color-primario`, no `--azul-346` | Nombrar por el valor literal — se rompe si cambias el color |
| Redefine el scope para temas/variantes en vez de duplicar reglas | Definir la misma variable en 5 lugares "por las dudas" |
| Usa fallback en `var()` cuando la variable puede no existir | Depender de JS si la cascada o una media query ya resuelven el caso |
</div>

---

## Soporte (2026) {: .topic-title }

| Chrome | Firefox | Safari | Edge |
|:------:|:-------:|:------:|:----:|
| 49+ ✅ | 31+ ✅ | 9.1+ ✅ | 15+ ✅ |

**Cobertura global**: ~98% — soporte universal desde hace años, es CSS base, no una novedad.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **MDN — Using CSS custom properties** | https://developer.mozilla.org/es/docs/Web/CSS/Using_CSS_custom_properties |
| 📘 **MDN — `var()`** | https://developer.mozilla.org/es/docs/Web/CSS/var |
| 📖 **lenguajecss.com — Variables CSS** | https://lenguajecss.com/css/variables-css/ |
| ✅ **Can I Use** | https://caniuse.com/css-variables |
