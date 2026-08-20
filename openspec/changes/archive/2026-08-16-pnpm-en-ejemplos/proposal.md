# Proposal: pnpm-en-ejemplos

## Intent

Pau pidió explícitamente que todos los ejemplos de instalación de paquetes en la documentación (`npm install ...`) usen `pnpm` en vez de `npm` de ahora en adelante — es el gestor que usa realmente, siguiendo la convención que ya conocía de midudev.

## Scope

### In Scope
- Todo ejemplo de código NUEVO en `docs/` que instale dependencias de Node/npm: usar sintaxis `pnpm` (`pnpm add <paquete>`, no `pnpm install <paquete>`).

### Out of Scope
- No se retrocompletan ejemplos ya existentes que usan `npm install` — el cambio aplica desde el 16/08/2026 en adelante, no retroactivo (pedido explícito de Pau).

## Approach

Decisión directa de Pau, sin alternativas evaluadas — no aplica `design.md`. Nota técnica: el equivalente de `npm install <paquete>` en pnpm es `pnpm add <paquete>` (no `pnpm install <paquete>`, que es el equivalente de `npm install` sin argumentos — instala desde `package.json`/lockfile existente).

## Affected Areas

| Area | Impact | Description |
|------|--------|--------------|
| `docs/**/*.md` (ejemplos de código nuevos) | Convención nueva | Instalación de paquetes vía `pnpm add`, nunca `npm install` |

## Rollback Plan

Volver a `npm install` en los ejemplos nuevos si Pau lo pide — no afecta código de proyectos reales, solo snippets de documentación.

## Success Criteria

- [x] Convención registrada para aplicarse desde ya
- [x] Página `docs/ia/claude/02-claude-api/02-creando-conexion/index.md` usa `pnpm add`, no `npm install`
