# Image support { .bloque-ia }

> Enviar imágenes a Claude junto con el texto para que las describa, las compare, cuente objetos o haga análisis visuales más complejos.

---

## Qué es { .topic-title }

Claude puede **ver** imágenes. Al enviar un mensaje, además de texto puedes incluir una o varias imágenes y hacerle preguntas sobre ellas: qué aparece, qué diferencias hay entre dos, cuántos objetos hay, etc.

Esta capacidad se llama *vision* (visión). Funciona igual que una conversación normal: tú envías un mensaje con contenido de imagen y de texto, y Claude responde con un bloque de texto con su análisis.

## Límites { .topic-title }

Antes de enviar imágenes conviene conocer las restricciones:

| Límite | Valor |
|---|---|
| Imágenes en una misma petición (sumando todos los mensajes) | Hasta **100** |
| Tamaño máximo por imagen | **5 MB** |
| Alto y ancho máximos, si envías **una** imagen | **8000 px** |
| Alto y ancho máximos, si envías **varias** | **2000 px** |
| Formas de incluirla | Codificada en **base64** o mediante una **URL** |

!!! tip "Cada imagen también gasta tokens"
    Una imagen se factura en tokens según sus dimensiones: `tokens = (ancho en px × alto en px) / 750`. Una imagen de 1500 × 1000 px equivale a unos 2000 tokens. Cuanto más grande la imagen, más cuesta, así que no envíes más resolución de la que necesites.

## Cómo se envía una imagen { .topic-title }

Se añade un **bloque de imagen** al contenido del mensaje del usuario, junto a un bloque de texto. En vez de una cadena, `content` pasa a ser un array de bloques.

```js
import { readFileSync } from 'node:fs';

// base64 es una forma de escribir los bytes de un archivo como texto
const imagenBase64 = readFileSync('imagen.png').toString('base64');

const messages = [
  {
    role: 'user',
    content: [
      // Bloque de imagen
      {
        type: 'image',
        source: {
          type: 'base64',
          media_type: 'image/png',
          data: imagenBase64,
        },
      },
      // Bloque de texto
      {
        type: 'text',
        text: '¿Qué ves en esta imagen?',
      },
    ],
  },
];
```

Si la imagen ya está publicada en internet, en lugar de base64 se puede indicar su URL:

```js
{
  type: 'image',
  source: { type: 'url', url: 'https://ejemplo.com/imagen.png' },
}
```

!!! warning "El `media_type` tiene que coincidir con el archivo"
    `image/png` para un PNG, `image/jpeg` para un JPG, y así con cada formato. Si no coincide, la petición falla o Claude interpreta mal la imagen.

## Por qué se usa base64 { .topic-title }

La petición a la API viaja en formato **JSON**, y JSON es solo texto. Una imagen, en cambio, es un archivo **binario**: una secuencia de bytes, muchos de los cuales no corresponden a ningún carácter de texto legible. Si se pegaran tal cual dentro del JSON, algunos caracteres romperían su estructura y la petición sería inválida.

**Base64** resuelve ese problema. Es un sistema que convierte cualquier secuencia de bytes en texto formado solo por caracteres seguros: letras, números y unos pocos símbolos (`+`, `/`, `=`). Ese texto sí cabe dentro de un JSON sin romperlo, y quien lo recibe puede convertirlo de nuevo en los bytes originales.

```js
// Bytes del archivo  →  texto base64  →  va dentro del JSON
const imagenBase64 = readFileSync('imagen.png').toString('base64');
```

| Si la imagen... | Cómo se envía |
|---|---|
| Está **en tu equipo** (un archivo local) | En base64, dentro del bloque de imagen |
| Ya está **publicada en internet** | Solo su URL, sin codificar nada |

!!! warning "Base64 no ahorra ni gasta tokens"
    Los tokens de una imagen dependen de sus **dimensiones**, no de cómo se envíe. Base64 solo afecta al **tamaño de la petición**: el texto resultante pesa aproximadamente un tercio más que el archivo original. Para gastar menos tokens hay que reducir las dimensiones de la imagen.

## Cómo pedir bien un análisis { .topic-title }

Las mismas técnicas de ingeniería de prompts que funcionan con texto funcionan con imágenes. Un prompt simple suele dar resultados pobres: preguntar «¿cuántas canicas hay en esta imagen?» puede devolver un recuento incorrecto.

La precisión mejora si:

- Das **pautas detalladas** y pasos de análisis.
- Incluyes **ejemplos** de uno o varios casos (*one-shot* o *multi-shot*).
- Divides la tarea compleja en **pasos más pequeños**.

### Análisis paso a paso

En vez de una pregunta suelta, le das a Claude una metodología:

```text
Analiza esta imagen de canicas y determina el recuento exacto con esta metodología:
1. Empieza identificando cada canica una por una. Asigna un número a cada una al identificarla.
2. Verifica el resultado contando con un método distinto. Empieza por la esquina inferior izquierda y ve fila por fila, de izquierda a derecha.

¿Cuál es el número exacto y verificado de canicas en esta imagen?
```

### Ejemplo dentro del mensaje (*one-shot*)

Incluyes una imagen cuyo resultado ya conoces, indicas la respuesta correcta y después preguntas por la imagen que te interesa. Así Claude tiene una referencia del tipo de análisis que esperas.

## Ejemplo real: riesgo de incendio { .topic-title }

Una aplicación práctica: automatizar la evaluación del riesgo de incendio de viviendas para un seguro. En lugar de enviar un inspector a cada propiedad, se analizan imágenes de satélite con Claude, buscando:

- Árboles muy densos y juntos cerca de la vivienda.
- Accesos difíciles para los servicios de emergencia.
- Ramas que sobresalen sobre la vivienda.

Un prompt simple como «dame una puntuación de riesgo de incendio» da un resultado poco fiable. Uno bien estructurado descompone el análisis en pasos concretos:

```text
Analiza la imagen de satélite adjunta de una propiedad con estos pasos:

1. Identificación de la vivienda: localiza la vivienda principal buscando:
   - La estructura con tejado más grande
   - Rasgos residenciales típicos (conexión con un camino, geometría regular)
   - Que se distinga de otras estructuras (garajes, cobertizos, piscinas)

2. Análisis de ramas sobre el tejado: examina los árboles cercanos a la vivienda:
   - Identifica los árboles cuya copa se extiende sobre alguna parte del tejado
   - Estima el porcentaje de tejado cubierto (0-25 %, 25-50 %, 50-75 %, 75 % o más)
   - Anota las zonas de especial densidad

3. Evaluación del riesgo de incendio: para los árboles que sobresalen, evalúa:
   - Vulnerabilidad ante un incendio forestal (puntos donde caen brasas, caminos de combustible continuos hasta la estructura)
   - Cercanía a chimeneas, ventilaciones u otras aberturas del tejado, si se ven
   - Zonas donde las ramas forman un "puente" entre la vegetación y la estructura

4. Espacio defendible: valora la estructura de la vegetación de la propiedad:
   - Si las copas se conectan formando un dosel continuo sobre o cerca de la vivienda
   - Si hay escaleras de combustible (vegetación que lleva el fuego del suelo al árbol y de ahí al tejado)

5. Nivel de riesgo: según tu análisis, asigna un nivel de 1 a 4:
   - Nivel 1 (bajo): ninguna rama sobre el tejado, buen espacio defendible
   - Nivel 2 (moderado): poco tejado cubierto (<25 %), cierta separación entre copas
   - Nivel 3 (alto): cobertura significativa (25-50 %), copas conectadas, varios puntos vulnerables
   - Nivel 4 (grave): cobertura extensa (>50 %), vegetación pegada a la estructura

Para cada punto (1-5), escribe una frase con tus conclusiones. Tu respuesta final debe ser el nivel numérico.
```

Este prompt guía a Claude por un análisis sistemático y da resultados mucho más precisos y útiles que una petición simple.

!!! tip "La idea que hay que llevarse"
    Con imágenes se aplican las mismas técnicas que con texto: instrucciones claras, pasos concretos y ejemplos. Si quieres resultados fiables, invierte tiempo en un prompt estructurado en lugar de una pregunta corta.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **Vision — documentación oficial** | https://docs.anthropic.com/en/docs/build-with-claude/vision |
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
