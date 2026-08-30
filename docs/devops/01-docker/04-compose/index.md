# Docker Compose { .bloque-devops }

> Una aplicación real no es un contenedor: son varios que tienen que hablar entre sí — la web, la base de datos, la caché. Compose describe todo ese conjunto en un fichero y lo levanta con un solo comando.

---

## Qué resuelve {: .topic-title }

Sin Compose, arrancar una aplicación con base de datos significa escribir dos `docker run` largos, en el orden correcto, creando antes la red que los conecta y recordando de memoria cada puerto y cada variable.

Compose mueve todo eso a un fichero `docker-compose.yml` que vive en el repositorio. Cualquiera que clone el proyecto lo levanta igual:

```bash
docker compose up -d
```

El fichero es documentación ejecutable: describe la arquitectura del proyecto y a la vez la pone en marcha.

!!! info "`docker compose`, sin guion"
    La versión antigua era un programa aparte que se invocaba como `docker-compose` (con guion). Hoy es un subcomando integrado: **`docker compose`**, separado por espacio.

    Verás las dos formas en tutoriales. La versión con guion está descatalogada; usa la nueva.

---

## Anatomía del fichero {: .topic-title }

```yaml
services:
  web:
    build: .
    ports:
      - "8080:80"
    volumes:
      - ./src:/var/www/html
    environment:
      DATABASE_URL: "mysql://app:secreto@db:3306/tienda"
    depends_on:
      - db

  db:
    image: mysql:8.4
    environment:
      MYSQL_DATABASE: tienda
      MYSQL_USER: app
      MYSQL_PASSWORD: secreto
      MYSQL_ROOT_PASSWORD: raiz
    volumes:
      - datos_mysql:/var/lib/mysql

volumes:
  datos_mysql:
```

| Clave | Qué hace |
|---|---|
| `services` | Cada entrada es un contenedor del conjunto |
| `image` | Usa una imagen ya existente del registro |
| `build` | Construye la imagen desde un `Dockerfile` local |
| `ports` | Publica puertos, con el mismo orden `fuera:dentro` |
| `volumes` | Volúmenes y montajes de directorio del servicio |
| `environment` | Variables de entorno |
| `depends_on` | Orden de arranque entre servicios |

`image` y `build` son alternativos: o usas una imagen hecha, o construyes la tuya.

---

## Cómo se comunican los servicios {: .topic-title }

Compose crea automáticamente una red privada para el proyecto, y **el nombre de cada servicio funciona como su dirección** dentro de esa red.

Por eso, en el ejemplo anterior, la aplicación se conecta a `mysql://app:secreto@db:3306/tienda`: `db` es el nombre del servicio.

!!! danger "Dentro de la red, `localhost` no es lo que crees"
    ```
    DATABASE_URL: "mysql://app:secreto@localhost:3306/tienda"   # ❌
    DATABASE_URL: "mysql://app:secreto@db:3306/tienda"          # ✅
    ```
    Cada contenedor tiene su propio `localhost`, que apunta a **sí mismo**. Desde el contenedor `web`, `localhost` es el propio `web`, donde no hay ninguna base de datos escuchando.

    Es probablemente el fallo número uno al montar el primer Compose, y el mensaje de error (`Connection refused`) no ayuda a verlo.

    La otra cara: `ports` solo hace falta para lo que tenga que ser accesible **desde tu navegador**. Los servicios se hablan entre sí por la red interna sin publicar ningún puerto — una base de datos en producción no debería exponer el 3306 al exterior.

---

## `depends_on` y el orden de arranque {: .topic-title }

`depends_on` garantiza que un contenedor **arranque** antes que otro. No garantiza que el servicio de dentro esté **listo**.

Un MySQL tarda unos segundos en aceptar conexiones después de que su contenedor esté en marcha. Durante ese hueco, la aplicación intenta conectarse y falla.

La solución es esperar a una comprobación de salud, no solo al arranque:

```yaml
services:
  db:
    image: mysql:8.4
    environment:
      MYSQL_ROOT_PASSWORD: raiz
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 5s
      timeout: 3s
      retries: 10

  web:
    build: .
    depends_on:
      db:
        condition: service_healthy      # espera a que responda de verdad
```

!!! tip "Aun con `healthcheck`, la aplicación debería reintentar"
    Una base de datos puede reiniciarse en cualquier momento, no solo al arrancar el conjunto. Una aplicación que se cae para siempre porque su primera conexión falló es frágil.

    Lo robusto es reintentar la conexión unas cuantas veces con espera creciente. Es el mismo principio que la reconexión de un WebSocket.

---

## Variables de entorno {: .topic-title }

Las contraseñas no se escriben en el `docker-compose.yml`, porque ese fichero va al repositorio. Se ponen en un `.env` junto a él, que Compose lee automáticamente.

```bash
# .env  (en el .gitignore)
MYSQL_PASSWORD=secreto_de_verdad
PUERTO_WEB=8080
```

```yaml
services:
  web:
    ports:
      - "${PUERTO_WEB}:80"
  db:
    environment:
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
```

!!! danger "El `.env` va al `.gitignore`, siempre"
    Y en el repositorio se deja un `.env.example` con las mismas claves y valores falsos, para que quien clone el proyecto sepa qué tiene que rellenar.

    Un `.env` con contraseñas reales subido a Git queda en el historial aunque lo borres después: hay que rotar esas contraseñas, no basta con quitar el fichero.

---

## Comandos {: .topic-title }

```bash
docker compose up -d          # levantar todo en segundo plano
docker compose up -d --build  # reconstruir las imágenes antes de levantar
docker compose ps             # estado de los servicios
docker compose logs -f web    # seguir los logs de un servicio
docker compose exec web bash  # abrir una shell en un servicio
docker compose restart web    # reiniciar uno solo
docker compose down           # parar y borrar los contenedores
```

!!! danger "`down -v` borra los volúmenes"
    `docker compose down` para los contenedores y borra la red, pero **respeta los volúmenes**: los datos siguen ahí para el próximo `up`.

    `docker compose down -v` añade los volúmenes al borrado. Es útil para empezar de cero con una base de datos limpia, y desastroso si lo escribes por costumbre en un proyecto con datos que importan.

!!! tip "Después de cambiar el `Dockerfile`, hace falta `--build`"
    `docker compose up` reutiliza la imagen que ya construyó. Si tocas el `Dockerfile` y no ves el cambio, es que estás levantando la imagen antigua.

    ```bash
    docker compose up -d --build
    ```
    Los cambios en el propio `docker-compose.yml` (puertos, variables, volúmenes) sí se aplican con un `up` normal.

---

## Escalar un servicio {: .topic-title }

Compose puede arrancar varias copias del mismo servicio:

```bash
docker compose up -d --scale web=5
```

Para que sirva de algo hacen falta dos condiciones:

1. **El servicio no puede publicar un puerto fijo.** Cinco contenedores no caben en el puerto 8080 de tu máquina. Se quita el `ports:` de ese servicio.
2. **Alguien tiene que repartir el tráfico.** Un balanceador delante —Nginx o Traefik— que reciba las peticiones y las distribuya entre las copias.

!!! info "Escalar solo funciona si el servicio no guarda estado"
    Si cada copia guarda la sesión del usuario en su propia memoria, la segunda petición puede caer en otra copia que no sabe quién eres, y el usuario aparece deslogueado de forma aleatoria.

    Por eso las aplicaciones pensadas para escalar guardan la sesión fuera: en Redis o en la base de datos. Es la misma idea que con los volúmenes — el contenedor debe poder destruirse y sustituirse sin que se pierda nada.

    Para desarrollo local rara vez lo necesitas. Merece la pena conocerlo porque es la pregunta natural de arquitectura: "¿y si esto recibe mucho tráfico?".

---

## Perfiles {: .topic-title }

Los perfiles permiten declarar servicios que **no** arrancan por defecto, y activarlos solo cuando hagan falta.

```yaml
services:
  web:
    build: .

  adminer:
    image: adminer:latest
    ports:
      - "8081:8080"
    profiles: ["herramientas"]
```

```bash
docker compose up -d                            # solo web
docker compose --profile herramientas up -d     # web + adminer
```

Es la forma limpia de tener utilidades de desarrollo —un cliente de base de datos, un visor de correo— en el mismo fichero sin que carguen siempre.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Usar el nombre del servicio como dirección (`db`) | `localhost` para hablar con otro contenedor |
| Publicar puertos solo de lo que se accede desde fuera | Exponer el puerto de la base de datos por defecto |
| `healthcheck` + `condition: service_healthy` | Confiar en que `depends_on` significa "está listo" |
| Contraseñas en `.env`, con `.env.example` versionado | Contraseñas escritas en el `docker-compose.yml` |
| Volumen con nombre para los datos de la base de datos | Dejar los datos dentro del contenedor |
| `--build` tras tocar el `Dockerfile` | Extrañarse de que el cambio no aparezca |
| Fijar la versión de cada imagen | `image: mysql` sin etiqueta |
| Pensar dos veces antes de `down -v` | Escribir `-v` por costumbre |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — Volúmenes y Compose** | https://apunts.institutmontilivi.cat/DAW-MP08/uf3/0614_Bloc3_docker_002/ |
| 🐳 **Docker — Compose** | https://docs.docker.com/compose/ |
| 🐳 **Docker — Referencia del fichero Compose** | https://docs.docker.com/reference/compose-file/ |
