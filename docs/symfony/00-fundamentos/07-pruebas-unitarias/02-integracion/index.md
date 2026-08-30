# Pruebas de integración { .section-fundamentos }

> Una prueba de integración arranca el *kernel* de Symfony y trabaja con los servicios reales del contenedor. Comprueba que las piezas encajan, que es justo lo que una prueba unitaria con dobles no puede verificar.

---

## Generar con MakerBundle {: .topic-title }

!!! example "💻 Comandos — MakerBundle"
    ```bash
    symfony console make:test        # elegir "KernelTestCase"

    symfony console --env=test doctrine:database:create
    symfony console --env=test doctrine:schema:create
    ```

---

## `KernelTestCase` {: .topic-title }

```php
namespace App\Tests\Service;

use App\Service\TaskStats;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class TaskStatsTest extends KernelTestCase
{
    public function testDevuelveElResumen(): void
    {
        self::bootKernel();

        $estadisticas = static::getContainer()->get(TaskStats::class);
        $resumen = $estadisticas->resumen();

        $this->assertArrayHasKey('total', $resumen);
        $this->assertArrayHasKey('pendientes', $resumen);
    }
}
```

Dos líneas hacen todo el trabajo: `bootKernel()` arranca la aplicación en el entorno `test`, y `getContainer()` da acceso al contenedor de servicios.

!!! warning "`getContainer()` es estático y solo funciona tras `bootKernel()`"
    ```php
    $container = static::getContainer();     // ✅
    $container = $this->getContainer();      // ❌ no existe
    ```
    Y si olvidas el `bootKernel()`, el error habla de que el kernel no ha arrancado, no de que falte una línea.

!!! info "En pruebas puedes obtener servicios privados"
    El contenedor de producción solo expone los servicios públicos. El de pruebas es un contenedor especial que **da acceso a todos**, incluidos los privados.

    Es intencionado: sin eso no podrías probar la mayoría de tus servicios, que por defecto son privados. No significa que puedas hacer lo mismo en un controlador.

Se puede arrancar con opciones distintas:

```php
self::bootKernel([
    'environment' => 'test',
    'debug' => false,          // más rápido en integración continua
]);
```

---

## Cuándo usarla en vez de una unitaria {: .topic-title }

| Situación | Tipo de prueba |
|---|---|
| Un método que calcula a partir de sus argumentos | Unitaria |
| Un servicio que depende de otros dos reales | Integración |
| Un repositorio con una consulta de Doctrine | Integración |
| Comprobar que la configuración del contenedor es correcta | Integración |
| Un validador con restricciones propias | Integración |

!!! tip "Las consultas de Doctrine solo se prueban de verdad contra una base de datos"
    Simular un `QueryBuilder` no comprueba nada útil: verificas que has llamado a los métodos que has decidido llamar, no que la consulta devuelva lo correcto.

    Un `andWhere` mal escrito, un `JOIN` que falta o un nombre de campo equivocado solo aparecen ejecutando la consulta. Los repositorios se prueban con `KernelTestCase` y datos reales.

---

## La base de datos de pruebas {: .topic-title }

```bash
# .env.test.local  (fuera del repositorio)
DATABASE_URL="mysql://usuario:clave@127.0.0.1:3306/mi_app_test?serverVersion=8.4"
```

```bash
symfony console --env=test doctrine:database:create
symfony console --env=test doctrine:schema:create
```

!!! danger "Comprueba a qué base de datos apunta antes de la primera ejecución"
    Las pruebas insertan y borran. Si `DATABASE_URL` apunta a tu base de datos de desarrollo, la primera ejecución se lleva tus datos por delante.

    ```bash
    symfony console --env=test debug:config doctrine dbal
    ```
    Míralo una vez. Cuesta diez segundos y evita un disgusto irreversible.

### Que cada prueba empiece limpia

El problema de fondo: si una prueba crea tres tareas y la siguiente cuenta cuántas hay, el resultado depende del orden de ejecución.

La solución estándar es envolver cada prueba en una transacción que se deshace al terminar:

```bash
composer require --dev dama/doctrine-test-bundle
```

```xml
<!-- phpunit.dist.xml -->
<extensions>
    <bootstrap class="DAMA\DoctrineTestBundle\PHPUnit\PHPUnitExtension"/>
</extensions>
```

Con eso, todo lo que una prueba escriba se revierte automáticamente al acabar. La base de datos vuelve a su estado anterior sin recrear el esquema.

!!! tip "Es la diferencia entre una batería de pruebas usable y una inservible"
    Sin aislamiento, las pruebas empiezan a fallar de forma intermitente según el orden en que se ejecuten. Y una batería que falla a veces se deja de mirar, que es peor que no tenerla.

    Vaciar las tablas a mano en `setUp()` también funciona, pero es lento y hay que acordarse de cada tabla nueva.

---

## Datos de partida {: .topic-title }

Las *fixtures* son datos de ejemplo que se cargan antes de probar.

```bash
composer require --dev doctrine/doctrine-fixtures-bundle
symfony console make:fixtures ProductoFixture
```

```php
namespace App\DataFixtures;

use App\Entity\Producto;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ProductoFixture extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $producto = new Producto();
        $producto->setNombre('Camiseta');
        $producto->setPrecio(14.50);

        $manager->persist($producto);
        $manager->flush();
    }
}
```

```bash
symfony console --env=test doctrine:fixtures:load
```

!!! danger "`doctrine:fixtures:load` VACÍA las tablas antes de cargar"
    Es su comportamiento por defecto, y por eso el comando pide confirmación. Ejecutado sin `--env=test`, borra tu base de datos de desarrollo.

    Añade `--append` si quieres cargar sin vaciar, y **acostúmbrate a escribir `--env=test` siempre** en los comandos relacionados con pruebas.

!!! tip "Datos mínimos, no un catálogo completo"
    Una *fixture* con doscientos productos hace las pruebas lentas y no aporta nada: si un método falla con dos productos, falla con doscientos.

    Carga lo justo para cubrir los casos que pruebas, incluidos los raros —un producto sin categoría, uno con precio cero—, que es donde de verdad aparecen los fallos.

---

## Sustituir un servicio {: .topic-title }

A veces quieres los servicios reales **menos uno**: el que llama a una API externa, el que envía correos, el que cobra.

```php
public function testAvisaAlCrearLaTarea(): void
{
    self::bootKernel();
    $container = static::getContainer();

    $mailer = $this->createMock(MailerInterface::class);
    $mailer->expects($this->once())->method('send');

    $container->set(MailerInterface::class, $mailer);

    $notificador = $container->get(TaskNotifier::class);
    $notificador->taskCreated($tarea);
}
```

`$container->set()` reemplaza el servicio real por tu doble. El resto de la aplicación sigue siendo real.

!!! warning "El orden importa: sustituye ANTES de pedir el servicio que lo usa"
    Si haces `get(TaskNotifier::class)` primero, el contenedor ya lo ha construido con el `MailerInterface` real y tu sustitución llega tarde.

!!! info "Para el correo hay una vía más limpia"
    Symfony trae aserciones específicas que no necesitan ningún doble:

    ```php
    $this->assertEmailCount(1);
    $email = $this->getMailerMessage(0);
    $this->assertEmailAddressContains($email, 'To', 'ana@ejemplo.com');
    $this->assertEmailSubjectContains($email, 'Nueva tarea');
    ```
    Funcionan porque en el entorno de pruebas el transporte de correo no envía nada: recoge los mensajes. Compruebas el contenido real del correo en vez de que se haya llamado a un método.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `bootKernel()` antes de `getContainer()` | Pedir el contenedor sin arrancar el kernel |
| Base de datos de pruebas separada y comprobada | Apuntar `DATABASE_URL` a la de desarrollo |
| `dama/doctrine-test-bundle` para aislar cada prueba | Depender del orden de ejecución |
| `--env=test` en todos los comandos de datos | `doctrine:fixtures:load` a secas |
| *Fixtures* mínimas, con los casos límite | Doscientos registros de relleno |
| Probar los repositorios contra la base de datos | Simular el `QueryBuilder` |
| Sustituir el servicio antes de pedir quien lo usa | Sustituirlo después y extrañarte |
| Aserciones de correo en vez de dobles | Simular el `MailerInterface` sin necesidad |

</div>

---

## 📚 Fuentes {: .topic-title }

| Recurso | Link |
|---------|------|
| 🐘 **Symfony — Testing** | https://symfony.com/doc/current/testing.html |
| 📙 **Institut Montilivi — Proves i depuració** | https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/provesidepuracio/ |
