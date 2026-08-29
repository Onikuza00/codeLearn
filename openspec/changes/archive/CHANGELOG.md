# Changelog — cambios archivados en OpenSpec

> Índice de una línea por cambio archivado, de más reciente a más antiguo. No sustituye a `proposal.md`/`design.md` de cada carpeta — es el resumen para tener la evolución completa de un vistazo, sin leer cada cambio entero.
>
> **Al archivar un cambio nuevo, añadir su fila aquí en el MISMO paso** (igual que la regla de nav en `mkdocs.yml`).

| Fecha | Cambio | Resumen |
|---|---|---|
| 2026-08-29 | [php-startinline-highlight](2026-08-29-php-startinline-highlight/) | Los bloques ` ```php ` de la doc solo se coloreaban si empezaban con `<?php` (44 de 95 salían en gris). `pymdownx.highlight` con `extend_pygments_lang` redefine `php` con `startinline: true` → todo fragmento PHP se colorea, lleve o no la etiqueta, ahora y siempre |
| 2026-08-29 | [quitar-context7-mcp](2026-08-29-quitar-context7-mcp/) | Arranque de sesión colgado minutos en "Cerebrating…": los hooks estaban bien (<0,4 s), el bloqueo era la init de MCP. `context7` (npx, ~10 s por arranque en Windows, sin usar en sesiones recientes) eliminado de `~/.claude/settings.json` |
| 2026-08-22 | [setup-claude-js-raiz](2026-08-22-setup-claude-js-raiz/) | `claude.js` (raíz, curso API de Claude) no arrancaba: `index.html` lo cargaba como script de navegador (es Node), `package.json` sin `"type": "module"`, `.gitignore` sin cubrir `.env` plano. Los 3 corregidos |
| 2026-08-22 | [nav-header-en-creacion-ejercicios](2026-08-22-nav-header-en-creacion-ejercicios/) | Norma fija: antes de crear un ejercicio, comprobar el nav del header (`nav.js`) — si el track ya existe, fusionar en su HTML (primero, separado por fecha); si es nuevo, crear HTML Y enlazarlo en el nav en el mismo paso. Corrige `dia-22-dom-tailwind.html`, creado huérfano sin este chequeo |
| 2026-08-20 | [planes-a-waytoCode](2026-08-20-planes-a-waytoCode/) | Bloque "Planes" fusionado dentro de "Way to Code"; "Próxima sesión" pasa de página abandonada (stale desde 27/07) a disciplina activa, actualizada al final de cada sesión |
| 2026-08-20 | [hook-sessionstart-codelearn](2026-08-20-hook-sessionstart-codelearn/) | Hook de arranque pasa de `UserPromptSubmit` (palabra clave "codeLearn") a `SessionStart` real acotado por `cwd` — se dispara siempre al empezar sesión, no solo si el prompt la menciona |
| 2026-08-16 | [pnpm-en-ejemplos](2026-08-16-pnpm-en-ejemplos/) | Ejemplos de instalación de paquetes en la documentación usan `pnpm add`, no `npm install`, desde ahora en adelante |
| 2026-08-16 | [cuadricula-totales-sin-fallos](2026-08-16-cuadricula-totales-sin-fallos/) | Ejercicios sin fallos en el daily log ya no se listan uno por uno — solo cuadrícula de totales (bien/mal) |
| 2026-08-15 | [changelog-context-injection](2026-08-15-changelog-context-injection/) | Este índice + el hook lo inyecta al arrancar sesión nueva, para tener contexto de toda la evolución sin cargar cada cambio entero |
| 2026-08-15 | [hook-codelearn-session](2026-08-15-hook-codelearn-session/) | Hook que recupera contexto de engram, levanta mkdocs y arranca el registro diario al escribir "codeLearn" |
| 2026-06-27 | [fases-sdd](2026-06-27-fases-sdd/) | Página de detalle de las fases SDD en `docs/sdd/fases.md`, con diagrama de dependencias y mapeo a las 13 fases de la empresa de Pau |
