# 🎯 Próxima sesión

> Esta página se sobreescribe al final de cada sesión con el plan de la siguiente. No es historial — para eso está el registro diario (año → mes → semana) y `GOTCHAS.md` para el registro de fallos acumulado.

---

## Domingo 30/08 — Repaso final de Symfony desde 0 (12 h)

### Objetivo

Rehacer **todo** Symfony desde un proyecto nuevo, maquetando un **SaaS pequeño y elegante con Twig + Tailwind**: un **gestor de tareas** (dashboard con stats, lista responsive, CRUD completo, filtros) con una **página de contacto** como feature secundaria (para el ángulo de formulario + servicio de notificación). Profundidad sobre amplitud — una app redonda explicando cada línea, no un speed-run de cuatro temas.

> Decisión del agente (Pau dijo "nuse"): gestor de tareas como espina, no un formulario de contacto suelto. Un contact form es una *página*, no un SaaS — no ejercita lista/CRUD/dashboard/estados. El gestor de tareas sí, y encima es el redo desde 0 del primer bloque de Symfony (12/08), que es el repaso más limpio posible. El formulario de contacto entra como una pantalla más dentro de la app.

### Reglas

- **Proyecto nuevo aparte.** `symfony new` limpio (p. ej. `Backend/repaso-tareas/`). **No tocar `Backend/assessment/symfony/`** — ese código funciona y es la referencia para contrastar (mismo motivo por el que no se borró `Product` en S1).
- Sin IA en los ejercicios. Consultar teoría solo para dudas puntuales.
- Explicar cada decisión en voz alta antes de escribir.

### Bloques de ejercicios

En `assessment/symfony/ejercicios/` → card **"🔁 Repaso final desde 0 — gestor de tareas (SaaS)"** (5 sub-cards plegadas, ≥5 ejercicios cada una):

| Bloque | Contenido |
|---|---|
| **A — Setup + Entidades** | `symfony new`, `make:entity Task` (title, description `TEXT`, `status`/`priority` como enum PHP, `dueDate`, `createdAt` en constructor), constraints, 2ª entidad (`Project` o `Tag`) + relación `ManyToOne` / `OneToMany`, migraciones |
| **B — Controladores** | `make:controller`, CRUD entero (index / show / new / edit / delete), `EntityValueResolver` (404 auto), borrar con CSRF a mano, Repository con QueryBuilder (`findByStatus`, `findVencidas`, búsqueda `LIKE`) |
| **C — Formularios** | `TaskType` reutilizado crear+editar, flujo del controlador **línea a línea** (el hueco de S1), renderizado Twig (`form()` y `form_row`), opción propia en `configureOptions` (`is_edit` → `status` solo en edición), form sin `data_class` para el filtro por GET |
| **D — Servicios** | servicio a mano inyectado por type-hint (`TaskStats` para los contadores del dashboard), `#[Autowire]` escalar desde `.env`, servicio que usa otros (`TaskNotifier` con `MailerInterface` + `LoggerInterface`), Twig Extension (`fecha_relativa`, badge de prioridad), `RequestStack`, elegir implementación |
| **E — Capstone maquetación SaaS** | layout con nav/sidebar, dashboard con tarjetas de stats, lista de tareas responsive (grid de cards con badges de estado/prioridad, mobile-first, focus/hover), *empty states*, formulario elegante con errores por campo, la **página de contacto** como pantalla secundaria (form + `TaskNotifier`) |

### Últimas 2 h — curso de Claude API

Retomar en `gradeByModel()` (documentado en `docs/ia/claude/02-claude-api/08-evaluacion-prompts/`, sin implementar ni probar en `claude2.js`). Continuar después de "Calificación basada en modelos".

### Prep hecha el sábado 29 (por el agente)

- Card de ejercicios de los 5 bloques A–E.
- Reestructuración de `docs/assessment/`: un tema = una card, cada día = subcard plegada por defecto (JS y Symfony).

### Checkpoint que sigue abierto

El flujo del controlador `new`/`edit` **de memoria** — S1 quedó en 🔁 Repasar (salió entidad y estructura de `FormType`, se cayó la secuencia línea a línea del controlador). El **Bloque C** lo vuelve a machacar desde 0.

## ⚠️ Normas vigentes

- **Tailwind en ejercicios:** describir la intención visual con palabras ("título en semibold", "badge tipo píldora"), NUNCA pasar clases ni strings de `class="..."`. (`feedback_tailwind_no_pasar_clases`)
- **Docs — bloques PHP:** no escribir `<?php` en los ejemplos; el coloreado es global vía `startinline` en `mkdocs.yml`.
- **Daily log:** solo se documentan fallos **conceptuales** con su 🧠. Lo de apuntado/typo/naming/imports/media-corrección no se documenta.
- **Disciplina de Pau (detectada 29/08):** media corrección (arreglar una parte y dejar el resto), decir "así?/listo" sin releer ni guardar. Antídoto: enunciado línea a línea, tachando cada requisito.

## ⏳ Pendiente de fondo (sin cambios)

- **FUSTES ESTEBA:** sin novedades de la 2ª entrevista / prueba de pizarra.
- **VoraData:** vuelta el 1/09. Contrato parcial. Línea dura: no renunciar a la ayuda hasta contrato firmado con horas + tarifa (fecha límite 3/09).
- **Servicios (card S1–S12):** S1 hecho (🔁), S2 (`SlugGenerator`) casi cerrado. S8/S10/S11 (cliente API, varias implementaciones, `RequestStack`) no los cubre el formulario de contacto — pescarlos si sobra tiempo.
- **JS:** hueco de `fetch`/Promises/async-await sigue abierto, antes de React.
- **Fallos DOM acumulados:** ver `GOTCHAS.md` y `repaso-urgente-js.md`. Sesión estrecha de repaso pendiente.
