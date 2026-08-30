# Un stack de Symfony { .bloque-devops }

> Todas las piezas anteriores juntas en el caso real: una aplicación Symfony servida por Nginx y PHP-FPM, con su base de datos, montada para desarrollo y preparada para producción.

---

## Por qué tres servicios {: .topic-title }

Una aplicación Symfony en producción no es un solo proceso. Son tres, y cada uno tiene un trabajo distinto:

| Servicio | Qué hace |
|---|---|
| **Nginx** | Recibe las peticiones HTTP. Sirve directamente los ficheros estáticos y pasa el resto a PHP |
| **PHP-FPM** | Ejecuta el código PHP. No entiende de HTTP: habla un protocolo propio con Nginx |
| **MySQL** | Guarda los datos |

Esa separación es la razón de que `php:8.3-apache` sirva para aprender pero no para trabajar: mete el servidor web y el intérprete en el mismo contenedor, y eso impide escalarlos por separado o cambiar uno sin tocar el otro.

!!! info "PHP-FPM no sirve páginas por sí solo"
    FPM significa *FastCGI Process Manager*. Es un intérprete de PHP que escucha peticiones en el puerto 9000 con un protocolo llamado FastCGI, no HTTP.

    Por eso si publicas el puerto de PHP-FPM y lo abres en el navegador no ves nada: hace falta Nginx delante traduciendo. Ese reparto explica la configuración que viene a continuación.

---

## Estructura del proyecto {: .topic-title }

```
mi-proyecto/
├── docker/
│   ├── nginx/
│   │   └── default.conf
│   └── php/
│       └── Dockerfile
├── src/
├── public/
│   └── index.php
├── composer.json
├── .dockerignore
├── .env
└── compose.yaml
```

La convención de dejar la configuración de infraestructura en una carpeta `docker/` mantiene la raíz del proyecto legible.

---

## El Dockerfile de PHP {: .topic-title }

La imagen oficial de PHP viene desnuda: hay que instalarle las extensiones que Symfony y Doctrine necesitan.

```dockerfile
FROM php:8.3-fpm-alpine

# Dependencias del sistema y extensiones de PHP
RUN apk add --no-cache git unzip icu-dev libzip-dev \
    && docker-php-ext-install pdo_mysql intl zip opcache \
    && apk del icu-dev libzip-dev

# Composer, copiado desde su propia imagen oficial
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Primero las dependencias: esta capa se reaprovecha entre construcciones
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader --no-dev --prefer-dist

# Ahora el código
COPY . .
RUN composer dump-autoload --optimize --no-dev

# Permisos de las carpetas que Symfony escribe
RUN mkdir -p var/cache var/log \
    && chown -R www-data:www-data var

USER www-data

EXPOSE 9000
CMD ["php-fpm"]
```

Tres decisiones que conviene entender:

**`docker-php-ext-install`** es una utilidad que traen las imágenes oficiales de PHP para compilar extensiones. Las de arriba son el mínimo de Symfony: `pdo_mysql` para Doctrine, `intl` para traducciones y formatos, `zip` para Composer, `opcache` para rendimiento.

**`COPY --from=composer:2`** trae el binario de Composer desde su imagen oficial en vez de instalarlo con un script. Es más limpio y queda fijado a una versión.

**`composer.json` y `composer.lock` antes que el código**, por lo mismo que en cualquier otro lenguaje: las dependencias solo se reinstalan cuando cambian de verdad.

!!! danger "Los permisos de `var/` son el fallo número uno de Symfony en Docker"
    Symfony escribe en `var/cache` y `var/log`. Si el proceso de PHP no tiene permiso, la aplicación devuelve un error 500 sin más explicación que una traza sobre no poder escribir un fichero.

    El `chown -R www-data:www-data var` del Dockerfile lo resuelve para producción. En desarrollo, con el código montado desde tu disco, hay que mirar además la sección de permisos más abajo.

---

## La configuración de Nginx {: .topic-title }

```nginx
# docker/nginx/default.conf
server {
    listen 80;
    server_name _;
    root /var/www/public;

    location / {
        try_files $uri /index.php$is_args$args;
    }

    location ~ ^/index\.php(/|$) {
        fastcgi_pass php:9000;
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $document_root;
        internal;
    }

    location ~ \.php$ {
        return 404;
    }

    error_log /var/log/nginx/error.log;
    access_log /var/log/nginx/access.log;
}
```

Lo importante de este fichero:

- **`root` apunta a `public/`**, no a la raíz del proyecto. Todo lo que hay fuera de `public/` —tu código, la configuración, el `.env`— queda inaccesible desde el navegador.
- **`try_files $uri /index.php...`** es el controlador frontal: si la ruta no corresponde a un fichero real, se la pasa a Symfony para que la resuelva su enrutador.
- **`fastcgi_pass php:9000`** usa el nombre del servicio como dirección, exactamente como se explica en la página de [redes](../05-redes/index.md).
- **`location ~ \.php$ { return 404; }`** bloquea la ejecución de cualquier otro `.php`. Es una medida de seguridad, no un adorno.

---

## El fichero de Compose {: .topic-title }

```yaml
# compose.yaml
services:
  php:
    build:
      context: .
      dockerfile: docker/php/Dockerfile
    volumes:
      - ./:/var/www
      - /var/www/vendor          # protege el vendor de la imagen
    environment:
      DATABASE_URL: "mysql://app:${DB_PASSWORD}@db:3306/app?serverVersion=8.4"
      APP_ENV: dev
    depends_on:
      db:
        condition: service_healthy

  nginx:
    image: nginx:1.27-alpine
    ports:
      - "8080:80"
    volumes:
      - ./:/var/www
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - php

  db:
    image: mysql:8.4
    environment:
      MYSQL_DATABASE: app
      MYSQL_USER: app
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
    volumes:
      - datos_mysql:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 5s
      retries: 10

volumes:
  datos_mysql:
```

!!! warning "Nginx también necesita ver el código"
    Es un detalle que sorprende: si Nginx solo pasara las peticiones a PHP, no le haría falta. Pero sirve directamente los ficheros estáticos —imágenes, CSS, JavaScript compilado— y para eso tiene que tenerlos.

    Por eso el mismo `./:/var/www` aparece en los dos servicios. Si falta en Nginx, la aplicación funciona pero se ve sin estilos.

!!! danger "La línea `- /var/www/vendor` no es un error de escritura"
    El montaje `./:/var/www` tapa toda la carpeta con el contenido de tu disco, **incluido el `vendor/` que se instaló durante la construcción**. La aplicación deja de encontrar sus dependencias.

    Declarar `/var/www/vendor` como volumen anónimo aparte hace que esa subcarpeta conserve lo que traía la imagen. Es el mismo truco que con `node_modules` en un proyecto de Node.

    La alternativa es no ponerlo y ejecutar `composer install` desde dentro del contenedor; entonces el `vendor/` vive en tu disco. Funciona, pero es más lento en Windows y macOS.

---

## Levantarlo y trabajar {: .topic-title }

```bash
docker compose up -d --build

# La consola de Symfony se ejecuta dentro del contenedor de PHP
docker compose exec php php bin/console doctrine:migrations:migrate
docker compose exec php php bin/console cache:clear
docker compose exec php composer require symfony/uid

# Los logs de Symfony
docker compose exec php tail -f var/log/dev.log
```

La aplicación queda en `http://localhost:8080`.

!!! tip "Todos los comandos del proyecto pasan por `docker compose exec php`"
    Es el cambio de costumbre más grande al pasar un proyecto a Docker. `composer`, `bin/console` y `phpunit` ya no se ejecutan en tu máquina: se ejecutan dentro del contenedor, donde está la versión correcta de PHP con sus extensiones.

    Si ejecutas `php bin/console` en tu terminal de Windows, estás usando el PHP de XAMPP, que probablemente sea otra versión y no tenga las mismas extensiones.

---

## Permisos en desarrollo {: .topic-title }

Este es el problema que más tiempo hace perder, y es específico de Linux.

Cuando montas tu carpeta dentro del contenedor, los ficheros que **crea el contenedor** aparecen en tu disco con el propietario que tuviera dentro. En Linux eso significa que la caché generada por Symfony te sale como propiedad de otro usuario y tu editor no puede tocarla.

La solución es hacer que el usuario del contenedor tenga tu mismo identificador:

```dockerfile
ARG UID=1000
ARG GID=1000

RUN addgroup -g ${GID} app \
    && adduser -u ${UID} -G app -s /bin/sh -D app

USER app
```

```yaml
services:
  php:
    build:
      context: .
      dockerfile: docker/php/Dockerfile
      args:
        UID: ${UID:-1000}
        GID: ${GID:-1000}
```

Y en el `.env`, con tus identificadores reales (`id -u` y `id -g` en la terminal).

!!! info "En Windows con WSL 2 esto casi nunca aparece"
    Docker Desktop traduce los permisos entre sistemas, así que el problema no se manifiesta igual. Aun así conviene tener la solución escrita: el servidor donde despliegues sí será Linux, y quien trabaje contigo en Linux lo va a sufrir.

    Ver la sección de [permisos](../../02-linux/03-permisos/index.md) para entender qué son esos identificadores.

---

## Diferencias con producción {: .topic-title }

El fichero de arriba es de desarrollo. En producción cambian cuatro cosas:

| | Desarrollo | Producción |
|---|---|---|
| Código | Montado desde el disco | **Dentro de la imagen**, sin montaje |
| `APP_ENV` | `dev` | `prod` |
| Dependencias | Con las de desarrollo | `composer install --no-dev --optimize-autoloader` |
| Base de datos | Contenedor | Servicio gestionado, normalmente fuera de Docker |

!!! danger "En producción, `APP_DEBUG` a `1` filtra información"
    Con la depuración activada, cualquier error muestra la traza completa: rutas de ficheros, fragmentos de código, valores de variables y a veces cadenas de conexión. La barra de depuración de Symfony expone además toda la configuración.

    Comprueba siempre que en el entorno real están `APP_ENV=prod` y `APP_DEBUG=0`.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Nginx + PHP-FPM en contenedores separados | `php:8.3-apache` para un proyecto real |
| `root` de Nginx apuntando a `public/` | Servir la raíz del proyecto entera |
| `composer.json` y `.lock` copiados antes que el código | `COPY . .` y luego `composer install` |
| Volumen anónimo para `vendor/` si montas el proyecto | Dejar que el montaje tape las dependencias instaladas |
| Montar el código también en Nginx | Preguntarse por qué la web se ve sin estilos |
| `docker compose exec php` para `composer` y `bin/console` | Ejecutar los comandos con el PHP de tu equipo |
| Código dentro de la imagen en producción | Desplegar montando una carpeta del servidor |
| `APP_ENV=prod` y `APP_DEBUG=0` en el entorno real | Dejar la barra de depuración accesible en producción |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🐘 **Symfony — Docker y despliegue** | https://symfony.com/doc/current/setup/docker.html |
| 🐳 **Imagen oficial de PHP** | https://hub.docker.com/_/php |
| 📙 **Institut Montilivi — Docker en Windows** | https://apunts.institutmontilivi.cat/DAW-MP08/dockerWindows/dockerProj001/ |
