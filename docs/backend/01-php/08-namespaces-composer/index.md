# Namespaces y Composer { .section-fundamentos }

> Sin namespaces, dos clases llamadas `Logger` no pueden convivir en el mismo proyecto. Sin autoload, cada fichero necesitaría un `require` manual. Composer resuelve las dos cosas a la vez, y es la pieza sobre la que se apoya cualquier framework de PHP.

---

## Qué problema resuelve un namespace { .topic-title }

Un namespace es un **apellido** para las clases. Permite que existan dos `Logger` distintos —el tuyo y el de una librería— sin chocar.

```php
<?php

namespace App\Service;      // primera instrucción tras <?php

class Logger { ... }
```

El nombre completo de esa clase —su **FQCN**, *fully qualified class name*— pasa a ser `App\Service\Logger`. Un fichero declara **un solo** namespace.

## `use`: importar para no escribir el nombre largo { .topic-title }

```php
namespace App\Controller;

use App\Service\Logger;
use App\Entity\Task as TaskEntity;   // alias, para desambiguar

class TaskController
{
    public function __construct(private Logger $logger) {}
}
```

`use` no carga nada ni ejecuta código: solo declara un atajo dentro de ese fichero. La carga real la hace el autoload.

!!! danger "Dentro de un namespace, las clases globales necesitan barra inicial"
    ```php
    namespace App\Service;

    $fecha = new DateTime();     // ❌ busca App\Service\DateTime
    $fecha = new \DateTime();    // ✅ la global
    ```

    Al estar dentro de un namespace, PHP busca **primero** en el namespace actual. Las clases nativas —`DateTime`, `Exception`, `ArrayObject`— viven en el namespace global y necesitan `\` delante, o un `use DateTime;` arriba.

    Con **funciones** nativas (`count`, `strlen`) no pasa: si no las encuentra en el namespace, cae al global automáticamente. Solo las clases fallan.

!!! tip "Para importar funciones y constantes hace falta decirlo"
    ```php
    use function App\Helper\formatear;
    use const App\Config\IVA;
    ```

    Un `use` a secas solo importa clases, interfaces, traits y enums.

## PSR-4: la convención que lo ata todo { .topic-title }

PSR-4 es el estándar que dice cómo se traduce un nombre de clase a una ruta de fichero. Dos reglas:

1. El **namespace refleja la estructura de carpetas**.
2. El **nombre de la clase es el nombre del fichero**.

| FQCN | Fichero |
|---|---|
| `App\Service\Logger` | `src/Service/Logger.php` |
| `App\Entity\Task` | `src/Entity/Task.php` |
| `App\Service\Sorter\ByPriority` | `src/Service/Sorter/ByPriority.php` |

El prefijo `App\` no es mágico: lo define el mapeo de `composer.json`.

```json
{
    "autoload": {
        "psr-4": { "App\\": "src/" }
    }
}
```

Eso significa: «todo lo que empiece por `App\` búscalo dentro de `src/`».

!!! danger "Los dos errores clásicos de PSR-4"
    **1. El nombre de la clase no coincide con el del fichero.** Si `ByPrioritySorter.php` declara `class ByPriority`, el autoload no la encuentra: busca por el nombre del fichero.

    **2. Dos clases con el mismo nombre en el mismo namespace.** Da `Cannot declare class ... because the name is already in use`. Pasa al copiar un fichero y olvidar renombrar la clase de dentro — por ejemplo, un fichero `ByPrioritySorter.php` que sigue declarando `class TaskSorter` como el original.

    Los dos fallan en tiempo de ejecución con un mensaje que no señala la causa. Ante un «class not found» que debería existir, lo primero es comprobar nombre de fichero y nombre de clase.

## Composer { .topic-title }

Composer es el gestor de dependencias de PHP: instala librerías y genera el autoload.

| Fichero | Qué es |
|---|---|
| `composer.json` | Lo que **pides**: dependencias con su rango de versiones |
| `composer.lock` | Lo que **hay instalado**: la versión exacta de cada paquete |
| `vendor/` | El código descargado. **No se sube al repositorio** |
| `vendor/autoload.php` | El cargador. Se incluye una vez y ya funciona todo |

```php
require __DIR__ . '/vendor/autoload.php';
```

En Symfony esa línea ya está en `public/index.php`; no hay que tocarla.

### Los comandos { .topic-title }

| Comando | Qué hace |
|---|---|
| `composer require symfony/mailer` | Añade el paquete y actualiza los dos ficheros |
| `composer require --dev phpunit/phpunit` | Solo para desarrollo y tests |
| `composer install` | Instala **las versiones exactas del `.lock`** |
| `composer update` | Recalcula versiones y **reescribe el `.lock`** |
| `composer dump-autoload` | Regenera el autoload sin tocar dependencias |

!!! danger "`install` y `update` no son intercambiables"
    En producción y en integración continua se ejecuta **siempre `composer install`**: reproduce exactamente las versiones que se probaron.

    `composer update` sube las dependencias a versiones nuevas dentro del rango permitido y reescribe el `.lock`. Ejecutarlo en un despliegue significa desplegar código que nadie ha probado.

    Y el `composer.lock` **sí se sube al repositorio**, precisamente para que `install` pueda reproducir el estado.

### Rangos de versión { .topic-title }

```json
"symfony/mailer": "^7.1"    // >= 7.1, < 8.0  — cambios menores y parches
"symfony/mailer": "~7.1.3"  // >= 7.1.3, < 7.2 — solo parches
"symfony/mailer": "7.1.3"   // exactamente esa
```

`^` es el que se usa por defecto y descansa sobre el versionado semántico: el número mayor solo cambia cuando hay ruptura de compatibilidad.

!!! tip "Cuándo hace falta `dump-autoload`"
    El autoload es un mapa generado. Si creas una carpeta nueva y las clases «no existen» pese a estar bien nombradas, o si tocas la sección `autoload` del `composer.json`, hay que regenerarlo. En desarrollo Composer usa un modo dinámico que suele evitarlo; en producción se genera optimizado con `composer dump-autoload --optimize`.

---

## 📚 Fuentes { .topic-title }

| Fuente | Enlace |
|---|---|
| 📘 **Manual oficial — Namespaces** | [php.net/manual/es/language.namespaces.php](https://www.php.net/manual/es/language.namespaces.php) |
| 📦 **Documentación de Composer** | [getcomposer.org/doc](https://getcomposer.org/doc/) |
| 📐 **PSR-4: Autoloader** | [php-fig.org/psr/psr-4](https://www.php-fig.org/psr/psr-4/) |
