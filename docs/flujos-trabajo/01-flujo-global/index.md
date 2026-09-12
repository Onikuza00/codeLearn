# Flujo Global

> La base que necesita cualquier proyecto nuevo, sea una landing o una aplicación completa, antes de escribir una sola línea de código con ayuda de un agente de IA.

---

## Orden rápido

1. **Normas globales** — lo personal (decides una vez) y lo de proyecto (`AGENTS.md`/`CLAUDE.md`, se escribe en cada repo)
2. **OpenSpec**, solo si el proyecto lo necesita
3. **Hooks iniciales**, que automatizan lo que ya declaraste en el paso 1
4. **Skills de proyecto**, opcional, más adelante
5. **Normas personalizadas**, reglas técnicas concretas (ej. diseño) que no caben en el paso 1

## Por qué este orden

Cada paso depende del anterior — es **orden de dependencias**, el mismo principio por el que no testeas una función que todavía no has escrito:

- No puedes automatizar (hook) el cumplimiento de una regla que no existe todavía.
- No puedes montar OpenSpec sin haber decidido antes, en algún sitio, que este proyecto lo necesita.
- No puedes escribir un skill de un flujo que se repite si todavía no sabes qué flujos se van a repetir.

Por eso las reglas van primero: es el único elemento de la lista que no depende de nada más para funcionar. El agente lo lee solo, desde el primer mensaje, sin instalar ni activar nada.

!!! note "Lo que NO es un paso — ya viene de fábrica"
    Un servidor de memoria persistente (como [Engram](../02-engram/index.md)) y las herramientas MCP instaladas globalmente en tu máquina **no se configuran por proyecto**: ya funcionan en cuanto detectan en qué carpeta estás trabajando. Lo único que decides tú es si un hook las dispara solo (paso 3), o si las invocas a mano cuando haga falta.

---

## 1. Normas globales

Las reglas que decides una vez, en tu archivo personal (quién eres, cómo quieres que te traten, tu filosofía de colaboración, seguridad no negociable, herramientas globales, idioma) **y** lo que se escribe de cero en cada repo nuevo (`AGENTS.md`/`CLAUDE.md`: contexto, stack, convenciones, qué requiere tu confirmación). Detalle completo en [Normas globales](01-normas-globales/index.md).

---

## 2. OpenSpec

El criterio de **cuándo** proponerlo ya vive en el paso 1 (Normas globales, filosofía de colaboración) — es global, se aplica igual en cualquier proyecto nuevo. Lo que falta aquí es el **cómo**: qué es OpenSpec, cómo se configura y qué hace realmente. Detalle completo en [OpenSpec](02-openspec/index.md).

---

## 3. Hooks

Automatizan lo que ya declaraste en los pasos 1 y 2 — arranque de sesión, normas de diseño bajo demanda, lint/formato tras cada edición, y un intento de guardado antes de compactar/cerrar. Detalle completo, con la mecánica verificada de Claude Code, en [Hooks](03-hooks/index.md).

---

## 4. Skills de proyecto

La mayoría de los skills que vas a usar ya existen de forma global (en `~/.claude/skills/`) y no dependen del proyecto — están disponibles desde el primer día sin hacer nada. Un skill **específico** de un proyecto solo merece la pena cuando detectas un flujo que se repite tres veces o más de forma idéntica. Escribirlo el día 1, sin haber visto el flujo repetirse todavía, es adivinar — y normalmente adivinas mal la forma que debería tener.

---

## 5. Normas personalizadas

Reglas técnicas concretas y repetibles (normas de diseño y maquetación, por ejemplo) que no caben ni en el `AGENTS.md` general del paso 1 ni en ningún skill — viven en su propio archivo, y un hook o skill las lee cuando hace falta. Detalle completo, con la arquitectura del archivo y el patrón de lectura, en [Normas personalizadas](05-normas-personalizadas/index.md).

---

## Checklist del día 1

- [ ] Existe un `CLAUDE.md`/`AGENTS.md` en la raíz con contexto, stack, convenciones y qué requiere confirmación
- [ ] Está decidido si el proyecto usa OpenSpec — y si es que sí, `sdd-init` ya se ejecutó
- [ ] Los hooks mínimos (arranque de sesión, normas de guardado) están puestos y dan alguna señal visible al correr
- [ ] Ningún skill de proyecto todavía — se escribe cuando haga falta, no antes
- [ ] Ninguna norma técnica repetible quedó "sobreentendida" — o está en `AGENTS.md`, o tiene su propio archivo referenciado
