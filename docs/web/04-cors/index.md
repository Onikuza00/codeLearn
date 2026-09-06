# CORS { .section-web }

> CORS es el error que más tiempo hace perder a quien no lo entiende, porque el mensaje del navegador describe el síntoma y no la causa. La clave es esta: **CORS no protege tu API, protege al usuario del navegador**, y quien lo aplica es el navegador, no tu servidor.

---

## La política del mismo origen { .topic-title }

Por defecto, el navegador **no deja que una página lea la respuesta de otro origen**. Un [origen](../01-ciclo-peticion-respuesta/index.md) son esquema, dominio y puerto juntos.

Sin esa política, cualquier web que visitaras podría lanzar en segundo plano una petición a tu banco —con tus cookies adjuntas, porque el navegador las manda solas— y **leer el resultado**. La política existe para que eso no ocurra.

!!! danger "Lo que se bloquea es la LECTURA, no el envío"
    Este malentendido explica casi toda la confusión del tema.

    Cuando ves un error de CORS, la petición **normalmente ya se ha ejecutado en el servidor**. Los datos se han guardado, el correo se ha enviado. Lo que el navegador impide es que **el JavaScript de la página lea la respuesta**.

    Consecuencia práctica: un error de CORS **no significa que la operación no se haya hecho**. Y consecuencia de seguridad: CORS nunca sustituye a la autorización en el servidor.

**CORS** (*Cross-Origin Resource Sharing*) es el mecanismo con el que un servidor dice: «este origen sí puede leer mis respuestas».

## Peticiones simples { .topic-title }

Algunas peticiones se mandan directamente y el navegador comprueba la respuesta después. Se consideran simples si cumplen **todo** esto:

- Método `GET`, `HEAD` o `POST`.
- `Content-Type` es `text/plain`, `application/x-www-form-urlencoded` o `multipart/form-data`.
- No llevan cabeceras personalizadas.

El servidor responde y el navegador mira si trae permiso:

```http
Access-Control-Allow-Origin: https://app.ejemplo.com
```

Si esa cabecera falta, o no coincide con el origen de la página, el navegador **descarta la respuesta** y lanza el error en consola.

!!! warning "`Content-Type: application/json` ya no es una petición simple"
    Por eso un formulario HTML tradicional nunca da problemas de CORS y un `fetch()` con JSON sí: en cuanto declaras `application/json`, la petición deja de ser simple y se dispara la comprobación previa.

## La comprobación previa (*preflight*) { .topic-title }

Para todo lo demás —`PUT`, `DELETE`, `PATCH`, JSON, cabecera `Authorization`— el navegador manda **primero** una petición `OPTIONS` preguntando si se permite:

```http
OPTIONS /api/pedidos HTTP/1.1
Origin: https://app.ejemplo.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type, authorization
```

Y el servidor contesta:

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.ejemplo.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

Solo si la respuesta autoriza el método y las cabeceras, el navegador manda la petición real. Son **dos viajes** en lugar de uno.

!!! tip "`Access-Control-Max-Age` ahorra la mitad de las peticiones"
    Le dice al navegador cuántos segundos puede recordar ese permiso. Sin ella, cada llamada a la API paga su `OPTIONS` previo. Con `86400` (un día), el *preflight* se hace una vez.

## Credenciales { .topic-title }

Por defecto, `fetch()` a otro origen **no envía cookies**. Para que las mande:

```js
fetch('https://api.ejemplo.com/pedidos', { credentials: 'include' });
```

Y el servidor tiene que autorizarlo explícitamente:

```http
Access-Control-Allow-Origin: https://app.ejemplo.com
Access-Control-Allow-Credentials: true
```

!!! danger "Con credenciales, el comodín `*` deja de valer"
    ```http
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Credentials: true    ❌ el navegador lo rechaza
    ```

    Es una protección deliberada: permitir que **cualquier** web lea respuestas autenticadas con las cookies del usuario sería exactamente el agujero que la política del mismo origen evita. Con credenciales hay que devolver el **origen concreto**, comprobado contra una lista blanca.

!!! warning "Nunca reflejes el `Origin` recibido sin comprobarlo"
    El atajo de copiar la cabecera `Origin` de la petición en `Access-Control-Allow-Origin` equivale a un `*`, pero además funciona con credenciales. Es un fallo de seguridad real, no un descuido de estilo.

    Lo correcto es una **lista explícita** de orígenes permitidos y comparar contra ella.

## Los errores típicos { .topic-title }

| Síntoma | Causa habitual |
|---|---|
| «No `Access-Control-Allow-Origin` header» | El servidor no manda la cabecera, o la ruta `OPTIONS` devuelve `404` |
| Funciona en Postman pero no en el navegador | Postman no aplica la política del mismo origen. **CORS es solo del navegador** |
| Falla solo el `POST`, el `GET` va bien | El `POST` con JSON dispara *preflight* y el `OPTIONS` no está contemplado |
| El origen está en la lista y aun así falla | Suele ser la barra final: `https://app.com` y `https://app.com/` no coinciden |
| Con `credentials: 'include'` deja de funcionar | Hay un `*` donde debería ir el origen concreto |

!!! tip "Que funcione en Postman es la pista más útil"
    Si con `curl` o Postman la API responde bien y el navegador la bloquea, **el servidor está bien**: el problema es exclusivamente de cabeceras CORS. Eso descarta de golpe la mitad de las hipótesis.

## CORS no es una medida de seguridad de tu API { .topic-title }

!!! danger "Restringir orígenes no protege los datos"
    CORS solo afecta a peticiones **hechas desde una página web en un navegador**. Un script en un servidor, `curl`, una app móvil o Postman ignoran las cabeceras CORS por completo: ni las miran.

    Tu API sigue necesitando **autenticación y autorización propias**. CORS decide qué páginas web pueden leer respuestas en el navegador del usuario; no decide quién puede llamar a tu API.

Y no confundir con `SameSite`, que es un atributo de **cookie** y actúa en otra capa: `SameSite` decide si la cookie viaja; CORS decide si la respuesta se puede leer.

---

## 📚 Fuentes { .topic-title }

| Fuente | Enlace |
|---|---|
| 📗 **MDN — CORS** | [developer.mozilla.org/es/docs/Web/HTTP/CORS](https://developer.mozilla.org/es/docs/Web/HTTP/CORS) |
| 📗 **MDN — Política del mismo origen** | [developer.mozilla.org/es/docs/Web/Security/Same-origin_policy](https://developer.mozilla.org/es/docs/Web/Security/Same-origin_policy) |
