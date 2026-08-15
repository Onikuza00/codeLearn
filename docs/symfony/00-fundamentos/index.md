# Fundamentos { .section-fundamentos }

> Symfony es un framework PHP para aplicaciones web robustas y mantenibles, creado por Fabien Potencier en 2005. Antes de tocar una sola línea de código, hace falta el entorno instalado y entender de qué piezas está hecho.

<div class="video-embed">
<iframe src="https://www.youtube.com/embed/9OUvACXdxFs" title="Curso de Symfony — Introducción e instalación (DFBastidas)" loading="lazy" allowfullscreen></iframe>
</div>

---

## ¿Qué es Symfony? {: .topic-title }
Symfony es un **framework**: una estructura base y un conjunto de herramientas ya resueltas (rutas, formularios, autenticación, acceso a base de datos) para no reinventar ese código en cada proyecto. Sigue el patrón **MVC** (Modelo — Vista — Controlador), separando la lógica de negocio, la presentación y el flujo de la petición HTTP.

No es un bloque monolítico: es un conjunto de **componentes PHP independientes** (HttpFoundation, Routing, Doctrine, Twig, Security...) que se pueden usar sueltos o combinados como framework completo. Por eso frameworks como Laravel usan piezas de Symfony por dentro — son buenas librerías, no solo "el framework".

## Componentes principales {: .topic-title }
| Componente | Para qué sirve |
|---|---|
| **HttpFoundation** | Modela la petición (`Request`) y la respuesta (`Response`) HTTP |
| **Routing** | Decide qué controlador atiende cada URL |
| **DependencyInjection** | Crea, configura e inyecta los servicios de la app |
| **Form** | Construcción, procesado y validación de formularios |
| **Doctrine** | ORM — comunicación con la base de datos mediante objetos PHP |
| **Twig** | Motor de plantillas |
| **Security** | Autenticación y autorización |
| **Console** | Comandos de línea (`bin/console`) |

## Instalación {: .topic-title }
**Requisito previo:** Symfony 7 pide **PHP ≥ 8.2** (con las extensiones `ctype` e `iconv`). Si tu PHP es más antiguo, `symfony new` no falla — instala Symfony 6.4 en su lugar sin avisar demasiado, así que conviene comprobar la versión antes de empezar.

**1. Composer** — el gestor de dependencias de PHP. Symfony se apoya en él para instalar componentes y bundles. Descarga oficial: [getcomposer.org/download](https://getcomposer.org/download/).

**2. Symfony CLI** — herramienta de línea de comandos con servidor local optimizado para proyectos Symfony. Es la vía recomendada frente a crear el proyecto solo con Composer. Descarga oficial: [symfony.com/download](https://symfony.com/download).

!!! example "💻 Comandos — verificar la instalación"
    ```bash
    php -v              # comprobar la versión de PHP instalada (>= 8.2)
    composer -v         # comprobar que Composer está instalado
    symfony -v          # comprobar que Symfony CLI está instalado
    symfony check:req   # comprobar que el sistema cumple todos los requisitos
    ```

## Crear un proyecto nuevo {: .topic-title }

!!! example "💻 Comandos — nuevo proyecto"
    ```bash
    # Proyecto completo (rutas, Twig, seguridad, formularios...) — recomendado para empezar
    symfony new --webapp miProyecto

    # Versión mínima, se añaden componentes según hagan falta
    composer create-project symfony/skeleton miProyecto
    ```

!!! tip "El comando crea la carpeta por ti"
    Ninguno de los dos comandos se ejecuta "dentro" de un proyecto existente — `miProyecto` es el nombre que le das a la carpeta nueva que Symfony va a crear en el directorio donde estés situado. Si ejecutas `symfony new --webapp tienda`, te va a aparecer una carpeta `tienda/` al lado de donde lanzaste el comando, con todo el esqueleto dentro.

## Levantar el servidor local {: .topic-title }

Con el proyecto ya creado, hace falta arrancar el servidor de desarrollo. Symfony CLI trae uno propio, con soporte de HTTPS y detección automática del puerto libre — mejor que usar el servidor embebido de PHP a mano.

!!! warning "Tienes que estar DENTRO de la carpeta del proyecto"
    `symfony server:start` (o `serve`) no sabe qué proyecto levantar si lo ejecutas desde cualquier sitio — busca un `composer.json` de Symfony en el directorio actual. Primer paso siempre: `cd miProyecto` (o el nombre que le hayas puesto), y recién entonces levantas el servidor.

!!! example "💻 Comandos — servidor local"
    ```bash
    cd miProyecto                # primero entrar a la carpeta del proyecto

    symfony server:start        # arranca en primer plano (bloquea la terminal)
    symfony serve -d            # arranca en segundo plano (daemon)
    symfony server:stop         # detiene el servidor en segundo plano
    symfony server:status       # muestra si hay un servidor corriendo y en qué puerto
    symfony open:local          # abre el proyecto en el navegador
    symfony server:ca:install   # genera el certificado local de HTTPS (solo la primera vez)
    ```

Por defecto sirve en `https://127.0.0.1:8000` (o el siguiente puerto libre si ese está ocupado).

## Estructura de carpetas {: .topic-title }

El proyecto recién creado trae una estructura fija (`bin/`, `config/`, `public/`, `src/`, `templates/`, `var/`, `vendor/`) y ficheros clave en la raíz (`composer.json`, `.env`, `symfony.lock`...) que merece su propia página, carpeta por carpeta y fichero por fichero.

➡️ **[01 — Estructura de carpetas](01-estructura-carpetas/index.md)**

## Formateo con cs-fixer {: .topic-title }

!!! example "💻 Comandos — cs-fixer"
    ```bash
    composer require --dev friendsofphp/php-cs-fixer

    vendor/bin/php-cs-fixer fix                    # formatea el proyecto
    vendor/bin/php-cs-fixer fix --dry-run --diff    # vista previa sin aplicar cambios
    vendor/bin/php-cs-fixer fix src tests           # formatea solo esas carpetas
    ```

---

## 📚 Fuentes {: .topic-title }
| Fuente | Enlace |
|---|---|
| 📕 **Apuntes propios** (base de estos temarios — prevalece en caso de conflicto) | Apunts DAW2, Institut Montilivi |
| 📘 **Documentación oficial de Symfony** | [symfony.com/doc](https://symfony.com/doc) |
| 🏫 **Apunts del profesor — Institut Montilivi** | [apunts.institutmontilivi.cat/MOD-0613/frameworks](https://apunts.institutmontilivi.cat/MOD-0613/frameworks/) |
| 🎥 **SymfonyCasts — Configurando nuestra App Symfony** (ES, ep. 1) | [symfonycasts.com/es/screencast/symfony/setup](https://symfonycasts.com/es/screencast/symfony/setup) |
