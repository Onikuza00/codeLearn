# Calificadores { .bloque-ia }

> Curso oficial de Anthropic Academy en Skilljar. Cómo reemplazar la nota fija (`score = 10`) del flujo de evaluación por una calificación real.

---

## Tres tipos de calificador { .topic-title }

| Tipo | Cómo funciona | Bueno para |
|---|---|---|
| **Evaluador de código** | Lógica programática propia | Longitud, presencia/ausencia de palabras, sintaxis válida (JSON/Python/regex), legibilidad |
| **Evaluador de modelo** | Otra llamada a la API evalúa la respuesta | Calidad de la respuesta, si sigue la instrucción, exhaustividad, utilidad, seguridad |
| **Evaluador humano** | Una persona revisa y califica a mano | Calidad general, profundidad, concisión, pertinencia — el más flexible, también el más lento |

El único requisito común: la salida tiene que ser una señal usable, normalmente un número del 1 al 10.

## Definir criterios antes de calificar { .topic-title }

Para un prompt que genera código, tres criterios típicos:

- **Formato** — devuelve SOLO Python/JSON/regex, sin explicación.
- **Sintaxis válida** — el código generado compila/parsea.
- **Sigue la tarea** — la respuesta resuelve de verdad lo que pidió el usuario.

Los dos primeros encajan mejor con un evaluador de CÓDIGO (son comprobaciones mecánicas). El tercero encaja mejor con un evaluador de MODELO — hace falta criterio, no una regla fija.

---

## Temario {: .topic-title }

| Lección | Qué cubre |
|---|---|
| [Calificación basada en modelos](01-calificacion-por-modelo/index.md) | Usar otra llamada a Claude para calificar la respuesta, con fuerzas/debilidades/razonamiento |
| [Calificación basada en código](02-calificacion-por-codigo/index.md) | Validar formato y sintaxis (JSON/Python/regex) con `try/parse`, y combinar esa nota con la del modelo |
