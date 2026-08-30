# Pruebas de aplicación { .section-fundamentos }

> También llamadas funcionales. Simulan un navegador: hacen una petición HTTP real contra tu aplicación, reciben la respuesta y la inspeccionan. Es la prueba que comprueba que la cadena entera funciona.

---

## Generar con MakerBundle {: .topic-title }

!!! example "💻 Comandos — MakerBundle"
    ```bash
    symfony console make:test        # elegir "WebTestCase"
    php bin/phpunit tests/Controller
    ```

---

## La primera prueba {: .topic-title }

```php
namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class TaskControllerTest extends WebTestCase
{
    public function testLaListaDeTareasSeCarga(): void
    {
        $client = static::createClient();

        $client->request('GET', '/tasks');

        $this->assertResponseIsSuccessful();
        $this->assertSelectorTextContains('h1', 'Tareas');
    }
}
```

`createClient()` arranca el kernel **y** devuelve un cliente que simula un navegador. No hay servidor web de por medio: la petición entra directamente en el kernel, lo que la hace mucho más rápida que un navegador real.

!!! danger "`createClient()` solo se puede llamar una vez por prueba"
    ```php
    $client = static::createClient();
    $otro = static::createClient();     // ❌ LogicException
    ```
    Arranca el kernel, y el kernel ya está arrancado. Si necesitas dos usuarios distintos en el mismo escenario, usa un solo cliente y cambia de sesión con `loginUser()`.

    Tampoco llames a `bootKernel()` antes: `createClient()` lo hace por ti.

---

## Hacer peticiones {: .topic-title }

```php
$crawler = $client->request('GET', '/tasks');
$client->request('POST', '/tasks', ['title' => 'Nueva tarea']);

// Petición con cuerpo JSON, para una API
$client->request('POST', '/api/tasks', [], [], [
    'CONTENT_TYPE' => 'application/json',
], json_encode(['title' => 'Nueva tarea']));
```

La firma completa es `request($metodo, $uri, $parametros, $ficheros, $servidor, $contenido)`. Los parámetros del medio se saltan con arrays vacíos cuando no hacen falta.

!!! warning "Las cabeceras van con prefijo `HTTP_` y guiones bajos"
    ```php
    $client->request('GET', '/api/tasks', [], [], [
        'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
    ]);
    ```
    `Authorization` se convierte en `HTTP_AUTHORIZATION`; `X-Session-Token` en `HTTP_X_SESSION_TOKEN`. Es la convención de las variables de servidor, y escribirla como el nombre real de la cabecera hace que se ignore en silencio.

    Excepción: `CONTENT_TYPE` y `CONTENT_LENGTH` van **sin** el prefijo.

### Redirecciones

```php
$client->request('POST', '/tasks', ['title' => 'X']);
$this->assertResponseRedirects('/tasks');

$crawler = $client->followRedirect();     // seguirla a mano
```

O que las siga siempre:

```php
$client->followRedirects();
```

!!! tip "No sigas las redirecciones si quieres comprobarlas"
    Con `followRedirects()` activado, `assertResponseRedirects()` nunca se cumple: cuando compruebas, el cliente ya está en el destino.

    Comprueba primero la redirección, y **después** llama a `followRedirect()` si necesitas mirar la página final.

---

## El *crawler* {: .topic-title }

`request()` devuelve un *crawler*: un objeto que permite recorrer el HTML de la respuesta con selectores CSS.

```php
$crawler = $client->request('GET', '/tasks');

$crawler->filter('h1')->text();                  // el texto del primer h1
$crawler->filter('.task')->count();              // cuántos elementos
$crawler->filter('a.editar')->attr('href');      // un atributo
```

En la práctica se usa poco directamente, porque las aserciones que trae Symfony ya hacen el trabajo:

```php
$this->assertSelectorExists('.task');
$this->assertSelectorNotExists('.error');
$this->assertSelectorCount(3, '.task');
$this->assertSelectorTextContains('h1', 'Tareas');
$this->assertPageTitleContains('Tareas');
```

---

## Navegar y enviar formularios {: .topic-title }

```php
$client->request('GET', '/tasks');
$client->clickLink('Nueva tarea');

$client->submitForm('Guardar', [
    'task[title]' => 'Revisar informe',
    'task[priority]' => 'High',
]);

$this->assertResponseRedirects();
```

Los nombres de los campos son los del HTML generado, con la notación del formulario de Symfony: `task[title]`, no `title`.

Para casos que `submitForm` no cubre:

```php
$crawler = $client->request('GET', '/tasks/new');
$formulario = $crawler->selectButton('Guardar')->form();

$formulario['task[title]'] = 'Revisar informe';
$formulario['task[priority]']->select('High');
$formulario['task[urgente]']->tick();
$formulario['task[adjunto]']->upload('/ruta/al/fichero.pdf');

$client->submit($formulario);
```

!!! tip "El formulario recogido ya trae el token CSRF"
    Es la ventaja de partir del *crawler*: el token oculto que Symfony genera viene incluido, así que el envío pasa la validación sin que hagas nada.

    Si construyes la petición `POST` a mano con `request()`, el token falta y el formulario se rechaza. El síntoma engaña, porque parece un problema de validación de los datos.

---

## Probar con un usuario identificado {: .topic-title }

```php
public function testElPerfilRequiereSesion(): void
{
    $client = static::createClient();
    $repositorio = static::getContainer()->get(UserRepository::class);

    $usuario = $repositorio->findOneByEmail('ana@ejemplo.com');
    $client->loginUser($usuario);

    $client->request('GET', '/perfil');

    $this->assertResponseIsSuccessful();
}
```

`loginUser()` salta el formulario de acceso: coloca directamente al usuario en la sesión. Es lo correcto — el acceso ya lo pruebas una vez, y no tiene sentido repetirlo en las otras cincuenta pruebas.

Sin necesidad de base de datos:

```php
use Symfony\Component\Security\Core\User\InMemoryUser;

$usuario = new InMemoryUser('admin', 'clave', ['ROLE_ADMIN']);
$client->loginUser($usuario);
```

Y si hay varios cortafuegos, hay que decir cuál:

```php
$client->loginUser($usuario, 'api');
```

!!! danger "Prueba también lo que NO debe poder hacerse"
    ```php
    public function testUnUsuarioNormalNoEntraEnAdministracion(): void
    {
        $client = static::createClient();
        $client->loginUser($this->usuarioNormal());

        $client->request('GET', '/admin');

        $this->assertResponseStatusCodeSame(403);
    }
    ```
    Comprobar que un administrador entra no demuestra que los demás queden fuera. La prueba que de verdad protege es la del acceso denegado, y es la que casi nadie escribe.

    Lo mismo sin sesión: debe salir una redirección al acceso o un `401`, nunca un `500`.

---

## Aserciones útiles {: .topic-title }

| Aserción | Comprueba |
|---|---|
| `assertResponseIsSuccessful()` | Código 2xx |
| `assertResponseStatusCodeSame(404)` | Un código concreto |
| `assertResponseRedirects('/tasks')` | Redirección y destino |
| `assertResponseIsUnprocessable()` | Código 422 |
| `assertResponseHeaderSame('content-type', '...')` | Una cabecera |
| `assertResponseHasCookie('PHPSESSID')` | Una cookie |
| `assertSelectorTextContains('h1', 'X')` | Texto dentro de un selector |
| `assertSelectorCount(3, '.task')` | Cuántos elementos hay |
| `assertRouteSame('task_index')` | Qué ruta ha atendido |
| `assertInputValueSame('task[title]', 'X')` | El valor de un campo |
| `assertSessionHasFlashMessage('success', 'X')` | Un mensaje flash |
| `assertEmailCount(1)` | Cuántos correos se han enviado |

!!! tip "`assertResponseIsSuccessful()` da mejores mensajes que comparar el código"
    Cuando falla, Symfony imprime **el contenido de la respuesta**, incluido el mensaje de la excepción si hubo un error 500. Eso suele bastar para saber qué ha pasado sin abrir los registros.

---

## Probar una API {: .topic-title }

```php
public function testDevuelveLaListaEnJson(): void
{
    $client = static::createClient();

    $client->request('GET', '/api/tasks', [], [], [
        'HTTP_AUTHORIZATION' => 'Bearer ' . $this->obtenerToken($client),
    ]);

    $this->assertResponseIsSuccessful();
    $this->assertResponseHeaderSame('content-type', 'application/json');

    $datos = json_decode($client->getResponse()->getContent(), true);

    $this->assertArrayHasKey('data', $datos);
    $this->assertIsArray($datos['data']);
}
```

!!! danger "Comprueba que la respuesta de error también es JSON"
    ```php
    public function testUnRecursoInexistenteDevuelveJson(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/tasks/999999');

        $this->assertResponseStatusCodeSame(404);
        $this->assertResponseHeaderSame('content-type', 'application/json');
    }
    ```
    Es la prueba que detecta el problema descrito en [API REST → validación y errores](../../../03-api-rest/03-validacion-errores/index.md): sin un *listener* de excepciones, un `404` devuelve la página HTML de error y el cliente revienta al intentar leerla como JSON.

    Nadie prueba los errores de su API hasta que el frontend se queja.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Un solo `createClient()` por prueba | Llamarlo dos veces y recibir una excepción |
| `loginUser()` para saltar el acceso | Rellenar el formulario de acceso en cada prueba |
| Probar el acceso denegado y el no autenticado | Solo comprobar que el administrador entra |
| Recoger el formulario del *crawler* | Construir el `POST` a mano y perder el token CSRF |
| Comprobar la redirección antes de seguirla | `followRedirects()` y luego intentar comprobarla |
| Cabeceras con prefijo `HTTP_` | `'Authorization' => ...` tal cual |
| Comprobar que los errores de la API son JSON | Probar solo el camino feliz |
| Pocas pruebas de aplicación, bien elegidas | Cubrir cada caso límite por HTTP |

</div>

---

## 📚 Fuentes {: .topic-title }

| Recurso | Link |
|---------|------|
| 🐘 **Symfony — Testing** | https://symfony.com/doc/current/testing.html |
| 📙 **Institut Montilivi — Proves i depuració** | https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/provesidepuracio/ |
