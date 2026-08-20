# Acceso a la API { .bloque-ia }

> Ciclo de vida completo de una solicitud a Claude: desde que el usuario pulsa "enviar" hasta que la respuesta aparece en pantalla.

---

## Por qué necesitas un servidor intermedio {: .topic-title }

Nunca se debe llamar a la API de Anthropic directamente desde código de cliente (navegador, app móvil). La clave API es secreta: si viaja en el cliente, cualquiera puede extraerla e inspeccionar el tráfico para hacer solicitudes no autorizadas a tu costa.

El patrón correcto: el cliente llama a tu propio servidor, y es el servidor el que llama a la API de Anthropic guardando la clave de forma segura (variable de entorno, secret manager...).

## El flujo de solicitud en cinco pasos {: .topic-title }

Cada interacción con Claude sigue el mismo patrón, desde que el usuario pulsa "enviar" hasta que la respuesta aparece en pantalla:

1. **Solicitud al servidor** — el cliente envía la petición a tu backend.
2. **Solicitud a la API de Anthropic** — tu servidor reenvía la petición a Anthropic, autenticado con tu clave API.
3. **Procesamiento del modelo** — Claude genera la respuesta.
4. **Respuesta al servidor** — Anthropic devuelve el resultado a tu backend.
5. **Respuesta al cliente** — tu servidor reenvía ese resultado a la interfaz.

## Campos de una solicitud {: .topic-title }

Anthropic ofrece SDKs oficiales para Python, TypeScript, JavaScript, Go y Ruby — también se puede llamar por HTTP directo. El servidor usa el SDK (o HTTP plano) para mandar la solicitud a la Anthropic API con estos campos:

| Campo | Qué es |
|---|---|
| Clave API (`x-api-key`) | Identifica tu solicitud ante Anthropic |
| `model` | Nombre del modelo a usar (p. ej. `claude-sonnet-4-5`) |
| `messages` | Lista de mensajes |
| `max_tokens` | Límite de tokens que el modelo puede generar |

El texto que escribe el usuario no viaja suelto: se coloca dentro de un mensaje con rol `"user"`, y ese mensaje se coloca dentro de la lista `messages`.

## Qué hace Claude internamente {: .topic-title }

Esto ocurre dentro del paso 3 ("Procesamiento del modelo") del flujo de cinco pasos de arriba. Con la solicitud ya dentro de la Anthropic API, el texto encadena cuatro etapas, cada una alimentando a la siguiente — misma entrada de ejemplo que usa la lección: **"What is quantum computing?"**

### 1. Tokenización

Claude divide el texto de entrada en fragmentos llamados tokens — palabras completas, partes de palabras, espacios o símbolos. Para simplificar, piensa en cada palabra como un token. Con el ejemplo, la pregunta se parte en 5 tokens: `What` · `is` · `quantum` · `computing` · `?`.

### 2. Embedding

Cada token se convierte en un vector: una lista larga de números que representa todos los posibles significados de esa palabra — como una definición numérica que captura relaciones semánticas.

!!! example "Un token, varios significados"
    La palabra "cuántico" puede significar cosas muy distintas según el contexto: una magnitud física discreta, un concepto de mecánica cuántica, "algo extremadamente pequeño", o una referencia a computación cuántica. El embedding todavía no elige entre esos significados — los representa todos a la vez.

### 3. Contextualización

Claude refina cada vector según las palabras que lo rodean, para quedarse con el significado más probable en ese contexto concreto. Es la etapa que decide, de todos los significados posibles del embedding, cuál aplica aquí.

### 4. Generación

Los vectores ya contextualizados pasan por una capa de salida que calcula la probabilidad de cada palabra siguiente posible. Claude no elige siempre la más probable — combina probabilidad con aleatoriedad controlada, para que la respuesta suene natural y variada en vez de repetitiva.

Tras seleccionar cada palabra, Claude la añade a la secuencia generada y repite el proceso completo (las cuatro etapas) para decidir la siguiente.

## Cuándo Claude deja de generar {: .topic-title }

Después de cada token, Claude comprueba tres condiciones:

- **Se alcanzó el límite de tokens** (`max_tokens`).
- **Final natural** — generó un token de fin de secuencia.
- **Secuencia de parada** — apareció una frase de stop predefinida.

## La respuesta de la API {: .topic-title }

Cuando termina la generación, la API devuelve una respuesta estructurada con:

| Campo | Contenido |
|---|---|
| Contenido del mensaje | El texto generado |
| `usage` | Recuento de tokens de entrada y de salida |
| `stop_reason` | Por qué terminó la generación |

El servidor recibe esa respuesta y la reenvía al cliente, donde aparece en la interfaz.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Accessing the API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api/287726 |
| 📘 **Documentación oficial — Messages API** | https://docs.claude.com/en/api/messages |
