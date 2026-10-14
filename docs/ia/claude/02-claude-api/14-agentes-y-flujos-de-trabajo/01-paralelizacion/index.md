# Paralelización { .bloque-ia }

> Dividir una decisión compleja en varias llamadas independientes que se ejecutan a la vez, en vez de pedírselo todo a Claude de golpe.

---

## El problema de la instrucción única { .topic-title }

Una aplicación de diseño de materiales donde el usuario sube la imagen de una pieza y recibe una recomendación de material (metal, polímero, cerámica, compuesto, elastómero, madera). Pedirle todo a Claude en una única instrucción, con todos los criterios de todos los materiales a la vez, genera confusión y resultados peores: Claude tiene que repartir su atención entre demasiados criterios distintos en la misma llamada.

## El patrón de paralelización { .topic-title }

El enfoque mejor es dividir el trabajo en varias solicitudes paralelas, cada una evaluando la pieza para un único tipo de material con sus propios criterios especializados:

1. Se envía la misma imagen a Claude varias veces, de forma simultánea.
2. Cada solicitud lleva criterios especializados para un material distinto.
3. Claude evalúa de forma independiente la idoneidad de la pieza para cada material.
4. Se recogen todos los resultados y se pasan a un paso de agregación final, pidiéndole a Claude que los compare y dé una recomendación única.

La estructura del patrón tiene tres partes: dividir una tarea en subtareas, ejecutar esas subtareas en paralelo, y agregar los resultados en una decisión final. Las subtareas no tienen por qué ser idénticas entre sí — cada una puede llevar su propia instrucción, sus propias herramientas o sus propios criterios.

## Beneficios { .topic-title }

- **Atención focalizada** — Claude se concentra en un único aspecto por llamada.
- **Optimización más sencilla** — se puede ajustar el prompt de un material sin tocar los demás.
- **Mayor escalabilidad** — añadir un material nuevo es solo sumar otra solicitud paralela.
- **Mayor fiabilidad** — menos carga cognitiva por llamada, menos probabilidad de que se salte un criterio.

## Cuándo usarlo { .topic-title }

Para decisiones complejas que se pueden dividir en evaluaciones independientes: comparar varias opciones frente a los mismos criterios, decisiones que cruzan distintas áreas de especialización, o cualquier caso con múltiples criterios que compiten entre sí dentro de la misma instrucción. La clave es que cada subtarea funcione de forma independiente y aporte un análisis distinto a la decisión final.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📘 **Anthropic Engineering — Building Effective AI Agents** | https://www.anthropic.com/engineering/building-effective-agents |
