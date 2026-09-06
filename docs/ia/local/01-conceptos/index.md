# Conceptos de modelos { .bloque-ia }

> Cuatro números deciden si un modelo cabe en tu máquina y si sirve para lo que quieres: parámetros, cuantización, ventana de contexto y memoria disponible. Con eso se elige modelo sin probar a ciegas.

---

## Parámetros: el tamaño del modelo {: .topic-title }

Los nombres llevan el número: `llama3.1:8b`, `qwen2.5:14b`, `deepseek-r1:32b`. Esa **b** son miles de millones de parámetros — los pesos internos que el modelo aprendió durante el entrenamiento.

| Tamaño | Qué esperar |
|---|---|
| **1B – 3B** | Muy rápido. Clasificar, extraer datos, tareas acotadas. Razona poco |
| **7B – 8B** | El punto dulce doméstico. Conversación decente, resúmenes, RAG sencillo |
| **13B – 14B** | Notablemente mejor razonando. Necesita una GPU con margen |
| **30B – 70B** | Calidad seria. Hardware de servidor |
| **> 70B** | Territorio de centro de datos |

Más parámetros significa mejor razonamiento **y** más memoria, más lentitud y más consumo. La relación no es lineal: saltar de 8B a 14B se nota mucho; de 32B a 70B, menos de lo que cuesta.

## Cuantización: el mismo modelo, más ligero {: .topic-title }

Un modelo se entrena con pesos de 16 bits. **Cuantizar** es guardarlos con menos precisión —8, 5 o 4 bits— para que ocupe menos y vaya más rápido, a cambio de una pérdida de calidad.

| Etiqueta | Bits | Tamaño de un modelo 8B | Calidad |
|---|---|---|---|
| `f16` | 16 | ~16 GB | Referencia |
| `q8_0` | 8 | ~8,5 GB | Prácticamente idéntica |
| **`q4_K_M`** | 4 | **~4,7 GB** | Muy buena. **El estándar de facto** |
| `q3_K_M` | 3 | ~3,5 GB | Se empieza a notar |
| `q2_K` | 2 | ~2,8 GB | Degradación clara |

!!! tip "La regla que evita la mayoría de los errores de elección"
    **Un modelo más grande y más cuantizado gana casi siempre a uno pequeño sin cuantizar.** Un 14B en `q4_K_M` (~8 GB) rinde mejor que un 8B en `f16` (~16 GB), y ocupa la mitad.

    Por eso `q4_K_M` es lo que Ollama descarga por defecto: es el mejor equilibrio conocido. Bajar de 4 bits solo compensa cuando no hay más remedio.

## Ventana de contexto {: .topic-title }

Cuántos *tokens* caben entre la pregunta, las instrucciones de sistema, el historial y la respuesta. Un token es aproximadamente **tres cuartos de palabra** en español.

| Contexto | Aproximadamente |
|---|---|
| 4 096 | 3 000 palabras |
| 8 192 | 6 000 palabras |
| 32 768 | 24 000 palabras |
| 128 000 | Un libro corto |

!!! danger "El contexto consume memoria, y mucha"
    No basta con que el modelo quepa: el contexto ocupa memoria **aparte**, y crece con su tamaño. Un modelo que funciona con 4K de contexto puede quedarse sin memoria al subirlo a 32K, sin que el modelo haya cambiado.

    Y ampliar el contexto no es gratis en calidad: los modelos tienden a **prestar menos atención a lo que queda en el medio** de un contexto muy largo. Meter documentación entera «por si acaso» suele empeorar la respuesta frente a recuperar solo los fragmentos relevantes con [RAG](../../../backend/02-arquitectura/04-asistente-ia/index.md).

## Cuánta memoria hace falta {: .topic-title }

Regla práctica para estimar antes de descargar nada:

```
memoria ≈ tamaño del fichero del modelo + 1-2 GB de contexto y margen
```

| Hardware | Qué mueve con soltura |
|---|---|
| CPU y 8 GB de RAM | Modelos de 3B. Lento pero funciona |
| CPU y 16 GB | 7B–8B en `q4`. Utilizable, no rápido |
| GPU con 8 GB de VRAM | 7B–8B en `q4`, rápido |
| GPU con 12–16 GB | 14B en `q4` con contexto amplio |
| GPU con 24 GB | 32B en `q4` |
| Varias GPU o servidor | 70B y más |

!!! warning "GPU y CPU no son «un poco más rápido»: son otro orden de magnitud"
    Un modelo que **cabe entero en la VRAM** genera decenas de tokens por segundo. El mismo modelo en CPU puede ir a dos o tres.

    Lo peor es el caso intermedio: si el modelo **no cabe del todo** en la GPU, una parte se descarga a la RAM del sistema y el rendimiento se desploma por debajo de lo esperado. Antes de subir de tamaño conviene comprobar que sigue cabiendo entero.

## Familias de modelos {: .topic-title }

| Familia | Nota |
|---|---|
| **Llama** (Meta) | Muy extendida, mucho ecosistema y variantes afinadas |
| **Qwen** (Alibaba) | Fuerte en multilingüe y en código. Muy buena relación tamaño/calidad |
| **Mistral** / **Mixtral** | Europeos, eficientes, licencia permisiva |
| **DeepSeek** | Destacan en código y en razonamiento paso a paso |
| **Gemma** (Google) | Tamaños pequeños bien optimizados |
| **Phi** (Microsoft) | Muy pequeños para lo que rinden |

Además de la familia, importa la **variante**:

- **`instruct`** — afinado para seguir instrucciones. Es el que quieres para casi todo.
- **`base`** — solo completa texto, no conversa. Punto de partida para afinar.
- **`code`** — especializado en programación.
- **`embed`** — no genera texto: produce **vectores**. Es el que se usa para RAG, y es otro modelo distinto del que responde.

!!! danger "Modelo de generación y modelo de embeddings son dos cosas distintas"
    Un sistema RAG necesita **los dos**: uno que convierta los textos en vectores para poder buscarlos (`nomic-embed-text`, `mxbai-embed-large`) y otro que redacte la respuesta con los fragmentos encontrados.

    Y el de embeddings tiene que ser **el mismo al indexar y al consultar**: cambiarlo obliga a reindexar toda la documentación, porque los vectores viejos dejan de ser comparables.

## Licencias {: .topic-title }

«Abierto» no significa lo mismo en todos los casos. Apache 2.0 y MIT permiten uso comercial sin condiciones; la licencia de Llama impone restricciones por volumen de usuarios; algunos modelos son solo para investigación.

Antes de montar algo en producción sobre un modelo, se lee su licencia. Es el mismo criterio que con cualquier dependencia.

---

## 📚 Fuentes {: .topic-title }

| Fuente | Enlace |
|---|---|
| 🦙 **Biblioteca de modelos de Ollama** | [ollama.com/library](https://ollama.com/library) |
| 🤗 **Hugging Face — Modelos** | [huggingface.co/models](https://huggingface.co/models) |
