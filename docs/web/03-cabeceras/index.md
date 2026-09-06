# Cabeceras { .section-web }

> Las cabeceras son los metadatos de una petición y de una respuesta: quién eres, qué formato esperas, cuánto se puede cachear, qué orígenes se aceptan. Casi todo lo que un framework configura por ti acaba siendo una cabecera.

---

## Cómo funcionan { .topic-title }

Pares `Nombre: valor`, uno por línea, entre la línea inicial y el cuerpo. El **nombre no distingue mayúsculas** (`Content-Type` y `content-type` son la misma), el valor sí.

Las que empiezan por `X-` eran extensiones no estándar. Hoy se desaconseja el prefijo, pero quedan muchas heredadas en uso.

## Cabeceras de petición { .topic-title }

| Cabecera | Qué dice |
|---|---|
| `Host` | A qué dominio va. Permite varios sitios en una IP |
| `Accept` | Qué formatos **acepta** de respuesta |
| `Accept-Language` | Qué idiomas prefiere |
| `Accept-Encoding` | Qué compresión entiende (`gzip`, `br`) |
| `Content-Type` | Formato **del cuerpo que envía** |
| `Content-Length` | Tamaño del cuerpo |
| `Authorization` | La credencial (`Bearer <token>`, `Basic ...`) |
| `Cookie` | Las cookies de ese dominio |
| `Origin` | Desde qué origen se lanza (clave en CORS) |
| `Referer` | Desde qué página se llegó (con la errata histórica en el nombre) |
| `User-Agent` | Navegador y sistema |
| `If-None-Match` / `If-Modified-Since` | Validación de caché |

!!! danger "`Accept` y `Content-Type` van en direcciones opuestas"
    Es la confusión más habitual del tema:

    - **`Accept`** → «lo que quiero **recibir**».
    - **`Content-Type`** → «lo que estoy **enviando**».

    En una petición conviven las dos y significan cosas distintas: `Content-Type: application/json` describe el cuerpo que mandas, `Accept: application/json` pide que te contesten en JSON. Mandar solo `Content-Type` y esperar respuesta JSON es una fuente clásica de recibir HTML de error donde esperabas datos.

    En la **respuesta**, `Content-Type` describe el cuerpo que devuelve el servidor.

!!! warning "`User-Agent` y `Referer` los pone el cliente: no son fiables"
    Se falsifican con una línea de `curl`. Sirven para estadísticas y para adaptar la experiencia, **nunca** para decidir permisos ni para validar de dónde viene una petición.

## Cabeceras de respuesta { .topic-title }

| Cabecera | Qué hace |
|---|---|
| `Content-Type` | Formato del cuerpo devuelto, con su `charset` |
| `Content-Encoding` | Con qué se comprimió |
| `Location` | A dónde redirigir (con un `3xx`) o dónde quedó lo creado (con un `201`) |
| `Set-Cookie` | Pide al navegador que guarde una cookie |
| `Cache-Control` | Cuánto y quién puede cachear |
| `ETag` / `Last-Modified` | Identidad de la versión, para revalidar |
| `Access-Control-Allow-Origin` | Qué orígenes de navegador pueden leer la respuesta |
| `Content-Security-Policy` | De dónde puede cargar recursos la página |
| `Strict-Transport-Security` | Obliga a HTTPS en visitas futuras |
| `Retry-After` | Cuándo reintentar (con un `503` o un `429`) |

## Negociación de contenido { .topic-title }

El cliente dice qué prefiere y el servidor elige:

```http
Accept: application/json;q=0.9, text/html;q=0.8, */*;q=0.1
```

El valor `q` es la prioridad, de 0 a 1. El servidor responde con lo que mejor encaje y lo declara en su `Content-Type`.

En una API el patrón habitual es más simple: si `Accept` pide JSON, devuelves JSON; si no, HTML. Symfony lo resuelve con el formato de la ruta o con el `Accept`.

!!! tip "El `charset` del `Content-Type` no es decorativo"
    `Content-Type: text/html; charset=UTF-8`. Sin él, el navegador **adivina** la codificación, y ahí es donde aparecen los acentos rotos. Es la causa de la mitad de los «se ven caracteres raros», junto con la codificación de la base de datos y la del propio fichero.

## Cabeceras y proxies { .topic-title }

Entre el navegador y tu aplicación suele haber un balanceador, un CDN o un Nginx. Eso cambia lo que ve tu código:

| Cabecera | Para qué |
|---|---|
| `X-Forwarded-For` | La IP real del cliente |
| `X-Forwarded-Proto` | Si el usuario venía por HTTPS |
| `X-Forwarded-Host` | El dominio que pidió el usuario |

!!! danger "Estas cabeceras solo son fiables si confías en el proxy"
    Cualquiera puede mandar `X-Forwarded-For: 1.2.3.4` en su petición. Solo valen si un proxy tuyo las **reescribe**, y por eso los frameworks obligan a declarar en qué proxies confías (en Symfony, `trusted_proxies`).

    Sin esa configuración pasan dos cosas típicas: la aplicación genera URLs con `http://` estando detrás de HTTPS, y los registros guardan la IP del balanceador en lugar de la del usuario.

---

## 📚 Fuentes { .topic-title }

| Fuente | Enlace |
|---|---|
| 📗 **MDN — Cabeceras HTTP** | [developer.mozilla.org/es/docs/Web/HTTP/Headers](https://developer.mozilla.org/es/docs/Web/HTTP/Headers) |
| 📗 **MDN — Negociación de contenido** | [developer.mozilla.org/es/docs/Web/HTTP/Content_negotiation](https://developer.mozilla.org/es/docs/Web/HTTP/Content_negotiation) |
