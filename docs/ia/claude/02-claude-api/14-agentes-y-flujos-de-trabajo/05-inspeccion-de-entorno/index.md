# Inspección del entorno { .bloque-ia }

> Por qué un agente necesita poder observar el resultado de sus propias acciones para funcionar bien, en vez de actuar a ciegas.

---

## Claude opera a ciegas por defecto { .topic-title }

Al construir agentes, hay un concepto clave que se suele pasar por alto: la **inspección del entorno**. Claude no tiene ninguna percepción automática del resultado de sus propias acciones — necesita poder observarlo y entenderlo para funcionar bien.

En el uso del ordenador (*computer use*), cada vez que Claude hace una acción — escribir texto, hacer clic en un botón — recibe inmediatamente una captura de pantalla para entender qué pasó. No es un capricho, es esencial: desde la perspectiva de Claude, un clic en un botón podría haber navegado a una página nueva, abierto un menú, o disparado cualquier otro cambio. Sin poder ver el resultado, Claude no tiene forma de saber si su acción tuvo éxito ni cómo quedó el entorno después.

## Leer antes de escribir { .topic-title }

El mismo principio se aplica a las operaciones con archivos. Antes de que Claude pueda modificar un archivo, necesita entender su contenido actual. Parece obvio, pero es un patrón que siempre hay que seguir al construir agentes: al pedirle que añada una ruta nueva a un archivo de rutas, Claude primero lee el código existente para entender la estructura actual, y solo entonces hace el cambio pedido, sin romper lo que ya funcionaba.

## Guiar la inspección desde el system prompt { .topic-title }

Se puede guiar a Claude a inspeccionar su entorno mediante instrucciones explícitas en el system prompt. Para tareas complejas como la generación de vídeo esto es especialmente importante: un agente de creación de vídeo que genera contenido, coloca diálogo de audio, y añade elementos visuales, se beneficia de instrucciones como "usa la herramienta de terminal para ejecutar un transcriptor y generar subtítulos con marcas de tiempo, para verificar la colocación del diálogo" o "extrae capturas del vídeo a intervalos regulares e inspecciona visualmente el resultado".

## Beneficios de la inspección del entorno { .topic-title }

- **Mejor seguimiento del progreso** — Claude puede calibrar cuán cerca está de terminar la tarea.
- **Mejor manejo de errores** — se detectan y corrigen resultados inesperados antes de continuar.
- **Control de calidad** — se puede verificar el resultado antes de dar la tarea por terminada.
- **Comportamiento adaptativo** — Claude ajusta su enfoque según lo que observa, en vez de seguir a ciegas.

## Implementación práctica { .topic-title }

Al diseñar un agente propio, conviene preguntarse siempre: **¿cómo sabrá Claude si esta acción funcionó?** Ya sea con archivos, APIs o interfaces de usuario, hay que dar herramientas e instrucciones que le permitan observar el resultado de sus propias acciones: leer el contenido de un archivo antes de modificarlo, capturar pantallas después de interactuar con una interfaz, comprobar las respuestas de una API frente a los datos esperados, validar el contenido generado contra los requisitos originales.

La inspección del entorno es lo que transforma a Claude de un ejecutor ciego de comandos a un agente que de verdad entiende y se adapta al entorno en el que trabaja.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
