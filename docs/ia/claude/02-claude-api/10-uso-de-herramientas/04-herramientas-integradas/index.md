# Herramientas integradas { .bloque-ia }

> Dos herramientas que Claude ya trae hechas: el editor de texto (para trabajar con archivos) y la búsqueda web — no hace falta escribirles un esquema desde cero, y a la búsqueda web ni siquiera la implementación.

---

## La herramienta de búsqueda web { .topic-title }

No necesita función propia ni implementación — Claude gestiona toda la búsqueda por su cuenta. Solo hace falta declararla:

```js
const webSearchSchema = {
  type: 'web_search_20250305',
  name: 'web_search',
  max_uses: 5,
};
```

`max_uses` limita cuántas búsquedas puede encadenar Claude en una sola conversación. Con `allowed_domains` se puede restringir a fuentes de confianza (por ejemplo, `['nih.gov']` para consejos médicos, en vez de cualquier blog).

**Qué trae la respuesta:** en vez de un `tool_use` + `tool_result` normal, aparece `server_tool_use` (Claude ejecuta la búsqueda del lado del servidor, no vos) y `web_search_tool_result` con los resultados. Los bloques de texto pueden traer `citations`, que enlazan una afirmación concreta con la fuente de la que salió. No hace falta bucle ni `runTool` — todo llega resuelto en la misma respuesta.

!!! tip "Dos activaciones distintas, no una"
    1. **Una vez, a nivel organización** — activarla en la consola de Anthropic (configuración de privacidad).
    2. **En cada llamada** donde la quieras disponible — declarar el schema en `tools`, igual que cualquier otra herramienta.

    Con el schema declarado, Claude decide solo, pregunta por pregunta, si una búsqueda ayuda — no busca siempre.

## La herramienta de edición de texto { .topic-title }

El esquema viene completo desde Claude — solo hace falta `type` y `name`, sin `input_schema`. Pero a diferencia de la búsqueda web, esta SÍ manda `tool_use` normales: la implementación real de leer/escribir el archivo la escribís vos, con el mismo `runTool` de las herramientas propias.

```js
const textEditorSchema = {
  type: 'text_editor_20250728',
  name: 'str_replace_based_edit_tool',
};
```

!!! warning "El esquema cambia según el modelo — comprobar la tabla oficial"
    La cadena exacta no es fija. `text_editor_20250728` es la versión vigente para los modelos actuales (Sonnet/Opus); versiones de modelos anteriores usaban otro `type` y otro `name` (`str_replace_editor`). Antes de escribir el esquema a mano, comprobar la [tabla de versiones oficial](https://docs.claude.com/en/docs/agents-and-tools/tool-use/text-editor-tool) — copiar un ejemplo viejo no funciona con un modelo nuevo. Un caso concreto: el comando `undo_edit` existía hasta `text_editor_20250124`, pero se quitó a partir de `text_editor_20250429` — la versión actual no lo tiene.

**Los 4 comandos que Claude puede pedir**, cada uno con su propio `input`:

| Comando | Campos de `input` | Qué hace |
|---|---|---|
| `view` | `path`, `view_range` (opcional) | Ver un archivo o directorio |
| `str_replace` | `path`, `old_str`, `new_str` | Reemplazar un texto exacto por otro |
| `create` | `path`, `file_text` | Crear un archivo nuevo |
| `insert` | `path`, `insert_line`, `insert_text` | Insertar texto después de una línea |

**Implementar `view`** — leer el archivo real que Claude pidió:

```js
function viewFile(path) {
  return readFileSync(`./ruta/a/tu/carpeta/${path}`, 'utf-8');
}

const toolBlock = respuesta.content.find((block) => block.type === 'tool_use');
const contenido = viewFile(toolBlock.input.path);
```

!!! tip "Claude manda el `path` con barra inicial"
    El `input.path` que llega suele venir como `/archivo.txt`, no `archivo.txt` — Claude trata el sistema de archivos como si arrancara en `/`. Prefijar la ruta real con un template string (como arriba) resuelve esto sin problema, aunque quede una doble barra en el medio.

!!! warning "Acotar siempre a una carpeta de pruebas"
    Esta herramienta le da a Claude acceso real de lectura/escritura sobre el disco. Nunca resolver `path` directo contra la raíz del proyecto — prefijar siempre una carpeta de pruebas propia (sandbox), para que Claude solo pueda tocar lo que hay ahí adentro.

`str_replace`, `create` e `insert` se implementan con el mismo patrón: una función por comando, enrutadas desde `runTool` según `toolInput.command`, usando `writeFileSync` de `node:fs` para escribir.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📘 **Documentación oficial — Text editor tool** | https://docs.claude.com/en/docs/agents-and-tools/tool-use/text-editor-tool |
| 📘 **Documentación oficial — Web search tool** | https://docs.claude.com/en/docs/agents-and-tools/tool-use/web-search-tool |
