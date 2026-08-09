# Un CLAUDE.md que se sigue de verdad { .bloque-ia }

> `CLAUDE.md` es el archivo que Claude Code carga automáticamente al arrancar en un proyecto. La diferencia entre uno que funciona y uno que se ignora no es cuánto escribes — es qué tan bien está escrito.

---

## Qué es y dónde vive {: .topic-title }

```
mi-proyecto/
├── CLAUDE.md          ← se lee siempre que trabajas en este proyecto
└── src/
```

También existe un `CLAUDE.md` **personal**, fuera de cualquier proyecto (en tu carpeta de usuario), que se aplica a TODAS tus sesiones — instrucciones tuyas como persona, no del proyecto. Los dos se cargan juntos: el personal para "cómo te gusta trabajar a ti", el de proyecto para "cómo funciona este proyecto en concreto".

---

## Por qué un CLAUDE.md largo no funciona mejor {: .topic-title }

Es tentador volcar ahí toda la documentación del proyecto. El problema: cuanto más largo, más se diluye lo importante entre lo accesorio, y más probable que Claude le preste menos atención a una instrucción puntual perdida en el medio.

!!! danger "Un CLAUDE.md de 2000 líneas es peor que uno de 200"
    No es una cuestión de "más contexto es mejor" — es una cuestión de señal/ruido. Si todo es importante, nada lo es. Guarda ahí lo que Claude necesita saber SIEMPRE que toca este proyecto — no la documentación completa (esa puede vivir en `docs/` y Claude la lee cuando la necesita).

---

## Qué va adentro {: .topic-title }

| Sección | Ejemplo |
|---|---|
| Comandos para correr | `npm test`, `npm run build`, cómo levantar el entorno local |
| Convenciones de código | Estilo, naming, patrones que se esperan (y los que NO) |
| Estructura del proyecto | Dónde vive cada cosa, para no tener que explorar de cero cada vez |
| Cosas que romper cuesta caro | "Nunca toques `migrations/` a mano", "no uses `git push --force`" |
| Cómo verificar el trabajo | Qué comando correr para confirmar que algo funciona antes de darlo por hecho |

```markdown
## Comandos
- `npm run dev` — servidor de desarrollo
- `npm test` — tests unitarios (correr SIEMPRE antes de dar una tarea por terminada)

## Convenciones
- TypeScript estricto, sin `any`
- Componentes funcionales, no clases
- Tests junto al archivo que testean (`Button.tsx` + `Button.test.tsx`)

## Cuidado con
- `src/legacy/` es código heredado, no lo toques salvo que la tarea lo pida explícitamente
```

---

## Estructura que Claude sigue mejor {: .topic-title }

- **Listas y encabezados**, no párrafos largos — Claude (como cualquier lector) escanea mejor una lista con viñetas que un bloque de texto corrido.
- **Instrucciones accionables**, no descripciones — "corre `npm test` antes de terminar" se sigue más que "es importante que el código funcione".
- **Sin contradicciones** entre secciones — si una parte dice "usa comillas simples" y otra "usa comillas dobles", Claude tiene que adivinar cuál vale.

!!! tip "Trátalo como onboarding para una persona nueva, no como documentación técnica completa"
    La pregunta útil para decidir si algo va en `CLAUDE.md` es: *¿esto es lo que le contarías a alguien el primer día, antes de que toque una sola línea?* Si la respuesta es sí, va ahí. Si es "esto lo puede buscar cuando lo necesite", va en `docs/`.

---

## Mantenlo vivo {: .topic-title }

Un `CLAUDE.md` que no se actualiza se vuelve mentira con el tiempo — dice cosas que ya no son ciertas del proyecto, y eso es peor que no tener nada, porque Claude confía en él. Cuando cambies una convención importante, actualízalo en el mismo cambio, no "después".

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Instrucciones cortas, accionables, en listas | Párrafos largos explicando el "por qué" filosófico |
| Solo lo que hace falta SIEMPRE | Volcar toda la documentación del proyecto ahí |
| Actualizarlo cuando cambia una convención | Dejar que quede desactualizado y silenciosamente incorrecto |
| Un CLAUDE.md personal para tus preferencias de trabajo | Repetir tus preferencias personales en cada proyecto |
</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — A CLAUDE.md That Follows** | https://anthropic.skilljar.com/claude-code-in-action/486901 |
| 📘 **Documentación oficial de Claude Code — Memoria** | https://docs.claude.com/claude-code |
