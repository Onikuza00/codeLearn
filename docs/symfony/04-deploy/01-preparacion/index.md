# Preparar el despliegue { .section-fundamentos }

> La secuencia de comandos que convierte un repositorio en una aplicación funcionando. El orden importa: ejecutarlos en otro orden deja la aplicación a medias sin dar ningún error.

---

## Comprobar los requisitos {: .topic-title }

!!! example "💻 Comandos — verificación"
    ```bash
    composer require symfony/requirements-checker
    ```

Comprueba que el servidor tiene la versión de PHP y las extensiones que Symfony necesita. Merece la pena la primera vez que se toca un servidor nuevo: es más rápido que descubrir a mitad de despliegue que falta `intl`.

---

## El orden {: .topic-title }

```bash
# 1. Traer el código
git fetch --all --tags
git checkout v1.4.0

# 2. Fijar el entorno
export APP_ENV=prod
export APP_DEBUG=0

# 3. Dependencias, sin las de desarrollo
composer install --no-dev --optimize-autoloader

# 4. Variables de entorno compiladas
composer dump-env prod

# 5. Base de datos
php bin/console doctrine:migrations:migrate --no-interaction

# 6. Assets
npm ci && npm run build          # con Webpack Encore
php bin/console asset-map:compile # con AssetMapper

# 7. Caché
php bin/console cache:clear

# 8. Permisos
chown -R www-data:www-data var/
```

!!! danger "`composer install` antes de fijar `APP_ENV=prod`"
    Composer ejecuta scripts al terminar la instalación, y algunos de esos scripts arrancan la aplicación para preparar la caché. Si `APP_ENV` todavía vale `dev`, intentan cargar paquetes de desarrollo que `--no-dev` acaba de no instalar.

    El error que sale habla de una clase que no se encuentra, y no menciona el entorno por ningún lado. Exportar `APP_ENV=prod` **antes** lo evita.

---

## Variables de entorno {: .topic-title }

Hay dos formas de dárselas al servidor, y una está mal.

**Bien:** variables reales del sistema, o un `.env.prod.local` que solo existe en el servidor y nunca sale de ahí.

```bash
# .env.prod.local  — creado en el servidor, fuera del repositorio
APP_ENV=prod
APP_DEBUG=0
APP_SECRET=un-valor-largo-y-aleatorio-distinto-al-de-desarrollo
DATABASE_URL="mysql://app:contrasena_fuerte@10.0.0.5:3306/produccion"
```

!!! danger "NUNCA subas tu `.env.local` al servidor"
    Ese fichero tiene las credenciales de tu máquina: base de datos local, `APP_ENV=dev`, claves de prueba. Subirlo apunta la producción a una base de datos que no existe y, peor, puede dejar el entorno en `dev`.

    Y el `APP_SECRET` debe ser **distinto** en producción. Ese valor firma las cookies de sesión y los tokens de "recordarme": si es el mismo que el de desarrollo y tu repositorio es público, cualquiera puede falsificar una sesión.

### Compilar las variables

```bash
composer dump-env prod
```

Genera un `.env.local.php` con todas las variables ya resueltas en un array de PHP. Symfony deja de leer y analizar los ficheros `.env` en cada petición, lo que se nota en el tiempo de respuesta.

Si Composer no está instalado en el servidor:

```bash
php bin/console dotenv:dump prod
```

!!! warning "Hay que regenerarlo cada vez que cambie una variable"
    El fichero compilado tiene prioridad. Si cambias `DATABASE_URL` en el `.env.prod.local` y no vuelves a ejecutar `dump-env`, la aplicación sigue usando el valor viejo.

    Es un fallo desconcertante: editas el fichero, compruebas que está bien, y la aplicación insiste en conectarse a otro sitio.

---

## Dependencias {: .topic-title }

```bash
composer install --no-dev --optimize-autoloader
```

| Bandera | Qué hace |
|---|---|
| `--no-dev` | No instala el perfilador, MakerBundle, PHPUnit ni el resto de utilidades de desarrollo |
| `--optimize-autoloader` | Genera un mapa de clases completo en vez de buscarlas en disco |

!!! danger "`composer install`, nunca `composer update` en producción"
    `install` respeta el `composer.lock` e instala **exactamente** las versiones que probaste. `update` resuelve las versiones de nuevo y puede traer una menor distinta que nadie ha probado.

    Las actualizaciones se hacen en desarrollo, se prueban, y el `composer.lock` resultante se sube al repositorio. El servidor solo obedece ese fichero.

!!! warning "`--no-dev` elimina el perfilador, así que la barra desaparece"
    Es lo correcto: esas herramientas no deben estar en producción. Pero explica un desconcierto habitual — "en el servidor no me sale la barra de depuración". No es un fallo, es lo esperado.

---

## Base de datos {: .topic-title }

```bash
php bin/console doctrine:migrations:migrate --no-interaction
```

`--no-interaction` evita que el comando se quede esperando una confirmación que nadie va a dar en un despliegue automático.

!!! danger "`doctrine:schema:update --force` no se usa en producción, nunca"
    Ese comando compara tus entidades con la base de datos y aplica las diferencias que le parecen. Puede decidir que una columna sobra y **borrarla con sus datos dentro**.

    Las migraciones son ficheros versionados, revisables y reversibles: sabes qué va a ejecutar antes de ejecutarlo. La comodidad de `schema:update` es de desarrollo.

!!! tip "Revisa la migración antes de desplegar"
    ```bash
    php bin/console doctrine:migrations:migrate --dry-run
    ```
    Imprime el SQL sin ejecutarlo. Un `DROP COLUMN` inesperado se ve ahí, no después.

    Y antes de una migración que toca datos, una copia de seguridad. Las migraciones se pueden revertir; los datos borrados, no.

---

## Assets {: .topic-title }

```bash
npm ci && npm run build              # Webpack Encore
php bin/console asset-map:compile    # AssetMapper
```

`npm ci` en vez de `npm install`, por la misma razón que `composer install`: respeta el fichero de bloqueo y no resuelve versiones nuevas.

!!! warning "Los assets compilados no suelen estar en el repositorio"
    `public/build/` está normalmente en el `.gitignore`. Si te saltas este paso, la web carga pero se ve sin estilos y sin JavaScript, con un montón de `404` en la consola del navegador.

    Es el segundo síntoma más común de un despliegue incompleto, después de los permisos.

---

## Caché {: .topic-title }

```bash
php bin/console cache:clear
```

En Symfony moderno, ese comando ya hace el *calentamiento*: no solo borra, también genera todo lo que la aplicación va a necesitar. Sin él, el primer visitante paga el coste de construir la caché entera.

!!! danger "No borres `var/cache/` a mano"
    ```bash
    rm -rf var/cache/*        # ❌
    ```
    Deja la carpeta sin la estructura ni los permisos que Symfony espera, y la aplicación puede quedarse sin poder escribir. Además, si lo ejecutas como administrador, los ficheros que se creen después pertenecerán a `root` y el servidor web no podrá tocarlos.

    Usa siempre el comando, y con el mismo usuario que ejecuta la aplicación.

---

## Permisos {: .topic-title }

Symfony escribe en dos sitios: `var/cache/` y `var/log/`. Si el usuario del servidor web no puede escribir ahí, la aplicación responde un `500` cuya única pista está en una traza sobre no poder abrir un fichero.

```bash
# Averiguar con qué usuario corre el servidor
ps aux | grep -E "nginx|php-fpm|apache"

chown -R www-data:www-data var/
chmod -R 775 var/
```

!!! danger "El error 500 más frecuente de un primer despliegue"
    Y el más desconcertante, porque el código es correcto y en local funciona. Suele pasar por haber ejecutado algún comando como `root`: los ficheros que ese comando creó pertenecen a `root`, y `www-data` no puede escribir encima.

    La comprobación:

    ```bash
    ls -la var/
    ```
    Si el propietario no es el usuario del servidor web, ahí está el problema. Está explicado a fondo en [Comandos de Linux → Permisos](../../../devops/02-linux/03-permisos/index.md).

---

## Después de desplegar {: .topic-title }

Tareas que se olvidan y luego dan problemas raros:

```bash
# Reiniciar los procesos en segundo plano
php bin/console messenger:stop-workers

# Vaciar cachés externas
php bin/console cache:pool:clear cache.app

# Regenerar las páginas de error estáticas
APP_ENV=prod php bin/console error:dump var/cache/prod/error_pages/
```

!!! danger "Los *workers* de Messenger siguen ejecutando el código antiguo"
    Un proceso en segundo plano carga el código al arrancar y lo mantiene en memoria. Después de un despliegue, sigue con la versión anterior indefinidamente.

    El síntoma es de los peores que hay: la web muestra el comportamiento nuevo y las tareas en segundo plano el viejo, y nadie entiende nada.

    `messenger:stop-workers` los detiene con orden; el supervisor de procesos los vuelve a levantar ya con el código nuevo.

---

## La lista completa {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `export APP_ENV=prod` antes de `composer install` | Instalar y luego cambiar el entorno |
| `composer install --no-dev --optimize-autoloader` | `composer update` en el servidor |
| `.env.prod.local` creado en el servidor | Subir tu `.env.local` |
| `APP_SECRET` distinto en producción | Reutilizar el de desarrollo |
| Regenerar `dump-env` al cambiar una variable | Editar el `.env` y extrañarte de que no cambie |
| `doctrine:migrations:migrate` | `doctrine:schema:update --force` |
| `--dry-run` y copia de seguridad antes de migrar | Migrar a ciegas sobre datos reales |
| Compilar los assets en cada despliegue | Preguntarte por qué la web se ve sin estilos |
| `cache:clear` con el usuario correcto | `rm -rf var/cache/*` como administrador |
| `chown` a `var/` y comprobarlo con `ls -la` | Buscar el `500` en el código |
| `messenger:stop-workers` al final | Dejar procesos con el código antiguo |

</div>

---

## 📚 Fuentes {: .topic-title }

| Recurso | Link |
|---------|------|
| 🐘 **Symfony — Deploying** | https://symfony.com/doc/current/deployment.html |
| 📙 **Institut Montilivi — Desplegament** | https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/desplegament/ |
