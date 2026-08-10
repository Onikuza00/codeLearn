# Container Queries { .section-cq .bloque-css }

> Las Container Queries permiten aplicar estilos basados en el tamaño del **contenedor padre**, no de la ventana. Es responsive a nivel de componente.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/cihfapXEqOs" title="Container Queries — midudev" loading="lazy" allowfullscreen></iframe>
</div>

---

## El problema que resuelven {: .topic-title }

Con Media Queries preguntas: "¿qué ancho tiene la pantalla?"

```
@media (width >= 768px) { ... }
```

Pero eso no siempre sirve. Un mismo componente puede estar en contextos distintos:

- Una card en el grid principal (ancho: 800px)
- Esa misma card en un sidebar (ancho: 300px)

Con media queries la card se ve igual en los dos sitios porque el navegador solo mira la pantalla, no dónde está la card.

**Container Query**: preguntale al contenedor, no a la ventana.

```
@container cards (min-width: 400px) {
  .card { flex-direction: row; }
}
```

<div class="demo-box">
<p class="demo-box__label">Vista previa — la misma card, dos contenedores</p>
<div class="demo-cq-wrap demo-cq-wrap--narrow">
  <div class="demo-cq-card"><span>📦</span><p>Card</p></div>
</div>
<div class="demo-cq-wrap demo-cq-wrap--wide">
  <div class="demo-cq-card"><span>📦</span><p>Card</p></div>
</div>
<p class="demo-box__caption">Contenedor angosto (160px) → columna. Contenedor ancho (420px) → fila. Es el <strong>mismo CSS</strong> con <code>@container</code>, sin media queries.</p>
</div>

<style>
.demo-cq-wrap { container-type: inline-size; border: 1px dashed var(--md-default-fg-color--lighter); border-radius: 8px; padding: 0.6rem; margin-bottom: 0.6rem; }
.demo-cq-wrap--narrow { width: 160px; }
.demo-cq-wrap--wide { width: 100%; max-width: 420px; }
.demo-cq-card { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; background: rgba(4, 120, 87, 0.08); border-radius: 6px; padding: 0.5rem; }
.demo-cq-card p { margin: 0; font-size: 0.8rem; }
@container (min-width: 300px) {
  .demo-cq-card { flex-direction: row; justify-content: center; }
}
</style>

---

## Sintaxis {: .topic-title }

### 1. Declarar el contenedor

El elemento PADRE debe declararse como contenedor:

```css
.projects {
  container-type: inline-size;
  container-name: cards;
}
```

| Propiedad | Valores | Significado |
|-----------|---------|-------------|
| `container-type` | `inline-size` / `size` / `normal` | `inline-size` solo mira el ancho (la más usada). `size` mira ancho y alto. |
| `container-name` | Nombre opcional | Le pones nombre para referirte a él en el `@container` |

También existe el shorthand:

```css
.projects {
  container: cards / inline-size;
}
```

### 2. Consultar al contenedor

```css
@container cards (min-width: 500px) {
  .card {
    flex-direction: row;
    gap: 2rem;
  }
}

@container cards (max-width: 499px) {
  .card {
    flex-direction: column;
  }
}
```

!!! warning "Los estilos aplican a los HIJOS, no al contenedor"
    Lo que declares dentro de `@container` se aplica a los **hijos** del elemento contenedor, nunca al contenedor mismo. Si el contenedor es `.grid`, no puedes hacer `@container { .grid { ... } }`.

---

## Container Queries vs Media Queries {: .topic-title }

| Media Query | Container Query |
|-------------|-----------------|
| Mira la ventana (viewport) | Mira el contenedor padre |
| Global para toda la página | Local al componente |
| No cambia si mueves el componente | Se adapta automáticamente |
| Ideal para layout general | Ideal para componentes reutilizables |

**Conviven, no compiten.** Usa media queries para el layout general (header, sidebar, main) y container queries para componentes que se mueven entre contextos (cards, modales, tabs).

---

## Casos de uso {: .topic-title }

### 1. Cards responsive por contexto

Una misma card se ve distinta si está en el grid principal o en un related-posts:

```css
.post-card {
  container: card / inline-size;
}

/* Card en contexto ANCHO -> horizontal */
@container card (min-width: 450px) {
  .post-card__inner {
    display: flex;
    gap: 1.5rem;
  }
  .post-card__image {
    width: 200px;
    height: auto;
  }
}

/* Card en contexto ESTRECHO -> vertical */
@container card (max-width: 449px) {
  .post-card__inner {
    display: flex;
    flex-direction: column;
  }
  .post-card__image {
    width: 100%;
    height: 180px;
  }
}
```

### 2. Sidebar adaptable

```css
.sidebar {
  container: side / inline-size;
}

@container side (max-width: 250px) {
  .menu-item span {
    display: none;  /* Solo iconos */
  }
}

@container side (min-width: 251px) {
  .menu-item span {
    display: inline; /* Icono + texto */
  }
}
```

### 3. Tablas responsive

```css
.table-wrapper {
  container: table / inline-size;
}

@container table (max-width: 500px) {
  table {
    font-size: 0.75rem;
  }
  th:nth-child(3),
  td:nth-child(3) {
    display: none; /* Oculta columna menos importante */
  }
}
```

---

## Unit `cqw` (Container Query Width) {: .topic-title }

Además de `@container`, tienes unidades basadas en el contenedor:

| Unidad | Significado |
|--------|-------------|
| `1cqw` | 1% del ancho del contenedor |
| `1cqh` | 1% del alto del contenedor |
| `1cqi` | 1% del tamaño inline del contenedor |
| `1cqb` | 1% del tamaño block del contenedor |
| `1cqmin` | El menor entre `cqi` y `cqb` |
| `1cqmax` | El mayor entre `cqi` y `cqb` |

Ejemplo:

```css
.card__title {
  font-size: clamp(1rem, 4cqw, 2rem);
  /* La fuente crece con el contenedor, no con la ventana */
}
```

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Usa `container-type: inline-size` por defecto (solo mira ancho, mejor rendimiento) | `container-type: size` a menos que necesites alto y ancho (peor rendimiento) |
| Pon nombre a los contenedores si tienes varios | Anidar container queries sin necesidad |
| Combina media queries (layout global) + container queries (componentes) | Usar container queries para el layout general (para eso están las media queries) |
| Usa `cqw` para tipografía que escale con el contenedor | |
</div>

---

## Soporte (2026) {: .topic-title }

| Chrome | Firefox | Safari | Edge |
|:------:|:-------:|:------:|:----:|
| 105+ ✅ | 110+ ✅ | 16+ ✅ | 105+ ✅ |

**Cobertura global**: ~92% — listo para producción.

---

## 📖 Recursos

| Recurso | Link |
|---------|------|
| 📘 **MDN — Container Queries** | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries |
| 🎥 **Container Queries — midudev (nuevo link)** | https://www.youtube.com/watch?v=cihfapXEqOs |
| 🎮 **Tutorial interactivo** | https://interactivecss.com/container-queries-interactive-tutorial/ |
| 📗 **Guía completa — Ahmad Shadeed** | https://ishadeed.com/article/css-container-query-guide/ |
| ✅ **Can I Use** | https://caniuse.com/css-container-queries |
