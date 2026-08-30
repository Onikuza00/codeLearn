# Pruebas unitarias { .section-fundamentos }

> Una prueba unitaria comprueba **una clase, aislada de todo lo demás**. No arranca Symfony, no toca la base de datos y no hace peticiones. Por eso tarda milisegundos y, cuando falla, señala exactamente qué método está mal.

---

## Generar con MakerBundle {: .topic-title }

!!! example "💻 Comandos — MakerBundle"
    ```bash
    symfony console make:test        # elegir "TestCase"
    php bin/phpunit tests/Service/ReferenceGeneratorTest.php
    php bin/phpunit --filter testGeneraReferencia    # un solo método
    ```

---

## Qué se puede probar así {: .topic-title }

Una clase es fácil de probar de forma unitaria cuando **no depende de nada externo**: recibe datos, calcula y devuelve.

| Buen candidato | Mal candidato |
|---|---|
| Un servicio que formatea o calcula | Un controlador |
| Un `Voter` | Un repositorio de Doctrine |
| Una clase que valida reglas de negocio | Un servicio que envía correos |
| Un DTO con lógica propia | Cualquier cosa que llame a una API |

!!! info "Si una clase es difícil de probar, normalmente el problema es la clase"
    Cuando para probar un método necesitas arrancar media aplicación, suele significar que ese método hace demasiadas cosas o que crea sus dependencias por dentro en vez de recibirlas.

    Ese es el vínculo entre las pruebas y la inyección de dependencias: una clase que recibe sus colaboradores por el constructor se prueba sola, porque puedes darle sustitutos. Una que hace `new EntityManager()` dentro, no.

    La dificultad para probar es una señal de diseño, no una molestia del testeo.

---

## Aserciones {: .topic-title }

Una aserción es la comprobación: si se cumple, la prueba sigue; si no, falla ahí mismo.

```php
$this->assertSame(42, $resultado);              // idénticos: valor Y tipo
$this->assertEquals('42', $resultado);          // iguales tras conversión
$this->assertTrue($condicion);
$this->assertNull($valor);
$this->assertCount(3, $array);
$this->assertContains('rojo', $colores);
$this->assertArrayHasKey('total', $resumen);
$this->assertInstanceOf(Task::class, $objeto);
$this->assertMatchesRegularExpression('/^TSK-\d{8}$/', $referencia);
$this->assertGreaterThan(0, $total);
$this->assertEmpty($errores);
```

!!! danger "`assertEquals` compara con conversión de tipos; `assertSame` no"
    ```php
    $this->assertEquals(42, '42');    // ✅ pasa
    $this->assertSame(42, '42');      // ❌ falla: int contra string
    ```
    `assertEquals` deja pasar un método que devuelve una cadena donde debería devolver un número. La prueba está en verde y el contrato está roto.

    **Usa `assertSame` por defecto.** Recurre a `assertEquals` solo cuando comparas objetos y de verdad te interesa el contenido y no la instancia.

### Probar que algo falla

Comprobar que una excepción se lanza es tan importante como comprobar el camino feliz:

```php
public function testLanzaExcepcionSiElPrecioEsNegativo(): void
{
    $this->expectException(\InvalidArgumentException::class);
    $this->expectExceptionMessage('El precio no puede ser negativo');

    new Producto('Camiseta', -10);
}
```

!!! warning "`expectException` va ANTES de la línea que falla"
    Si lo pones después, la excepción se lanza primero y la prueba explota en vez de pasar.

    Y no pongas nada detrás de la línea que provoca el fallo: no se ejecutará nunca, porque la excepción corta el método ahí.

---

## Proveedores de datos {: .topic-title }

Cuando la misma lógica hay que comprobarla con varias entradas, copiar el método cambiando los valores es ruido. Un proveedor de datos ejecuta la prueba una vez por cada caso.

```php
use PHPUnit\Framework\Attributes\DataProvider;

#[DataProvider('casosDeIva')]
public function testCalculaElIva(float $base, float $esperado): void
{
    $calculadora = new CalculadoraIva();

    $this->assertSame($esperado, $calculadora->aplicar($base));
}

public static function casosDeIva(): array
{
    return [
        'importe normal'  => [100.0, 121.0],
        'importe cero'    => [0.0, 0.0],
        'con decimales'   => [10.5, 12.71],
    ];
}
```

!!! tip "Ponle nombre a cada caso"
    Las claves del array (`'importe cero'`) aparecen en la salida de PHPUnit cuando ese caso falla. Sin ellas, el mensaje dice "conjunto de datos #1" y toca contar posiciones.

    El proveedor debe ser **estático**: PHPUnit lo llama antes de instanciar la clase de prueba.

---

## Dobles de prueba {: .topic-title }

Un **doble** es un objeto falso que sustituye a una dependencia real. Sirve para dos cosas: aislar la clase que pruebas y controlar qué devuelve su colaborador.

```php
public function testAvisaAlCrearUnaTarea(): void
{
    $logger = $this->createMock(LoggerInterface::class);

    $logger->expects($this->once())
           ->method('info')
           ->with('Tarea creada', $this->anything());

    $notificador = new TaskNotifier($logger);
    $notificador->taskCreated($tarea);
}
```

Y para fijar lo que devuelve:

```php
$repositorio = $this->createMock(TaskRepository::class);
$repositorio->method('count')->willReturn(7);

$estadisticas = new TaskStats($repositorio);

$this->assertSame(7, $estadisticas->resumen()['total']);
```

| Método | Para qué |
|---|---|
| `createMock()` | Crear el doble a partir de una interfaz o clase |
| `->method('x')->willReturn($v)` | Fijar qué devuelve |
| `->willThrowException($e)` | Simular un fallo |
| `->expects($this->once())` | Exigir que se llame exactamente una vez |
| `->expects($this->never())` | Exigir que **no** se llame |
| `->with($argumento)` | Comprobar con qué argumentos se llama |

!!! tip "Simula una interfaz, no una clase concreta"
    ```php
    $this->createMock(LoggerInterface::class);   // ✅
    $this->createMock(MonologLogger::class);     // ⚠️ frágil
    ```
    La interfaz es el contrato y cambia poco. Una clase concreta puede ganar métodos, volverse `final` —lo que impide simularla— o cambiar de firma, y tu prueba se rompe sin que tu código haya cambiado.

    Es otro argumento a favor de declarar los tipos por interfaz en el constructor.

!!! danger "No simules aquello que estás probando"
    ```php
    $servicio = $this->createMock(TaskStats::class);
    $servicio->method('resumen')->willReturn(['total' => 7]);

    $this->assertSame(7, $servicio->resumen()['total']);   // ❌ no prueba nada
    ```
    Ahí has comprobado que PHPUnit sabe devolver lo que le has dicho que devuelva. El código real ni se ejecuta.

    Se simulan **las dependencias**, nunca el objeto bajo prueba.

!!! warning "Demasiados dobles significa que la clase depende de demasiado"
    Si para probar un método necesitas cinco `createMock`, la prueba se vuelve tan complicada como el código, y además queda atada a los detalles internos: cambiar el orden de las llamadas la rompe aunque el resultado sea el mismo.

    Cuando eso pasa, la respuesta suele ser partir la clase, no escribir más dobles.

---

## Preparación compartida {: .topic-title }

`setUp()` se ejecuta antes de **cada** método de prueba:

```php
class TaskStatsTest extends TestCase
{
    private TaskRepository $repositorio;
    private TaskStats $estadisticas;

    protected function setUp(): void
    {
        $this->repositorio = $this->createMock(TaskRepository::class);
        $this->estadisticas = new TaskStats($this->repositorio);
    }

    public function testDevuelveElTotal(): void
    {
        $this->repositorio->method('count')->willReturn(7);

        $this->assertSame(7, $this->estadisticas->resumen()['total']);
    }
}
```

!!! info "Cada prueba arranca de cero"
    PHPUnit crea una **instancia nueva** de la clase de prueba para cada método. No hay estado compartido entre pruebas, y es intencionado: si una prueba dependiera del resultado de otra, el orden de ejecución cambiaría el resultado.

    Si dos pruebas tuyas solo pasan cuando se ejecutan en cierto orden, hay algo que se está guardando fuera de la instancia —una propiedad estática, un fichero, una variable global— y eso es un fallo de la prueba.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `assertSame` por defecto | `assertEquals`, que deja pasar tipos incorrectos |
| Nombres de método que describan el comportamiento | `testFunciona1`, `testFunciona2` |
| Una sola cosa comprobada por prueba | Veinte aserciones en un método |
| Proveedores de datos con casos nombrados | Copiar el método cambiando un número |
| Probar también el camino de error | Solo el caso que sabes que funciona |
| Simular interfaces | Simular clases concretas o `final` |
| Simular las dependencias | Simular el objeto que estás probando |
| Partir la clase cuando necesita cinco dobles | Escribir un quinto `createMock` |

</div>

---

## 📚 Fuentes {: .topic-title }

| Recurso | Link |
|---------|------|
| 🐘 **Symfony — Testing** | https://symfony.com/doc/current/testing.html |
| 📙 **Institut Montilivi — Proves i depuració** | https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/provesidepuracio/ |
