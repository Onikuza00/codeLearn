# 🎯 Próxima sesión

> Esta página se sobreescribe al final de cada sesión con el plan de la siguiente. No es historial — para eso está el registro diario (año → mes → semana) y `GOTCHAS.md` para el registro de fallos acumulado.

---

## Estado tras el miércoles 23/09

**Repaso urgente de DOM, segunda sesión.** Seis ejercicios de `dia-19-dom` hechos con corrección sobre el código real: `filtrarPorNombreOCategoria`, `activarStepperConLimite`, `validarPrecioEnRango`, `validarTelefonoExacto`, `activarFiltroCategorias` y `moverAbajo`. Detalle, con una card por fallo, en el [registro del miércoles 23](/waytoCode/2026/09/semana-3/2026-09-23/).

Lo que más se repitió: `includes` con los papeles al revés, el parámetro del listener tratado como elemento (es el **evento**), lo que cambia en cada evento leído fuera del listener, `&&` en vez de `||` e `insertBefore` con el orden invertido. Los tests de los seis y los cuatro del lunes siguen **sin confirmar en el navegador**.

Teoría nueva: [Métodos básicos](/js/01-basico/08-metodos-basicos/) (números y strings, por categoría con ejemplos).

---

## 📅 Plan — próxima sesión

**Ritmo:** 3 días a la semana, de 3 a 4 horas cada uno, sin días fijos. Entre semana, en casa: JS.

**Desde octubre:** sábado y domingo (12 h cada día) para sacar el certificado del curso de API de Claude (48 de 84 sesiones hechas, quedan 36); entre semana sigue JS.

**Objetivo único:** cerrar lo que queda de JS para empezar React cuanto antes.

**Continuar el repaso de DOM (antes de `fetch`):**

- `moverArriba` (card 🔁 Bloque 2 — Repaso, nº 9): ya hay código escrito; revisarlo con lo aprendido en `moverAbajo` (orden de las líneas y click fuera de un item).
- `activarAcordeonExclusivo` (Bloque 2 — Repaso, nº 2).
- Confirmar en el navegador los tests de los seis ejercicios del 23/09 y los cuatro del 21/09.
- Si sobra tiempo: nº 3 a 6 y 9 a 10 de Bloque 2 — Repaso.

**JS después:** repaso de **`fetch`** y `async/await`, cuando el DOM esté consolidado.

**React:** empieza en cuanto el bloque JS esté cerrado, sin esperar a octubre.

**Sin prioridad esta semana:** BM25 y `Retriever` de índice múltiple del curso de API de Claude; Symfony (próximo bloque a confirmar contra el plan real).

**Deferred, no empezar sin pedirlo explícito:** Flujo Landing Pages, Flujo SaaS con IA.

### Candidatos a salir de Repaso urgente (confirmar con Pau, no podado aún)

Salieron bien hoy **sin ayuda** y no han reincidido:

- **nº 5** — `classList` recibe nombres de clase, no selectores (sin punto).
- **nº 9** — dentro de un `forEach`, el método va sobre el parámetro del callback.

El resto reincidió hoy y se queda: nº 1 y 2 (`setCustomValidity`, `&&` frente a `||`), nº 3, nº 7 (leer dentro del listener), nº 10 (`includes`/`contains`), nº 11 (elemento frente a valor), nº 16 (`insertBefore`).

---

## ⚠️ Normas vigentes

- **Todo ejercicio cierra con fase de maquetación responsive en Tailwind**, sea del track que sea. Se describe cómo debe verse, nunca las clases.
- **Enunciados autocontenidos:** paso a paso, sin dar nada por sentado, sin tecnicismos sin definir, sin referencias a ejercicios anteriores.
- **Teoría en `docs/` antes de cualquier ejercicio** — salvo excepción puntual pedida explícitamente.
- **Un concepto nuevo por ejercicio.**
- **Tono:** concepto en palabras llanas primero, una idea por frase; respuestas cortas, sin enrollarse.
- **Disciplina — media corrección:** arreglar una parte y decir «¿así?» sin releer es el fallo que más pesa. Releer el bloque entero antes de dar algo por hecho.
- **Leer el enunciado y el HTML entero antes de escribir**, y apuntar lo que debe ocurrir (en `activarFiltroCategorias` faltó rotar el botón activo por no leerlo entero).
- **Daily log — una card por error** (desde el 23/09): cada error en su propio `!!! failure "❌ Fallo N — título"`, con su código real, `// ❌` y su propia `🧠 Lección`. Los ejercicios sin fallos van en cuadrícula de totales. Nada de typos ni de notas meta sobre cómo se escribió el log. En cada ejercicio va primero el ✅ código corregido y debajo las cards de fallo.
- **Poda de Repaso urgente al cerrar cada sesión** (desde el 23/09): un error que ya no persiste se saca de Repaso urgente (JS/DOM o Symfony). Se comprueba contra el resultado real del día, no de memoria.
- **Registro el mismo día:** daily log + esta página se actualizan al cierre de cada sesión, no al día siguiente.

---

## ⏳ Pendiente de escribir en docs

- **«Un voter no filtra listados»** en [Voters](/symfony/02-seguridad/05-voters/) — está la dirección contraria, no ésta.
- **Cola, worker, handler y qué significa asíncrono** — el vocabulario del componente, no solo el patrón.
- **Orden ✅ antes de ❌** en `rules/ejercicios-resultados.md` y en las páginas de repaso urgente: hoy lo siguen los daily del 21/09 y del 23/09. Cambiarlo en la norma exige su entrada en `openspec/changes/archive/`.
