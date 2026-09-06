# 🚨 Repaso urgente — Arquitectura y permisos

> Repaso rápido de los conceptos de diseño que más cuesta fijar al aplicarlos por primera vez: la frontera entre rol y voter, cómo viaja un JWT, los códigos HTTP, cómo integrar un sistema externo sin acoplarte a él, y cómo separar un frontend de su API. Antes de resolver un caso de arquitectura, repasar esto.
>
> Empieza por el **guion universal de pizarra**: el orden que funciona con cualquier caso, incluido uno que no hayas visto nunca.
>
> Teoría completa en [Backend → Arquitectura](/backend/02-arquitectura/).

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

## 🧭 Guion universal de pizarra

> El orden que sirve para **cualquier** caso, incluido uno que no hayas visto nunca. Antes de dibujar nada, repasar esto.

**0. Repite el enunciado.** «Entonces queréis X, ¿correcto?» Confirmas que lo has entendido y ganas diez segundos.

**1. Preguntas del primer minuto (3-5).** No empieces a diseñar: pregunta, y **di por qué preguntas** («esto cambia el diseño entero»). Las que valen casi siempre:

| Pregunta | Qué decide |
|---|---|
| ¿Quién lo usa y qué puede ver cada uno? | Permisos |
| ¿De dónde salen los datos y **de quién son**? | Fuente de verdad |
| ¿Qué volumen y con qué frecuencia? | Escala |
| **¿Qué pasa cuando algo falla o llega mal?** | Suele partir el diseño en dos |
| ¿Hay acciones con consecuencias, o solo consulta? | Lectura vs. escritura |

**2. Las piezas.** Cajas en la pizarra: entidades, relaciones, y qué guarda cada una.

**3. Las decisiones, con su porqué.** Nunca «uso una cola». Siempre **«uso una cola porque generar esto agota el tiempo de la petición»**. El porqué es lo que se evalúa.

**4. El flujo paso a paso.** Una petición de principio a fin, en voz alta, sin saltarse capas.

**5. Qué puede fallar.** Cuatro o cinco riesgos con su mitigación. Aquí se nota si has pensado en producción o solo en el camino feliz.

**6. Qué dejo fuera.** Acótalo tú: «no entro en X ni Y; con más tiempo lo abordaría así». Es criterio, no ignorancia.

!!! danger "Las tres reglas de supervivencia"
    1. **Repite la pregunta antes de responder.** El fallo más caro: contestar a una pregunta más fácil que la que te han hecho.
    2. **Si no lo sabes, dilo y da el planteamiento.** «No lo he implementado nunca; el planteamiento sería…» Eso suma. Rellenar con palabras vagas resta.
    3. **Piensa en voz alta.** El silencio es lo peor: se evalúa el proceso, no el resultado.

---

## 📊 Los conceptos que más se mezclan

| Concepto | La confusión típica |
|---|---|
| Voter — a quién pertenece | Pensar que el voter "es de" o "hereda de" la entidad Usuario |
| Autenticación vs. autorización | Meter el rol dentro de la autenticación, en vez de después |
| Relación `ManyToOne` | Tratar el dato como un string o un id, en vez del objeto completo |
| `supports()` en un voter | Confundir "me abstengo" con "deniego" |
| JWT y revocación | Creer que un cambio de rol en BD se refleja en un token ya emitido |
| Hash vs. cifrado | Usarlos como sinónimos |
| Códigos HTTP | Mezclar 401/403/404/503 |
| Listado vs. detalle | Pensar que filtrar el listado protege también el acceso directo |
| `ManyToMany` con datos propios | Crear una entidad de unión sin que haga falta |
| Requisito funcional vs. no funcional | Confundir una acción con una condición de rendimiento |

---

!!! danger "El voter no pertenece a ninguna de las dos entidades que compara"
    Es fácil pensar "el voter es de `Usuario`" o "`Cliente` usa el voter". Ninguna de las dos es cierta: el voter es una clase **independiente**, que solo **lee** a las dos entidades para decidir.

    ```
    Controlador  →  usa  →  Voter  →  lee  →  Usuario y Cliente
    ```

    Ninguna entidad "tiene" ni "usa" el voter — quien lo usa es el código que necesita comprobar un permiso (controlador, plantilla, comando).

!!! danger "El rol no es autenticación — es la primera capa de autorización"
    Autenticación es solo "¿quién eres?" (login, JWT) y **nunca** mira roles. El rol entra después, con la identidad ya confirmada, para decidir "¿a qué sección entras?". Mezclarlos hace perder la distinción entre **401** (no sé quién eres) y **403** (sé quién eres, no puedes).

!!! tip "Un `ManyToOne` no es un string ni un id — es el objeto completo"
    En la base de datos es una columna entera (`comercial_id`). En el objeto PHP, Doctrine ya lo hidrata como la entidad completa: `$cliente->getComercial()` devuelve un `Usuario` entero, no un número ni un texto. La comparación en un voter siempre es entre dos objetos, nunca entre dos ids sueltos.

!!! danger "`supports() → false` no deniega, se abstiene — y la abstención deniega igual"
    Los dos métodos de un voter parecen decir lo mismo pero significan cosas opuestas: `supports() → false` es "no es asunto mío", `voteOnAttribute() → false` es "denegado". Si todos los voters se abstienen, la estrategia por defecto de Symfony **deniega** — un `supports()` mal escrito da un 403 permanente sin que ningún voter llegue a razonar nada.

!!! tip "Un JWT emitido no se puede revocar"
    El servidor nunca vuelve a consultar la base de datos para un token ya firmado — solo comprueba su firma y su caducidad. Los roles que lleva dentro son una foto fija del momento del login. Cambiar el rol de un usuario en base de datos no toca los tokens que ya emitiste: siguen funcionando con los permisos viejos hasta que caducan.

!!! danger "Hashear no es cifrar"
    Cifrar es reversible: con la clave correcta se recupera el original. Hashear no lo es. Una contraseña se hashea porque nadie —ni el propio sistema— debería poder recuperarla nunca en texto plano.

!!! note "Cuatro códigos, cuatro preguntas distintas"
    | Código | Pregunta que responde |
    |---|---|
    | **401** | ¿Sé quién eres? |
    | **403** | Sabiendo quién eres, ¿puedes hacer esto? |
    | **404** | ¿Existe esto? (o se finge que no existe) |
    | **503** | ¿Está disponible ahora mismo algo de lo que dependo? |

!!! danger "Filtrar el listado no protege el acceso directo"
    Un repository filtrado (`findByComercial()`) decide qué filas trae una consulta — no protege una carga directa por id. El `show()` de un objeto necesita su propia comprobación (el voter), sea cual sea el filtro que ya se aplicó en el listado; si no, cualquiera que escriba la URL a mano se lo salta entero.

!!! tip "`ManyToMany` con datos propios de la relación, `ManyToOne` nunca"
    La entidad de unión (`UsuarioEquipo`) solo hace falta cuando la relación es de varios a varios **y**, además, la propia pertenencia necesita guardar un dato que no pertenece a ninguno de los dos lados por separado (una fecha de entrada, por ejemplo). Con `ManyToOne`, ese mismo dato cabe como una columna más en la entidad — nunca hace falta una entidad nueva, sin importar cuántas propiedades tenga la otra entidad relacionada.

!!! note "Funcional = acción, no funcional = condición"
    Si la frase describe algo que alguien **puede hacer** ("puede filtrar", "puede editar") → funcional. Si describe una **condición o umbral** bajo la que opera el sistema (cuántos usuarios, cuán rápido, qué pasa si algo falla) → no funcional.

---

## Integración con un sistema externo

| Concepto | La confusión típica |
|---|---|
| Fuente de verdad | Pensar "de dónde vienen los datos" (API, BD) en vez de "de quién es cada dato" |
| Adaptador vs. servicio | Buscar un "conector dentro del servicio" — son la misma clase |
| Réplica vs. caché | Creer que una caché corta cubre lo mismo que una réplica completa |
| Timeout vs. cortocircuito | Pensar que con el timeout ya está resuelto que el ERP se caiga |
| Promesas | Querer resolver el timeout de PHP con `async`/promesas (eso es de JS) |
| Idempotencia | Buscar el duplicado en tu BD, cuando nace en el ERP por el reintento |
| Pedido en BD y en cola | Creer que basta la cola porque de ahí sale hacia el ERP |
| Webhook | Pensar que "se define en el ERP" — se configura allí, se programa aquí |

---

!!! tip "La frase que resume el caso: no todos los datos se integran igual"
    Clasificar cada dato por **cómo cambia** es lo que se evalúa:

    | Dato | Cómo cambia | Estrategia |
    |---|---|---|
    | Catálogo (nombre, precio, descripción) | Poco | **Replicar** en tu BD (sync nocturna) |
    | Stock | Mucho, tolera desfase | **Cachear** corto contra el ERP |
    | Pedido | Escritura crítica | **Encolar** y procesar en segundo plano |

    "Usa un adaptador" es un principio de estructura genérico; esta clasificación demuestra que entendiste **este** problema.

!!! danger "Fuente de verdad = un solo dueño por dato, sin prioridades"
    No es "¿por qué canal llega el dato?" — es "¿qué sistema manda sobre él?". El stock siempre es del ERP; la descripción de marketing, tuya. Cada dato tiene **un** dueño decidido de antemano — no hay varias fuentes compitiendo por prioridad.

!!! tip "El adaptador ES el servicio, y contiene comunicación, no negocio"
    No hay un "conector dentro del servicio" — es una sola clase. Dentro de ella viven el formato del ERP, los tiempos límite, los reintentos, la caché y el cortocircuito. La lógica de negocio vive fuera, en tus servicios de dominio.

!!! danger "Réplica y caché no son lo mismo"
    Una **réplica** es una copia completa y autónoma: sigue sirviendo aunque el ERP esté caído días. Una **caché corta** expira y necesita al ERP para renovarse — si el ERP cae, en pocos minutos caduca todo y no queda nada que mostrar. El catálogo se replica **porque** debe funcionar durante una caída; el stock se cachea porque tolera unos minutos de desfase.

!!! danger "Timeout y cortocircuito son dos escalas distintas"
    El **timeout** (3-5 s, dentro del adaptador) limita cuánto esperas en **una** llamada. El **cortocircuito** decide dejar de llamar **del todo** tras varios fallos seguidos, para no tener cien procesos bloqueados 5 s cada uno cuando el ERP está caído (efecto dominó). Se usan juntos.

!!! note "El timeout va en el adaptador, nunca en el controlador"
    El controlador no conoce detalles técnicos del ERP. Llama a `$adaptador->consultarStock($id)` y confía en que el adaptador gestiona timeout, reintentos, caché y cortocircuito por dentro.

!!! tip "Las promesas son de JavaScript"
    En PHP/Symfony el modelo es síncrono: el timeout es una **opción de configuración** de la llamada HTTP (`['timeout' => 5]`), no algo asíncrono. Existen librerías con promesas (Guzzle, ReactPHP) pero para este caso no hacen falta.

!!! danger "El pedido duplicado nace en el ERP, no en tu BD"
    Tu BD crea el pedido una sola vez. El duplicado aparece cuando el proceso en segundo plano **reintenta el envío** y el ERP recibe el mismo pedido dos veces. Solución: un **identificador único del pedido** (no del adaptador) que se reenvía igual en cada intento, y que **el ERP** usa para reconocer repetidos. Si el ERP no lo soporta, la garantía pasa a tu lado (registrar qué pedidos ya confirmaste antes de reintentar).

!!! tip "El pedido va a la BD Y a la cola — por razones distintas"
    La **BD** es el registro permanente: el pedido existe como fila real, consultable siempre (pantalla "mis pedidos", panel de atascados). La **cola** es solo el tubo de entrega, transitoria — si pierde un mensaje, sin la BD no quedaría rastro de que el pedido existió.

!!! note "Cómo sabe el cliente que su pedido entró: un campo de estado"
    El controlador responde "recibido" **antes** de que el ERP vea el pedido. La visibilidad se da con un estado en el pedido (`recibido → enviado al ERP → confirmado / error`) que el proceso en segundo plano actualiza y la web muestra.

!!! danger "Webhook: se configura en el ERP, se programa en tu lado"
    Dos mitades. En el **ERP**: un ajuste que dice "cuando cambie un precio, haz POST a esta URL". En **tu lado**: la ruta + el controlador que la atiende + la verificación de firma (secreto compartido). Es una petición **entrante** → la recibe un controlador, no el adaptador de salida.

!!! tip "Un cambio de mecanismo del ERP solo debe tocar el adaptador"
    Si el ERP pasa de API REST a ficheros CSV por carpeta, solo cambia el adaptador (leer/escribir ficheros en vez de HTTP). Si el cambio te obliga a tocar el controlador, la cola o cualquier otra cosa, el adaptador no estaba bien aislado.

!!! note "Sincronización nocturna que falla: servir lo viejo + avisar + no borrar hasta confirmar"
    Los datos viejos siguen sirviendo (mejor que romperse). Pero además: una **alerta** para que alguien lo arregle, y **nunca borrar los datos viejos hasta que la sincronización nueva esté completa y confirmada** (intercambio atómico), o un fallo a mitad te deja sin nada.

---

## Portal de cliente y consultas a medida

| Concepto | La confusión típica |
|---|---|
| Índice de BD | Pensar que es una `id`, o que sus columnas dependen de cuántas propiedades tiene la entidad |
| Índice vs. QueryBuilder | Verlos como alternativas — son capas distintas: uno pide, el otro ejecuta rápido |
| `SameSite` vs. CORS | Mezclar el atributo de cookie con la cabecera `Access-Control-Allow-Origin` |
| `403` vs. `404` | Devolver `403` en un recurso con dueño y confirmar así que existe |
| Revocar un permiso | Creer que surte efecto al caducar el token, no en la siguiente petición |
| Firewall vs. voter | Pensar que el firewall comprueba permisos — solo valida el token |
| Estructura por nº de propiedades | "La entidad tiene X campos, entonces la estructura es Y" |
| Exportación grande | "Va en un servicio" como motivo para no hacerla en la petición |
| Servir un fichero | Dejarlo en carpeta pública y añadirle una comprobación que nunca corre |

---

!!! tip "Un índice no es una `id`, y sus columnas salen de tus consultas"
    Un índice es una **estructura ordenada** que la BD mantiene aparte para saltar directa a unas filas sin recorrer la tabla. Sus columnas **no dependen de la entidad** — dependen de por dónde filtran y ordenan las consultas frecuentes. Miras el `WHERE` y el `ORDER BY` del listado (`cliente_id`, `fecha`) y declaras un índice con esas columnas, en ese orden: las de `=` primero, la de ordenar o rango al final.

!!! danger "Índice y QueryBuilder no son alternativas"
    El **QueryBuilder** dice *qué* quieres (produce el SQL). El **índice** hace que la BD *ejecute* ese SQL rápido. El mismo QueryBuilder, con índice o sin él, devuelve lo mismo — solo cambia si la BD recorre 4 millones de filas y ordena en memoria, o salta a 20. El `orderBy()` funciona igual sin índice; solo que significa "ordena 4.000 filas cada vez".

!!! note "Lo que ya está indexado sin hacer nada"
    La **clave primaria `id`** (por eso `find($id)` es instantáneo) y la **columna FK de un `ManyToOne`** (`cliente_id`), ambas de una sola columna. Lo demás — incluido cualquier índice **compuesto** — lo declaras tú con `#[ORM\Index(columns: [...])]` sobre la clase. Coste: ocupa disco y ralentiza cada `INSERT`/`UPDATE`, así que solo se indexan las consultas frecuentes.

!!! danger "`SameSite` es de cookies; CORS es `Access-Control-Allow-Origin`"
    Son capas distintas. `SameSite` es un atributo de **cookie** (sale en la decisión token vs. sesión). **CORS** es una cabecera de respuesta de la **API** — `Access-Control-Allow-Origin` — que dice qué orígenes de navegador acepta. Se configura con **lista explícita** de orígenes, **nunca `*`**: un comodín deja que cualquier web llame a tu API desde el navegador del usuario.

!!! tip "`404` en vez de `403` para recursos con dueño"
    Si el pedido 48 no es del usuario, un `403` **confirma que existe** — y alguien puede enumerar IDs (`/1`, `/2`, `/3`...) para mapear los pedidos ajenos. Con `404` no distingue "no existe" de "no es tuyo". El `403` normal se reserva para "no tienes el rol para esta sección entera" (RBAC), donde no ocultas la existencia de nada.

!!! danger "Revocar un permiso surte efecto en la siguiente petición, no al caducar el token"
    Solo si el token lleva **únicamente la identidad**. Los permisos (qué clientes representa el usuario) se consultan **frescos en la BD en cada request**, así que quitarle el acceso a las 10:15 se nota a las 10:16, aunque el token dure hasta las 10:30. Si metes la lista de clientes **dentro** del token, la revocación no surte efecto hasta que caduca. En el token va quién eres, no qué puedes ver.

!!! note "Firewall valida el token; el voter consulta la BD"
    Dos comprobaciones distintas en cada petición. El **firewall** (config en `security.yaml`, `jwt: ~`) comprueba firma + caducidad del token — es autenticación, no mira permisos. El **voter** (tu código, invocado desde el controlador) lee la BD y decide si este usuario puede ver este objeto — es autorización. Un token válido pasa el firewall aunque el usuario ya no tenga el permiso; lo para el voter.

!!! danger "La estructura no se decide por cuántas propiedades tiene la clase"
    Patrón a romper: "la entidad tiene X campos, entonces necesito una entidad de unión / un índice / un DTO". Las columnas de un índice salen de las **consultas**. La entidad de unión sale de si la **relación** guarda datos propios. El DTO sale de qué **campos pinta** una pantalla. Siempre se mira qué hace el sistema con los datos, nunca el número de propiedades.

!!! tip "Una exportación grande no se hace en la petición — y el motivo es el tiempo"
    "Va en un servicio" no es el motivo: un servicio llamado de forma síncrona bloquea la petición igual. El motivo es que generar un Excel de miles de filas **agota el tiempo de espera** del navegador. Solución asíncrona: el controlador despacha un mensaje a una **cola** y responde "recibido"; un **worker** en segundo plano genera el fichero y avisa al cliente cuando está listo (componente Messenger). Es la importación masiva al revés.

!!! danger "Un fichero en carpeta pública lo sirve el servidor web, sin pasar por tu código"
    Un PDF en `public/uploads/` lo entrega Apache/nginx directamente — tu voter **nunca corre** porque tu PHP nunca arranca. No es que falte la comprobación: es que no hay dónde ponerla. Se guarda **fuera** de `public/` y se sirve por un **controlador** (que corre el voter y devuelve el fichero) o con un **enlace firmado temporal** si hay volumen. La comprobación tiene que estar donde la petición no puede no pasar.

</div>
