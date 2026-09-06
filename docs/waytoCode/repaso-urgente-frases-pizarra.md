# 🚨 Repaso urgente — Frases de pizarra

> Lo último que se lee antes de exponer un caso en voz alta. No son conceptos nuevos: son **las palabras exactas** con las que se dicen los que ya sabes. En una exposición oral, el término correcto convence y el aproximado siembra duda.

<style>
.repaso-compact { font-size: .82rem; line-height: 1.45; }
.repaso-compact .admonition { font-size: .8rem; margin-block: .55rem; }
.repaso-compact .admonition > .admonition-title { font-size: .8rem; }
.repaso-compact :is(pre, code) { font-size: .78em; }
.repaso-compact table { font-size: .76rem; }
.repaso-compact :is(ul, ol) { margin-block: .3rem; }
.repaso-compact li + li { margin-top: .15rem; }
.repaso-compact h2 { font-size: 1rem; margin-top: 1.2rem; }
</style>

<div class="repaso-compact" markdown>

## 🗣️ Las frases que hay que soltar

| Cuando toque… | La frase |
|---|---|
| Permisos con un modelo de lenguaje | **«Los permisos se aplican en la consulta, no en el prompt.»** |
| Cualquier comprobación de seguridad | **«La comprobación va donde la petición no puede no pasar.»** |
| Hablar con un sistema externo | **«El adaptador *es* el servicio: dentro van formato, timeouts, reintentos y caché; el negocio vive fuera.»** |
| Justificar replicar en vez de cachear | **«Una réplica sigue sirviendo con el origen caído; una caché corta caduca y se queda sin nada.»** |
| Trabajo pesado en una petición | **«Subir es rápido y devuelve un identificador; procesar ocurre después, en segundo plano.»** |
| Reintentos contra un tercero | **«Idempotencia: procesarlo cinco veces deja el sistema igual que procesarlo una.»** |
| Un asistente que ejecuta acciones | **«El modelo propone, la persona confirma.»** |
| Te piden un número que no sabes | **«No te daría una cifra sin medir; te digo cómo lo mediría.»** |
| Cerrar el diseño | **«Dejo fuera X e Y; con más tiempo lo abordaría así.»** |
| Datos de un tercero | **«Clasifico cada dato por cómo cambia: replicar, cachear o encolar.»** |

## ⚖️ Los pares que se confunden

| No es… | Es… |
|---|---|
| Copia de seguridad | **Réplica** — el backup se usa para recuperarse de un desastre; la réplica, para **seguir sirviendo** |
| Un voter que devuelve un dato | Un voter devuelve **sí o no**; el dato lo devuelve una **consulta** |
| Timeout = ya está resuelta la caída | **Timeout** limita *una* llamada; **cortocircuito** deja de llamar del todo tras varios fallos |
| Autenticación con roles dentro | **Autenticación** = quién eres · **autorización** = qué puedes. El rol va después |
| Firewall que comprueba permisos | El **firewall** valida el token (autenticación); el **voter** consulta la BD (autorización) |
| `403` en un recurso con dueño | **`404`** — un `403` confirma que existe y deja enumerar ids ajenos |
| `SameSite` y CORS son lo mismo | `SameSite` es de **cookies**; CORS es `Access-Control-Allow-Origin`, de la **API** |
| Índice y QueryBuilder son alternativas | El **QueryBuilder** dice *qué* quieres; el **índice** hace que se ejecute rápido |
| Hashear = cifrar | **Cifrar** es reversible; **hashear** no |
| Requisito funcional | Si es una **acción** («puede filtrar») es funcional; si es una **condición** (cuántos, cuán rápido) es **no funcional** |
| Promesas para el timeout de PHP | Las promesas son de **JavaScript**; en PHP el timeout es una **opción** de la llamada |
| Filtrar el listado protege el detalle | El `show()` necesita **su propia** comprobación |

## 🚫 Términos que se dicen mal

| Se dice | No |
|---|---|
| **Estados** del pedido (`recibido → enviado → confirmado`) | «medidores de fase», «control de estados» |
| **Réplica** / **sincronización nocturna** | «copias de seguridad», «fallbacks diarios» |
| **Respuesta en flujo** (*streaming*) | «gestor de estados» para una respuesta lenta |
| **Reindexar** el documento | «un aviso», «que la aplicación lo sepa» |
| **Cola + worker** | «un servicio» como motivo para no bloquear |
| **Consulta** que resuelve el precio | «un voter que determina el precio» |

!!! danger "Las tres reglas de supervivencia"
    1. **Repite la pregunta antes de responder.** El fallo más caro no es no saber: es contestar a una pregunta más fácil que la que te han hecho.
    2. **Si no lo sabes, dilo y da el planteamiento.** «No lo he implementado nunca; el planteamiento sería…» Eso suma. Rellenar con un mecanismo comodín resta.
    3. **Piensa en voz alta.** El silencio es lo peor: se evalúa el proceso, no el resultado.

!!! tip "El porqué vale más que el qué"
    Nunca «uso una cola». Siempre **«uso una cola porque generar esto agota el tiempo de la petición»**. Un mecanismo sin su motivo se lee como recitado; con su motivo, como criterio.

</div>
