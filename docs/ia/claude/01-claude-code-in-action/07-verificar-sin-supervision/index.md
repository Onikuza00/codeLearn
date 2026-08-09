# Confiar en ejecuciones sin supervisión { .bloque-ia }

> Una vez que automatizaste una rutina (sección anterior), aparece la pregunta real: ¿cómo sabes si puedes confiar en lo que hizo mientras no mirabas? "Corrió sin errores" no es lo mismo que "hizo lo correcto".

---

## El problema de fondo {: .topic-title }

En una sesión interactiva, la confianza se construye en tiempo real: ves cada paso, cortas si algo se desvía. En una ejecución sin supervisión, esa red de seguridad no existe — la confianza tiene que estar construida **de antemano**, en cómo diseñaste el sistema, no en la vigilancia del momento.

---

## Capas de confianza, de más a menos costosa {: .topic-title }

| Capa | Qué aporta |
|---|---|
| **Aislamiento** (sandbox, contenedor, VM descartable) | Si algo sale mal, el daño queda contenido ahí — no toca tu sistema real |
| **Verificación automática** (tests, linter, build) | Un resultado objetivo de si el trabajo cumple lo mínimo, sin que nadie lo revise a mano |
| **Revisión de diffs antes de aplicar** | Ver QUÉ cambió, no solo si "pasó" — a veces algo pasa los tests y aun así está mal |
| **Gates de CI** | Que nada se mergee a la rama principal sin pasar por pipelines automáticos |
| **Registro/auditoría** | Poder reconstruir después qué hizo y por qué, si algo falla más adelante |

Ninguna capa sola alcanza — se combinan. Aislamiento sin verificación te protege del desastre pero no te dice si el trabajo sirve. Verificación sin aislamiento te dice si sirve pero no te protege de un desastre real si algo se ejecuta mal.

---

## Git worktrees: aislar sin perder el repo real {: .topic-title }

Una técnica concreta para dar autonomía sin arriesgar tu working tree principal: correr la sesión automatizada en un **git worktree** aparte (una copia de trabajo del mismo repo, en otra carpeta, en otra rama). Si el resultado es bueno, lo mergeas. Si no, lo descartas sin que haya tocado tu rama de trabajo actual.

```bash
git worktree add ../mi-proyecto-automatizado -b feature/limpieza-automatica
cd ../mi-proyecto-automatizado
claude -p "Limpia el código muerto de src/legacy/, corre los tests, y confirma que siguen pasando"
```

---

## Revisa el diff, no solo el resultado declarado {: .topic-title }

```
❌ Confiar en: "Listo, arreglé el bug y los tests pasan ✅"

✅ Revisar: git diff antes de aceptar — ¿el cambio tiene sentido con
   lo que pediste, o "pasó los tests" de una forma rara (por ejemplo,
   modificando el test en vez del código)?
```

!!! danger "Pasar los tests no es lo mismo que resolver el problema"
    Un cambio puede hacer que los tests pasen sin resolver el problema real — por ejemplo, si el propio test tenía el bug, o si el cambio evita el caso de prueba en vez de arreglar la causa. Revisar el diff, no solo el resultado del comando, es la única forma de detectar esto.

---

## Construye confianza de forma incremental {: .topic-title }

No pases de "reviso cada acción" a "corre sola en producción" de un salto. La progresión razonable:

1. Corre supervisado varias veces, con el mismo tipo de tarea.
2. Corre sin supervisión, pero en un entorno aislado (worktree, sandbox) y revisas el resultado antes de aplicar.
3. Automatizas la aplicación de resultados que pasan TODAS las verificaciones automáticas, pero sigues revisando una muestra.
4. Solo confías plenamente en tareas acotadas y bien verificadas — nunca "todo, siempre, sin mirar".

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Aísla las ejecuciones sin supervisión (worktree, sandbox) | Dejar que una rutina automática toque tu working tree principal directo |
| Revisa el diff, no solo si "pasó" | Confiar en el resumen que Claude da de su propio trabajo sin comprobarlo |
| Sube la autonomía de forma incremental | Pasar de supervisión total a cero supervisión de un salto |
| Guarda registro de qué corrió y cuándo | Perder la trazabilidad de qué hizo una ejecución automática |
</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Trust It: Verifying Unsupervised Runs** | https://anthropic.skilljar.com/claude-code-in-action/486901 |
| 📘 **Documentación oficial de Claude Code** | https://docs.claude.com/claude-code |
