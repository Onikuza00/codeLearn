# Documentar resultados de ejercicios — normas

> Normas para documentar en el daily log (`docs/waytoCode/AAAA/MM/semana-N/AAAA-MM-DD.md`) cómo salió cada ejercicio del día: qué falló, cómo se corrigió y qué se aprendió. No aplica a crear el ejercicio en sí (`rules/ejercicios-estructura.md`) ni a documentar teoría (`rules/documentacion.md`).

---

## Regla general por ejercicio

**Ejercicios CON fallos** — llevan sección propia completa:

- Encabezado: `### E# — \`función(args)\` — ✅ Completado (N fallos)`
- **Cada error en su propia card independiente** (norma vigente desde el 23/09/2026): un bloque `!!! failure "❌ Fallo N — título corto"` por error, nunca una lista de bullets con todos los errores juntos ni un único bloque de código para varios fallos. Cada card lleva:
    - Una frase con qué falló.
    - El código REAL que escribió Pau (el fragmento de ese error, con contexto suficiente), con comentarios inline `// ❌ ...` marcando el error EXACTO en la línea donde ocurre.
    - Su propio `🧠 **Lección:**` nombrando el principio/patrón general detrás de ese error (early return, off-by-one, etc.), no solo "estaba mal".
- Bloque `!!! success "✅ Versión corregida (...)"` con el código completo y correcto, una sola vez por ejercicio. **Va ANTES de las cards de fallo** (primero el ✅, debajo un `!!! failure` por cada error).

**Ejercicios SIN fallos** — NO llevan sección propia, ni bloque de código, ni listado por ejercicio. Van resumidos en una cuadrícula compacta de totales al principio del grupo — solo el conteo de cuántos salieron bien, sin nombrarlos uno por uno:

```markdown
| ✅ Sin fallos | ❌ Con fallos |
|:---:|:---:|
| 8 | 4 |
```

## Formato de las páginas Repaso urgente (JS / DOM y Symfony)

Mismo formato de código que el daily log (norma vigente desde el 26/09/2026):

- **Todo código va en cards, nunca en bloques sueltos:** primero un `!!! success "✅ Versión correcta"` con el código bueno y debajo un `!!! failure "❌ Fallo N — título"` por cada error (código real con `// ❌` + su `🧠 Lección`). Un error = una card; nunca varios `// ❌` juntos en un mismo bloque.
- **Los avisos NO cambian:** los `!!! tip`, `!!! danger` y `!!! warning` (incluidos los de «Reincidencia dd/mm») se mantienen tal cual y van **después** de las cards de código. Al reformatear una página existente solo se tocan los bloques de código; ningún aviso se quita, se funde en una lección ni se convierte en `failure`.
- Las tablas de referencia y el checklist final quedan como están.

## Qué NO documentar

- Errores de naming/typos que no son conceptuales (ej. `array` vs `pwd`) — solo errores conceptuales.
- Rutas de archivo ni URLs completas como texto plano en ningún lado del log — siempre `[texto](link)` markdown, con rutas absolutas (`/js/03-objetos/`), nunca relativas (`../../..`).
- Secciones de "Plan de la sesión" / "Objetivo del día" / "Setup" con tablas de horas — el daily log se mantiene liviano, eso sobra.

## Cierre del bloque de ejercicios

- Sección `## 🔎 Por qué fallaron — resumen del día` (o equivalente) al final, con los patrones/debilidades detectadas.
- Pendientes se listan al final como checklist.
- **Poda de Repaso Urgente al cerrar cada sesión** (norma vigente desde el 23/09/2026): si un error ya no persiste (el ejercicio salió bien esta vez, sin reincidir), se saca de [Repaso urgente — JS / DOM](/waytoCode/repaso-urgente-js/) o de [Repaso urgente — Symfony](/waytoCode/repaso-urgente-symfony/). Un error solo se queda mientras reincida. Se comprueba contra el resultado real del día, no de memoria.
- **Actualizar también `docs/assessment/index.html`**: añadir fila nueva a la tabla "Historial de assessments" (fecha, ejercicio/bloque, resultado) — no alcanza con dejarlo solo en el daily log.
  - Si la fila es un examen con nota o resultado aprobado/no aprobado, recalcular las 4 métricas de `.stats-row` (Exámenes totales / Aprobados / Pendientes de calificar / Promedio calificados).
  - El promedio solo cuenta filas con nota numérica explícita — nunca inventar una nota; si no hay, dejar `—` y contarla aparte como aprobado/pendiente cualitativo.

## Cómo aplicar esto en la práctica

- Antes de escribir la sección de Ejercicios de cualquier daily log, releer un daily log anterior del mismo tipo (o de otro bloque si es el primero de ese bloque) para clonar el formato exacto con código real, no inventado ni genérico.
- Este formato aplica a TODOS los bloques (JS, Symfony, CSS...), no solo JS — es un estándar fijo, no una preferencia puntual de un bloque.

---

*Consolidado el 15/08/2026 desde engram `pattern` #214 (formato fijo vigente — supera a #186 y #174, versiones anteriores del mismo patrón ya obsoletas) y desde memoria personal `feedback_formato_daily_log_ejercicios.md` + `feedback_actualizar_historial_assessment.md`.*
