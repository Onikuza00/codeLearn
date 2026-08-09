# Dirigir sesiones largas { .bloque-ia }

> Una sesión larga con Claude Code no es "un prompt gigante" — es una conversación de trabajo que puede durar horas y decenas de acciones. Dirigirla bien es la diferencia entre delegar de verdad y tener que revisar cada línea.

---

## El problema que resuelve {: .topic-title }

Con prompts cortos, corregís sobre la marcha: si Claude se desvía, lo ves enseguida y lo redirigís. En una sesión larga y semi-autónoma eso no pasa — para cuando revisás, ya hizo 30 cambios sobre una premisa equivocada. Dirigir bien significa reducir esa ventana de desvío, no eliminarla del todo.

---

## Dale contexto ANTES de que lo necesite {: .topic-title }

La regla de oro: todo lo que Claude tendría que preguntar, dáselo de entrada. Cada pregunta que no le hiciste falta es una vuelta menos, pero cada suposición que hizo en tu lugar es un riesgo.

```
❌ "Arregla el bug del login"

✅ "Arregla el bug del login: al meter una contraseña incorrecta 3 veces
   seguidas, el formulario se congela en vez de mostrar el mensaje de
   error. Está en src/auth/. Los tests relevantes son
   auth.test.ts — corrélos antes y después del cambio."
```

!!! tip "Un CLAUDE.md bien escrito hace la mitad de este trabajo por ti"
    Si el proyecto ya tiene documentadas sus convenciones, comandos y estructura en `CLAUDE.md`, no tienes que repetirlas en cada prompt — Claude las lee solo. Ver [Un CLAUDE.md que se sigue de verdad](../03-claude-md/index.md).

---

## Divide en checkpoints, no en un solo salto {: .topic-title }

Para una tarea grande, no le pidas "hazlo todo" de una — dale una tarea, revisa el resultado, y recién ahí la siguiente. El coste de revisar en 4 puntos de control es mucho menor que el de deshacer 4 tareas mal encadenadas.

```
❌ "Migra toda la app de JavaScript a TypeScript"

✅ "Paso 1: migra solo src/utils/ a TypeScript y verifica que
   los tests pasen. Cuando termines, paro yo a revisar antes
   de seguir con el resto."
```

Para tareas con varios pasos, pídele explícitamente que use su lista de tareas interna (`TodoWrite`) — así ves el plan antes de que empiece a ejecutar, y puedes cortar si el enfoque no te convence.

---

## Usa el modo plan para tareas ambiguas {: .topic-title }

Antes de dejar que Claude toque código en una tarea compleja o poco clara, pídele (o activa) el **modo plan**: primero investiga y propone un plan, sin escribir ni un archivo, y lo apruebas o lo corriges tú. Es mucho más barato corregir un plan mal enfocado que un cambio ya hecho.

!!! tip "El modo plan es tu punto de control más barato"
    Corregir texto ("no, así no, mejor así") cuesta segundos. Corregir código ya escrito cuesta revisar diffs, revertir, y volver a explicar. Si la tarea tiene más de un camino posible, pasa primero por el plan.

---

## Corrige el rumbo, no solo el resultado final {: .topic-title }

Si notas que Claude está yendo por un camino que no quieres, interrúmpelo ahí — no dejes que termine "para ver qué sale" y después corregir. Cuanto más lejos llegue por el camino equivocado, más contexto arrastrado por ese error va a tener el resto de la sesión.

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Corta apenas notes que se desvió | Dejar que "termine igual" para revisar al final |
| Da contexto completo por adelantado | Dejar que adivine detalles importantes |
| Divide tareas grandes en checkpoints revisables | Pedir una tarea enorme de una sola vez |
| Usa modo plan cuando hay ambigüedad real | Usar modo plan para todo — para tareas triviales solo frena |
</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Steering Long Sessions** | https://anthropic.skilljar.com/claude-code-in-action/486901 |
| 📘 **Documentación oficial de Claude Code** | https://docs.claude.com/claude-code |
