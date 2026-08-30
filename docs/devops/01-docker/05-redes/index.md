# Redes { .bloque-devops }

> Cada contenedor tiene su propia pila de red: su dirección IP, sus puertos, su `localhost`. Entender cómo se conectan entre sí y con el exterior explica la mayoría de los fallos de "no me conecta".

---

## El modelo {: .topic-title }

Un contenedor está aislado por defecto. No comparte la red de tu máquina: tiene la suya.

De ahí salen las tres preguntas que hay que saber responder:

| Pregunta | Respuesta |
|---|---|
| ¿Cómo llego a un contenedor desde el navegador? | Publicando un puerto con `-p` |
| ¿Cómo hablan dos contenedores entre sí? | Poniéndolos en la misma red y usando su nombre |
| ¿Cómo llega un contenedor a un servicio de mi máquina? | Con `host.docker.internal` |

---

## Los tipos de red {: .topic-title }

| Tipo | Qué hace | Cuándo se usa |
|---|---|---|
| `bridge` | Red privada virtual con traducción de direcciones. **La opción por defecto** | Prácticamente siempre |
| `host` | El contenedor comparte la red del anfitrión, sin aislamiento | Rendimiento máximo; **solo funciona bien en Linux** |
| `none` | Sin red de ningún tipo | Procesos que no deben tener conectividad |
| `overlay` | Red que abarca varias máquinas | Clústeres (Swarm, Kubernetes) |
| `macvlan` | El contenedor recibe una IP de tu red física, como si fuera otro equipo | Integración con hardware o redes existentes |

En el día a día trabajas con `bridge`. Los otros cuatro conviene reconocerlos, pero no los vas a escribir.

!!! warning "`--network host` no funciona igual en Windows y macOS"
    En Linux, el contenedor usa directamente la red de la máquina: `-p` deja de tener sentido porque los puertos ya son los mismos.

    En Windows y macOS los contenedores viven dentro de una máquina virtual, así que "el anfitrión" es esa máquina virtual, no tu ordenador. El resultado es que `--network host` no hace lo que esperas. Si el tutorial que sigues lo usa, es un tutorial escrito para Linux.

---

## Redes propias {: .topic-title }

La red `bridge` por defecto tiene una limitación importante: **los contenedores no se resuelven por nombre**. Solo se ven por dirección IP, que cambia en cada arranque.

En cuanto creas tu propia red, aparece la resolución automática de nombres:

```bash
docker network create mi-red

docker run -d --name db --network mi-red mysql:8.4
docker run -d --name api --network mi-red -p 8080:80 mi-aplicacion
```

Desde `api`, la base de datos está en `db:3306`. Sin IPs, sin configuración añadida.

```bash
docker network ls                  # listar redes
docker network inspect mi-red      # ver qué contenedores tiene dentro
docker network connect mi-red web  # meter un contenedor ya creado
docker network rm mi-red           # borrarla
```

!!! tip "Compose ya hace esto por ti"
    Cada proyecto de Compose crea automáticamente una red propia y mete dentro todos sus servicios. Por eso funciona escribir `db` como nombre de servidor en la cadena de conexión sin haber configurado nada.

    Las redes manuales se usan cuando trabajas sin Compose, o cuando necesitas que servicios de **dos proyectos distintos** se vean entre sí.

---

## Publicar puertos {: .topic-title }

`-p` es lo que abre una puerta desde tu máquina hacia el contenedor.

```bash
-p 8080:80                  # puerto 8080 de la máquina → 80 del contenedor
-p 127.0.0.1:8080:80        # igual, pero solo accesible desde este equipo
-p 80                       # puerto aleatorio de la máquina → 80 del contenedor
```

!!! danger "`-p 3306:3306` en un servidor expone tu base de datos a internet"
    Es el fallo de seguridad más repetido en despliegues con Docker. Publicar el puerto de MySQL o PostgreSQL lo hace accesible desde **cualquier dirección**, no solo desde tu aplicación.

    La aplicación no necesita ese puerto publicado: le basta con estar en la misma red y usar el nombre del servicio. Si de verdad necesitas acceso externo para administrar, publícalo restringido al equipo local:

    ```yaml
    ports:
      - "127.0.0.1:3306:3306"
    ```
    Y aun así, lo correcto es entrar por un túnel, no dejar el puerto abierto.

Recuerda que `EXPOSE` en el `Dockerfile` no publica nada: solo documenta. La publicación real siempre es `-p` o `ports:`.

---

## Llegar a tu máquina desde un contenedor {: .topic-title }

Este caso aparece constantemente cuando ya tienes servicios instalados en el equipo: un MySQL de XAMPP, un servidor de desarrollo, un depurador escuchando.

Desde dentro del contenedor, `localhost` es **el propio contenedor**. Para referirte a tu ordenador hay un nombre especial:

```
host.docker.internal
```

```bash
# El contenedor se conecta al MySQL que corre en tu equipo, no en otro contenedor
docker run -d -e DB_HOST=host.docker.internal mi-aplicacion
```

Funciona directamente en Windows y macOS. En Linux hay que declararlo:

```yaml
services:
  app:
    build: .
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

!!! tip "Es la pieza que falta para depurar con Xdebug"
    Xdebug corre **dentro** del contenedor y tiene que conectarse a tu editor, que corre **fuera**. Por eso la configuración lleva siempre `xdebug.client_host=host.docker.internal`: le estás diciendo al depurador dónde encontrar tu máquina.

    Si el depurador nunca se activa, este suele ser el motivo.

---

## Diagnosticar {: .topic-title }

Cuando algo no conecta, el orden de comprobación es siempre el mismo.

```bash
# 1. ¿Están los dos contenedores en la misma red?
docker network inspect mi-red

# 2. ¿Se resuelve el nombre desde dentro?
docker exec -it api ping -c 2 db

# 3. ¿Responde el puerto?
docker exec -it api curl -v telnet://db:3306

# 4. ¿Está escuchando el servicio de verdad?
docker logs db
```

!!! warning "Muchas imágenes no traen `ping` ni `curl`"
    Las imágenes ligeras vienen sin herramientas de diagnóstico. En vez de instalarlas dentro (que se pierde al recrear el contenedor), arranca uno temporal en la misma red:

    ```bash
    docker run --rm -it --network mi-red alpine sh
    # dentro: apk add curl && curl http://api
    ```

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Crear una red propia para que funcionen los nombres | Confiar en la red `bridge` por defecto y buscar IPs |
| Publicar solo los puertos que se usan desde fuera | Publicar el puerto de la base de datos "por si acaso" |
| `127.0.0.1:puerto:puerto` cuando el acceso es solo local | `-p 3306:3306` en un servidor accesible desde internet |
| `host.docker.internal` para llegar a tu equipo | `localhost` dentro del contenedor esperando salir de él |
| Diagnosticar con un contenedor temporal en la misma red | Instalar `curl` dentro del contenedor de producción |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — Docker avanzado** | https://apunts.institutmontilivi.cat/DAW-MP08/dockerWindows/dockerWin002/ |
| 🐳 **Docker — Networking** | https://docs.docker.com/engine/network/ |
