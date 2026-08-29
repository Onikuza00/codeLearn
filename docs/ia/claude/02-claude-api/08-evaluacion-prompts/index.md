# Evaluación de prompts { .bloque-ia }

> Curso oficial de Anthropic Academy en Skilljar. Cómo medir objetivamente si una versión de un prompt es mejor que otra, en vez de decidirlo "a ojo".

---

## Flujo de trabajo típico { .topic-title }

Un flujo de evaluación mide objetivamente si una versión de un prompt es mejor que otra.

1. **Escribir el prompt** a mejorar.
   ```js
   const prompt = `Please answer the user's question:\n\n${question}`;
   ```
2. **Armar un dataset de evaluación** — preguntas de ejemplo, representativas de lo que va a recibir en producción (ej. `"¿Cuánto es 2+2?"`, `"¿Cómo se prepara la avena?"`, `"¿A qué distancia está la Luna?"`). En un caso real puede tener cientos o miles de registros.
3. **Pasar cada pregunta por Claude**, combinándola con la plantilla del prompt, y guardar cada respuesta.
4. **Calificar cada respuesta con un evaluador** (otro modelo, o un humano) en una escala 1-10. Promediar las notas da una puntuación objetiva de esa versión del prompt — ej. `(10 + 4 + 9) / 3 = 7.66`.
5. **Modificar el prompt y repetir** el proceso completo. Si la nueva versión promedia más alto (ej. 8.7), la mejora es real, no una impresión subjetiva.

Sin este flujo, comparar dos prompts es una corazonada. Con él, cada cambio se valida contra un número — permite comparar versiones, quedarte con la que mejor puntúa, y seguir iterando con la seguridad de que los cambios son mejoras reales.

---

## Temario {: .topic-title }

| Lección | Qué cubre |
|---|---|
| [Generación de conjuntos de datos de prueba](01-generacion-datasets/index.md) | Crear el dataset de evaluación automáticamente con Claude, en vez de a mano |
| [Ejecutar la evaluación](02-ejecutar-evaluacion/index.md) | Las 3 funciones que procesan todo el dataset y devuelven resultados estructurados |
| [Calificadores](03-calificadores/index.md) | Reemplazar la nota fija por una calificación real — tipos de calificador y calificación basada en modelos |
