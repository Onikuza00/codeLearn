# 📚 Journal de Aprendizaje — Pau

> Tu cuaderno de bitácora. Cada sesión se guarda aquí.
> Cuando abras esto en otra máquina, el contexto viaja con vos.

---

## 👤 Perfil

| Campo | Valor |
|-------|-------|
| Nombre | Pau |
| Rol | Junior DAW + prácticas startup |
| Stack principal | JS, Symfony, GSAP, Vue, CSS |
| Nivel | Junior avanzado — escribe código real con GSAP complejo |
| Disponibilidad | ~15h/sem (3h x 3 días + 2 findes intensivos/mes) |
| Objetivo | Consolidar prácticas, aprender CSS moderno, crecer profesionalmente |
| Mentor | Gentle AI (orquestrador SDD + senior) |

---

## 🎯 Plan de aprendizaje activo

| Prioridad | Stack | Tema | Estado |
|-----------|-------|------|--------|
| 🔴 Alta | CSS | Bloque 1: `:has()` | Pendiente |
| 🟡 Media | JS | Práctica deliberada sin IA | Pendiente |
| 🟡 Media | Symfony | Web Components (Twig + Live) | Teoría lista |
| 🟢 Futuro | React | Cuando CSS+JS estén sólidos | Pendiente |

---

## 📓 Sesiones

### 2026-06-13 — Sesión de inicio

**Stack:** Múltiple
**Tema:** Setup + diagnóstico + plan de aprendizaje

#### Lo que hicimos
- Configuración de perfil en Engram (contexto permanente)
- Revisión de apuntes y proyectos del curso DAW (nota: 9/10)
- Análisis de código real: máquina tragaperras, API temps, Vue inventory
- Revisión exhaustiva de raymel.cat (producción real con GSAP avanzado)
- Revisión de gsapAcademy (autoaprendizaje transcribiendo CodeGrid)
- Diagnóstico de nivel y plan de aprendizaje personalizado

#### Stack: CSS
- **Tema:** `:has()` — Bloque 1
- **Recurso:** `CSS/bloque-1/README.md`
- **Ejercicio:** Galería de productos adaptativa (`ejercicio-has.html` + `ejercicio-has.css`)
- **Estado:** Pendiente (no iniciado)
- **Concepto clave:** `:has()` permite estilar un padre según el estado de un hijo

#### Stack: Backend
- **Tema:** Symfony Web Components
- **Recurso:** `Backend/symfony-webcomponents/README.md`
- **Estado:** Teoría desde cero (nunca los había visto)
- **Dudas:** Concepto nuevo, necesita práctica

#### Notas importantes
- Pau aprendió GSAP por su cuenta transcribiendo ejercicios de CodeGrid
- Raymel.cat es código propio (no vib coding) con GSAP + Lenis + MorphSVG + MatchMedia
- Buena base teórica, necesita práctica deliberada para ganar fluidez

#### Próximo bloque
- CSS moderno: Container Queries + `@layer`
- JS: fetch a API real sin IA
- Symfony: crear primer Twig Component

---

## 🏆 Proyectos propios (portfolio)

| Proyecto | URL | Tecnologías |
|----------|-----|-------------|
| VoraStudio | https://www.vorastudio.cat | Diseño propio, web custom |
| Raymel Sweet Sensations | https://www.raymel.cat | GSAP, Lenis, CSS, JS, i18n, reCAPTCHA |
| Comercial Ros | https://www.comercialros.cat | Odoo e-commerce |

---

## ⚙️ Config OpenCode

### AGENTS.md actualizado (14/06/2026)
- Sección `gentle-ai:persona` → tono, idioma, personalidad del mentor
- Sección `gentle-ai:user-profile` → **perfil de Pau para todos los agentes** (stack, nivel, preferencias, repo)
- Sección `gentle-ai:engram-protocol` → memoria persistente entre sesiones

### Skills instaladas (22)
- SDD: init, explore, propose, spec, design, tasks, apply, verify, archive, onboard
- Reviews: R1 (risk), R2 (readability), R3 (reliability), R4 (resilience)
- Meta: skill-creator, skill-improver, skill-registry, work-unit-commits
- PRs: branch-pr, chained-pr
- Otros: comment-writer, cognitive-doc-design, go-testing, issue-creation, judgment-day

### Para portar al trabajo
Copiar `C:\Users\Usuario\.config\opencode\` → misma ruta en la máquina de trabajo.

## 📁 Estructura del repo

```
codeLearn/
├── CSS/
│   └── bloque-1/           ← :has() + futuros conceptos
│       ├── README.md        ← teoría + ejercicio
│       ├── ejercicio-has.html
│       └── ejercicio-has.css
├── Backend/
│   └── symfony-webcomponents/
│       └── README.md        ← teoría desde cero
└── JOURNAL.md               ← este archivo
```
