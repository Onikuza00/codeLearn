# Prompt caching { .bloque-ia }

> Reutilizar el trabajo que Claude ya hizo con un texto en una petición anterior, para responder más rápido y pagar menos: cómo funciona, sus reglas y cómo aplicarlo.

---

## Qué es { .topic-title }

**Prompt caching** (caché de prompts) es una función que acelera las respuestas de Claude y reduce el coste de generar texto. Consiste en **guardar** el trabajo de procesamiento de una petición para **reutilizarlo** cuando vuelves a enviar el mismo contenido.

Una **caché** es una memoria temporal donde se guarda un resultado ya calculado, para no tener que calcularlo otra vez.

## Cómo procesa Claude una petición normal { .topic-title }

Cuando envías un mensaje, Claude no empieza a responder de inmediato. Antes hace mucho trabajo de preparación con tu texto:

1. **Tokeniza** el prompt: lo divide en piezas pequeñas (tokens).
2. **Crea embeddings** de cada token: los convierte en números que representan su significado.
3. **Añade contexto** según el texto que lo rodea.
4. Solo entonces **genera** el texto de salida.

Cuando termina de responder, descarta todo ese trabajo: la tokenización, los embeddings y el análisis de contexto.

## El problema de descartar el trabajo { .topic-title }

Descartarlo es ineficiente cuando haces peticiones seguidas con el mismo contenido. Por ejemplo, en una conversación donde le pides a Claude que vaya mejorando el resumen de un mismo texto largo, en cada petición Claude repite **todo el procesamiento** de un texto que acaba de analizar hace unos instantes.

## Cómo lo resuelve el caching { .topic-title }

Con prompt caching, el procesamiento no se descarta, se **guarda**:

- En la **primera petición**, Claude hace todo el procesamiento habitual, pero guarda el resultado en la caché.
- La caché funciona como una tabla de consulta: «si vuelvo a ver este mensaje, reutilizo el trabajo que ya hice».
- En las **peticiones siguientes** con el mismo contenido, Claude lee ese trabajo de la caché en lugar de rehacerlo.

## Ventajas { .topic-title }

| Ventaja | Qué significa |
|---|---|
| **Respuestas más rápidas** | Las peticiones que usan contenido en caché se ejecutan antes. |
| **Menor coste** | Pagas menos por las partes que salen de la caché. |
| **Optimización automática** | La primera petición escribe en la caché y las siguientes leen de ella. |

## Limitaciones { .topic-title }

- **La caché caduca.** Por defecto el contenido guardado dura **5 minutos**, y hay una opción de **1 hora** con un coste extra. Cada vez que se reutiliza, el plazo se renueva.
- **Casos de uso limitados.** Solo compensa cuando envías **repetidamente el mismo contenido**.
- **Requiere frecuencia alta.** Rinde más cuanto más a menudo aparece el mismo contenido en tus peticiones.
- **Escribir en la caché cuesta más** que enviar el texto sin caché. El ahorro llega al leer.

!!! warning "Precios: escribir cuesta más, leer cuesta mucho menos"
    Como referencia, escribir en la caché cuesta aproximadamente **1,25 veces** el precio normal de entrada (para la caché de 5 minutos), y **2 veces** para la de 1 hora. Leer de la caché cuesta aproximadamente **0,1 veces**, es decir, un 90 % menos. Los importes exactos varían según el modelo: consúltalos en la [documentación oficial](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching).

## Cuándo encaja { .topic-title }

Prompt caching funciona mejor en escenarios como:

- **Análisis de documentos:** haces varias preguntas sobre el mismo documento grande.
- **Edición iterativa:** el contenido base no cambia y vas refinando un aspecto concreto.

En ambos casos, lo que se repite en cada petición es lo que se guarda en la caché.

## Reglas: los puntos de corte (*cache breakpoints*) { .topic-title }

El procesamiento de tus mensajes **no se guarda automáticamente**. Hay que indicar hasta dónde se quiere guardar añadiendo un **punto de corte** a un bloque:

- El trabajo hecho con todo lo que hay **antes** del punto de corte se guarda en la caché, incluido el propio bloque que lo lleva.
- En las peticiones siguientes, la caché solo se usa si el contenido **hasta ese punto es idéntico**.
- Lo que va después del punto de corte se procesa con normalidad, sin caché.

Un punto de corte se añade con el campo `cache_control`, con el valor `{ type: 'ephemeral' }`. Para poder ponerlo, el bloque de texto tiene que escribirse en su **forma larga**:

```js
// Forma corta: no hay dónde poner cache_control
{ role: 'user', content: 'Resume este texto...' }

// Forma larga: un array de bloques, y en el bloque va el punto de corte
{
  role: 'user',
  content: [
    {
      type: 'text',
      text: 'Resume este texto...',
      cache_control: { type: 'ephemeral' },
    },
  ],
}
```

!!! warning "Un cambio mínimo invalida la caché"
    La caché solo sirve si el contenido hasta el punto de corte es idéntico, carácter por carácter. Añadir una sola palabra, como un «por favor», invalida la caché y obliga a Claude a procesar todo otra vez.

### Entre varios mensajes

Un punto de corte puede estar en cualquier mensaje. Si lo colocas en uno posterior, **todos los mensajes anteriores** (del usuario, del asistente, etc.) quedan dentro del contenido guardado. Es útil para guardar todo el contexto de una conversación hasta cierto punto.

### Qué bloques admiten un punto de corte

No solo los bloques de texto. También se puede añadir a:

- El **prompt de sistema**.
- Las **definiciones de herramientas**.
- Los bloques de **imagen**.
- Los bloques de **uso de herramienta** y de **resultado de herramienta**.

!!! tip "Lo que casi no cambia es lo que mejor se cachea"
    Los prompts de sistema y las definiciones de herramientas rara vez cambian entre peticiones, así que suelen ser los mejores candidatos. Es donde más beneficio se suele obtener.

### Orden de procesamiento

Claude procesa los componentes de la petición siempre en este orden:

1. Las **herramientas** (`tools`).
2. El **prompt de sistema** (`system`).
3. Los **mensajes** (`messages`).

Conocer el orden ayuda a colocar bien los puntos de corte. Se pueden usar **hasta cuatro** en una petición. Por ejemplo, uno para las herramientas y otro a mitad del historial de la conversación, según qué parte cambie entre peticiones.

### Longitud mínima

Para que un contenido se guarde en la caché tiene que tener como mínimo **1024 tokens** en la mayoría de los modelos (algunos exigen más: consulta la [documentación oficial](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)). Se cuenta la **suma** de todos los mensajes y bloques que se quieren guardar, no cada bloque por separado.

Un simple «¡Hola!» no llega, pero repetido 500 veces, o un prompt realmente largo, sí supera ese mínimo.

## En la práctica { .topic-title }

Al activar el caching, la primera petición escribe en la caché y las siguientes leen de ella. Es especialmente valioso cuando envías:

- **Prompts de sistema grandes** (por ejemplo, unos 6000 tokens para un asistente de programación).
- **Esquemas de herramientas complejos** (unos 1700 tokens para varias herramientas).
- **Contenido de mensajes repetido.**

La clave es que solo ayuda si envías **el mismo contenido** una y otra vez, y en muchas aplicaciones eso ocurre con muchísima frecuencia.

### Cachear los esquemas de herramientas

El punto de corte de las herramientas se pone en la **última herramienta** de la lista. Lo recomendable es no modificar la lista original, sino trabajar con copias:

```js
let toolsParaEnviar = tools;

if (tools?.length) {
  // Copia de la lista y de la última herramienta, para no tocar las originales
  toolsParaEnviar = [...tools];
  const ultima = { ...toolsParaEnviar.at(-1), cache_control: { type: 'ephemeral' } };
  toolsParaEnviar[toolsParaEnviar.length - 1] = ultima;
}

params.tools = toolsParaEnviar;
```

Se podría modificar directamente `tools.at(-1).cache_control`, pero trabajar con copias evita problemas si más adelante cambias el orden de las herramientas.

### Cachear el prompt de sistema

El prompt de sistema pasa de ser una cadena a un array con un bloque de texto que lleva el punto de corte:

```js
if (system) {
  params.system = [
    {
      type: 'text',
      text: system,
      cache_control: { type: 'ephemeral' },
    },
  ];
}
```

### Cómo se ve en la respuesta

La respuesta indica en `usage` qué ha pasado con la caché:

| Situación | Campo en `usage` |
|---|---|
| **Primera petición**: Claude escribe en la caché | `cache_creation_input_tokens` (por ejemplo, 1772) |
| **Peticiones siguientes**: Claude lee de la caché | `cache_read_input_tokens` (por ejemplo, 1772) |
| **Contenido cambiado**: se escribe de nuevo | Vuelven a aparecer tokens de creación de caché |

```js
console.log(respuesta.usage.cache_creation_input_tokens);
console.log(respuesta.usage.cache_read_input_tokens);
```

La caché es muy sensible: cambiar un solo carácter en las herramientas o en el prompt de sistema invalida la caché de **ese componente**.

### Varios puntos de corte y cambios parciales

Como el orden es herramientas, prompt de sistema y mensajes, un cambio en una parte solo afecta a esa parte y a las que van después. Si cambias el prompt de sistema pero mantienes las mismas herramientas, verás una **lectura parcial** (las herramientas salen de la caché) y una **escritura nueva** (el prompt de sistema). Así solo pagas por procesar lo que realmente ha cambiado.

### Cuándo compensa

Prompt caching rinde más cuando tienes:

- **Esquemas de herramientas constantes** entre peticiones.
- **Prompts de sistema estables.**
- **Aplicaciones que hacen varias peticiones** con un contexto parecido.

Como la caché caduca (por defecto a los 5 minutos), está pensada para aplicaciones con un uso frecuente de la API, no como almacenamiento a largo plazo.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **Prompt caching — documentación oficial** | https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching |
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
