# Normas globales

> Todo lo que hace falta definir antes de tocar una sola línea de código con ayuda de un agente de IA: lo que decides una vez para siempre (tu archivo personal) y lo que se escribe de cero en cada repo nuevo (`AGENTS.md`).

---

## Mapa de archivos

| Archivo | Dónde vive | Alcance | ¿Portable entre herramientas? |
|---|---|---|---|
| Config global personal | Tu máquina, fuera de cualquier repo (`~/.claude/CLAUDE.md` en Claude Code; cada herramienta tiene su propio sitio) | **Todos** tus proyectos, para siempre | No — cada herramienta lo guarda a su manera |
| `AGENTS.md` | Raíz de **cada** repo, versionado en git | Ese proyecto concreto | Sí — estándar abierto, lo leen 20+ herramientas |
| `CLAUDE.md` de proyecto | Raíz del repo | Ese proyecto, solo si usas Claude Code | No — es propio de Claude Code |

---

## Parte 1 — Lo personal

### 1. Quién eres y tu contexto

El agente calibra sus explicaciones según lo que sabe de ti. Sin esto, asume un nivel medio y acierta a medias.

**Recomendación:** rol profesional, años de experiencia, stack principal, y — igual de importante — qué NO dominas todavía. No sirve "soy desarrollador"; sirve "junior backend en un framework concreto, sin experiencia real en frontend".

??? example "Ejemplo de instrucción"
    ```markdown
    **Sobre mí**
    Soy desarrollador backend júnior, con 2 años de experiencia
    profesional. Stack principal: un framework de PHP y JavaScript
    vanilla. Tengo poca experiencia real con frameworks de frontend,
    librerías de animación o testing automatizado — avísame si una
    tarea da por hecho que ya domino esto.
    ```

!!! tip "Cuanto más específico, menos genérica la respuesta"
    "Sé breve" no dice nada accionable. "Respuestas de máximo 3 frases salvo que pida detalle" sí. La regla vaga se ignora porque no hay nada que verificar; la regla concreta se puede comprobar con un vistazo.

### 2. Cómo quieres que te traten

Tono, cuánto detalle, y cuántas preguntas hace antes de actuar.

**Recomendación:** decide explícitamente si prefieres que pregunte una cosa a la vez y espere respuesta, o que resuelva la ambigüedad por su cuenta y te avise después. Decide también la verbosidad por defecto — corta y directa, o explicada paso a paso — y si quieres que evite resúmenes finales de lo que ya se ve en el propio cambio.

??? example "Ejemplo de instrucción"
    ```markdown
    **Estilo de comunicación**
    - Haz como máximo una pregunta a la vez y espera mi respuesta.
    - Respuestas cortas y directas por defecto. Amplía solo si pido
      más detalle.
    - No resumas al final de una respuesta lo que acabas de hacer —
      ya lo veo en el diff o en el propio archivo.
    ```

!!! tip "Los ejemplos negativos valen más que los positivos"
    "No repitas al final lo que ya hiciste" corrige un hábito concreto. "Sé claro" no corrige nada porque no señala qué está mal ahora mismo.

### 3. Filosofía de colaboración

Si el agente actúa en piloto automático o si te hace pensar antes de escribir código.

**Recomendación:** decláralo por defecto, y ten en cuenta que puede variar según el proyecto — en código de producción real puede tener sentido más autonomía con revisión tuya después; en un proyecto donde el objetivo es que aprendas, el criterio es el contrario: que explique el concepto y te deje intentarlo antes de dar la solución.

Aquí también va el criterio de **cuándo usar SDD** — no la respuesta para cada proyecto (esa va en el `AGENTS.md` de cada repo, más abajo), sino el método para llegar a esa respuesta sin tener que reexplicarlo cada vez:

- **Sí conviene SDD** si el cambio típico tiene usuarios/pantallas nuevas, casos borde no triviales, puede tardar más de una sesión, o un error sale caro.
- **No hace falta** (o solo la versión reducida) si es un ajuste de configuración/arquitectura que sigue un patrón ya existente y probado a mano.

??? example "Ejemplo de instrucción"
    ```markdown
    **Modo de colaboración**
    Modo por defecto: pareja de nivel senior. Puedes actuar con
    autonomía razonable en código de producción, pero explica
    cualquier decisión de arquitectura que no sea obvia antes de
    implementarla.

    En cualquier repositorio explícitamente marcado como proyecto de
    aprendizaje: cambia a modo mentor. Explica el concepto primero,
    déjame intentarlo yo, y da la solución completa solo si la pido
    una segunda vez.

    **Cuándo proponer SDD en un proyecto nuevo**
    Evalúa si el cambio típico de este proyecto tiene usuarios,
    pantallas o casos borde no triviales. Si es así, propón el ciclo
    completo de SDD. Si son ajustes de configuración que siguen un
    patrón ya existente, no lo propongas — es sobrecarga innecesaria.
    ```

!!! tip "Nombra el patrón, no solo la regla"
    Pedir que el agente nombre el principio detrás de cada sugerencia ("esto es un early return", "esto es una condición de carrera") convierte cada respuesta en una lección reutilizable, no solo en código que copias sin entender por qué funciona.

### 4. Reglas de seguridad no negociables

Las que aplican en TODOS tus proyectos, sin excepción, independientemente del stack.

**Recomendación mínima:**

- Nunca `push --force`, `reset --hard` ni borrar ramas sin que tú lo pidas explícitamente
- Nunca saltarse hooks o verificaciones (`--no-verify` y similares) sin pedirlo tú
- Confirmar contigo antes de cualquier acción irreversible o que afecte a algo fuera de tu máquina
- Nunca commitear secretos, aunque el archivo parezca inofensivo por el nombre

??? example "Ejemplo de instrucción"
    ```markdown
    **Reglas de seguridad no negociables**
    - Nunca ejecutes `git push --force`, `git reset --hard` ni borres
      una rama sin mi confirmación explícita en esta conversación.
    - Nunca te saltes hooks o verificaciones (`--no-verify` y
      similares) salvo que yo lo pida explícitamente.
    - Nunca hagas commit de un archivo que pueda contener secretos,
      aunque el nombre parezca inofensivo — revisa el contenido antes.
    ```

!!! danger "Estas reglas no se negocian por comodidad puntual"
    Son las que evitan que una tarea rutinaria se convierta en un incidente. No las flexibilices "solo por esta vez" — la excepción de hoy es el hábito de mañana.

### 5. Herramientas instaladas globalmente

Qué tienes siempre disponible en tu máquina, para que el agente no intente reinstalar algo que ya existe ni asuma que falta.

**Recomendación:** lista el gestor de paquetes que usas, los CLIs de uso frecuente, y cualquier servidor de memoria/contexto persistente que tengas configurado. Indica también cómo verificar que algo está instalado antes de instalarlo de nuevo — evita reinstalaciones innecesarias y conflictos de versión.

??? example "Ejemplo de instrucción"
    ```markdown
    **Herramientas instaladas**
    - Gestor de paquetes: pnpm. No sugieras npm ni yarn salvo que el
      proyecto ya use uno de los dos.
    - Hay un servidor de memoria/contexto persistente disponible de
      forma global — consúltalo antes de asumir que no hay contexto previo.
    - Verifica que un CLI existe (`--version`) antes de proponer instalarlo.
    ```

!!! note "Esto no se configura por proyecto"
    Un servidor de memoria persistente (tipo `engram`) y las herramientas MCP instaladas globalmente **ya funcionan** en cuanto detectan en qué carpeta estás trabajando. Lo único que decides tú es si un hook las dispara solo, o si las invocas a mano cuando haga falta.

### 6. Idioma y forma de comunicación

**Recomendación:** idioma y variante en la que quieres la conversación, y si el código/comentarios deben ir en un idioma distinto al de la conversación (lo habitual: conversar en tu idioma, código y comentarios en inglés, por convención internacional).

??? example "Ejemplo de instrucción"
    ```markdown
    **Idioma**
    - Conversación: responde en español de España (tú/vosotros).
    - Código, comentarios, mensajes de commit y contenido técnico
      de archivos: en inglés, salvo que pida explícitamente lo contrario.
    ```

---

## Parte 2 — Lo de proyecto

### Cómo interactúa con Claude

Dato verificado contra la documentación oficial de Claude Code: **no lee `AGENTS.md` de forma nativa**. Cita textual: *"Claude Code reads `CLAUDE.md`, not `AGENTS.md`"*.

Por eso la relación entre los dos archivos no es automática — hay que declararla tú, con una línea de import dentro de `CLAUDE.md`:

```markdown
@AGENTS.md
```

Con eso, el flujo queda así:

```
AGENTS.md  (fuente de verdad, lo lee todo el mundo)
     ↑
     │ @AGENTS.md (import)
     │
CLAUDE.md  (solo esta línea, más overrides específicos de Claude si hacen falta)
```

Cualquier otra herramienta (Cursor, Codex, etc.) lee `AGENTS.md` directamente, sin necesidad de nada más — el import solo hace falta para que Claude Code también lo respete.

!!! tip "El import no ahorra contexto"
    `@AGENTS.md` no es una referencia perezosa: el contenido completo se carga igual al arrancar sesión, como si estuviera escrito directo en `CLAUDE.md`. La única ventaja real es no mantener el mismo contenido duplicado en dos sitios.

!!! warning "En Windows, el import es la única opción real"
    La alternativa a importar es un symlink (`CLAUDE.md → AGENTS.md`), pero en Windows requiere permisos de administrador para crearlo. El import (`@AGENTS.md`) no es una segunda alternativa aquí — es la única práctica.

### Cómo se hace desde cero

1. **Crear el archivo en la raíz del repo:** `AGENTS.md`, en texto plano, sin plantilla previa.
2. **Rellenar las secciones mínimas** — contexto, stack y comandos, convenciones, reglas de git, qué requiere tu confirmación, seguridad, y si usa SDD/OpenSpec (detalle de cada una en la tabla de abajo).
3. **Crear `CLAUDE.md` en la misma raíz**, con una única línea: `@AGENTS.md`.
4. **Verificarlo:** pide al agente que resuma el proyecto sin haber leído nada más que ese archivo. Si acierta el contexto, el stack y las reglas de confirmación, el archivo cumple su función.
5. **Vigilar el tamaño:** si `AGENTS.md` supera las ~200 líneas, es señal de que hay detalle que debería vivir en otro sitio (documentación técnica del proyecto), no en las reglas del agente.

| Sección | Qué lleva | Ejemplo de regla accionable |
|---|---|---|
| Contexto | Qué es el proyecto, para quién, en qué estado | "Es una API REST en producción, con usuarios reales" |
| Stack y comandos | Lenguaje, framework, cómo instalar/testear/levantar | `npm install` · `npm test` · `npm run dev` |
| Convenciones de código | Naming, estilo, estructura de carpetas | "Componentes en `PascalCase`, un componente por archivo" |
| Reglas de git | Formato de commits, qué requiere revisión | "Conventional commits. Nunca `--force` sin permiso explícito" |
| Confirmación humana | Qué acción NO debe tomar el agente sin preguntar | "Nunca hacer `push`, `merge` ni borrar ramas sin que lo pida una persona" |
| Seguridad no negociable | Reglas de este proyecto concretas, no generales | "Las claves de API viven en `.env`, nunca en el código ni en el frontend" |
| SDD/OpenSpec (si aplica) | Si este proyecto usa esa metodología, y dónde | "Los cambios de arquitectura se registran en `openspec/changes/`" |

??? example "Esqueleto mínimo"
    ```markdown
    # AGENTS.md

    **Contexto**
    [Qué es el proyecto, quién lo usa, en qué estado está]

    **Stack y comandos**
    - Instalar: `...`
    - Test: `...`
    - Levantar: `...`

    **Convenciones**
    - [Regla concreta 1]
    - [Regla concreta 2]

    **Git**
    - [Formato de commits]
    - [Qué requiere revisión]

    **Requiere confirmación humana**
    - [Acción 1]
    - [Acción 2]

    **Seguridad**
    - [Regla concreta de este proyecto]
    ```

!!! tip "Si una convención es técnica y se repite mucho, no la metas entera aquí"
    Una regla concreta y técnica que se va a citar en cada tarea del mismo tipo (normas de diseño, por ejemplo) merece su propio archivo en vez de vivir dentro de las `**Convenciones**` de arriba — ver [Normas personalizadas](../05-normas-personalizadas/index.md). El `AGENTS.md` entonces solo enlaza a ese archivo, no repite la regla.

---

## Checklist

- [ ] Tu contexto (rol, stack, nivel, lo que no dominas) está escrito, no implícito
- [ ] Definiste cuánto pregunta el agente antes de actuar y cuánto detalle da por defecto
- [ ] Declaraste el modo de colaboración por defecto y el criterio de cuándo proponer SDD
- [ ] Las reglas de seguridad no negociables están escritas como acciones concretas, no como principios
- [ ] Tus herramientas globales están listadas, para que no se reinstale nada que ya tienes
- [ ] Idioma de conversación y de código están definidos por separado
- [ ] `AGENTS.md` existe en la raíz de cada repo, versionado en git
- [ ] `CLAUDE.md` de cada proyecto contiene solo `@AGENTS.md` (y overrides propios de Claude, si hacen falta)
- [ ] Ninguna regla personal de la Parte 1 está repetida en el `AGENTS.md` de un proyecto
- [ ] Cada `AGENTS.md` se mantiene por debajo de ~200 líneas
