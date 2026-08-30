# Volúmenes { .bloque-devops }

> Un contenedor es efímero: al borrarlo desaparece todo lo que escribió dentro. Un volumen es un espacio de almacenamiento que vive **fuera** del contenedor, así que sobrevive a que lo destruyan y lo vuelvan a crear.

---

## El problema {: .topic-title }

El sistema de ficheros de un contenedor forma parte del propio contenedor. Al hacer `docker rm`, se va con él.

Eso está bien para todo lo que sea reproducible: el código, las dependencias, los binarios. Se reconstruyen desde el `Dockerfile` en segundos.

Pero hay cosas que no se pueden reconstruir: los datos de una base de datos, los ficheros que suben los usuarios, los certificados generados. Esos tienen que estar en un sitio que no dependa del ciclo de vida del contenedor.

!!! danger "Actualizar la imagen implica recrear el contenedor"
    Es el escenario donde esto duele de verdad. Para pasar de `mysql:8.0` a `mysql:8.4` hay que borrar el contenedor y crear otro con la imagen nueva.

    Si la base de datos vivía dentro del contenedor, esa actualización **borra todos los datos**. Con un volumen, el contenedor nuevo se engancha al mismo almacenamiento y no se pierde nada.

---

## Los tres tipos {: .topic-title }

| Tipo | Dónde se guarda | Para qué |
|---|---|---|
| **Volumen con nombre** | En un área que gestiona Docker | Datos que deben persistir: bases de datos, subidas |
| **Montaje de directorio** | Una carpeta concreta de tu máquina | Desarrollo: ver los cambios de código al instante |
| **`tmpfs`** | En la memoria RAM, nunca en disco | Datos temporales y sensibles |

---

## Volúmenes con nombre {: .topic-title }

Docker crea y administra el espacio; tú solo le pones un nombre y dices dónde se monta dentro del contenedor.

```bash
docker volume create datos_mysql

docker run -d \
    --name base-datos \
    -v datos_mysql:/var/lib/mysql \
    -e MYSQL_ROOT_PASSWORD=secreto \
    mysql:8.4
```

No hace falta crearlo antes: si el volumen no existe, `docker run` lo crea.

```bash
docker volume ls                    # listar
docker volume inspect datos_mysql   # dónde está y desde cuándo
docker volume rm datos_mysql        # borrarlo (¡destruye los datos!)
```

Es la opción por defecto para cualquier cosa que deba persistir. Docker se encarga de los permisos y de la ubicación, y funciona igual en Linux, Windows y macOS.

!!! warning "Borrar el contenedor NO borra el volumen"
    Y es intencionado: esa es precisamente su razón de ser. Pero tiene una consecuencia práctica — los volúmenes se acumulan sin que te des cuenta y ocupan espacio.

    ```bash
    docker volume ls -f dangling=true   # volúmenes que no usa nadie
    docker volume prune                 # borrarlos
    ```
    Revisa la lista **antes** de ejecutar `prune`: entre esos huérfanos puede estar la base de datos de un proyecto que solo tienes parado.

---

## Montajes de directorio {: .topic-title }

Un *bind mount* enlaza una carpeta real de tu máquina con una ruta dentro del contenedor. Los dos lados ven exactamente los mismos ficheros: lo que edites en tu editor aparece dentro al instante.

```bash
docker run -d \
    --name web \
    -p 8080:80 \
    -v ./src:/var/www/html \
    php:8.3-apache
```

Es **la herramienta de desarrollo**: escribes código en tu editor de siempre y el contenedor lo ejecuta sin reconstruir la imagen.

!!! danger "En producción, un montaje de directorio rompe la reproducibilidad"
    Toda la gracia de una imagen es que contiene lo que necesita. Si en producción el código viene de una carpeta del servidor, la imagen ya no es autosuficiente: depende de que esa carpeta exista, tenga los permisos correctos y esté actualizada.

    Regla: **montaje de directorio en desarrollo, código dentro de la imagen en producción.**

!!! tip "El montaje tapa lo que hubiera en esa ruta"
    Si montas `./src` sobre `/var/www/html` y el contenedor ya tenía ficheros ahí, dejan de verse — no se borran, quedan ocultos debajo.

    Esto explica un fallo muy típico: montar el proyecto sobre una carpeta que contenía un `vendor/` o `node_modules/` instalado durante la construcción, y encontrarse con que la aplicación ya no arranca. La solución habitual es declarar esa subcarpeta como volumen aparte:

    ```yaml
    volumes:
      - ./:/app
      - /app/node_modules      # protege lo instalado en la imagen
    ```

Solo lectura, cuando el contenedor no debe modificar nada:

```bash
docker run -v ./config:/etc/app/config:ro mi-imagen
```

### Los permisos de los ficheros creados dentro

Un montaje de directorio comparte ficheros entre dos sistemas que no tienen los mismos usuarios. En Linux, cada usuario es un número —el **UID**—, y el contenedor tiene los suyos propios.

El resultado: los ficheros que crea el contenedor aparecen en tu carpeta con el propietario que tuvieran dentro. Si el proceso corría como administrador, esos ficheros quedan como propiedad del administrador y tu editor no puede modificarlos ni borrarlos.

!!! danger "«No puedo borrar la carpeta de caché que generó el contenedor»"
    Es exactamente este problema, y es la razón número uno de frustración con Docker en Linux.

    La solución limpia es construir la imagen con un usuario que tenga **tu mismo número**:

    ```dockerfile
    ARG UID=1000
    RUN adduser -u ${UID} -D app
    USER app
    ```
    ```yaml
    services:
      app:
        build:
          context: .
          args:
            UID: ${UID:-1000}
    ```
    Tu número lo averiguas con `id -u`. El parche de emergencia es `sudo chown -R $USER:$USER .`, pero volverá a pasar en cuanto el contenedor escriba otra vez.

    En Windows y macOS este problema casi no se manifiesta, porque Docker Desktop traduce los permisos. Conviene conocerlo igualmente: el servidor donde despliegues sí será Linux.

---

## `tmpfs` {: .topic-title }

Guarda en la memoria RAM del anfitrión, nunca en disco. Al parar el contenedor, desaparece sin dejar rastro.

```bash
docker run -d --tmpfs /tmp:rw,size=100m mi-imagen
```

Sirve para ficheros temporales que se escriben mucho (más rápido que el disco) y para datos sensibles que no deben quedar escritos en ninguna parte.

---

## Volúmenes en Compose {: .topic-title }

En un `docker-compose.yml` los volúmenes se declaran en dos sitios: dentro del servicio que los usa, y en una sección global si son volúmenes con nombre.

```yaml
services:
  web:
    image: php:8.3-apache
    ports:
      - "8080:80"
    volumes:
      - ./src:/var/www/html          # montaje de directorio: ruta relativa

  db:
    image: mysql:8.4
    environment:
      MYSQL_ROOT_PASSWORD: secreto
    volumes:
      - datos_mysql:/var/lib/mysql   # volumen con nombre

volumes:
  datos_mysql:                       # declaración global, obligatoria
```

La diferencia se ve en la sintaxis: si empieza por `./` o `/` es un montaje de directorio; si es un nombre suelto, es un volumen con nombre y **hay que declararlo** en la sección `volumes:` de arriba.

---

## Copias de seguridad {: .topic-title }

Un volumen no se copia arrastrándolo: no está en una carpeta accesible sin más. La técnica es arrancar un contenedor temporal que monte el volumen y comprima su contenido.

```bash
# Guardar
docker run --rm \
    -v datos_mysql:/origen \
    -v ./copias:/destino \
    alpine tar czf /destino/copia.tar.gz -C /origen .

# Restaurar
docker run --rm \
    -v datos_mysql:/destino \
    -v ./copias:/origen \
    alpine tar xzf /origen/copia.tar.gz -C /destino
```

!!! warning "Para una base de datos, mejor su propia herramienta"
    Copiar los ficheros de un MySQL en marcha puede dejar una copia inconsistente, a medio escribir. Lo correcto es usar el volcado propio del motor:

    ```bash
    docker exec base-datos mysqldump -u root -p --all-databases > copia.sql
    ```
    La copia del volumen sirve cuando el contenedor está parado, o para datos que no son una base de datos.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Volumen con nombre para todo dato que deba persistir | Confiar en el sistema de ficheros del contenedor |
| Montaje de directorio solo en desarrollo | Montar el código desde el disco en producción |
| Declarar los volúmenes con nombre en la sección global de Compose | Usar un nombre suelto sin declararlo |
| Revisar `docker volume ls` antes de un `prune` | Borrar volúmenes huérfanos a ciegas |
| `:ro` cuando el contenedor solo tiene que leer | Dar permiso de escritura por defecto |
| `mysqldump` u otra herramienta del motor para bases de datos | Copiar los ficheros de una base de datos en marcha |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — Volúmenes y persistencia** | https://apunts.institutmontilivi.cat/DAW-MP08/uf3/0614_Bloc3_docker_002/ |
| 🐳 **Docker — Volumes** | https://docs.docker.com/engine/storage/volumes/ |
| 🐳 **Docker — Bind mounts** | https://docs.docker.com/engine/storage/bind-mounts/ |
