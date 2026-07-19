# Container Queries { .section-cq }

> Las Container Queries permiten aplicar estilos basados en el tamaño del **contenedor padre**, no de la ventana. Es responsive a nivel de componente.

---

## El problema que resuelven

Con Media Queries preguntás: "¿qué ancho tiene la pantalla?"

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

---

## Sintaxis

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
| `container-name` | Nombre opcional | Le ponés nombre para referirte a él en el `@container` |

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

**Importante**: los estilos dentro de `@container` se aplican a los HIJOS del contenedor, no al contenedor mismo.

---

## Container Queries vs Media Queries

| Media Query | Container Query |
|-------------|-----------------|
| Mira la ventana (viewport) | Mira el contenedor padre |
| Global para toda la página | Local al componente |
| No cambia si movés el componente | Se adapta automáticamente |
| Ideal para layout general | Ideal para componentes reutilizables |

**Conviven, no compiten.** Usá media queries para el layout general (header, sidebar, main) y container queries para componentes que se mueven entre contextos (cards, modales, tabs).

---

## Casos de uso

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

## Unit `cqw` (Container Query Width)

Además de `@container`, tenés unidades basadas en el contenedor:

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

## Buenas prácticas

### ✅ Hacé

- Usá `container-type: inline-size` por defecto (solo mira ancho, mejor rendimiento)
- Poné nombre a los contenedores si tenés varios
- Combiná media queries (layout global) + container queries (componentes)
- Usá `cqw` para tipografía que escale con el contenedor

### ❌ No hagas

- `container-type: size` a menos que necesites alto y ancho (peor rendimiento)
- Anidar container queries sin necesidad
- Usar container queries para el layout general (para eso están las media queries)

---

## Soporte (2026)

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
