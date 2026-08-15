# Documentar resultados de ejercicios — normas

> Normas para documentar en el daily log (`docs/waytoCode/AAAA/MM/semana-N/AAAA-MM-DD.md`) cómo salió cada ejercicio del día: qué falló, cómo se corrigió y qué se aprendió. No aplica a crear el ejercicio en sí (`rules/ejercicios-estructura.md`) ni a documentar teoría (`rules/documentacion.md`).

---

## Regla general por ejercicio

**Ejercicios CON fallos** — llevan sección propia completa:

- Encabezado: `### E# — \`función(args)\` — ✅ Completado (N fallos)`
- Lista en bullets (`- **❌ Error/Intento N:**`) de cada error — NUNCA como párrafos en negrita seguidos sin lista.
- Bloque `!!! failure "❌ Código de Pau (...)"` con el código REAL que escribió (completo, no fragmentos), con comentarios inline `// ❌ ...` marcando el error EXACTO en la línea donde ocurre — no alcanza con explicarlo aparte en prosa.
- Bloque `!!! success "✅ Versión corregida (...)"` con el código completo y correcto.
- Párrafo `🧠 **Lección:**` nombrando el principio/patrón general detrás del error (early return, off-by-one, etc.), no solo "estaba mal".

**Ejercicios SIN fallos** — NO llevan sección propia ni bloque de código. Van agrupados en una tabla/cuadrícula compacta al principio del grupo: columna con el ejercicio (firma de función) y columna con si salió correcto — nada más, sin explicación.

## Qué NO documentar

- Errores de naming/typos que no son conceptuales (ej. `array` vs `pwd`) — solo errores conceptuales.
- Rutas de archivo ni URLs completas como texto plano en ningún lado del log — siempre `[texto](link)` markdown, con rutas absolutas (`/js/03-objetos/`), nunca relativas (`../../..`).
- Secciones de "Plan de la sesión" / "Objetivo del día" / "Setup" con tablas de horas — el daily log se mantiene liviano, eso sobra.

## Cierre del bloque de ejercicios

- Sección `## 🔎 Por qué fallaron — resumen del día` (o equivalente) al final, con los patrones/debilidades detectadas.
- Pendientes se listan al final como checklist.
- **Actualizar también `docs/assessment/index.html`**: añadir fila nueva a la tabla "Historial de assessments" (fecha, ejercicio/bloque, resultado) — no alcanza con dejarlo solo en el daily log.
  - Si la fila es un examen con nota o resultado aprobado/no aprobado, recalcular las 4 métricas de `.stats-row` (Exámenes totales / Aprobados / Pendientes de calificar / Promedio calificados).
  - El promedio solo cuenta filas con nota numérica explícita — nunca inventar una nota; si no hay, dejar `—` y contarla aparte como aprobado/pendiente cualitativo.

## Cómo aplicar esto en la práctica

- Antes de escribir la sección de Ejercicios de cualquier daily log, releer un daily log anterior del mismo tipo (o de otro bloque si es el primero de ese bloque) para clonar el formato exacto con código real, no inventado ni genérico.
- Este formato aplica a TODOS los bloques (JS, Symfony, CSS...), no solo JS — es un estándar fijo, no una preferencia puntual de un bloque.

---

*Consolidado el 15/08/2026 desde engram `pattern` #214 (formato fijo vigente — supera a #186 y #174, versiones anteriores del mismo patrón ya obsoletas) y desde memoria personal `feedback_formato_daily_log_ejercicios.md` + `feedback_actualizar_historial_assessment.md`.*
