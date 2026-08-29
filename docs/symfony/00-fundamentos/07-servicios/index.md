# Servicios { .section-fundamentos }

> Un servicio es un objeto PHP que hace **un** trabajo (validar una subida, hablar con una API, generar un slug). El contenedor de servicios los construye y los conecta por ti: tú pides, él inyecta.

---

## Sin `make:service` — se crea a mano {: .topic-title }

MakerBundle **no** tiene un `make:service`: un servicio corriente es una clase PHP normal que creas tú en `src/Service/`. Lo que sí genera son **servicios especializados**, que por dentro funcionan igual:

!!! example "💻 Comandos — makers que generan servicios"
    ```bash
    symfony console make:twig-extension   # función/filtro Twig respaldado por un servicio
    symfony console make:command          # comando de consola
    symfony console make:subscriber       # event subscriber
    ```

Y para **inspeccionar** lo que hay registrado en el contenedor:

!!! example "💻 Comandos — inspección del contenedor"
    ```bash
    symfony console debug:container       # lista todos los servicios
    symfony console debug:autowiring      # tipos que se pueden inyectar por type-hint
    symfony console lint:container        # valida que el contenedor compila sin errores
    ```

## Qué problema resuelve {: .topic-title }

Cuando una clase crea sus propias dependencias con `new`, queda atada a esa implementación concreta y es difícil de testear o reutilizar:

```php
// ❌ la clase decide qué formateador usa — no hay forma de cambiarlo desde fuera
class MessageGenerator
{
    public function getMessage(): string
    {
        $formatter = new TextFormatter();
        return $formatter->format('...');
    }
}
```

La **inyección de dependencias** le da la vuelta: la clase declara qué necesita en el constructor y lo recibe ya construido. No sabe ni le importa de dónde sale.

```php
// ✅ recibe la dependencia — se le puede pasar cualquier implementación de FormatterInterface
class MessageGenerator
{
    public function __construct(
        private FormatterInterface $formatter,
    ) {
    }

    public function getMessage(): string
    {
        return $this->formatter->format('...');
    }
}
```

Aplicado a la web: la lógica que no es "recibir la petición y devolver la respuesta" **no vive en el controlador**. El controlador queda fino (orquesta), y el trabajo real —validar un archivo, llamar a una API, calcular un precio— vive en un servicio que puedes reutilizar desde otro controlador, desde un comando de consola o desde otro servicio.

## El contenedor de servicios {: .topic-title }

El **contenedor** (o *dependency injection container*) es el objeto que sabe construir cada servicio de la aplicación y entregártelo montado. En lugar de instanciar con `new` y encadenar dependencias a mano, se lo pides al contenedor —normalmente sin pedirlo explícitamente: basta con poner el type-hint.

```php
use Psr\Log\LoggerInterface;

class ProductController extends AbstractController
{
    #[Route('/products', name: 'product_list')]
    public function list(LoggerInterface $logger): Response
    {
        $logger->info('Listando productos');   // $logger lo inyectó el contenedor
        // ...
    }
}
```

!!! tip "Los servicios son privados: se inyectan, no se piden"
    Por defecto un servicio es **privado** — no se puede sacar con `$container->get(MiServicio::class)` desde cualquier sitio. Se recibe siempre por inyección (argumento del constructor o del método del controlador). Inyectar el contenedor entero para ir sacando servicios de él (*service locator*) es justo lo que se quiere evitar: esconde de qué depende realmente la clase.

## `config/services.yaml` y autowiring {: .topic-title }

Casi nunca hace falta tocar este archivo. Su bloque `_defaults` es lo que hace que todo funcione solo:

```yaml
# config/services.yaml
services:
    _defaults:
        autowire: true       # inyecta dependencias leyendo los type-hints del constructor
        autoconfigure: true  # detecta el rol del servicio (comando, subscriber...) y lo registra

    App\:
        resource: '../src/'
        exclude:
            - '../src/DependencyInjection/'
            - '../src/Entity/'
            - '../src/Kernel.php'
```

- **`autowire: true`** — el contenedor mira el type-hint de cada argumento del constructor y busca el servicio que encaja. `LoggerInterface` → el logger real; `FileUploadValidator` → tu clase.
- **`autoconfigure: true`** — si tu clase implementa una interfaz conocida (`Command`, `EventSubscriberInterface`...), se registra en su sitio sin config extra.
- **`App\` con `resource: '../src/'`** — registra como servicio **toda** clase de `src/` automáticamente. Por eso cualquier clase que crees ahí es inyectable de inmediato, sin escribir nada en el YAML. Las `Entity` se excluyen: son datos, no servicios.

!!! info "Autowiring por interfaz"
    Si el type-hint es una interfaz y hay **una sola** implementación registrada, el contenedor la resuelve sola. Si hay varias, hay que desambiguar (ver más abajo). Comprueba qué se puede inyectar con `debug:autowiring`.

## Crear un servicio propio {: .topic-title }

Una clase normal en `src/Service/`. Sin `extends`, sin atributos, sin registrarla en ningún sitio.

Ejemplo web típico — validar una subida antes de aceptarla:

```php
// src/Service/FileUploadValidator.php
namespace App\Service;

use Symfony\Component\HttpFoundation\File\UploadedFile;

class FileUploadValidator
{
    private const MAX_BYTES = 2 * 1024 * 1024;              // 2 MB
    private const ALLOWED = ['image/jpeg', 'image/png', 'application/pdf'];

    /** @return string[] lista de errores; vacía si el archivo es válido */
    public function validate(UploadedFile $file): array
    {
        $errors = [];

        if ($file->getSize() > self::MAX_BYTES) {
            $errors[] = 'El archivo supera los 2 MB.';
        }

        if (!in_array($file->getMimeType(), self::ALLOWED, true)) {
            $errors[] = 'Formato no permitido (solo JPG, PNG o PDF).';
        }

        return $errors;
    }
}
```

En el controlador se pide por type-hint y ya está montado:

```php
#[Route('/upload', name: 'file_upload', methods: ['POST'])]
public function upload(Request $request, FileUploadValidator $validator): Response
{
    $file = $request->files->get('documento');
    $errors = $validator->validate($file);

    if ($errors) {
        return $this->json(['errors' => $errors], 422);
    }

    // ... mover el archivo, guardar la ruta en la entidad
}
```

!!! tip "Un servicio es compartido: no guardes estado de la petición en propiedades"
    Por defecto el contenedor crea **una sola instancia** de cada servicio y la reutiliza durante toda la petición (y, con algunas configuraciones, entre peticiones). Guardar en una propiedad algo específico de *esta* petición (el usuario actual, el archivo que se está subiendo) es una fuente de bugs difíciles. El servicio recibe lo que necesita como **argumento del método** y devuelve el resultado; no acumula estado.

## Inyección por constructor: un servicio que usa otros {: .topic-title }

Un servicio puede depender de otros servicios —un repositorio, el logger, un cliente HTTP— y los declara igual, en el constructor:

```php
// src/Service/WeatherClient.php
namespace App\Service;

use Psr\Log\LoggerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class WeatherClient
{
    public function __construct(
        private HttpClientInterface $http,
        private LoggerInterface $logger,
    ) {
    }

    public function current(string $city): array
    {
        $this->logger->info('Consultando el tiempo de ' . $city);

        $response = $this->http->request('GET', 'https://api.example.com/weather', [
            'query' => ['city' => $city],
        ]);

        return $response->toArray();   // lanza excepción si el status no es 2xx
    }
}
```

- `HttpClientInterface` viene del paquete `symfony/http-client` (`composer require symfony/http-client`). Es el cliente HTTP estándar para hablar con APIs externas.
- Sintaxis de constructor con **propiedades promocionadas** (`private HttpClientInterface $http` directamente en la firma): PHP crea la propiedad y la asigna sola, sin `$this->http = $http` en el cuerpo.

!!! tip "El type-hint del constructor va contra la interfaz, no la clase concreta"
    `HttpClientInterface`, `LoggerInterface`, `MailerInterface`... siempre la interfaz. Así el contenedor puede cambiar la implementación (un cliente falso en los tests, uno con reintentos en producción) sin tocar tu servicio.

## Argumentos que no son servicios {: .topic-title }

Un token de API, un email de administrador, un tamaño máximo — el contenedor no puede adivinarlos por el type-hint (`string`, `int`). Se le indica con el atributo **`#[Autowire]`** sobre el argumento:

```php
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class WeatherClient
{
    public function __construct(
        private HttpClientInterface $http,
        #[Autowire('%env(WEATHER_API_KEY)%')]      // variable de entorno (.env)
        private string $apiKey,
        #[Autowire(param: 'app.weather_ttl')]      // parámetro definido en services.yaml
        private int $cacheTtl,
        #[Autowire('https://api.example.com')]     // valor literal
        private string $baseUrl,
    ) {
    }
}
```

Las tres formas que se inyectan así:

| Origen | Con `#[Autowire]` | Equivalente en YAML |
|---|---|---|
| Valor literal | `#[Autowire('texto')]` | `arguments: { $x: 'texto' }` |
| Variable de entorno (`.env`) | `#[Autowire('%env(API_KEY)%')]` | `arguments: { $x: '%env(API_KEY)%' }` |
| Parámetro del contenedor | `#[Autowire(param: 'app.x')]` | `arguments: { $x: '%app.x%' }` |

Los parámetros propios se definen una vez en `config/services.yaml`:

```yaml
parameters:
    app.weather_ttl: 3600

services:
    _defaults:
        autowire: true
        autoconfigure: true
    App\:
        resource: '../src/'
```

!!! tip "Secretos en `.env`, nunca en el código"
    Una clave de API, una contraseña de base de datos, un token — van en `.env.local` (que no se sube al repo) y se inyectan con `%env(NOMBRE)%`. Escribir el valor directo en el `#[Autowire('...')]` o en el YAML lo deja en el historial de Git para siempre.

## Elegir entre varias implementaciones {: .topic-title }

Si una interfaz tiene varios servicios que la implementan, el autowiring no sabe cuál quieres y falla al compilar. Se desambigua nombrando el servicio concreto:

```php
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class MessageGenerator
{
    public function __construct(
        #[Autowire(service: 'monolog.logger.request')]   // este logger, no cualquiera
        private LoggerInterface $logger,
    ) {
    }
}
```

El id exacto del servicio sale de `debug:autowiring LoggerInterface` o `debug:container`.

## Servicios en Twig y en comandos {: .topic-title }

**En una plantilla** no se inyecta un servicio directamente: se expone una función Twig respaldada por un servicio, con una *Twig Extension* (`make:twig-extension`):

```php
// src/Twig/AppExtension.php
namespace App\Twig;

use App\Service\PriceCalculator;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class AppExtension extends AbstractExtension
{
    public function __construct(
        private PriceCalculator $calculator,
    ) {
    }

    public function getFilters(): array
    {
        return [
            new TwigFilter('con_iva', [$this->calculator, 'withVat']),
        ];
    }
}
```

```twig
{# la extensión es un servicio; el contenedor la registra sola por autoconfigure #}
<span>{{ product.price|con_iva }} €</span>
```

**En un comando de consola** (`make:command`) los servicios se inyectan en el constructor igual que en cualquier otra clase — un comando *es* un servicio.

## La Request dentro de un servicio {: .topic-title }

Un servicio **no** puede recibir `Request` por el constructor (no hay una "la" request cuando el contenedor se construye). Para leer la petición en curso se inyecta `RequestStack`:

```php
use Symfony\Component\HttpFoundation\RequestStack;

class LocaleContext
{
    public function __construct(
        private RequestStack $requestStack,
    ) {
    }

    public function currentLocale(): string
    {
        return $this->requestStack->getCurrentRequest()?->getLocale() ?? 'es';
    }
}
```

Aun así, la vía preferida sigue siendo pasar el dato como **argumento del método** desde el controlador (que sí tiene la `Request` a mano) en vez de que el servicio vaya a buscarlo.

## 📚 Fuentes {: .topic-title }
| Fuente | Enlace |
|---|---|
| 📕 **Apuntes propios** (base de estos temarios — prevalece en caso de conflicto) | `Symfony.pdf` — apunts DAW2 |
| 🏫 **Apunts del profesor — Institut Montilivi** | [apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/serveis](https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/serveis/) |
| 📘 **Documentación oficial de Symfony — Service Container** | [symfony.com/doc/current/service_container.html](https://symfony.com/doc/current/service_container.html) |
| 📘 **Symfony — `#[Autowire]` attribute** | [symfony.com/doc/current/service_container/autowiring.html](https://symfony.com/doc/current/service_container/autowiring.html) |
| 🎥 **SymfonyCasts — Symfony Fundamentals** (servicios y contenedor) | [symfonycasts.com/screencast/symfony-fundamentals](https://symfonycasts.com/screencast/symfony-fundamentals) |
