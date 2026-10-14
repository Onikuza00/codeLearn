# Encadenamiento { .bloque-ia }

> Dividir una tarea grande en subtareas secuenciales, cada una centrada en un único aspecto, en vez de pedirle a Claude que lo haga todo de una vez.

---

## Qué es el encadenamiento { .topic-title }

Un flujo de trabajo encadenado (*prompt chaining*) divide una tarea grande y compleja en subtareas más pequeñas y secuenciales. A diferencia de la paralelización, aquí cada paso depende del resultado del anterior — no se pueden ejecutar a la vez.

Ejemplo: una herramienta de marketing en redes sociales que crea y publica vídeos de forma automática, dividida en pasos secuenciales:

1. Encontrar temas de tendencia en Twitter.
2. Seleccionar el tema más interesante (con Claude).
3. Investigar el tema elegido (con Claude).
4. Escribir un guion de vídeo corto (con Claude).
5. Generar el vídeo con un avatar de IA y texto a voz.
6. Publicarlo en redes.

## Por qué encadenar en vez de una sola instrucción { .topic-title }

La ventaja principal es la concentración: Claude hace bien una tarea a la vez, en vez de gestionar varios requisitos simultáneos. El encadenamiento aporta:

- Divide tareas grandes en subtareas más pequeñas que no se pueden paralelizar, porque cada una depende de la anterior.
- Permite meter procesamiento que no es un LLM entre cada tarea (una llamada a una API, una validación, un filtro).
- Mantiene a Claude enfocado en un único aspecto en cada paso.

## El problema de las instrucciones largas { .topic-title }

Pedirle a Claude un artículo técnico con muchas restricciones a la vez — no decir que lo escribió una IA, sin emojis, sin lenguaje cliché, tono profesional — puede fallar. Aunque las reglas estén claras, Claude puede incumplir alguna igualmente: cuantas más restricciones se acumulan en la misma instrucción, más fácil es que se le escape una.

## Solución: encadenar en dos pasos { .topic-title }

1. Enviar la solicitud inicial y aceptar que el primer resultado puede no ser perfecto.
2. Hacer una solicitud de seguimiento centrada solo en revisar y corregir, pasándole el artículo generado junto con una instrucción de revisión específica:

```
Revisa el artículo de abajo. Sigue estos pasos para reescribirlo:
1) localiza cualquier mención a que el autor es una IA y elimínala
2) busca y elimina todos los emojis
3) localiza cualquier texto de redacción cursi y sustitúyelo por texto
   que escribiría un redactor técnico
```

Esto funciona porque en el segundo paso Claude se concentra por completo en la tarea de revisión, sin tener que repartir atención entre crear contenido nuevo y cumplir restricciones a la vez.

## Cuándo usar encadenamiento { .topic-title }

- Tareas complejas con múltiples requisitos.
- Cuando Claude ignora sistemáticamente alguna restricción en instrucciones largas.
- Cuando hace falta procesar o validar resultados entre pasos.
- Cuando se quiere que cada interacción con Claude sea enfocada y manejable.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📘 **Anthropic Engineering — Building Effective AI Agents** | https://www.anthropic.com/engineering/building-effective-agents |
