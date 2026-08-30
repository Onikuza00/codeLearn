# Comandos básicos { .bloque-devops }

> El conjunto de órdenes que se usan a diario: arrancar contenedores, mirar qué está corriendo, entrar dentro a inspeccionar y limpiar lo que sobra.

---

## Ciclo de vida de un contenedor {: .topic-title }

Un contenedor pasa por estados, y hay un comando para cada transición. Entender esto evita la confusión más común: creer que `docker run` es la única forma de arrancar algo.

| Comando | Qué hace |
|---|---|
| `docker create` | Crea el contenedor **sin** arrancarlo |
| `docker start` | Arranca un contenedor que ya existe |
| `docker run` | Crea **y** arranca de una vez — `create` + `start` |
| `docker stop` | Lo detiene con cortesía (le da unos segundos para cerrar) |
| `docker kill` | Lo mata al instante, sin margen |
| `docker restart` | `stop` seguido de `start` |
| `docker rm` | Borra el contenedor detenido |

!!! danger "`docker run` NO reanuda un contenedor: crea uno nuevo"
    Es el error de principiante más caro. Si paras un contenedor y vuelves a escribir el mismo `docker run`, Docker intenta crear **otro** contenedor. Y si le habías puesto nombre con `--name`, falla con "el nombre ya está en uso".

    Para volver a levantar el que ya tenías:

    ```bash
    docker start mi-contenedor
    ```

    Regla: `run` **una vez**, `start`/`stop` el resto de la vida del contenedor.

---

## Imágenes {: .topic-title }

```bash
docker search mysql            # buscar en Docker Hub
docker pull mysql:8            # descargar una versión concreta
docker images                  # listar las que tienes en local
docker rmi mysql:8             # borrar una imagen
```

Una imagen se identifica por `nombre:etiqueta`. La etiqueta es la versión.

!!! warning "No uses `latest` en nada que importe"
    `mysql` sin etiqueta equivale a `mysql:latest`, que no significa "la última" sino "la que esté marcada así en el registro hoy". Esa marca cambia con el tiempo.

    El resultado: la imagen que funcionaba hace tres meses ya no es la misma, y una actualización mayor entra sin avisar. **Fija siempre la versión** — `mysql:8.4`, `node:22`, `php:8.3-fpm` —, igual que fijas versiones en `composer.json` o `package.json`.

---

## `docker run` y sus banderas {: .topic-title }

Es el comando con más opciones, pero en la práctica se repiten siempre las mismas.

```bash
docker run -d -p 8080:80 --name web -v ./html:/var/www/html nginx:1.27
```

| Bandera | Qué hace |
|---|---|
| `-d` | *Detached*: en segundo plano, devuelve la terminal |
| `-it` | Interactivo con terminal — para entrar a una shell |
| `-p host:contenedor` | Publica un puerto del contenedor en la máquina |
| `-v origen:destino` | Monta un volumen o un directorio |
| `--name` | Le da un nombre en vez de uno aleatorio |
| `--rm` | Lo borra automáticamente al detenerse |
| `-e CLAVE=valor` | Define una variable de entorno |
| `--restart unless-stopped` | Lo levanta solo al reiniciar la máquina |

!!! tip "El orden del mapeo de puertos: primero el de fuera"
    `-p 8080:80` significa **puerto 8080 de tu máquina → puerto 80 del contenedor**. El de la izquierda es por el que entras desde el navegador; el de la derecha es el que escucha la aplicación dentro.

    Invertirlo es un fallo silencioso: el contenedor arranca sin quejarse, pero la aplicación no responde en la dirección esperada. Mnemotécnica: **de fuera hacia dentro**, igual que se lee.

!!! info "`--rm` para pruebas, nunca para servicios"
    `docker run --rm -it ubuntu:24.04 bash` te deja una terminal en un Ubuntu limpio que desaparece al salir. Es perfecto para probar algo sin dejar rastro.

    En un servicio que debe conservar su estado entre reinicios, `--rm` es justo lo contrario de lo que quieres.

---

## Ver qué está pasando {: .topic-title }

```bash
docker ps                 # contenedores EN EJECUCIÓN
docker ps -a              # todos, incluidos los parados
docker logs web           # la salida del contenedor
docker logs -f web        # seguir la salida en vivo
docker logs --tail 50 web # solo las últimas 50 líneas
docker stats              # consumo de CPU y memoria en tiempo real
docker inspect web        # toda la configuración, en JSON
```

!!! tip "Cuando un contenedor arranca y muere al instante, mira los logs"
    `docker ps` no lo muestra porque ya no corre; `docker ps -a` lo muestra como *Exited*. La razón está siempre en `docker logs <nombre>`: una variable de entorno que falta, un puerto ocupado, un fichero de configuración mal escrito.

    Es el primer sitio donde mirar, antes que ninguna otra cosa.

---

## Entrar en un contenedor {: .topic-title }

```bash
docker exec -it web bash        # abrir una shell dentro
docker exec web ls /var/www     # ejecutar un solo comando
```

`exec` ejecuta algo **en un contenedor que ya está corriendo**. Si el contenedor está parado, falla; hay que arrancarlo antes.

Algunas imágenes muy ligeras (las basadas en Alpine) no traen `bash`. En ellas se usa `sh`:

```bash
docker exec -it web sh
```

!!! warning "Lo que instales con `exec` desaparece al recrear el contenedor"
    Entrar y hacer `apt install` funciona para salir del paso, pero ese cambio vive solo en ese contenedor concreto. Al borrarlo y recrearlo, no queda nada.

    Si algo tiene que estar siempre, va en el [Dockerfile](../02-dockerfile/index.md). Un contenedor debe poder recrearse desde cero y quedar exactamente igual.

Para mover ficheros entre la máquina y el contenedor:

```bash
docker cp web:/etc/nginx/nginx.conf ./nginx.conf   # de dentro a fuera
docker cp ./nginx.conf web:/etc/nginx/nginx.conf   # de fuera a dentro
```

---

## Limpieza {: .topic-title }

Docker acumula mucho espacio sin avisar: imágenes viejas, contenedores parados, capas intermedias de construcciones.

```bash
docker system df           # cuánto espacio ocupa cada cosa
docker container prune     # borrar contenedores parados
docker image prune         # borrar imágenes sin etiqueta (huérfanas)
docker volume prune        # borrar volúmenes que no usa nadie
docker system prune        # todo lo anterior + redes y caché sin usar
```

Los mismos borrados, con filtros, cuando quieres ver antes qué se va a llevar:

```bash
docker ps -q -f "status=exited"                 # listar lo que se borraría
docker rm $(docker ps -q -f "status=exited")    # y borrarlo

docker volume ls -q -f "dangling=true"
docker rmi $(docker images -q -f "dangling=true")
```

!!! danger "`docker system prune -a --volumes` borra los datos"
    Sin banderas, `prune` toca solo lo que no está en uso. Con `-a` borra **todas** las imágenes que no tengan un contenedor corriendo, y con `--volumes` se lleva por delante los volúmenes.

    Eso significa las bases de datos de tus proyectos parados. Antes de escribir `--volumes`, comprueba con `docker volume ls` qué hay ahí.

---

!!! tip "Portainer: los mismos comandos, con interfaz web"
    Portainer es un contenedor que sirve un panel desde el que ves imágenes, contenedores, volúmenes y logs, y puedes pararlos o borrarlos con el ratón.

    ```yaml
    services:
      portainer:
        image: portainer/portainer-ce
        volumes:
          - /var/run/docker.sock:/var/run/docker.sock
          - portainer_data:/data
        ports:
          - "127.0.0.1:9000:9000"

    volumes:
      portainer_data:
    ```
    Ayuda a hacerse una imagen mental de lo que hay montado. Dos avisos: monta el socket de Docker, así que **quien entre en Portainer controla todo el motor** —publícalo solo en `127.0.0.1`—, y no sustituye a saber los comandos, porque en un servidor solo tendrás la terminal.

---

## Chuleta {: .topic-title }

| Quiero... | Comando |
|---|---|
| Ver qué corre | `docker ps` |
| Ver también lo parado | `docker ps -a` |
| Arrancar algo por primera vez | `docker run -d --name X imagen` |
| Volver a levantar lo que ya existe | `docker start X` |
| Pararlo | `docker stop X` |
| Ver por qué ha fallado | `docker logs X` |
| Entrar dentro | `docker exec -it X bash` |
| Borrarlo | `docker stop X && docker rm X` |
| Ver cuánto espacio ocupa Docker | `docker system df` |

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — Introducción a Docker** | https://apunts.institutmontilivi.cat/DAW-MP08/uf3/0614_Bloc3_docker_001/ |
| 🐳 **Docker — Referencia de la CLI** | https://docs.docker.com/reference/cli/docker/ |
