# Web { .section-web }

> El sustrato sobre el que se apoya todo lo demás. Un framework de backend, una librería de frontend y un CDN son formas distintas de manipular las mismas cuatro cosas: una petición, una respuesta, unas cabeceras y una caché. Conocerlas es lo que permite depurar cuando el framework deja de ayudar.

---

## Por qué este bloque va antes que cualquier framework { .topic-title }

Casi todos los problemas raros de una aplicación web se explican en esta capa:

- Un formulario que funciona en local y falla en producción → **cabeceras** o **HTTPS**.
- Una llamada que el navegador bloquea sin llegar al servidor → **CORS**.
- Un cambio desplegado que los usuarios no ven → **caché**.
- Una sesión que se pierde entre subdominios → **cookies** y sus atributos.
- Un usuario que ve datos de otro cambiando un número en la URL → **autorización**.

Ninguno se resuelve leyendo la documentación del framework: se resuelven entendiendo qué viaja por el cable.

## Temario { .topic-title }

| Lección | Qué cubre |
|---|---|
| [Petición y respuesta](01-ciclo-peticion-respuesta/index.md) | Qué ocurre entre escribir una URL y ver la página: DNS, TCP, TLS, HTTP. Anatomía de una petición y una respuesta. Por qué HTTP no tiene memoria |
| [Métodos y códigos](02-metodos-y-codigos/index.md) | `GET`/`POST`/`PUT`/`PATCH`/`DELETE`, seguros e idempotentes. Las cinco familias de códigos y los que de verdad importan |
| [Cabeceras](03-cabeceras/index.md) | Negociación de contenido, `Content-Type` frente a `Accept`, `Authorization`, `Location`, `Set-Cookie` |
| [CORS](04-cors/index.md) | Qué es un origen, qué bloquea el navegador exactamente, petición simple frente a *preflight*, credenciales |
| [Caché HTTP](05-cache-http/index.md) | `Cache-Control`, `ETag` y revalidación, `304`, CDN, y cómo invalidar sin rezar |
| [Seguridad web](06-seguridad-web/index.md) | XSS, CSRF, inyección, IDOR, cabeceras de seguridad, gestión de secretos |
| [Rendimiento web](07-rendimiento-web/index.md) | Core Web Vitals, qué bloquea el render, imágenes, fuentes, compresión |

---

## 📚 Fuentes { .topic-title }

| Fuente | Enlace |
|---|---|
| 📗 **MDN — HTTP** | [developer.mozilla.org/es/docs/Web/HTTP](https://developer.mozilla.org/es/docs/Web/HTTP) |
| 🛡️ **OWASP Cheat Sheet Series** | [cheatsheetseries.owasp.org](https://cheatsheetseries.owasp.org/) |
| ⚡ **web.dev** | [web.dev](https://web.dev/) — rendimiento y buenas prácticas |
