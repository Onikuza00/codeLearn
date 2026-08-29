# Proposal: setup-claude-js-raiz

## Intent

El script `claude.js` (raíz del proyecto, curso "API de Claude" de Anthropic Academy) no arrancaba: `index.html` lo cargaba con `<script src="claude.js">` como si fuera código de navegador, cuando es un script de Node (usa `dotenv` + SDK de Anthropic, ambos exclusivos del entorno Node — y ejecutar código con la API key en el navegador sería además un riesgo de seguridad, la clave quedaría expuesta a cualquiera que inspeccione la página). Además, `package.json` no tenía `"type": "module"`, así que `node claude.js` tampoco funcionaba directo (`SyntaxError: Cannot use import statement outside a module`, por el `import`/`await` de nivel superior del script). Y el `.gitignore` no cubría un `.env` plano, solo `.env.local` — riesgo de comprometer la clave si se creaba el archivo sin arreglar esto antes.

## Scope

### In Scope
- `index.html` (raíz): quitar el `<script src="claude.js">` — este script no se carga desde el navegador
- `package.json` (raíz): añadir `"type": "module"` como propiedad de nivel raíz
- `.gitignore` (raíz): añadir `.env` (además del `.env.local` ya existente)
- Persistencia en openspec (este cambio) + engram + `GOTCHAS.md`

### Out of Scope
- Bugs de código dentro de `claude.js` en sí (traducción literal de Python a JS, manejo del bloque `thinking` de Sonnet 5) — no son configuración del proyecto, van en `GOTCHAS.md` como fallos de aprendizaje, no en openspec
- Cualquier otro script o proyecto bajo `codeLearn/` — cambio acotado a este script puntual

## Approach

Configuración mínima para que un script de Node con ESM (`import`/top-level `await`) funcione desde terminal (`node claude.js`), separado por completo de cualquier carga desde navegador, con el `.env` que va a contener la API key correctamente ignorado por git desde antes de crearlo.

## Affected Areas

| Area | Impact | Description |
|------|--------|--------------|
| `index.html` | Modified | Se quita el `<script src="claude.js">` |
| `package.json` | Modified | `"type": "module"` añadido a nivel raíz |
| `.gitignore` | Modified | `.env` añadido junto a `.env.local` |
| `GOTCHAS.md` | New | Fallos 49-51 (bugs de código de `claude.js`, fuera del alcance de este proposal pero relacionados) |
| `docs/ia/claude/02-claude-api/02-creando-conexion/index.md` | Modified | Tip ampliado con el gotcha real del bloque `thinking` |

## Rollback Plan

Revertir las tres líneas de configuración (`index.html`, `package.json`, `.gitignore`) desde git si hiciera falta.

## Success Criteria

- [x] `node claude.js` corre sin errores de sintaxis ni de módulos
- [x] `index.html` ya no referencia `claude.js`
- [x] `.env` cubierto por `.gitignore` antes de haber sido creado
- [x] Script funcional de punta a punta (conversación multiturno + system prompt)
