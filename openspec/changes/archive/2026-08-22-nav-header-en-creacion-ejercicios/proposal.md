# Proposal: nav-header-en-creacion-ejercicios

## Intent

El agente creó `dia-22-dom-tailwind.html` como HTML nuevo para el bloque de ejercicios combinados DOM+Tailwind del 22/08, sin comprobar que el track "DOM" ya tenía sección propia en el nav del header (`docs/assessment/nav.js`, sección "🌐 DOM" → `dia-19-dom.html`). Resultado: página huérfana, sin enlace en ningún sitio del nav, inconsistente con la regla ya existente de "una página por track" (que hasta ahora solo se aplicaba de memoria, no como paso de verificación explícito). Pau corrigió con una norma de dos puntos: comprobar el nav ANTES de crear, y decidir según si el track ya existe o es nuevo.

## Scope

### In Scope
- `rules/ejercicios-estructura.md`: nueva subsección "Antes de crear: comprobar el nav del header" bajo la regla ya existente de "una página por track"
- Corrección del caso actual: fusionar `dia-22-dom-tailwind.html` (+ sus JS) dentro de `dia-19-dom.html` como card nueva al principio, separada por fecha; eliminar los archivos huérfanos
- Persistencia en engram (proyecto) y memoria personal del agente

### Out of Scope
- Cambiar `docs/assessment/nav.js` para el caso actual — DOM ya está enlazado, no hace falta tocar el nav esta vez (aplica el punto 1 de la norma, no el punto 2)
- Revisar retroactivamente otros bloques ya creados (Tailwind, Arrays, Objetos...) en busca de la misma inconsistencia — no se pidió, fuera de alcance de este cambio puntual

## Approach

Norma de verificación, no de código nuevo: antes de montar cualquier ejercicio, mirar `docs/assessment/nav.js` para saber si el track ya tiene sección. Si existe, todo ejercicio nuevo de ese track (aunque combine otro tema, como Tailwind dentro de DOM) se añade al HTML ya existente, nunca a uno nuevo. Si el track es realmente nuevo, el HTML nuevo se crea Y se enlaza en `nav.js` en el mismo paso — nunca una cosa sin la otra.

## Affected Areas

| Area | Impact | Description |
|------|--------|--------------|
| `rules/ejercicios-estructura.md` | Modified | Nueva subsección de verificación previa a crear |
| `docs/assessment/js/ejercicios/dia-19-dom.html` | Modified | Card nueva "22/08 — DOM + Tailwind" añadida al principio |
| `docs/assessment/js/ejercicios/dia-19-dom-soluciones.js` | Modified | Stubs de los 10 ejercicios nuevos añadidos |
| `docs/assessment/js/ejercicios/dia-19-dom-runner.js` | Modified | Tests de los 10 ejercicios nuevos añadidos |
| `docs/assessment/js/ejercicios/dia-22-dom-tailwind.html` (+ JS) | Removed | Huérfano, fusionado dentro de `dia-19-dom.html` |
| engram (proyecto `codelearn`) | New | Memoria `pattern` con la norma correcta (reemplaza la anulada sobre "avisar URL") |

## Rollback Plan

Revertir la subsección añadida en `rules/ejercicios-estructura.md`; recrear `dia-22-dom-tailwind.html` desde el historial de git si hiciera falta separar de nuevo el bloque.

## Success Criteria

- [x] `rules/ejercicios-estructura.md` refleja la norma de dos puntos
- [x] Los 10 ejercicios del 22/08 viven dentro de `dia-19-dom.html`, primeros en el orden, separados por fecha
- [x] `dia-22-dom-tailwind.html` y sus JS ya no existen como archivos huérfanos
- [x] Norma guardada en engram y en memoria personal del agente
