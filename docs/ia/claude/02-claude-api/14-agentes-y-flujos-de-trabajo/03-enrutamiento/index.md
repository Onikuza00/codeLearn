# Enrutamiento { .bloque-ia }

> Categorizar la solicitud entrante y enviarla a un pipeline de procesamiento especializado según esa categoría, en vez de usar un único prompt genérico para todo.

---

## El problema de los prompts genéricos { .topic-title }

Distintos tipos de solicitud de usuario necesitan un tratamiento distinto. Una herramienta de marketing en redes sociales que genera guiones de vídeo a partir de un tema dado por el usuario lo ilustra bien: si el usuario escribe "programación" o "surf", el contenido debería ser muy distinto.

- Los temas de programación piden contenido educativo, con explicaciones claras y definiciones.
- Los temas de surf funcionan mejor con guiones centrados en entretenimiento, emoción y atractivo visual.

Un único prompt genérico no puede hacer bien las dos cosas a la vez.

## Definir categorías de contenido { .topic-title }

El enrutamiento (*routing*) empieza por definir un conjunto cerrado de categorías, cada una con su propia plantilla de prompt especializada. Ejemplo de géneros para guiones de vídeo:

| Categoría | Enfoque del guion |
|---|---|
| Entretenimiento | Contenido enérgico, lenguaje de moda |
| Educativo | Explicaciones claras con ejemplos cercanos |
| Comedia | Observaciones ingeniosas y buen timing |
| Vlog personal | Narrativa conversacional e íntima |
| Reseñas | Contenido decisivo basado en experiencia, ventajas y desventajas |
| Storytelling | Detalles vívidos y conexión emocional |

## Cómo funciona en la práctica { .topic-title }

El enrutamiento se resuelve en dos pasos:

1. **Categorización** — se manda el tema del usuario a Claude pidiéndole que lo clasifique en una de las categorías predefinidas.
2. **Procesamiento especializado** — se usa esa categoría para elegir la plantilla de prompt adecuada y generar el contenido final.

Si el usuario escribe "funciones de Python" como tema, primero se le pide a Claude que lo categorice:

```
Categoriza el tema de un vídeo en una de las categorías listadas:
<topic>Funciones de Python</topic>

<categories>
- Educativo
- Entretenimiento
- Comedia
- Vlog personal
- Reseñas
- Storytelling
</categories>
```

Claude responde "Educativo", y entonces se usa la plantilla de prompt educativa para generar el guion real.

## Arquitectura del flujo { .topic-title }

La entrada del usuario va primero a un componente de enrutamiento (*router*), que la categoriza con una llamada inicial a Claude. Según la categoría obtenida, la entrada se reenvía a **un único** pipeline de procesamiento específico — cada pipeline puede tener su propio flujo, sus propios prompts o sus propias herramientas, optimizadas para esa categoría.

La idea clave es que la entrada del usuario solo llega a un pipeline especializado, no a todos: así cada pipeline puede estar muy afinado para su caso concreto, sin tener que cubrir también los demás.

## Cuándo usar enrutamiento { .topic-title }

- Cuando la aplicación maneja tipos de solicitud muy distintos que necesitan enfoques distintos.
- Cuando se pueden definir categorías claras que cubran los casos de uso reales.
- Cuando el paso de categorización se puede resolver de forma fiable con Claude.
- Cuando el beneficio de un procesamiento especializado compensa el coste extra del paso de enrutamiento.

Es especialmente valioso en bots de atención al cliente, herramientas de generación de contenido, y en general cualquier aplicación donde la respuesta "correcta" depende mucho de entender primero qué tipo de solicitud es.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📘 **Anthropic Engineering — Building Effective AI Agents** | https://www.anthropic.com/engineering/building-effective-agents |
