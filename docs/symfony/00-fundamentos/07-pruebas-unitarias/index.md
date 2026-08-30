# Pruebas Unitarias { .section-fundamentos }

> Una prueba automática es código que comprueba tu código. Su valor no es encontrar el fallo de hoy: es avisarte el día que lo rompas sin darte cuenta.

---

## Instalar el paquete {: .topic-title }

!!! example "💻 Comandos — instalación"
    ```bash
    composer require --dev symfony/test-pack
    ```

El *pack* trae PHPUnit —el motor que ejecuta las pruebas— y el puente de Symfony que lo conecta con el framework.

## Generar con MakerBundle {: .topic-title }

!!! example "💻 Comandos — MakerBundle"
    ```bash
    symfony console make:test        # pregunta el tipo de prueba y crea el esqueleto
    php bin/phpunit                  # ejecutar todas las pruebas
    php bin/phpunit tests/Service    # ejecutar solo una carpeta
    php bin/phpunit tests/Service/TaskStatsTest.php   # un solo fichero
    ```

Fíjate en `php bin/phpunit`, no `vendor/bin/phpunit`: ese ejecutable lo instala el puente de Symfony y se encarga de cargar el entorno de pruebas antes de arrancar.

---

## Para qué sirven {: .topic-title }

La respuesta habitual —"para saber que el código funciona"— se queda corta. Eso ya lo compruebas abriendo el navegador.

El valor real aparece **más tarde**:

- **Refactorizar sin miedo.** Puedes reescribir un servicio entero y saber en diez segundos si has roto algo.
- **Actualizar dependencias.** Subir de Symfony 7.1 a 7.2 deja de ser una tarde de clics por toda la aplicación.
- **Documentación viva.** Una prueba muestra cómo se usa una clase, con un ejemplo que además está garantizado que funciona.
- **Detectar regresiones.** El fallo que arreglaste hace tres meses no vuelve, porque hay una prueba que lo vigila.

!!! info "El coste está al principio; el beneficio, en el mantenimiento"
    Escribir la primera prueba de un proyecto cuesta más que la funcionalidad que prueba. Por eso mucha gente abandona ahí.

    La rentabilidad llega cuando el proyecto tiene meses y ya no recuerdas por qué una clase hace lo que hace. Un proyecto que vas a tirar en dos semanas no necesita pruebas; uno que vas a mantener un año, sí.

---

## Los tres tipos {: .topic-title }

Symfony distingue tres niveles, y cada uno usa una clase base distinta. Elegir el nivel equivocado es la primera fuente de frustración.

| Tipo | Qué prueba | Clase base | Velocidad |
|---|---|---|---|
| **Unitaria** | Una clase o un método, aislado | `TestCase` de PHPUnit | Milisegundos |
| **Integración** | Varias clases hablando entre sí | `KernelTestCase` | Décimas |
| **Aplicación** | La aplicación entera, por HTTP | `WebTestCase` | Segundos |

La diferencia práctica es **cuánto de Symfony arranca**:

- Una prueba unitaria no arranca nada. Instancias la clase con `new` y comprueba lo que devuelve.
- Una de integración arranca el *kernel* y te da acceso al contenedor de servicios.
- Una de aplicación arranca el kernel **y** simula una petición HTTP completa, con enrutador, cortafuegos y plantillas.

!!! tip "La forma de la pirámide"
    Muchas unitarias, algunas de integración, pocas de aplicación.

    Las unitarias son rápidas y señalan el fallo con precisión: si falla, sabes exactamente qué método está mal. Las de aplicación son lentas y, cuando fallan, solo te dicen que "algo" en toda la cadena no funciona.

    Invertir la pirámide —probar todo por HTTP porque es lo que se parece a usar la web— produce una batería lenta que nadie ejecuta y que no dice dónde está el problema.

Las pruebas de aplicación también se llaman **funcionales**. Son lo mismo.

---

## Dónde viven {: .topic-title }

```
src/
└── Service/
    └── TaskStats.php
tests/
└── Service/
    └── TaskStatsTest.php
```

La carpeta `tests/` **replica la estructura de `src/`**, y cada clase de prueba se llama igual que la que prueba, con el sufijo `Test`.

El espacio de nombres sigue la misma lógica: `App\Service\TaskStats` se prueba desde `App\Tests\Service\TaskStatsTest`.

!!! warning "PHPUnit solo ejecuta lo que termina en `Test`"
    Un fichero llamado `TaskStatsTests.php` o `TestTaskStats.php` **no se ejecuta**, y PHPUnit no avisa: simplemente informa de que ha pasado todo.

    Lo mismo con los métodos: solo se ejecutan los que empiezan por `test`, o los marcados con el atributo `#[Test]`. Un método llamado `compruebaElTotal()` se queda ahí sin ejecutarse nunca.

    Cuando una prueba "pasa" sospechosamente rápido, comprueba primero que se está ejecutando.

---

## El entorno de pruebas {: .topic-title }

Las pruebas corren en su propio entorno, `test`, con su propia configuración y su propia base de datos.

```bash
# .env.test
KERNEL_CLASS=App\Kernel
APP_SECRET='$ecretf0rt3st'
```

Cualquier configuración específica se declara con `when@test`:

```yaml
# config/packages/twig.yaml
when@test:
    twig:
        strict_variables: true
```

Y la configuración de PHPUnit vive en `phpunit.dist.xml` —o `phpunit.xml.dist` en versiones anteriores—, donde se fija el entorno:

```xml
<php>
    <server name="APP_ENV" value="test" force="true"/>
</php>

<testsuites>
    <testsuite name="Project Test Suite">
        <directory>tests</directory>
    </testsuite>
</testsuites>
```

!!! danger "La base de datos de pruebas NO es la de desarrollo"
    Las pruebas crean, modifican y borran registros. Apuntarlas a tu base de datos de trabajo significa perder tus datos en la primera ejecución.

    ```bash
    # .env.test.local  (fuera del repositorio)
    DATABASE_URL="mysql://usuario:clave@127.0.0.1:3306/mi_app_test?serverVersion=8.4"
    ```
    Symfony añade el sufijo `_test` automáticamente en algunos casos, pero **no cuentes con ello**: declara la base de datos de pruebas de forma explícita y compruébalo antes de la primera ejecución.

---

## Anatomía de una prueba {: .topic-title }

```php
namespace App\Tests\Service;

use App\Service\ReferenceGenerator;
use PHPUnit\Framework\TestCase;

class ReferenceGeneratorTest extends TestCase
{
    public function testGeneraUnaReferenciaConElFormatoEsperado(): void
    {
        // Preparar
        $generador = new ReferenceGenerator();
        $tarea = new Task();
        $tarea->setCreatedAt(new \DateTimeImmutable('2026-08-30'));

        // Actuar
        $referencia = $generador->forTask($tarea);

        // Comprobar
        $this->assertMatchesRegularExpression('/^TSK-20260830-[0-9A-F]{4}$/', $referencia);
    }
}
```

Las tres partes —preparar, actuar, comprobar— son el esqueleto de cualquier prueba. Separarlas con una línea en blanco hace que se lea sola.

!!! tip "El nombre del método es la documentación"
    ```php
    public function testFuncionaBien()                              // ❌ no dice nada
    public function testGeneraUnaReferenciaConElFormatoEsperado()   // ✅
    public function testLanzaExcepcionSiLaTareaNoTieneFecha()       // ✅
    ```
    Cuando una prueba falla, PHPUnit imprime el nombre del método. Si ese nombre describe el comportamiento esperado, ya sabes qué se ha roto sin abrir el fichero.

---

## Temario {: .topic-title }

| Temario | Concepto |
|---------|----------|
| [01 - Pruebas unitarias](01-unitarias/index.md) | `TestCase`, aserciones, proveedores de datos, dobles de prueba |
| [02 - Pruebas de integración](02-integracion/index.md) | `KernelTestCase`, contenedor, base de datos de pruebas, *fixtures* |
| [03 - Pruebas de aplicación](03-aplicacion/index.md) | `WebTestCase`, cliente, *crawler*, formularios, `loginUser`, aserciones |
| [04 - Depuración y errores](04-depuracion-errores/index.md) | `dump`/`dd`, perfilador, registros, páginas de error personalizadas |

---

## 📚 Fuentes {: .topic-title }

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — Proves i depuració** | https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/provesidepuracio/ |
| 🐘 **Symfony — Testing** | https://symfony.com/doc/current/testing.html |
