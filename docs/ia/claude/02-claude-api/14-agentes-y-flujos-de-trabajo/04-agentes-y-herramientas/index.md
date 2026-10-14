# Agentes y herramientas { .bloque-ia }

> Cómo un conjunto pequeño de herramientas abstractas permite a Claude combinar acciones de formas que el desarrollador no anticipó.

---

## Un cambio de enfoque { .topic-title }

Los agentes representan un cambio respecto a los flujos de trabajo estructurados. Un flujo de trabajo es perfecto cuando se conocen los pasos exactos; un agente destaca cuando no se está seguro de cuáles deberían ser esos pasos. En vez de definir una secuencia rígida, se le da a Claude un objetivo y un conjunto de herramientas, y se le deja determinar cómo combinarlas para lograrlo.

Esta flexibilidad hace atractivos a los agentes para tareas variadas e impredecibles: se crea el agente una vez, se verifica que funcione razonablemente bien, y se despliega para resolver un rango amplio de problemas. A cambio, tiene contrapartidas en fiabilidad y en coste frente a un flujo de trabajo cerrado.

## Cómo las herramientas hacen al agente { .topic-title }

El poder real de un agente está en combinar herramientas sencillas de formas inesperadas. Un ejemplo con un set básico de herramientas de fecha y hora:

- `get_current_datetime` — obtiene la fecha y hora actuales.
- `add_duration_to_datetime` — añade una duración a una fecha dada.
- `set_reminder` — crea un recordatorio para una hora concreta.

Con solo estas tres, Claude puede gestionar solicitudes bastante complejas:

| Solicitud del usuario | Herramientas que encadena Claude |
|---|---|
| "¿Qué hora es?" | Solo `get_current_datetime` |
| "¿Qué día de la semana es dentro de 11 días?" | `get_current_datetime` + `add_duration_to_datetime` |
| "Recuérdamelo el próximo miércoles" | Las tres, en secuencia |

Claude también reconoce cuándo le falta información: ante "¿cuándo vence mi garantía de 90 días?", sabe que primero tiene que preguntar cuándo se compró el artículo, antes de poder calcular nada.

## Las herramientas deben ser abstractas { .topic-title }

La clave de un agente eficaz es darle herramientas razonablemente abstractas, no hiperespecializadas para cada caso. Un ejemplo de esto son las herramientas genéricas y flexibles con las que se opera sobre archivos y comandos: una para ejecutar comandos de sistema, otras para leer, escribir y editar archivos, y otras para buscar contenido o rutas.

Ese conjunto **no** incluye herramientas especializadas del tipo "refactorizar código" o "instalar dependencias" — es el propio agente quien descubre cómo combinar las herramientas básicas para lograr esas tareas más complejas. Esa abstracción es lo que le permite manejar escenarios que nadie planificó explícitamente de antemano.

!!! tip "Herramientas combinables, no un catálogo de acciones"
    Al diseñar un agente, conviene dar herramientas que Claude pueda combinar creativamente, en vez de una herramienta distinta para cada acción posible. Un agente de vídeo para redes sociales, por ejemplo, puede bastar con cuatro herramientas: acceso a un procesador de vídeo, generación de imágenes a partir de un prompt, conversión de texto a voz, y publicación de contenido. Ese set permite tanto flujos simples (crear y publicar un vídeo) como experiencias más interactivas, donde el agente genera primero una imagen de muestra, pide aprobación al usuario, y solo entonces continúa con el vídeo — algo difícil de lograr con un flujo de trabajo rígido.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
