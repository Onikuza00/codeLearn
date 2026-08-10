# Habilidades de verificación y modos de permiso { .bloque-ia }

> Dos piezas que van juntas: cuánta autonomía le das a Claude (permisos) y cómo comprueba que lo que hizo funciona de verdad (verificación). Cuanta más autonomía, más importa la segunda parte.

---

## Verification Skills — que Claude compruebe su propio trabajo {: .topic-title }

Por defecto, Claude "cree" que terminó cuando el código tiene buena pinta. Enseñarle a verificar significa darle una forma **objetiva** de comprobarlo — no que se lo pregunte a sí mismo, que corra algo que da un resultado claro.

```
❌ "Arregla el formulario de contacto"
   (Claude edita, dice "listo", nadie comprobó nada)

✅ "Arregla el formulario de contacto. Cuando termines, corre
   npm test -- contacto y pega el resultado antes de decir que
   está resuelto."
```

| Tipo de verificación | Cómo se ve |
|---|---|
| Tests automáticos | `npm test`, `pytest`, el comando que use tu proyecto |
| Tipos | `tsc --noEmit`, comprobación estática sin ejecutar nada |
| Linter | `eslint .`, detecta problemas de estilo y errores comunes |
| Build | `npm run build` — si compila, al menos no está roto de raíz |
| Visual | Capturas de pantalla o inspección en navegador para cambios de UI |

!!! danger "\"Debería funcionar\" no es verificación"
    Un mensaje tipo "he actualizado la función, esto debería resolver el problema" sin haber corrido nada es una promesa, no una comprobación. La habilidad de verificación es precisamente convertir esas promesas en hechos comprobables — correr el comando y mostrar el resultado real.

!!! tip "Documenta el comando de verificación en CLAUDE.md una sola vez"
    Si `CLAUDE.md` dice "corre `npm test` antes de dar cualquier tarea por terminada", no tienes que repetirlo en cada prompt — se vuelve parte del flujo normal de trabajo del proyecto.

---

## Permission Modes — cuánta autonomía darle {: .topic-title }

Claude Code no ejecuta cualquier cosa sin más — cada acción (editar un archivo, correr un comando) pasa por un modo de permisos que decide si te pregunta antes o no.

| Modo | Qué hace | Cuándo usarlo |
|---|---|---|
| **Default** | Pide confirmación antes de acciones con efecto (editar, ejecutar comandos) | El modo normal para trabajo del día a día |
| **Plan** | Solo investiga y propone un plan — no toca nada hasta que lo apruebas | Tareas ambiguas o de alto impacto, antes de dejarlo escribir código |
| **Accept edits** | Acepta ediciones de archivo automáticamente, sigue preguntando para comandos | Cuando confías en los cambios de código pero quieres control sobre lo que se ejecuta |
| **Bypass permissions** | No pregunta nada — ejecuta todo sin confirmación | Solo en entornos aislados/sandboxeados, nunca en tu máquina con acceso real |

!!! danger "El modo sin confirmaciones NO es para uso normal"
    Saltarse las confirmaciones tiene sentido en un contenedor descartable o una VM aislada donde un error no puede hacer daño real — nunca en un entorno con acceso a tus credenciales, tu red o datos reales. Si lo activas, es porque el propio entorno ya te protege, no porque confíes ciegamente en el modelo.

Puedes fijar el modo por defecto en la configuración del proyecto, o cambiarlo puntualmente al lanzar una sesión. La lógica general: **más autonomía requiere más barandillas alrededor** (sandboxing, revisión posterior, tests) — no al revés.

---

## Cómo se relacionan {: .topic-title }

Cuanto más permisivo el modo, más importa que la verificación sea automática y objetiva — si le das accept-edits o bypass y no hay tests/comandos de verificación configurados, estás confiando a ciegas. La combinación segura para trabajo autónomo real es: **modo permisivo + verificación automática obligatoria en CLAUDE.md**, no una sin la otra.

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Pide un comando de verificación real, no una opinión | Aceptar "debería funcionar" como si fuera una prueba |
| Sube el nivel de permisos solo cuando la verificación ya es sólida | Dar bypass de permisos "para ir más rápido" sin red de seguridad |
| Usa modo plan para decisiones de alto impacto | Usar bypass en tu máquina real, con acceso a credenciales reales |
</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Verification Skills / Permission Modes** | https://anthropic.skilljar.com/claude-code-in-action/486901 |
| 📘 **Documentación oficial de Claude Code** | https://docs.claude.com/claude-code |
