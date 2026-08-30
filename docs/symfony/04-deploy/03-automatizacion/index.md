# Automatizar { .section-fundamentos }

> Un despliegue manual funciona hasta el día que se te olvida un comando. Automatizarlo convierte una lista de diez pasos en uno solo, y hace que volver atrás sea instantáneo en vez de una emergencia.

---

## El problema del despliegue en caliente {: .topic-title }

Desplegar con `git pull` sobre la carpeta que está sirviendo la web tiene un agujero: durante los segundos que tardan `composer install`, las migraciones y el `cache:clear`, **la aplicación está rota**.

El código nuevo ya está ahí pero las dependencias no; la caché apunta a clases que han cambiado; las migraciones están a medias. Quien entre en ese momento recibe un error.

La solución es no tocar nunca la carpeta que se está sirviendo.

---

## El patrón del enlace simbólico {: .topic-title }

```
/var/www/mi-proyecto/
├── releases/
│   ├── 20260830142200/     ← versión anterior
│   ├── 20260830153000/     ← versión anterior
│   └── 20260830161500/     ← la nueva, preparándose
├── shared/
│   ├── .env.prod.local     ← ficheros que sobreviven a los despliegues
│   └── var/log/
└── current → releases/20260830161500
```

El servidor web apunta a `current/public`, que es un **enlace simbólico**. El proceso es:

1. Se crea una carpeta nueva en `releases/` con el código.
2. Se ejecuta todo dentro: dependencias, assets, caché, migraciones.
3. Se comprueba que ha ido bien.
4. **Se mueve el enlace `current`** a la carpeta nueva.

Ese último paso es atómico: ocurre de golpe. No hay ningún instante en el que la aplicación esté a medias.

!!! tip "Y el *rollback* es mover el enlace hacia atrás"
    ```bash
    ln -sfn releases/20260830153000 current
    sudo systemctl reload php8.3-fpm
    ```
    Dos comandos y estás en la versión anterior, con sus dependencias y su caché intactas porque nunca se borraron.

    Compara eso con volver atrás en un despliegue por FTP.

!!! warning "Lo que debe sobrevivir va en `shared/`"
    Cada despliegue crea una carpeta limpia. Todo lo que no está en el repositorio desaparecería: el `.env.prod.local`, los registros, y sobre todo **los ficheros que suben los usuarios**.

    Por eso `shared/` guarda esos elementos y cada versión los enlaza. Olvidar la carpeta de subidas en esa lista significa perder los ficheros de los usuarios en el siguiente despliegue.

    Es el mismo razonamiento que un volumen de Docker: lo reproducible se recrea, lo que no se puede recrear vive fuera.

---

## Deployer {: .topic-title }

Es la herramienta estándar en PHP para este patrón, y trae una receta lista para Symfony.

```bash
composer require --dev deployer/deployer
vendor/bin/dep init
```

```php
// deploy.php
namespace Deployer;

require 'recipe/symfony.php';

set('application', 'mi-proyecto');
set('repository', 'git@github.com:usuario/mi-proyecto.git');
set('keep_releases', 5);

add('shared_files', ['.env.prod.local']);
add('shared_dirs', ['var/log', 'public/uploads']);
add('writable_dirs', ['var']);

host('produccion')
    ->set('hostname', 'tudominio.com')
    ->set('remote_user', 'deployer')
    ->set('deploy_path', '/var/www/mi-proyecto');

task('deploy:reload-php', function () {
    run('sudo systemctl reload php8.3-fpm');
});

after('deploy:symlink', 'deploy:reload-php');
after('deploy:failed', 'deploy:unlock');
```

```bash
vendor/bin/dep deploy produccion
vendor/bin/dep rollback produccion
```

La receta de Symfony ya hace `composer install --no-dev`, `cache:clear`, las migraciones y los permisos. Lo que añades son las particularidades tuyas.

!!! tip "`keep_releases` es tu red de seguridad"
    Guarda las cinco últimas versiones. Sin ellas, el `rollback` no tiene a dónde volver.

    Cinco es un buen número: ocupan poco y cubren los días que puede tardar en aparecer un fallo que nadie notó al desplegar.

!!! danger "El `reload` de PHP-FPM no viene de serie"
    La receta mueve el enlace simbólico, pero con `opcache.validate_timestamps=0` PHP sigue ejecutando el código antiguo desde memoria.

    El despliegue termina en verde, todo parece correcto y la web no ha cambiado. Por eso la tarea `deploy:reload-php` del ejemplo se engancha **después** de mover el enlace.

    Requiere que el usuario del despliegue pueda ejecutar ese comando sin contraseña, configurado en `sudoers` de forma acotada a ese comando concreto.

---

## Integración continua {: .topic-title }

El siguiente paso: que despliegue el servidor de integración, no tu portátil.

```yaml
# .github/workflows/desplegar.yml
name: Desplegar

on:
  push:
    tags: ["v*"]

jobs:
  probar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          extensions: intl, pdo_mysql

      - run: composer install --prefer-dist --no-progress
      - run: php bin/phpunit

  desplegar:
    needs: probar
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Desplegar con Deployer
        uses: deployphp/action@v1
        with:
          private-key: ${{ secrets.SSH_PRIVATE_KEY }}
          dep: deploy produccion
```

!!! tip "`needs: probar` es la línea que da valor a todo esto"
    Sin ella, tienes un despliegue automático de código que puede estar roto. Con ella, **el despliegue no ocurre si las pruebas fallan**.

    Ese es el momento en que la batería de pruebas deja de ser un ejercicio y se convierte en la puerta que protege producción. Es la conexión directa con [Pruebas Unitarias](../../00-fundamentos/07-pruebas-unitarias/index.md): las pruebas se escriben para esto.

!!! warning "Las claves van en los secretos del repositorio, nunca en el fichero"
    La clave SSH, las credenciales del registro y cualquier token se configuran como secretos de GitHub y se referencian con `${{ secrets.X }}`. El fichero del *workflow* está en el repositorio y lo ve cualquiera con acceso.

Desplegar solo al publicar una etiqueta (`on: push: tags`) evita que cada commit en la rama principal vaya a producción. Publicar una versión es un acto deliberado.

---

## Despliegue con contenedores {: .topic-title }

El nivel siguiente cambia la unidad: en vez de desplegar código que el servidor tiene que preparar, se despliega una **imagen ya construida y probada**.

```
Construir imagen  →  Probarla  →  Publicarla  →  El servidor la descarga y arranca
```

Las ventajas concretas:

- **Lo que probaste es exactamente lo que corre.** No hay "en el servidor la versión de PHP es otra": la versión de PHP va dentro.
- **El *rollback* es cambiar de etiqueta.** `docker compose up -d` con `v1.3.2` en vez de `v1.4.0`.
- **Escalar es arrancar más copias** de la misma imagen.

El proceso está en [Docker → Publicar imágenes](../../../devops/01-docker/06-publicar/index.md), y el montaje concreto de PHP-FPM y Nginx en [Docker → Un stack de Symfony](../../../devops/01-docker/07-stack-symfony/index.md).

!!! warning "Las migraciones siguen siendo el punto delicado"
    Contenedores o no, la base de datos es única y compartida. Si arrancas la versión nueva y la migración todavía no ha corrido, el código busca columnas que no existen.

    Se resuelve ejecutando las migraciones como un paso previo al cambio de versión, y escribiéndolas de forma que la versión anterior siga funcionando con el esquema nuevo: añadir columnas antes de usarlas, y borrar las viejas en un despliegue **posterior**, no en el mismo.

    Es el patrón de migración en dos fases, y es lo que permite desplegar sin cortar el servicio.

---

## La lista de un despliegue completo {: .topic-title }

| Paso | Automatizado por |
|---|---|
| Ejecutar las pruebas | Integración continua |
| Preparar la versión nueva sin tocar la actual | Deployer |
| Dependencias sin las de desarrollo | Receta de Symfony |
| Migraciones | Receta de Symfony |
| Compilar los assets | Tarea propia |
| Limpiar y calentar la caché | Receta de Symfony |
| Permisos de `var/` | Receta de Symfony |
| Mover el enlace simbólico | Deployer |
| Recargar PHP-FPM | **Tarea propia — la que se olvida** |
| Reiniciar los *workers* | Tarea propia |
| Regenerar páginas de error estáticas | Tarea propia |

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Preparar en una carpeta aparte y mover el enlace | `git pull` sobre la carpeta que sirve la web |
| `shared/` para subidas, registros y `.env.prod.local` | Perder los ficheros de los usuarios al desplegar |
| `keep_releases: 5` | Borrar la versión anterior nada más desplegar |
| Recargar PHP-FPM tras mover el enlace | Dar el despliegue por bueno sin comprobarlo |
| `needs: probar` antes de desplegar | Automatizar el despliegue de código sin probar |
| Claves en los secretos del repositorio | Credenciales dentro del fichero del *workflow* |
| Desplegar al publicar una etiqueta | Que cada commit vaya a producción |
| Migraciones en dos fases: añadir hoy, borrar mañana | Borrar una columna que la versión anterior usa |
| Probar el *rollback* antes de necesitarlo | Aprender a volver atrás con la web caída |

</div>

---

## 📚 Fuentes {: .topic-title }

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — Desplegament** | https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/desplegament/ |
| 🐘 **Symfony — Deploying** | https://symfony.com/doc/current/deployment.html |
| 🚀 **Deployer** | https://deployer.org/ |
