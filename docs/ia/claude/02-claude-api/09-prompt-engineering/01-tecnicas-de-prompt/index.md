# Técnicas de prompt { .bloque-ia }

> Cuatro formas de mejorar un prompt: empezar la frase con una instrucción directa, darle directrices concretas sobre la salida, delimitar con etiquetas XML los bloques de instrucción y datos, y enseñarle ejemplos de entrada/salida en vez de solo describir lo que quieres.

---

## Técnica 1: ser claro y directo { .topic-title }

La primera línea del prompt es la más importante de todas: ahí se sientan las bases de todo lo que sigue. Dos principios, independientes entre sí:

**Claridad** — que no quede ambigüedad sobre qué quieres:

- Lenguaje sencillo, el que usarías para explicárselo a cualquiera.
- Decir exactamente lo que quieres, sin rodeos.
- Empezar con la tarea, no con contexto de relleno.

**Ser directo** — cómo estructuras la frase:

- Instrucciones, no preguntas.
- Arrancar con un verbo de acción: "Genera", "Escribe", "Crea", "Identifica".

Aplicado al `runPrompt` del ejercicio:

```js
// ❌ Antes — pregunta vaga, sin verbo de acción
const prompt = `¿Qué debería comer esta persona?

- Altura: ${promptInputs.height}
...`;

// ✅ Después — instrucción directa: verbo + qué + restricción clave
const prompt = `Genera un plan de comidas de un día para un atleta que cumpla sus restricciones dietéticas.

- Altura: ${promptInputs.height}
...`;
```

La frase directa ya le dice a Claude tres cosas en una sola línea: qué acción tomar (generar), qué crear (un plan de comidas) y la restricción que no puede ignorar (dietética). En el ejemplo del curso, este único cambio subió la nota de evaluación de 2,32 a 3,92 — sin tocar nada más del prompt.

!!! tip "Esto no es solo para prompts de nutrición"
    El mismo principio aplica a cualquier prompt que escribas para tu propio trabajo — por ejemplo pidiéndole a Claude Code algo sobre tu stack web. "Ayúdame con este componente" es tan vago como "¿Qué debería comer esta persona?". "Genera un componente Vue que reciba una lista de productos por prop y la renderice como grid responsive" ya tiene verbo, objeto y restricción — la misma fórmula, aplicada a tu día a día.

## Técnica 2: ser específico { .topic-title }

Dejar que Claude interprete libremente da resultados inconsistentes: pedir "escribe un cuento sobre un personaje que descubre un talento oculto" puede devolver 200 palabras o 2000, uno o cinco personajes, cualquier escenario posible. Darle directrices concretas fija un objetivo claro, y eso sube tanto la coherencia como la calidad de la respuesta.

Hay dos formas de ser específico, y en los prompts profesionales suelen combinarse:

**1. Directrices sobre la salida** — qué cualidades tiene que tener el resultado: longitud, estructura/formato, elementos concretos a incluir, tono o estilo.

**2. Pasos del proceso** — indicarle a Claude qué pasos seguir antes de llegar a la respuesta, en vez de dejar que salte directo a la conclusión. Sirve para tareas donde conviene que considere varios ángulos en lugar de fijarse en uno solo: resolver un problema complejo, tomar una decisión, analizar por qué bajó el rendimiento de algo (mirar métricas, cambios externos, factores internos, en vez de asumir una sola causa).

Aplicado al ejercicio: añadir solo directrices de salida —sin tocar nada más del prompt— subió la nota de 3,92 a 7,86, más del doble:

```text
1. Incluir el total calórico diario exacto
2. Mostrar proteínas, grasas e hidratos de carbono
3. Especificar el horario de cada comida
4. Usar solo alimentos que cumplan las restricciones
5. Listar todas las porciones en gramos
6. Mantenerlo económico si se menciona un presupuesto
```

!!! tip "¿Directrices o pasos?"
    Las directrices de salida van casi siempre — son la garantía de un resultado consistente, cuestan poco de escribir. Los pasos del proceso solo hacen falta cuando la tarea es realmente compleja (analizar, decidir, comparar causas); para algo simple, añadirlos es ruido de más y alarga el prompt sin mejorar nada.

!!! tip "Llevado a un prompt de código"
    Si le pides a Claude que genere una función o un componente, las directrices de salida son cosas como: qué convención de nombres seguir, si usar TypeScript estricto, qué librerías evitar, o qué casos límite manejar. Sin esas directrices, dos ejecuciones del mismo prompt pueden darte estilos completamente distintos.

## Técnica 3: estructurar con etiquetas XML { .topic-title }

Cuando un prompt mezcla instrucciones con un bloque grande de datos interpolados, Claude puede tener problemas para distinguir dónde termina una cosa y empieza la otra. Las etiquetas XML resuelven esto: son un delimitador simple que marca con claridad qué es cada bloque de texto.

El caso más claro es cuando se mezclan dos tipos de contenido distintos — por ejemplo, código a depurar junto con su documentación. Sin etiquetas, todo es un bloque de texto plano y Claude tiene que adivinar qué parte es código y cuál es documentación. Envolviendo cada uno en su propia etiqueta (`<mi_codigo>...</mi_codigo>`, `<documentacion>...</documentacion>`) la frontera queda inequívoca.

**No hace falta usar nombres XML "oficiales"** — cualquier nombre descriptivo sirve, y cuanto más específico, mejor entiende Claude para qué es cada bloque:

- `<registros_de_ventas>` dice más que `<datos>`.
- `<informacion_atleta>` deja claro que ahí van los datos del usuario.
- `<mi_codigo>` / `<documentacion>` separan dos tipos de contenido que no hay que confundir.

Ejemplo aplicado al ejercicio — separar los datos del atleta de la instrucción:

```text
<informacion_atleta>
- Altura: 188 cm
- Peso: 82 kg
- Objetivo: ganar masa muscular
- Restricciones: vegetariano
</informacion_atleta>

Genera un plan de comidas basándote en la información del atleta de arriba.
```

Queda inequívoco que esos cuatro datos van juntos y son lo que hay que usar para generar el plan — no hace falta que Claude infiera la relación entre líneas sueltas.

!!! tip "Cuándo se nota la diferencia"
    Con un prompt corto y simple, las etiquetas casi no cambian el resultado. Se vuelven valiosas cuando el prompt crece: mucho contexto interpolado, varios tipos de contenido mezclados, o varias variables distintas en el mismo mensaje. En un prompt de código, por ejemplo, separar `<contexto_proyecto>`, `<codigo_actual>` y `<error>` evita que Claude confunda el stack trace con el código que lo produjo.

## Técnica 4: proporcionar ejemplos { .topic-title }

Mostrarle a Claude pares de entrada/salida de ejemplo — lo que se conoce como *prompting* de uno o varios disparos (*one-shot* / *few-shot*) — es de las técnicas más efectivas que hay: en vez de describir con palabras lo que quieres, se lo enseñas directamente.

**El problema que resuelve.** Un caso típico es la ambigüedad. Clasificar el sentimiento de un tuit parece sencillo, hasta que aparece el sarcasmo: *"Sí, claro, la mejor película desde 'Plan 9 del espacio exterior'"* suena positivo por las palabras sueltas, pero es negativo — esa película es famosa por ser una de las peores de la historia del cine. Sin un ejemplo que muestre este caso, Claude no tiene forma de saber que hay que leer entre líneas.

**Cómo se estructura un ejemplo.** Siempre envuelto en etiquetas XML descriptivas (enlaza con la técnica anterior), típicamente `<ejemplo_entrada>` / `<salida_ideal>`. La etiqueta le dice a Claude exactamente qué representa cada parte.

**Cuándo usarlos:**

- Capturar casos límite (como el sarcasmo del ejemplo).
- Definir un formato de salida complejo — una estructura JSON concreta, por ejemplo.
- Mostrar el tono o estilo exacto que buscas.
- Enseñar cómo resolver una entrada ambigua.

**Uno o varios ejemplos.** Un solo ejemplo (*one-shot*) alcanza para fijar el patrón general. Varios (*few-shot*) hacen falta cuando hay distintos casos límite que cubrir, o interesa mostrar distintos tipos de respuesta válida.

**De dónde salen los buenos ejemplos.** Del propio flujo de [evaluación de prompts](../../08-evaluacion-prompts/index.md): las respuestas que sacaron la nota más alta ya demostraron ser una salida "perfecta" para ese caso, y son candidatas naturales para reutilizar como ejemplo.

**No basta con el par entrada/salida** — explicar *por qué* esa salida es buena ayuda a Claude a entender el razonamiento, no solo a copiar el formato:

```text
<salida_ideal>
[la respuesta de ejemplo]
</salida_ideal>

Este ejemplo está bien estructurado, da información detallada
sobre las comidas y las cantidades, y respeta el objetivo y las
restricciones del atleta.
```

Buenas prácticas:

| Haz | No hagas |
|---|---|
| Envolver cada ejemplo en etiquetas XML | Pegar el ejemplo suelto, sin marcar qué es entrada y qué es salida |
| Explicar por qué la salida es ideal | Asumir que el formato solo ya se explica a sí mismo |
| Cubrir los casos límite que más fallan | Poner ejemplos triviales que no aportan nada nuevo |
| Usar ejemplos relevantes a la tarea concreta | Reciclar ejemplos genéricos de otro dominio |
{: .pros-cons }

Aplicado al ejercicio: se tomaría la mejor respuesta ya generada por el pipeline de evaluación (la de nota más alta) y se pegaría como ejemplo dentro del prompt, envuelta en `<salida_ideal>`, junto con una frase que explique por qué esa respuesta cumple bien las 6 directrices de la técnica 2.

!!! tip "Por qué funciona mejor que describir"
    Describir con palabras un formato o un tono deja margen de interpretación; mostrarlo con un ejemplo no. Es la misma diferencia que hay entre explicarle a alguien cómo formatear un mensaje de commit y mandarle uno real ya bien formateado como referencia — el ejemplo cierra la ambigüedad que las palabras solas no terminan de resolver.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📓 Notebooks del curso | `001_prompting.ipynb` · `002_prompting_completed.ipynb` |
