# Rutinas, modo headless y GitHub Actions { .bloque-ia }

> Todo lo visto hasta ahora asume que hay alguien mirando la conversación. El siguiente paso es sacar a Claude Code de la interfaz interactiva y meterlo en un script, un cron o un pipeline — para tareas que se repiten y no necesitan que estés presente cada vez.

---

## Modo headless — Claude Code sin interfaz {: .topic-title }

El flag `-p` (print) ejecuta un prompt de una vez y termina, sin abrir la sesión interactiva — ideal para scripts:

```bash
claude -p "Revisa los tests que fallan en CI y arréglalos"
```

Para integrarlo en otro programa, la salida en JSON es más fácil de parsear que texto libre:

```bash
claude -p "Resume los cambios de este PR en una frase" --output-format json
```

!!! tip "Headless es la base de todo lo demás en esta sección"
    Una rutina automatizada, un GitHub Action, un cron job — todos son, en el fondo, "correr `claude -p` con el prompt correcto en el momento correcto". Si el prompt funciona bien a mano en modo headless, ya tienes el 80% del trabajo de automatizarlo.

---

## Rutinas — tareas que se repiten {: .topic-title }

Una rutina es un prompt (o secuencia de prompts) que corres regularmente porque el trabajo es repetitivo pero no idéntico cada vez — necesita criterio, no solo un script fijo. Ejemplos típicos:

- Revisar issues nuevos y etiquetarlos según su contenido.
- Generar un resumen diario de los cambios del repositorio.
- Detectar dependencias desactualizadas y abrir un PR con la actualización.

```bash
# Ejemplo: cron job que corre cada mañana
0 8 * * * cd /ruta/proyecto && claude -p "Revisa las dependencias desactualizadas y abre un PR si hay alguna con vulnerabilidad conocida"
```

!!! warning "Una rutina automatizada necesita permisos y verificación más estrictos que una sesión interactiva"
    Nadie está ahí para cortar a mitad de camino si algo va mal. Combina esto con lo visto en [Verificación y permisos](../04-verificacion-permisos/index.md) — una rutina sin verificación automática es una rutina a ciegas.

---

## GitHub Actions y revisión de código {: .topic-title }

Claude Code se puede invocar directamente desde GitHub Actions, para que reaccione a eventos del repositorio: un PR nuevo, un comentario, una etiqueta.

```yaml
# .github/workflows/claude-review.yml
name: Claude Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "Revisa este PR: busca bugs, problemas de seguridad y código que no siga las convenciones de CLAUDE.md. Deja los comentarios directamente en el PR."
```

Casos de uso típicos:

| Disparador | Qué puede hacer Claude |
|---|---|
| PR abierto/actualizado | Revisar el diff y dejar comentarios de code review |
| Comentario con `@claude` en un issue/PR | Responder, investigar, o incluso hacer un cambio y abrir un commit |
| Issue nuevo | Triaje automático: etiquetar, pedir información que falta, o intentar reproducir el bug |

!!! danger "Un Action con permisos amplios en un repo compartido es zona de riesgo"
    Dale al workflow solo los permisos que realmente necesita (lectura de PR, escritura de comentarios) — no acceso general de escritura al repo salvo que el caso de uso lo requiera de verdad, y siempre con revisión humana antes de mergear nada que haya tocado código.

---

## De interactivo a automatizado: la progresión natural {: .topic-title }

1. Lo haces a mano, en una sesión interactiva, hasta que el prompt te da resultados consistentes.
2. Lo pasas a modo headless (`claude -p`) y lo corres manualmente cuando hace falta.
3. Lo metes en un cron/rutina para que corra solo, con verificación automática.
4. Si depende de eventos del repo (PRs, issues), lo conectas a GitHub Actions.

No saltes directo al paso 4 sin haber validado el prompt en los pasos anteriores — automatizar algo que no probaste a mano solo automatiza el error, no el trabajo.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Routines and Headless / GitHub Actions** | https://anthropic.skilljar.com/claude-code-in-action/486901 |
| 📘 **Documentación oficial de Claude Code — Modo headless** | https://docs.claude.com/claude-code |
| 📘 **claude-code-action (GitHub)** | https://github.com/anthropics/claude-code-action |
