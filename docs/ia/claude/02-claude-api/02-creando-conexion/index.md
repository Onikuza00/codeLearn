# Creando la conexión { .bloque-ia }

> Primera llamada real a la API. El curso lo enseña en Python — aquí va adaptado a JavaScript/Node.js, la lógica es la misma, cambia el SDK.

---

## Preparar el entorno {: .topic-title }

Instalar el SDK oficial y `dotenv` para cargar variables de entorno:

```bash
pnpm add @anthropic-ai/sdk dotenv
```

Crear un `.env` en la raíz del proyecto con la clave (nunca subir este archivo a Git — añadirlo siempre a `.gitignore`):

```
ANTHROPIC_API_KEY="tu-api-key-aqui"
```

Cargar la variable y crear el cliente:

```js
import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic(); // lee ANTHROPIC_API_KEY del entorno automáticamente
const model = 'claude-sonnet-4-0';
```

## La función `create` {: .topic-title }

El núcleo de cualquier solicitud es `client.messages.create()`. Necesita tres parámetros:

- `model` — el modelo de Claude a usar.
- `max_tokens` — límite de seguridad de la respuesta, NO un objetivo a alcanzar. Si lo pones en 1000 y Claude solo necesita 200 para responder, se detiene en 200 — no intenta "rellenar" hasta el límite.
- `messages` — el historial de la conversación que se envía a Claude.

En JavaScript, `client.messages.create()` devuelve una `Promise` — hay que usar `await` (o `.then()`), a diferencia del cliente síncrono que se ve en Python.

!!! tip "Cómo elegir un `max_tokens` razonable"
    No hay un número universal — depende de la tarea, pero unos criterios reales:

    - **El coste no depende de `max_tokens`**, depende de los tokens que Claude genera de verdad. No hace falta bajarlo "para ahorrar" ni tiene sentido ponerlo altísimo "por si acaso".
    - **Ajustarlo a la respuesta esperada**: una clasificación o un sí/no necesita poco (decenas-cientos de tokens); un resumen largo o generar código necesita bastante más.
    - **Sin streaming, un `max_tokens` muy alto puede provocar timeouts largos** — el SDK calcula el tiempo de espera en función de `max_tokens` cuando no hay streaming. Para respuestas largas, mejor usar streaming que subir el límite a lo bruto.
    - **El techo máximo real depende del modelo** — cada modelo de Claude tiene su propio límite de tokens de salida, hay que consultarlo en la documentación de modelos, no asumir un número fijo.

## Los mensajes {: .topic-title }

Un mensaje es un objeto con dos campos: `role` (`"user"` o `"assistant"`) y `content` (el texto). Los mensajes de rol `"user"` son los que escribe la persona; los de rol `"assistant"` son las respuestas que ya generó Claude — así se reconstruye una conversación completa cuando hace falta historial.

## Primera solicitud completa {: .topic-title }

```js
const message = await client.messages.create({
  model,
  max_tokens: 1000,
  messages: [
    {
      role: "user",
      content: "What is quantum computing? Answer in one sentence"
    }
  ]
});
```

## Extraer la respuesta {: .topic-title }

El objeto `message` trae mucha metadata, pero el texto generado está en:

```js
message.content[0].text
```

!!! tip "Cuando hay más de un bloque de contenido"
    Con respuestas simples de texto, `message.content[0].text` alcanza. Si la respuesta puede traer varios bloques (por ejemplo, uso de herramientas), hay que recorrer `message.content` y comprobar `block.type === "text"` antes de leer `block.text`.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📘 **SDK oficial de TypeScript/JavaScript** | https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/typescript |
