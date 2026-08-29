# Proposal: php-startinline-highlight

## Intent

Los bloques de código PHP en la documentación (` ```php `) solo se coloreaban del todo si empezaban con la etiqueta `<?php`. El lexer de PHP de Pygments arranca en modo HTML y no tokeniza nada hasta ver `<?php`, así que todo fragmento que empieza por `use ...`, `#[Route(...)]`, `class ...` o el cuerpo de un método salía en gris, sin resaltado. De 95 fences `php` en `docs/`, 44 (10 archivos) estaban sin colorear.

Pau pidió que **todos** los ejemplos de código estén coloreados y que **a partir de ahora siempre** lo estén — sin depender de acordarse de poner `<?php`.

## Scope

### In Scope
- `mkdocs.yml`: `pymdownx.highlight` con `extend_pygments_lang` que redefine `php` con la opción `startinline: true`, para que el lexer trate todo bloque `php` como si ya estuviera dentro de PHP.
- Quitar las 3 líneas `<?php` ahora redundantes de `docs/symfony/00-fundamentos/07-servicios/index.md` (con `startinline` esa etiqueta se tokeniza como `<?` + `php` y se ve peor).

### Out of Scope
- Bloques `twig`: que las partes fuera de `{{ }}`/`{% %}` salgan sin color es correcto (es texto literal), no es el mismo problema.
- No se tocan los ejemplos de código de `docs/assessment/**` (HTML propio con resaltado a mano, no MkDocs).

## Approach

Redefinir el lenguaje `php` a nivel de configuración en vez de editar 44 bloques a mano. Ver `design.md` para las alternativas.

```yaml
- pymdownx.highlight:
    anchor_linenums: true
    extend_pygments_lang:
      - name: php
        lang: php
        options:
          startinline: true
```

## Affected Areas

| Area | Impact | Description |
|------|--------|--------------|
| `mkdocs.yml` | Config de tooling | `php` global con `startinline: true` |
| `docs/**` (bloques ` ```php `) | Render | Todos los fragmentos PHP se colorean, lleven o no `<?php` |
| `docs/symfony/00-fundamentos/07-servicios/index.md` | Contenido | 3 líneas `<?php` redundantes eliminadas |

## Rollback Plan

Quitar el bloque `extend_pygments_lang` de `mkdocs.yml`. Los bloques que ya tenían `<?php` vuelven a colorearse solos; el resto vuelve a salir en gris.

## Success Criteria

- [x] Fragmentos PHP sin `<?php` (`use`, `#[Route]`, cuerpos de método) se colorean en el build
- [x] `mkdocs build` sin errores nuevos ni tokens `err` en los bloques afectados (10 archivos verificados)
- [x] Convención activa para todo bloque `php` futuro, sin acción manual
