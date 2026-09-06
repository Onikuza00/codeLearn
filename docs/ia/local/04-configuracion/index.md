# Configuración { .bloque-ia }

> Elegir el modelo, ajustar los parámetros de generación y decidir cómo se sirve. Son las tres decisiones que separan un montaje que funciona en una demo de uno que aguanta a varias personas usándolo a diario.

---

## Elegir modelo según el hardware {: .topic-title }

El orden correcto es: **mirar la memoria disponible → elegir el mayor que quepa entero → cuantizar a `q4_K_M`**.

| Memoria de GPU | Elección razonable |
|---|---|
| 8 GB | 7B–8B en `q4_K_M`, contexto 4K–8K |
| 12 GB | 14B en `q4_K_M`, contexto 8K |
| 16 GB | 14B en `q5`, o 14B en `q4` con contexto amplio |
| 24 GB | 32B en `q4_K_M` |
| Solo CPU, 16 GB de RAM | 7B–8B en `q4`. Funciona, pero lento |

!!! danger "Que quepa **entero** es la condición, no una recomendación"
    Si el modelo no cabe en la VRAM, una parte se descarga a la RAM del sistema y el rendimiento cae en picado — no un poco, sino a una fracción. Un 14B que cabe justo va mucho más rápido que un 32B que se sale por poco.

    Se comprueba con `ollama ps`: la columna del procesador tiene que decir `100% GPU`.

!!! tip "Prueba dos o tres modelos con tus propias preguntas"
    Las tablas comparativas de internet miden pruebas académicas que casi nunca se parecen a tu caso. Un modelo que puntúa peor en general puede responder mejor a tus preguntas concretas, sobre todo en español o en tu dominio.

    Media hora probando el mismo conjunto de diez preguntas reales contra tres modelos decide mejor que cualquier tabla.

## Parámetros de generación {: .topic-title }

| Parámetro | Qué controla | Valor útil |
|---|---|---|
| `temperature` | Cuánta variación. 0 = determinista | **0–0.3** para datos y extracción; 0.7 para redacción |
| `top_p` | Recorta las opciones improbables | 0.9. Se ajusta este **o** la temperatura, no los dos |
| `top_k` | Cuántas opciones considera | 40 |
| `repeat_penalty` | Penaliza repetir | 1.1 |
| `num_ctx` | Ventana de contexto | 4096–8192 |
| `num_predict` | Máximo de tokens a generar | Según el caso |
| `seed` | Fija la aleatoriedad | Para reproducir resultados en pruebas |
| `stop` | Secuencias que cortan la generación | Útil con formatos |

!!! tip "Temperatura baja para todo lo que sea consultar datos"
    Si el modelo redacta información que viene de tu base de datos o de un documento, no quieres creatividad: quieres fidelidad. Con `temperature: 0` la respuesta es prácticamente determinista y **es mucho más difícil que se invente cosas**.

    La temperatura alta tiene sentido para textos de marketing o lluvia de ideas, no para responder «¿cuándo llega mi pedido?».

!!! warning "`num_ctx` es memoria, no una opción gratis"
    Subirlo permite pasar más texto, y a la vez ocupa más memoria y ralentiza cada respuesta. Con RAG bien hecho —tres o cinco fragmentos relevantes— 8K sobra. Ampliarlo a 32K «por si acaso» suele empeorar el resultado y el rendimiento a la vez.

## Instrucciones de sistema {: .topic-title }

Es el ajuste que más cambia la calidad, y no cuesta memoria:

```
Eres un asistente de soporte. Respondes en español, breve y concreto.
Usas ÚNICAMENTE la información del contexto que se te proporciona.
Si la información no está en el contexto, dices "no dispongo de ese dato".
Nunca inventas cifras, fechas ni referencias.
Citas el documento del que sale cada afirmación.
```

!!! danger "Un modelo pequeño necesita instrucciones más explícitas"
    Los modelos grandes toleran instrucciones vagas; los de 7B o 8B no. Con ellos hay que ser concreto, poner el formato esperado y, si hace falta, un ejemplo de respuesta correcta.

    Y **«no lo sé» tiene que estar autorizado explícitamente**: un modelo sin esa instrucción prefiere inventarse algo antes que reconocer que no tiene la información.

!!! danger "Las instrucciones de sistema no son una medida de seguridad"
    «Solo puedes ver los datos del cliente 1745» es una sugerencia a un generador de texto, no un límite. Los permisos se aplican en la consulta que ejecuta tu backend, nunca en el prompt. Está desarrollado en el [caso del asistente de IA](../../../backend/02-arquitectura/04-asistente-ia/index.md).

## Servir a varias personas {: .topic-title }

| Variable | Para qué |
|---|---|
| `OLLAMA_NUM_PARALLEL` | Peticiones simultáneas por modelo |
| `OLLAMA_MAX_LOADED_MODELS` | Cuántos modelos distintos en memoria a la vez |
| `OLLAMA_KEEP_ALIVE` | Cuánto sigue cargado tras la última petición |

!!! warning "Cada petición en paralelo consume su propio contexto"
    Cuatro peticiones simultáneas con 8K de contexto ocupan cuatro veces esa memoria, además del modelo. Subir `OLLAMA_NUM_PARALLEL` sin margen de VRAM provoca justo lo que se quería evitar: descarga a CPU y todo se ralentiza para todos.

    Con varios usuarios concurrentes, el patrón sano es una **cola con un número limitado de trabajadores** delante del modelo: las peticiones esperan en lugar de tumbar el servidor.

!!! tip "`OLLAMA_KEEP_ALIVE` evita la espera del primer mensaje"
    Por defecto el modelo se descarga de memoria a los pocos minutos de inactividad, y la siguiente petición paga la recarga entera —varios segundos de silencio—. En un servidor dedicado, subirlo (o ponerlo a `-1` para que no se descargue) hace que la primera respuesta del día no sea la más lenta.

## Docker con GPU {: .topic-title }

```yaml
services:
  ollama:
    image: ollama/ollama
    volumes:
      - ollama:/root/.ollama
    environment:
      OLLAMA_KEEP_ALIVE: 30m
      OLLAMA_NUM_PARALLEL: 2
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
```

Hace falta el *NVIDIA Container Toolkit* en el anfitrión. Sin él, el contenedor arranca igual pero **usa solo la CPU**, y es fácil no darse cuenta: se comprueba con `docker exec -it ollama ollama ps`.

## Seguridad {: .topic-title }

<div class="pros-cons" markdown>

| ✅ Haz | ❌ No hagas |
|---|---|
| Ollama accesible solo desde la red interna | `OLLAMA_HOST=0.0.0.0` expuesto a internet |
| Proxy inverso con autenticación y HTTPS delante | Confiar en que «nadie sabe la URL» |
| Límite de peticiones por usuario | Dejar la API abierta al volumen que sea |
| Registrar quién consulta, no qué consulta | Guardar el texto de las conversaciones sin consentimiento |
| Índices separados para documentación interna | Un único índice con todo mezclado |

</div>

!!! danger "Ollama no tiene autenticación"
    No hay usuarios ni claves: quien alcanza el puerto, usa el modelo. Toda la protección tiene que estar **delante** — cortafuegos, proxy inverso, red privada.

    Y ojo con el motivo original: si el modelo es local porque los datos no pueden salir, dejar la API abierta anula el propósito entero.

## Medir antes de decidir {: .topic-title }

```bash
ollama run qwen2.5:14b --verbose
```

Al terminar cada respuesta imprime los tiempos y la velocidad en tokens por segundo. Es el dato con el que se compara un modelo con otro, o el efecto de bajar la cuantización, en lugar de guiarse por la sensación.

Referencia aproximada: por debajo de **10 tokens/s** la espera se hace incómoda; por encima de **30** se lee tan rápido como aparece.

---

## 📚 Fuentes {: .topic-title }

| Fuente | Enlace |
|---|---|
| 🦙 **Ollama — Preguntas frecuentes** | [github.com/ollama/ollama/blob/main/docs/faq.md](https://github.com/ollama/ollama/blob/main/docs/faq.md) |
| 🐳 **Ollama con Docker** | [hub.docker.com/r/ollama/ollama](https://hub.docker.com/r/ollama/ollama) |
