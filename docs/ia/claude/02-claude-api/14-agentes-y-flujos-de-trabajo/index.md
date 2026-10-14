# Agentes y flujos de trabajo { .bloque-ia }

> Dos estrategias distintas para resolver tareas que Claude no puede completar en una sola solicitud: seguir una receta fija de pasos, o darle un objetivo y dejar que decida cómo llegar.

---

## Qué son { .topic-title }

Los **flujos de trabajo** (*workflows*) y los **agentes** son formas de gestionar tareas que necesitan más de una llamada a Claude. Ya han aparecido antes en el curso sin nombrarlos: cada vez que se le dieron herramientas a Claude y se le dejó averiguar por su cuenta cómo completar una tarea, eso ya era un agente.

- Un **flujo de trabajo** es una serie de llamadas a Claude que sigue pasos predeterminados: el desarrollador decide de antemano el orden exacto y qué hace cada paso.
- Un **agente** le da a Claude un objetivo y un conjunto de herramientas, y espera que sea Claude quien descubra cómo combinarlas para lograrlo.

## Cuándo usar cada uno { .topic-title }

La decisión se reduce a qué tan bien se comprende la tarea de antemano:

- Usar un **flujo de trabajo** cuando se puede visualizar el flujo exacto o los pasos que Claude debería seguir, o cuando la interfaz de la aplicación ya limita al usuario a un conjunto cerrado de tareas.
- Usar un **agente** cuando no se está seguro de qué tarea concreta, ni con qué parámetros, se le va a pedir a Claude.

## Ejemplo: de una imagen a un modelo CAD { .topic-title }

Una aplicación donde el usuario sube la foto de una pieza metálica y la aplicación genera un archivo STEP (el estándar industrial para modelos 3D). Como se sabe exactamente qué hay que hacer en cada paso, es un candidato perfecto para un flujo de trabajo, no para un agente:

1. Pasarle la imagen a Claude y pedirle que describa el objeto.
2. Con esa descripción, pedirle a Claude que use la librería CadQuery para modelar el objeto.
3. Generar una representación (*render*) del modelo.
4. Pedirle a Claude que compare el render con la imagen original y corrija el modelo si encuentra problemas.

## El patrón evaluador-optimizador { .topic-title }

El último paso del ejemplo anterior — generar, comparar y corregir — es un ejemplo del patrón **evaluador-optimizador**, uno de los más repetidos al construir flujos de trabajo:

- **Productor**: recibe los datos de entrada y crea un resultado (Claude modela la pieza con CadQuery y genera un render).
- **Calificador**: evalúa ese resultado según unos criterios concretos.
- **Bucle de retroalimentación**: si el calificador no acepta el resultado, la retroalimentación vuelve al productor para que lo mejore.
- **Iteración**: el ciclo se repite hasta que el calificador acepta el resultado.

## Por qué aprender estos patrones { .topic-title }

Los patrones de flujo de trabajo son recetas repetibles. Identificar qué patrón encaja con un problema no lo resuelve por sí solo — el código hay que escribirlo igual — pero son estructuras que ya han demostrado ser eficaces para otros ingenieros, y ahorran tener que reinventarlas desde cero.

## Flujos de trabajo o agentes: la comparativa { .topic-title }

| | Flujos de trabajo | Agentes |
|---|---|---|
| **Ventajas** | Claude se centra en una subtarea a la vez (mayor precisión); mucho más fáciles de evaluar y testear porque se conoce cada paso exacto; ejecución predecible y fiable; mejor para problemas específicos y bien definidos | UX más flexible; completan tareas combinando herramientas de formas inesperadas; manejan situaciones novedosas no anticipadas en el desarrollo; pueden pedir más información al usuario cuando hace falta |
| **Desventajas** | Mucho menos flexibles, dedicados a un tipo de tarea concreto; UX más limitada porque hay que conocer de antemano las entradas exactas del flujo; requieren más trabajo previo de planificación y diseño | Menor tasa de éxito al completar tareas, comparados con un flujo de trabajo; más difíciles de instrumentar, testear y evaluar porque no siempre se sabe qué pasos va a ejecutar; comportamiento menos predecible |

El objetivo como ingeniero es resolver problemas de forma fiable — al usuario no le importa si por detrás hay un agente sofisticado, quiere un producto que funcione de forma consistente. La recomendación general es priorizar siempre un flujo de trabajo cuando sea posible, y recurrir a un agente solo cuando de verdad haga falta: los flujos de trabajo dan la fiabilidad y previsibilidad que la mayoría de aplicaciones en producción necesitan, y los agentes aportan la flexibilidad para los escenarios donde los requisitos exactos no se pueden determinar de antemano.

## Temario { .topic-title }

| Lección | Qué cubre |
|---|---|
| [Paralelización](01-paralelizacion/index.md) | Dividir una decisión compleja en varias llamadas independientes a Claude que se ejecutan a la vez, y agregar los resultados en un paso final |
| [Encadenamiento](02-encadenamiento/index.md) | Dividir una tarea grande en subtareas secuenciales, cada una centrada en un único aspecto, en vez de pedirlo todo de una vez |
| [Enrutamiento](03-enrutamiento/index.md) | Categorizar la solicitud entrante y enviarla a un pipeline de procesamiento especializado según esa categoría |
| [Agentes y herramientas](04-agentes-y-herramientas/index.md) | Cómo un conjunto pequeño de herramientas abstractas permite a Claude combinar acciones de formas que el desarrollador no anticipó |
| [Inspección del entorno](05-inspeccion-de-entorno/index.md) | Por qué Claude necesita poder observar el resultado de sus propias acciones para funcionar bien como agente |

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📘 **Anthropic Engineering — Building Effective AI Agents** | https://www.anthropic.com/engineering/building-effective-agents |
