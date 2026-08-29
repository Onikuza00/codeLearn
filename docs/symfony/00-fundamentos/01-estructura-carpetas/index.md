# Estructura de carpetas { .section-fundamentos }

> El esqueleto que genera `symfony new --webapp` no es arbitrario — cada carpeta tiene un porqué, y saber para qué sirve cada una es lo que te permite encontrar cualquier cosa en un proyecto que no escribiste tú.

---

## Vista general {: .topic-title }

| Carpeta | Contenido |
|---|---|
| `bin/` | Ejecutables de consola. No se toca. |
| `config/` | Configuración de la aplicación |
| `public/` | Raíz pública del proyecto — `index.php` es el único punto de entrada real: toda petición HTTP pasa por ahí antes de llegar a las rutas |
| `src/` | El código de la aplicación (controladores, entidades, servicios) |
| `templates/` | Plantillas Twig |
| `var/` | Caché y logs — ignorado por Git |
| `vendor/` | Dependencias instaladas por Composer |

## `composer.json`, el corazón del proyecto {: .topic-title }

`composer.json` es el archivo que declara qué paquetes usa el proyecto — es el equivalente al `package.json` de Node. Si se borra `vendor/` por error, `composer install` lo reconstruye entero a partir de este archivo, así que **nunca hace falta subir `vendor/` a Git** (por eso está ignorado).

Tiene dos bloques clave, y la diferencia importa:

- **`require`**: dependencias de **producción** — lo que la aplicación necesita para funcionar de verdad (versión mínima de PHP, bundles de Symfony, Twig...).
- **`require-dev`**: dependencias de **desarrollo únicamente** — herramientas que solo hacen falta mientras programas (MakerBundle, PHPUnit, cs-fixer). En un despliegue a producción, estas no deberían instalarse.

!!! example "💻 Comandos — Composer"
    ```bash
    composer install             # instala EXACTAMENTE lo que dice composer.lock (versiones fijadas)
    composer install --no-dev    # igual, pero sin las dependencias de require-dev (para producción)
    composer update              # busca versiones más nuevas compatibles y reescribe composer.lock
    ```

!!! tip "`composer install` — el primer comando al clonar cualquier proyecto"
    Cuando clonas un repositorio de Symfony desde cero, la carpeta `vendor/` **no existe** — está ignorada por Git a propósito, porque contiene miles de archivos que se pueden regenerar. El proyecto no va a arrancar hasta que ejecutes `composer install`.

    Este comando lee `composer.json` **y** `composer.lock` (el archivo que fija las versiones exactas que usó quien creó el proyecto) y descarga a `vendor/` exactamente esas mismas versiones — así todo el equipo trabaja con las mismas dependencias, sin sorpresas.

    **Ojo con la diferencia:** `composer install` respeta `composer.lock` al pie de la letra. `composer update` en cambio lo ignora y busca las versiones más nuevas compatibles, reescribiendo el lock — úsalo solo cuando quieras subir de versión a propósito, nunca como comando por defecto.

## Ficheros clave, uno a uno {: .topic-title }

Además de las carpetas grandes, hay ficheros sueltos en la raíz del proyecto que conviene saber identificar desde el primer día.

**`public/index.php`**
El front controller: literalmente el único fichero PHP al que el servidor web apunta. Cada petición HTTP, sin excepción, entra por aquí — arranca el kernel de Symfony, que decide qué ruta y qué controlador la atienden. Junto a él suele vivir `.htaccess`, con las reglas de reescritura para Apache (redirigir todo a `index.php` salvo assets reales).

**`config/`**
No es un único archivo, es una carpeta con subcarpetas:

- `config/packages/` — un YAML por cada bundle instalado (`doctrine.yaml`, `security.yaml`, `twig.yaml`...), con su configuración específica.
- `config/routes/` — definición de rutas cuando no se usan atributos PHP.
- `config/services.yaml` — configuración manual del contenedor de servicios (cuando el autowiring no alcanza).
- `config/bundles.php` — la lista de bundles activos; Symfony Flex la mantiene sola cada vez que instalas un paquete nuevo.

**`src/`**
El código propio de la aplicación, organizado por convención (no es obligatorio, pero es lo estándar):

- `src/Controller/` — controladores.
- `src/Entity/` — entidades de Doctrine (el mapeo objeto ↔ tabla).
- `src/Repository/` — clases de consulta asociadas a cada entidad.

**`migrations/`**
Cada cambio de esquema de base de datos queda como un fichero PHP versionado aquí (`VersionYYYYMMDDHHMMSS.php`), generado por `symfony console make:migration`. Es el historial de cambios de la BD, pensado para aplicarse en orden y compartirse entre el equipo.

**`var/`**
Todo lo que Symfony genera y regenera solo: `var/cache/` (caché de configuración compilada, por entorno) y `var/log/` (los logs de la aplicación). Se puede borrar entero sin miedo — se reconstruye al recargar.

**`.env`, `.env.local`, `.env.test`**
`.env` define las variables de entorno por defecto del proyecto (sí se sube a Git, son valores de ejemplo/genéricos). `.env.local` es donde van tus credenciales reales de tu máquina — está en `.gitignore`, nunca se comparte. `.env.test` sobrescribe variables solo cuando se ejecutan los tests (por ejemplo, apuntando a una base de datos distinta).

**`composer.json` / `composer.lock` / `symfony.lock`**
Ya viste `composer.json` arriba. `composer.lock` es el que fija las versiones exactas instaladas — es el que hace que `composer install` sea reproducible. `symfony.lock` es propio de Symfony Flex: registra qué "receta" (configuración automática) se aplicó al instalar cada paquete, para poder detectar si algo se modificó a mano después.

**`.gitignore`**
Ya trae precargadas las carpetas que nunca deben subirse: `/vendor/`, `/var/`, `.env.local`.

**`tests/` y `phpunit.xml.dist`**
`tests/` guarda los tests (unitarios, de integración, funcionales). `phpunit.xml.dist` es la configuración de PHPUnit — el `.dist` indica que es la plantilla compartida; si alguien necesita ajustes locales, crea su propio `phpunit.xml` (ignorado por Git) a partir de esta.

**`translations/`**
Los ficheros de internacionalización (`messages.es.yaml`, `messages.en.yaml`...), como se vio en la sección de traducciones de tus apuntes.

**`assets/` e `importmap.php`**
Donde viven los ficheros propios de CSS/JS cuando el proyecto usa AssetMapper (el sistema de assets sin bundler de Symfony 6.3+). `importmap.php` es el mapa de qué paquete JS de terceros está disponible y desde dónde se sirve — el equivalente a un `package.json` pero solo para JS de frontend servido directo, sin Webpack ni Vite de por medio.

**`compose.yaml` / `compose.override.yaml`**
Si el proyecto se creó con Docker en mente, aquí está la definición de los servicios auxiliares (base de datos, etc.) para levantarlos con `docker compose up`. `compose.override.yaml` es para tus ajustes locales, no se comparte con el resto del equipo tal cual.

---

## 📚 Fuentes {: .topic-title }
| Fuente | Enlace |
|---|---|
| 📕 **Apuntes propios** (base de estos temarios — prevalece en caso de conflicto) | Apunts DAW2, Institut Montilivi |
| 📘 **Documentación oficial de Symfony** | [symfony.com/doc](https://symfony.com/doc) |
| 🏫 **Apunts del profesor — Institut Montilivi** | [apunts.institutmontilivi.cat/MOD-0613/frameworks](https://apunts.institutmontilivi.cat/MOD-0613/frameworks/) |
| 🎥 **SymfonyCasts — Conociendo nuestro pequeño proyecto** (ES, ep. 2) | [symfonycasts.com/es/screencast/symfony/directories](https://symfonycasts.com/es/screencast/symfony/directories) |
