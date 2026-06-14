# 🗺️ Way to Code — Pau

> Línea de tiempo de tu progreso. Cada día se registra lo aprendido, lo practicado y el nivel alcanzado.

---

## 2026-06-14

### Symfony Web Components

| Concepto | Estado | Nivel |
|----------|--------|-------|
| Qué son los Twig Components | ✅ Entendido | Medio |
| Props y paso de datos | ✅ Entendido | Medio |
| Twig Components vs Live Components | ✅ Entendido | Medio |
| Live Actions (emit) | ✅ Entendido | Medio |
| Registro automático (vs Vue) | ✅ Entendido | Medio |
| Slots | ⏳ Pendiente | — |
| Primer Twig Component propio | ⏳ Pendiente | — |
| React vs Symfony WC (para el jefe) | ⏳ Pendiente | — |

### CSS

| Concepto | Estado | Nivel |
|----------|--------|-------|
| `:has()` selector relacional | ⏳ Pendiente | — |

### Logros del día
- ✅ Creada estructura de documentación mkdocs en codeLearn
- ✅ Instalado Python 3.13 + mkdocs + mkdocs-material
- ✅ Servicio mkdocs levantado en http://localhost:8000
- ✅ Guardado workflow de aprendizaje en Engram
- ✅ 8 placeholders creados para bloques futuros
- ✅ Docs Symfony WC reestructurados: 10 secciones (Arquitectura, Twig, Live, Props/Eventos, Stimulus, UX React/Vue, UX Toolkit, Web Components Navegador, Árbol Decisión, Recursos)
- ✅ Leído y entendido Component Architecture CookBook de ux.symfony.com

---

### 🎯 Sesión 2 — CSS intensivo: Flexbox + Grid

#### Evaluación de nivel

Se realizaron **3 ejercicios de diagnóstico** (Flexbox) y **4 ejercicios de Grid** para medir el nivel real:

| # | Ejercicio | Tema | Tiempo | Nota |
|---|-----------|------|--------|------|
| 1 | Header con Flexbox | Flexbox | 15' (no terminó) | 4/10 |
| 2 | Hero con Flexbox | Flexbox | 15' (sobraron 2') | 6.5/10 |
| 3 | Landing page | Flexbox | 20' (justo) | 7/10 |
| 4 | Galería responsive | Grid `auto-fit` | 20' | 8/10 |
| 5 | Dashboard | Grid `areas` | 20' (falló) | — |
| 6 | Revista digital | Grid `areas` | 20' | 7/10 |
| 7 | Hero con Grid | Grid `areas` | 20' | 6/10 |
| 8 | Pricing cards | Grid `areas` | 15' | 7/10 |

**Progresión**: 4/10 → 7/10 en 8 ejercicios. Notable mejora.

#### Fortalezas detectadas ✅
- Entiende y aplica `display: flex` con `justify-content` / `align-items`
- Captó rápido `repeat(auto-fit, minmax(..., 1fr))` — el combo responsive sin media queries
- `grid-template-areas` con nombres sin comillas
- Estructura HTML semántica consistente
- Reset global automático

#### Debilidades detectadas 🔴
- Errores de sintaxis CSS repetitivos: `0.5` sin unidad, `transition: .5` sin `s`, `calc()` en vez de `clamp()`
- `grid-template-areas` con comillas incorrectas (poner cada celda entre comillas en vez de cada fila)
- `repeat (4,1fr)` con espacio antes de `()` — no válido
- Hijos del grid no directos — no coincide el `grid-area` con el contenedor real
- `box-sizing: 0` en vez de `border-box`
- Olvida `display: flex` antes de usar `flex-direction`

#### CSS documentación creada
- **Flexbox** (4 páginas): conceptos, alineación, items flexibles — con 18 SVGs
- **Grid** (4 páginas): conceptos, ubicación, auto layout — con 9 SVGs
- **27 SVGs visuales** para propiedades de layout
- **Nav actualizado** en mkdocs.yml con bloques 04 y 05
- **Referencias**: midudev, lenguajecss.com, CSS-Tricks, MDN

#### Configuración de herramientas
- ✅ Emmet configurado con `triggerExpansionOnTab: true`
- ✅ Snippets VS Code: 5 HTML + 8 CSS
- ✅ `editor.suggestOnTriggerCharacters: false` en HTML y CSS para evitar interferencias
- ✅ Live Server recomendado para preview

#### Próximos pasos
- Terminar bloques CSS pendientes (`:has()`, Container Queries, `@layer`)
- Proyecto integrador CSS (bloque 06)
- Grid avanzado con subgrid

### Recursos
- Documentación local: `http://localhost:8000`
- Código: `C:\xampp\htdocs\codeLearn`
- mkdocs.yml con Material Theme

---

## 2026-06-13 — Setup y diagnóstico

- Configuración de perfil en Engram
- Revisión de proyectos DAW (nota: 9/10)
- Análisis de código real: tragaperras, API temps, Vue inventory
- Revisión de raymel.cat (producción GSAP real)
- Plan de aprendizaje personalizado
- Lectura de teoría Symfony Web Components
- Teoría de `:has()` lista para practicar
