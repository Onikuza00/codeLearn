# El servidor web { .section-fundamentos }

> Symfony tiene un único punto de entrada, `public/index.php`. Configurar el servidor consiste en dirigir todas las peticiones ahí y, sobre todo, en **no dejar accesible nada más**.

---

## La raíz apunta a `public/` {: .topic-title }

Es la decisión más importante de toda la configuración, y la que más veces se hace mal.

```
mi-proyecto/
├── config/          ← configuración
├── src/             ← tu código
├── var/             ← caché y registros
├── vendor/          ← dependencias
├── .env             ← variables
└── public/          ← ⬅ LA RAÍZ DEL SERVIDOR ES ESTA CARPETA
    └── index.php
```

!!! danger "Apuntar la raíz al proyecto expone el código y las credenciales"
    Si la raíz es la carpeta del proyecto en vez de `public/`, cualquiera puede pedir por el navegador:

    ```
    https://tudominio.com/.env              → tus credenciales
    https://tudominio.com/src/Entity/User.php  → tu código
    https://tudominio.com/var/log/prod.log     → tus registros
    ```

    Con `.env` en la mano, un atacante tiene la contraseña de la base de datos, el `APP_SECRET` con el que se firman las sesiones y las claves de cualquier servicio externo.

    No es una vulnerabilidad sutil: es entregar el proyecto entero. Y es la configuración por defecto de muchos alojamientos compartidos, que apuntan la raíz a `public_html/` y ahí se descomprime todo.

    **Compruébalo siempre**, pidiendo `https://tudominio.com/.env` desde el navegador. Si descarga algo, tienes un problema grave que hay que resolver antes que nada.

---

## Nginx {: .topic-title }

```nginx
server {
    listen 443 ssl http2;
    server_name tudominio.com;

    root /var/www/mi-proyecto/public;   # ← la carpeta public
    index index.php;

    location / {
        try_files $uri /index.php$is_args$args;
    }

    location ~ ^/index\.php(/|$) {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;
        internal;
    }

    location ~ \.php$ {
        return 404;
    }

    error_log /var/log/nginx/mi-proyecto_error.log;
    access_log /var/log/nginx/mi-proyecto_access.log;
}
```

Tres líneas hacen el trabajo:

- **`try_files $uri /index.php...`** — si la ruta corresponde a un fichero real (una imagen, un CSS), lo sirve directamente. Si no, se lo pasa a Symfony.
- **`fastcgi_pass`** — entrega la petición al intérprete de PHP.
- **`location ~ \.php$ { return 404; }`** — bloquea la ejecución de cualquier otro `.php`. No es paranoia: si alguien consigue subir un fichero PHP a la carpeta de subidas, esa línea impide que se ejecute.

!!! warning "Es la misma configuración que en Docker"
    Coincide con la del [stack de Symfony](../../../devops/01-docker/07-stack-symfony/index.md), salvo que ahí `fastcgi_pass` apunta al nombre del servicio (`php:9000`) y aquí a un socket local.

    Entender una es entender la otra.

---

## Apache {: .topic-title }

```apache
<VirtualHost *:443>
    ServerName tudominio.com
    DocumentRoot /var/www/mi-proyecto/public

    <Directory /var/www/mi-proyecto/public>
        AllowOverride None
        Require all granted
        FallbackResource /index.php
    </Directory>

    <Directory /var/www/mi-proyecto>
        Options -Indexes
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/mi-proyecto_error.log
    CustomLog ${APACHE_LOG_DIR}/mi-proyecto_access.log combined
</VirtualHost>
```

`FallbackResource /index.php` es el equivalente al `try_files` de Nginx y evita necesitar reglas de reescritura.

En alojamientos compartidos, donde no puedes tocar la configuración del servidor:

```bash
composer require symfony/apache-pack
```

Genera un `.htaccess` en `public/` con las reglas necesarias.

!!! danger "Apache elimina la cabecera `Authorization`"
    Si no tiene el formato de autenticación básica, Apache la descarta antes de que llegue a PHP. Una API con tokens deja de funcionar sin ninguna pista.

    ```apache
    SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1
    ```
    Está también en la página de [JWT](../../02-seguridad/08-jwt/index.md), porque es donde más duele.

---

## HTTPS {: .topic-title }

```bash
sudo certbot --nginx -d tudominio.com
```

Let's Encrypt emite certificados gratuitos y Certbot los renueva solo.

Y en la aplicación, forzando el canal seguro:

```yaml
# config/packages/security.yaml
security:
    access_control:
        - { path: ^/, requires_channel: https }
```

!!! danger "Sin HTTPS, las cookies de sesión viajan legibles"
    Cualquiera en la misma red —una wifi pública, por ejemplo— puede leer la cookie de sesión de un usuario y suplantarlo sin necesidad de su contraseña.

    Y las cookies marcadas como `Secure`, que es lo correcto para una sesión, **no se envían por HTTP**: la aplicación se comporta como si nadie iniciara sesión nunca.

    En 2026 no hay ningún motivo para servir una aplicación con sesiones por HTTP.

---

## OPcache {: .topic-title }

PHP compila cada fichero en cada petición. OPcache guarda el resultado compilado en memoria y se lo salta. Es la diferencia de rendimiento más grande que se consigue con un fichero de configuración.

```ini
; php.ini de producción
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
opcache.preload=/var/www/mi-proyecto/var/cache/prod/App_KernelProdContainer.preload.php
opcache.preload_user=www-data
```

!!! danger "`validate_timestamps=0` significa que hay que reiniciar PHP tras cada despliegue"
    Con esa opción, PHP **deja de comprobar** si los ficheros han cambiado. Es lo que da el máximo rendimiento, porque se ahorra una comprobación en disco por fichero y petición.

    El precio: después de desplegar, PHP sigue ejecutando el código antiguo desde la memoria. Puedes actualizar el código, limpiar la caché de Symfony y recargar la web viendo exactamente lo mismo que antes.

    ```bash
    sudo systemctl reload php8.3-fpm
    ```
    Ese comando va al final de todo despliegue. Si se olvida, el síntoma es de los que hacen perder una tarde entera: "he desplegado y no ha cambiado nada".

---

## Comprobaciones finales {: .topic-title }

Antes de dar un despliegue por bueno:

```bash
curl -I https://tudominio.com                    # ¿responde 200 y por HTTPS?
curl -I https://tudominio.com/.env               # debe ser 404, NO 200
curl -I https://tudominio.com/_profiler          # debe ser 404 en producción
curl -I https://tudominio.com/api/tasks          # ¿401 sin token, no 500?
```

!!! tip "Los cuatro cubren los fallos graves"
    El primero comprueba que la aplicación responde. El segundo, que la raíz está bien puesta. El tercero, que el entorno es `prod`. El cuarto, que la seguridad de la API funciona y que los errores no se convierten en un `500`.

    Treinta segundos que evitan los cuatro problemas más caros.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Raíz del servidor en `public/` | Apuntarla a la carpeta del proyecto |
| Comprobar que `/.env` devuelve 404 | Dar por hecho que está bien configurado |
| `location ~ \.php$ { return 404; }` | Permitir ejecutar cualquier `.php` |
| `Options -Indexes` en Apache | Dejar el listado de directorios accesible |
| HTTPS con renovación automática | Servir sesiones por HTTP |
| `symfony/apache-pack` en alojamiento compartido | Pelearte con las reglas de reescritura a mano |
| `SetEnvIf Authorization` si usas Apache y tokens | Buscar el fallo en el código de la API |
| Recargar PHP-FPM tras cada despliegue | Preguntarte por qué el código nuevo no aparece |
| Las cuatro comprobaciones con `curl` | Mirar solo la portada y darlo por bueno |

</div>

---

## 📚 Fuentes {: .topic-title }

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — Desplegament** | https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/desplegament/ |
| 🐘 **Symfony — Deploying** | https://symfony.com/doc/current/deployment.html |
| 🐘 **Symfony — Configurar un servidor web** | https://symfony.com/doc/current/setup/web_server_configuration.html |
