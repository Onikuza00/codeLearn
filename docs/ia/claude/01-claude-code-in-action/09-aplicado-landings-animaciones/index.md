# Aplicado a landing pages y animaciones { .bloque-ia }

> Todo lo anterior en la práctica: cómo configurar Claude Code para que te agilice de verdad el trabajo del día a día — maquetar landings, animar con GSAP, entregar rápido sin perder calidad.

---

## El CLAUDE.md de un proyecto de landing con GSAP {: .topic-title }

Un `CLAUDE.md` genérico no te sirve tanto como uno que refleje CÓMO trabajas tú. Ejemplo pensado para tu stack real (HTML/CSS/JS vanilla o Vue, GSAP con ScrollTrigger/SplitText/MatchMedia):

```markdown
## Stack
- Maquetación: HTML semántico + CSS con variables nativas (mobile-first, sin max-width salvo excepción)
- Animación: GSAP (ScrollTrigger, SplitText, MatchMedia, Lenis para scroll suave)
- Sin frameworks de CSS salvo que el proyecto ya use Tailwind

## Convenciones de animación
- Cada animación se registra en su propio archivo `animations/nombre-seccion.js`, no todo en un archivo gigante
- Usar `gsap.matchMedia()` para animaciones distintas en mobile/desktop — nunca duplicar timelines a mano con media queries de JS
- `ScrollTrigger.refresh()` después de cualquier cambio de layout dinámico (imágenes que cargan, fuentes)
- Nombrar los triggers con la clase de la sección: `.hero-trigger`, `.gallery-trigger`

## Verificación OBLIGATORIA antes de dar una animación por terminada
- Probar en mobile Y desktop (usa matchMedia, no solo redimensionar la ventana)
- Comprobar `prefers-reduced-motion` — las animaciones decorativas deben respetar esa media query
- Revisar el Performance tab si hay scroll con muchos elementos — nada de animar `width`/`top`/`left`, solo `transform`/`opacity`

## Cosas que NO hacer
- No uses `ScrollTrigger` sin `markers: true` durante el desarrollo — actívalos para depurar, desactívalos antes de entregar
- No animes con jQuery ni con transiciones CSS mezcladas con GSAP en el mismo elemento — un solo motor de animación por elemento
```

!!! tip "Este CLAUDE.md es el mismo por lo que ya sabes de la sección anterior"
    Corto, en listas, accionable — no una explicación de qué es GSAP (eso ya lo sabes). Ver [Un CLAUDE.md que se sigue de verdad](../03-claude-md/index.md) si quieres repasar por qué la brevedad importa más que la exhaustividad.

---

## Verificación visual — el punto débil real de este tipo de trabajo {: .topic-title }

Para lógica de backend, "corré los tests" alcanza. Para una landing con animaciones, el resultado importa **visualmente**, y eso es más difícil de verificar en automático. Formas concretas de cerrar esa brecha:

| Qué verificar | Cómo |
|---|---|
| Que la landing se vea bien en mobile y desktop | Pide explícitamente capturas de pantalla en ambos anchos (Claude Code puede usar herramientas de navegador si las tienes configuradas) |
| Que las animaciones no rompan el layout | Pide que revise el DOM después de que corran las animaciones (GSAP a veces deja `transform`/`opacity` residuales si falta un `.set()` de limpieza) |
| Que no haya jank/lag en scroll | Pide una revisión específica: ¿se está animando `transform`/`opacity` o propiedades que disparan reflow? |
| Que `prefers-reduced-motion` esté cubierto | Pide que liste qué animaciones NO están envueltas en esa media query |

!!! warning "\"Se ve bien\" sin captura no es verificación, es una opinión"
    Igual que en [Verificación y permisos](../04-verificacion-permisos/index.md): si la tarea es visual, la verificación tiene que ser visual también — una captura de pantalla real, no la afirmación de que "debería verse bien".

---

## Hooks útiles para este tipo de proyecto {: .topic-title }

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "npx prettier --write $CLAUDE_FILE_PATH" }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "echo \"$CLAUDE_TOOL_INPUT\" | grep -qE 'rm -rf|git push --force' && exit 1 || exit 0" }
        ]
      }
    ]
  }
}
```

- El primero formatea automáticamente cada archivo que Claude toca — nunca más "olvidé correr prettier antes de entregar".
- El segundo bloquea comandos destructivos comunes por accidente en medio de una sesión larga.

Ver [Hooks](../05-hooks/index.md) para el detalle de cómo funcionan los eventos.

---

## Rutinas que de verdad te ahorran tiempo {: .topic-title }

Casos concretos para tu tipo de trabajo (landings, entregas rápidas a clientes):

- **Scaffolding de sección nueva**: "Crea la estructura de una nueva sección `testimonios` siguiendo el patrón de `hero/` (HTML + CSS + animations/testimonios.js con ScrollTrigger)" — repetible entre proyectos, cada vez que agregas una sección nueva a una landing.
- **Checklist de entrega**: antes de mandar la landing al cliente, una rutina que revise: imágenes optimizadas, `prefers-reduced-motion` cubierto, sin `markers: true` olvidados, sin `console.log` sueltos.
- **Responsive audit**: "Revisa todas las secciones y decime cuáles no tienen `matchMedia` para mobile, si es que deberían tenerlo."

Ver [Automatización](../06-automatizacion/index.md) para cómo pasar esto de "algo que pides a mano" a un comando repetible en modo headless.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `CLAUDE.md` con TUS convenciones reales de GSAP/CSS, no genérico | Copiar un CLAUDE.md de ejemplo sin adaptarlo a cómo trabajas tú |
| Pide capturas/verificación visual explícita para cambios de UI | Confiar en "se ve bien" sin haberlo visto de verdad |
| Hook de formateo automático + bloqueo de comandos destructivos | Confiar en acordarte de correr prettier o de no hacer un `rm -rf` por error |
| Rutinas para lo que repites en cada proyecto (scaffolding, checklist de entrega) | Reescribir el mismo prompt largo cada vez que empiezas una sección nueva |
</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Claude Code in Action** | https://anthropic.skilljar.com/claude-code-in-action/486901 |
| 📘 **Documentación oficial de Claude Code** | https://docs.claude.com/claude-code |
