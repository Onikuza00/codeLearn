# Métodos y códigos { .section-web }

> El método declara **qué intención** tiene la petición; el código de estado, **qué ha pasado** con ella. Elegir mal cualquiera de los dos no rompe nada visible, y por eso se hace mal tan a menudo: el navegador, los proxies y los buscadores sí se comportan según lo que digas.

---

## Los métodos { .topic-title }

| Método | Para qué | Seguro | Idempotente |
|---|---|:---:|:---:|
| `GET` | Leer un recurso | ✅ | ✅ |
| `HEAD` | Como `GET`, pero solo cabeceras | ✅ | ✅ |
| `POST` | Crear, o disparar una acción | ❌ | ❌ |
| `PUT` | Reemplazar un recurso **entero** | ❌ | ✅ |
| `PATCH` | Modificar **parte** de un recurso | ❌ | ❌ |
| `DELETE` | Borrar | ❌ | ✅ |
| `OPTIONS` | Preguntar qué se permite (lo usa CORS) | ✅ | ✅ |

**Seguro** significa que **no cambia nada** en el servidor. **Idempotente** significa que repetirlo dos veces deja el sistema igual que hacerlo una.

!!! danger "Un `GET` nunca modifica nada"
    `GET /pedidos/48/borrar` es un error grave, aunque funcione:

    - Los navegadores y los proxies **precargan y cachean** los `GET`. Un enlace así puede dispararse solo.
    - Un rastreador que recorra tus enlaces borraría medio sistema.
    - El `GET` no lleva protección CSRF, porque se asume que no hace nada.

    Si la petición cambia estado, es `POST`, `PUT`, `PATCH` o `DELETE`.

!!! tip "Idempotente no es lo mismo que «da el mismo resultado»"
    `DELETE /pedidos/48` es idempotente: la primera vez borra, la segunda no encuentra nada. El **estado final es el mismo**, aunque la respuesta cambie (`204` y luego `404`).

    `POST /pedidos` no lo es: dos llamadas crean **dos pedidos**. Por eso hace falta [idempotencia explícita](../../backend/02-arquitectura/05-importacion-masiva/index.md) —un identificador propio— cuando un reintento automático puede repetir la petición.

## Las cinco familias { .topic-title }

| Familia | Significa |
|---|---|
| **1xx** | Informativo. Rara vez lo verás |
| **2xx** | Salió bien |
| **3xx** | Redirección: está en otro sitio, o no ha cambiado |
| **4xx** | **Error del cliente**: la petición está mal |
| **5xx** | **Error del servidor**: la petición estaba bien, fallamos nosotros |

La frontera entre `4xx` y `5xx` es la que más se equivoca, y no es cosmética: los sistemas de monitorización alertan por `5xx` y no por `4xx`. Devolver un `500` cuando el usuario mandó un campo mal genera alarmas falsas; devolver un `400` cuando tu base de datos está caída oculta una caída real.

## Los que hay que saberse { .topic-title }

**Éxito**

| Código | Cuándo |
|---|---|
| `200 OK` | Todo bien, con cuerpo |
| `201 Created` | Se creó algo. Acompáñalo de `Location` con su URL |
| `204 No Content` | Bien, y no hay nada que devolver (un `DELETE`) |

**Redirección**

| Código | Cuándo |
|---|---|
| `301 Moved Permanently` | Cambio definitivo. **Se cachea de forma agresiva** |
| `302 Found` | Temporal |
| `303 See Other` | Tras un `POST`, para redirigir a un `GET` |
| `304 Not Modified` | No ha cambiado, usa tu caché |
| `307` / `308` | Como `302`/`301`, pero **conservan el método** |

!!! danger "El `301` es casi irreversible"
    Los navegadores lo cachean durante meses y no vuelven a preguntar. Si mandas un `301` por error a una URL importante, los usuarios que ya lo recibieron **seguirán redirigidos** aunque lo arregles en el servidor.

    Ante la duda, `302`. El `301` solo cuando la mudanza es definitiva y está pensada.

!!! tip "Tras un `POST` correcto, `303`"
    Es el patrón PRG: procesas el formulario y rediriges. El `303` garantiza que la petición siguiente sea un `GET`; con un `307` el navegador **repetiría el `POST`** contra la nueva URL, que no es lo que quieres.

**Error del cliente**

| Código | La pregunta que responde |
|---|---|
| `400 Bad Request` | La petición está malformada |
| `401 Unauthorized` | **No sé quién eres** — falta o caducó la credencial |
| `403 Forbidden` | **Sé quién eres y no puedes** |
| `404 Not Found` | No existe (o se finge que no) |
| `405 Method Not Allowed` | Ese recurso existe, pero no acepta ese método |
| `409 Conflict` | Choca con el estado actual (dos ediciones a la vez) |
| `422 Unprocessable Content` | Está bien formada pero **falla la validación** |
| `429 Too Many Requests` | Has superado el límite de peticiones |

!!! danger "`401` y `403` se confunden, y el nombre no ayuda"
    `401` dice «no sé quién eres» — pese a llamarse *Unauthorized*, va de **autenticación**. `403` dice «sé quién eres, y esto no es para ti» — eso es **autorización**.

    Práctico: si iniciar sesión resolvería el problema, es `401`. Si ya has iniciado sesión y aun así no puedes, es `403`.

!!! warning "En recursos con dueño, `404` en lugar de `403`"
    Si el pedido 48 existe pero es de otro cliente, un `403` **confirma que existe**, y alguien puede recorrer identificadores (`/1`, `/2`, `/3`…) para deducir cuántos pedidos tienes y cuáles. Con `404` no se distingue «no existe» de «no es tuyo».

    El `403` se reserva para «no tienes el rol para esta sección entera», donde no ocultas la existencia de nada.

!!! tip "`400` frente a `422`"
    `400` es «no entiendo la petición»: JSON roto, falta un campo obligatorio del formato. `422` es «te entiendo perfectamente, pero el contenido no es válido»: el correo no tiene arroba, la fecha es del pasado. Para errores de validación de negocio, `422`.

**Error del servidor**

| Código | Significa |
|---|---|
| `500 Internal Server Error` | Excepción no controlada. El cajón de sastre |
| `502 Bad Gateway` | Un intermediario recibió basura del servidor de detrás |
| `503 Service Unavailable` | No disponible ahora: sobrecarga o mantenimiento |
| `504 Gateway Timeout` | El servidor de detrás no contestó a tiempo |

!!! tip "`502`, `503` y `504` señalan sitios distintos"
    Con Nginx delante de PHP: **`502`** = PHP se cayó o devolvió algo inválido. **`504`** = PHP sigue vivo pero tarda más que el timeout configurado. **`503`** = lo devuelves tú a propósito, normalmente con `Retry-After`, cuando un sistema del que dependes no está.

    Distinguirlos dice si hay que mirar los registros de la aplicación, subir un timeout, o revisar un servicio externo.

---

## 📚 Fuentes { .topic-title }

| Fuente | Enlace |
|---|---|
| 📗 **MDN — Métodos HTTP** | [developer.mozilla.org/es/docs/Web/HTTP/Methods](https://developer.mozilla.org/es/docs/Web/HTTP/Methods) |
| 📗 **MDN — Códigos de estado** | [developer.mozilla.org/es/docs/Web/HTTP/Status](https://developer.mozilla.org/es/docs/Web/HTTP/Status) |
