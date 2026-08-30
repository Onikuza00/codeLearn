# Depuración y errores { .section-fundamentos }

> Cuando algo falla hay dos preguntas: qué ha pasado, y qué ve el usuario mientras tanto. La primera se responde con las herramientas de depuración; la segunda, con páginas de error propias.

---

## Instalar los paquetes {: .topic-title }

!!! example "💻 Comandos — instalación"
    ```bash
    composer require --dev symfony/debug-pack     # perfilador, dump, registros ampliados
    composer require symfony/twig-pack            # necesario para plantillas de error propias
    ```

---

## `dump()` y `dd()` {: .topic-title }

`dump()` imprime cualquier variable con su estructura desplegable, en la barra de depuración o en la salida.

```php
dump($tarea);           // imprime y sigue
dd($tarea);             // imprime y detiene la ejecución (dump and die)
```

Y en Twig:

```twig
{{ dump(tareas) }}
{% dump tareas %}       {# va a la barra de depuración, no a la página #}
```

!!! danger "Un `dump()` olvidado llega a producción"
    Y ahí imprime la estructura interna de tus objetos en medio de la página: nombres de propiedades, valores, a veces datos de otros usuarios.

    Peor aún en una API: rompe el JSON, porque el volcado se escribe antes de la respuesta y el cliente recibe algo que no puede interpretar.

    Antes de cada commit:

    ```bash
    grep -rn "dump(\|dd(" src/ templates/
    ```
    En proyectos serios eso lo comprueba la integración continua.

!!! tip "En un comando de consola, `dump()` no siempre se ve"
    Los comandos deben escribir a través de `SymfonyStyle`:

    ```php
    $io->writeln(var_export($datos, true));
    ```

---

## El perfilador {: .topic-title }

La barra que aparece abajo en desarrollo es la punta del perfilador. Al pulsarla se abre un panel con todo lo que ha pasado en esa petición.

| Panel | Responde a |
|---|---|
| **Request / Response** | Qué ruta y controlador han atendido, con qué parámetros |
| **Doctrine** | Qué consultas se han lanzado, cuántas y cuánto han tardado |
| **Security** | Quién está autenticado, con qué roles, qué cortafuegos |
| **Mailer** | Qué correos se han generado, con su contenido |
| **Logs** | Los mensajes registrados durante la petición |
| **Performance** | Dónde se ha ido el tiempo |
| **Twig** | Qué plantillas se han renderizado y en qué orden |

!!! tip "El panel de Doctrine es el que más problemas descubre"
    Enseña el número de consultas de la petición. Si una página que muestra veinte tareas lanza sesenta consultas, tienes un problema **N+1**: por cada tarea, Doctrine va a buscar su proyecto y su usuario por separado.

    Se arregla con un `JOIN` explícito en el repositorio. Pero primero hay que verlo, y ese panel es donde se ve.

!!! info "El perfilador también funciona en las pruebas"
    ```php
    $client->enableProfiler();
    $client->request('GET', '/tasks');
    $perfil = $client->getProfile();
    ```
    Permite escribir una prueba que falle si una página supera cierto número de consultas. Es la forma de que un problema N+1 no vuelva.

---

## Registros {: .topic-title }

```php
use Psr\Log\LoggerInterface;

public function __construct(private LoggerInterface $logger) { }

public function procesar(): void
{
    $this->logger->info('Tarea procesada', ['id' => $tarea->getId()]);
    $this->logger->warning('El precio es negativo', ['precio' => $precio]);
    $this->logger->error('Falló el envío', ['exception' => $e]);
}
```

Los ficheros están en `var/log/`: `dev.log` en desarrollo, `prod.log` en producción.

```bash
tail -f var/log/dev.log
grep -B 3 -A 10 "Exception" var/log/prod.log
```

!!! tip "El segundo argumento es contexto, no texto"
    ```php
    $this->logger->error("Falló la tarea {$id} del usuario {$email}");     // ❌
    $this->logger->error('Falló la tarea', ['id' => $id, 'email' => $email]); // ✅
    ```
    Con el contexto separado, todos los fallos del mismo tipo comparten el mismo mensaje y se pueden agrupar y contar. Metiendo los valores dentro del texto, cada error es una cadena distinta y no hay forma de buscarlos juntos.

!!! danger "No registres contraseñas, tokens ni datos personales"
    Los registros se leen, se copian y a veces se envían a servicios externos de monitorización. Todo lo que escribas ahí deja de estar protegido.

Cuando la excepción no aparece por ningún lado, el sitio donde mirar es [Comandos de Linux → Ver y buscar](../../../../devops/02-linux/02-ver-buscar/index.md).

---

## Páginas de error propias {: .topic-title }

Symfony trata **todos los errores como excepciones**, incluidos los HTTP. Un `404` es una `NotFoundHttpException` que el manejador convierte en respuesta.

Las plantillas propias van en una ruta concreta:

```
templates/
└── bundles/
    └── TwigBundle/
        └── Exception/
            ├── error404.html.twig
            ├── error403.html.twig
            └── error.html.twig      ← el resto, incluido el 500
```

```twig
{# templates/bundles/TwigBundle/Exception/error404.html.twig #}
{% extends 'base.html.twig' %}

{% block body %}
    <h1>Página no encontrada</h1>
    <p>
        Comprueba la dirección o
        <a href="{{ path('app_homepage') }}">vuelve al inicio</a>.
    </p>
{% endblock %}
```

Variables disponibles: `status_code`, `status_text` y `exception`.

!!! danger "La plantilla del 500 debe ser lo más simple posible"
    Si la aplicación ha fallado, cualquier cosa de la que dependa tu plantilla puede estar rota también: la base de datos, un servicio inyectado, la propia plantilla base.

    Una plantilla de error 500 que extiende `base.html.twig` y ese `base` consulta el usuario actual acaba lanzando **otra** excepción mientras intenta mostrar la primera. El usuario ve una página en blanco y en los registros hay dos errores encadenados.

    La plantilla del 500 va sin herencia, sin consultas y con el mínimo Twig posible. Es la única página que tiene que funcionar cuando nada funciona.

!!! warning "En desarrollo NO verás tus páginas de error"
    Con `APP_ENV=dev` sale la pantalla de excepción con la traza, que es lo que quieres mientras programas. Tus plantillas solo aparecen en producción.

    Para probarlas sin cambiar de entorno, se activan unas rutas especiales:

    ```yaml
    # config/routes/framework.yaml
    when@dev:
        _errors:
            resource: '@FrameworkBundle/Resources/config/routing/errors.php'
            type: php
            prefix: /_error
    ```
    Y se visitan directamente:

    ```
    http://localhost:8000/_error/404
    http://localhost:8000/_error/500
    http://localhost:8000/_error/404.json
    ```
    Sin esto, la primera vez que ves tu página de error es en producción, que es el peor momento para descubrir que tiene una errata.

!!! info "En las páginas 404 no hay información de seguridad"
    El cortafuegos se resuelve **después** del enrutador. Cuando la ruta no existe, no se llega a cargar el usuario, así que `app.user` es `null` en `error404.html.twig` aunque haya sesión iniciada.

    Por eso una plantilla de error que muestra el menú de usuario falla justo en los 404.

---

## Errores en formato JSON {: .topic-title }

Para una API, la página HTML de error no sirve. La forma limpia es un *listener* de excepciones, explicado en [API REST → validación y errores](../../../03-api-rest/03-validacion-errores/index.md).

También se puede sustituir el controlador de errores completo:

```yaml
# config/packages/framework.yaml
framework:
    error_controller: App\Controller\ErrorController::show
```

O cambiar solo el formato de la respuesta con un normalizador propio, que recibe una `FlattenException` —una representación serializable de la excepción original—:

```php
namespace App\Serializer;

use Symfony\Component\ErrorHandler\Exception\FlattenException;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class ProblemNormalizer implements NormalizerInterface
{
    public function normalize($exception, ?string $format = null, array $context = []): array
    {
        return [
            'error' => [
                'code' => $exception->getStatusCode(),
                'message' => $exception->getMessage(),
            ],
        ];
    }

    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof FlattenException;
    }
}
```

---

## Páginas de error estáticas {: .topic-title }

Si la aplicación está tan rota que PHP no arranca, ninguna plantilla de Twig se va a renderizar. Para eso se generan versiones estáticas que sirve el propio servidor web:

```bash
APP_ENV=prod php bin/console error:dump var/cache/prod/error_pages/
APP_ENV=prod php bin/console error:dump var/cache/prod/error_pages/ 401 403 404 500
```

```nginx
server {
    error_page 404 /error_pages/404.html;
    error_page 500 /error_pages/500.html;

    location ^~ /error_pages/ {
        root /ruta/a/tu/symfony/var/cache/prod;
        internal;
    }
}
```

!!! tip "Es la red de seguridad de última instancia"
    Cubre el caso en el que PHP no responde: un error fatal, la caché sin permisos, un despliegue a medias. Sin esto, el visitante ve la página de error genérica del servidor web, o directamente nada.

    Se regenera en cada despliegue, junto al `cache:warmup`.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Buscar `dump(`/`dd(` antes de cada commit | Descubrir un volcado en producción |
| Mirar el panel de Doctrine ante una página lenta | Optimizar a ciegas sin contar consultas |
| Mensaje fijo y valores en el contexto del registro | Interpolar los datos dentro del texto |
| Plantilla del 500 sin herencia ni consultas | Extender `base.html.twig` en la página del 500 |
| Activar `/_error/` y probar las páginas en desarrollo | Verlas por primera vez en producción |
| *Listener* de excepciones para las rutas de API | Devolver HTML a un cliente que espera JSON |
| Regenerar `error:dump` en cada despliegue | Confiar solo en las plantillas de Twig |
| Registrar la traza de los `500` | Contar el detalle del error al usuario |

</div>

---

## 📚 Fuentes {: .topic-title }

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — Proves i depuració** | https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/provesidepuracio/ |
| 🐘 **Symfony — Customizing Error Pages** | https://symfony.com/doc/current/controller/error_pages.html |
| 🐘 **Symfony — Testing** | https://symfony.com/doc/current/testing.html |
