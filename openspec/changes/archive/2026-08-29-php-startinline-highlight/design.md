# Design: php-startinline-highlight

## Problema

El lexer PHP de Pygments (usado por `pymdownx.highlight`) empieza en modo HTML: no resalta nada hasta encontrar `<?php`. Los apuntes de Symfony están llenos de fragmentos parciales (un `use`, un método suelto, un atributo `#[Route]`), que por definición no llevan `<?php` y salían sin color.

## Alternativas evaluadas

### A — Anteponer `<?php` a cada bloque (44 ediciones)
- **Pro:** cero cambios de tooling, sin `openspec`.
- **Contra:** 44 ediciones ahora; y para "siempre coloreados" hace falta acordarse de poner `<?php` en cada bloque nuevo — disciplina que se rompe. Además `<?php` sobra visualmente en un fragmento de 3 líneas que es medio método.

### B — Nuevo lenguaje `php-inline` (`extend_pygments_lang` + cambiar fences)
- **Pro:** limpio, los bloques `<?php` completos siguen usando `php` normal.
- **Contra:** hay que cambiar 44 fences a ` ```php-inline ` igualmente, y decidir bloque a bloque cuál es "inline" y cuál no. Sigue dependiendo de elegir bien en cada bloque futuro.

### C (elegida) — Redefinir `php` global con `startinline: true`
- **Pro:** un solo cambio en `mkdocs.yml`. Todo bloque `php` presente y futuro se colorea sin pensar. Es exactamente lo que Pau pidió ("a partir de ahora SIEMPRE").
- **Contra:** un bloque que empiece literalmente con `<?php` renderiza la etiqueta como `<?` (operador) + `php` (nombre), un poco feo. Mitigación: no hace falta escribir `<?php` nunca más; se quitaron las 3 ocurrencias que quedaban.

## Decisión

Opción C. El coste (la etiqueta `<?php` se ve rara) desaparece al no volver a escribirla, y a cambio la garantía es estructural, no de disciplina.

## Verificación

`mkdocs build` + inspección del HTML generado en los 10 archivos afectados: los fragmentos sin `<?php` pasan a tener spans `k`/`nc`/`nd`/`nx`; cero spans `err` en cualquier bloque.
