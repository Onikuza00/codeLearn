# Herramientas integradas { .bloque-ia }

> Dos herramientas que Claude ya trae hechas: el editor de texto (para trabajar con archivos) y la búsqueda web — no hace falta escribirles un esquema desde cero, y a la búsqueda web ni siquiera la implementación.

---

## La herramienta de edición de texto { .topic-title }

A diferencia de una herramienta propia, el editor de texto viene con el esquema completo ya integrado en Claude — solo hace falta pasarle un fragmento pequeño que le diga qué versión usar, y Claude lo expande solo en la especificación completa por detrás.

Le da a Claude la capacidad de: ver el contenido de un archivo o directorio, ver rangos de líneas concretos, reemplazar texto, crear archivos nuevos, insertar texto en una línea, y deshacer la última edición.

**Lo que sí hay que escribir: la implementación real de cada operación.** El esquema es de Claude, pero las funciones que de verdad leen o escriben en el disco las escribís vos — Claude solo sabe *pedir* "ver este archivo" o "reemplazá este texto"; tu código es el que ejecuta esa operación sobre el sistema de archivos real.

**El esquema depende del modelo, y cambia con el tiempo.** La cadena exacta no es fija: para `claude-3-7-sonnet`, por ejemplo, el nombre de la herramienta es `str_replace_editor` con tipo `text_editor_20250124`; en versiones posteriores el nombre cambia a `str_replace_based_edit_tool` con un tipo distinto. Antes de escribir el esquema a mano hay que consultar la [tabla oficial de versiones](https://docs.claude.com/en/docs/agents-and-tools/tool-use/text-editor-tool) para el modelo concreto que estés usando — copiar un ejemplo de un modelo viejo no funciona con uno nuevo.

```js
function getTextEditSchema(model) {
  if (model.startsWith('claude-3-7-sonnet')) {
    return { type: 'text_editor_20250124', name: 'str_replace_editor' };
  }
  // el nombre y el tipo cambian según el modelo — comprobar la tabla oficial
}
```

**Ejemplo de uso:** pedirle a Claude "abrí `./main.py` y resumime su contenido" hace que use la herramienta para ver el archivo, lea el contenido, y devuelva el resumen. Pedirle además que modifique código ("agregá una función que calcule pi con 5 dígitos de precisión, y creá un test") hace que encadene ver el archivo, reemplazar su contenido, y crear un archivo nuevo — todo dentro del mismo flujo de herramientas ya conocido (bloques `tool_use`/`tool_result`, el bucle de conversación).

!!! tip "Cuándo tiene sentido usarla"
    Cuando estás construyendo una aplicación propia que necesita editar archivos programáticamente, o un entorno sin editor de código con IA integrada — es la forma de llevar esa capacidad de "editor con IA" dentro de tu propia app, con control total de qué puede tocar y qué no.

## La herramienta de búsqueda web { .topic-title }

A diferencia de todas las herramientas anteriores, la búsqueda web no necesita ni función propia ni implementación — Claude gestiona toda la búsqueda por su cuenta. Solo hace falta declararla:

```js
const webSearchSchema = {
  type: 'web_search_20250305',
  name: 'web_search',
  max_uses: 5,
};
```

`max_uses` limita cuántas búsquedas puede hacer Claude en una sola conversación — una pregunta puede necesitar varias búsquedas encadenadas, y este campo evita que se dispare sin control.

**Restringir a dominios de confianza** con `allowed_domains` — útil cuando la respuesta depende de que la fuente sea fiable (por ejemplo, limitar consejos médicos a `nih.gov` en vez de cualquier blog):

```js
const webSearchSchema = {
  type: 'web_search_20250305',
  name: 'web_search',
  max_uses: 5,
  allowed_domains: ['nih.gov'],
};
```

**Qué trae la respuesta.** A diferencia de una herramienta propia (un `tool_use` + un `tool_result`), acá aparecen bloques específicos: la consulta exacta que usó Claude, los resultados de la búsqueda (título + URL de cada uno), y bloques de cita que enlazan un fragmento concreto de la respuesta con la fuente de la que salió.

!!! tip "Requiere activarla antes de usarla"
    A diferencia del resto de herramientas, esta hay que habilitarla primero en la consola de Anthropic (configuración de privacidad de la organización) — si no está activada ahí, pasar el esquema en `tools` no alcanza.

Con el esquema en el array de `tools`, Claude decide solo cuándo una búsqueda ayuda a responder — típicamente para eventos recientes, información especializada fuera de sus datos de entrenamiento, o verificación de datos contra fuentes concretas.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📘 **Documentación oficial — Text editor tool** | https://docs.claude.com/en/docs/agents-and-tools/tool-use/text-editor-tool |
| 📘 **Documentación oficial — Web search tool** | https://docs.claude.com/en/docs/agents-and-tools/tool-use/web-search-tool |
