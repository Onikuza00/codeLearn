# Enviar emails { .section-fundamentos }

> El componente Mailer de Symfony envía correo desde un servicio. Tú construyes un objeto `Email` y se lo pasas a `MailerInterface`; el transporte real (SMTP, un proveedor, o nada en dev) se decide por configuración, no en el código.

---

## Instalar {: .topic-title }

!!! example "💻 Comando"
    ```bash
    composer require symfony/mailer
    ```

El recipe de Flex añade a `.env` la variable que decide **por dónde sale** el correo:

```env
# .env  → valor por defecto: no envía nada
MAILER_DSN=null://null
```

| DSN | Qué hace |
|---|---|
| `null://null` | No envía. El mensaje se registra en el profiler (útil en desarrollo) |
| `smtp://user:pass@smtp.example.com:587` | SMTP clásico |
| `brevo+api://KEY@default` | Un proveedor con su bridge (`composer require symfony/brevo-mailer`), pensado para producción |

El DSN real de producción va en `.env.local` o en las variables de entorno del servidor, **nunca** en `.env`.

## Enviar un email de texto {: .topic-title }

`MailerInterface` se inyecta por el constructor y tiene un solo método que importa: `send()`.

```php
// src/Service/AccountMailer.php
namespace App\Service;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class AccountMailer
{
    public function __construct(
        private MailerInterface $mailer,
    ) {
    }

    public function sendWelcome(string $to, string $name): void
    {
        $email = (new Email())
            ->from('noreply@miapp.test')
            ->to($to)
            ->subject('Te damos la bienvenida')
            ->text("Hola $name, tu cuenta ya está activa.")
            ->html("<p>Hola <strong>$name</strong>, tu cuenta ya está activa.</p>");

        $this->mailer->send($email);
    }
}
```

Paso a paso:

| Línea | Qué hace |
|---|---|
| `new Email()` | Crea el mensaje vacío. La clase la trae el componente (`Symfony\Component\Mime\Email`), no la escribes tú |
| `->from(...)` | Remitente. **Obligatorio** — sin él, `send()` lanza excepción (ver tip) |
| `->to(...)` | Destinatario. Se puede llamar varias veces o pasar varios: `->to($a, $b)` |
| `->subject(...)` | Asunto |
| `->text(...)` / `->html(...)` | Cuerpo. Puedes poner solo uno o los dos (el cliente de correo elige) |
| `$this->mailer->send($email)` | Encola/envía según el `MAILER_DSN` |

!!! tip "El `from` es obligatorio"
    Si no pones `->from(...)` y no hay un remitente global configurado, `send()` corta con *"An email must have a 'From' or a 'Sender' header"*. Para no repetirlo en cada email, se define una vez en `config/packages/mailer.yaml`:

    ```yaml
    framework:
        mailer:
            headers:
                From: 'MiApp <noreply@miapp.test>'
    ```

## Email con plantilla Twig {: .topic-title }

Para cuerpos con formato real se usa `TemplatedEmail`: en vez de `->html('<p>...')` a mano, apunta a una plantilla Twig y le pasa variables.

```php
use Symfony\Bridge\Twig\Mime\TemplatedEmail;

$email = (new TemplatedEmail())
    ->from('noreply@miapp.test')
    ->to($user->getEmail())
    ->subject('Restablece tu contraseña')
    ->htmlTemplate('emails/reset_password.html.twig')
    ->context([
        'user' => $user,
        'resetToken' => $token,
    ]);

$this->mailer->send($email);
```

```twig
{# templates/emails/reset_password.html.twig #}
<h1>Hola {{ user.name }}</h1>
<p>Pulsa el enlace para elegir una contraseña nueva:</p>
<p><a href="{{ url('reset_password', { token: resetToken }) }}">Restablecer</a></p>
```

`->context([...])` es lo que llega a la plantilla como variables. Dentro del Twig del email, `url()` (absoluta) en vez de `path()` (relativa): el enlace se abre desde el cliente de correo, no desde tu sitio.

Requiere el bridge de Twig, que ya viene si tienes `symfony/twig-bundle`. Si no: `composer require symfony/twig-bundle`.

## Adjuntar un archivo {: .topic-title }

```php
$email->attachFromPath('/ruta/al/factura.pdf', 'factura.pdf', 'application/pdf');
// o desde contenido en memoria:
$email->attach($pdfBytes, 'factura.pdf', 'application/pdf');
```

!!! warning "No generes el PDF pesado dentro del request"
    Adjuntar un archivo grande o generarlo al vuelo alarga la respuesta que ve el usuario. Para eso está Messenger (envío asíncrono): el controlador responde ya, y el email sale en segundo plano. Es tema aparte — de momento, adjuntos pequeños y listos.

## Ver el email en desarrollo {: .topic-title }

Con `MAILER_DSN=null://null` no se envía nada, pero **sí se registra**: en la barra de depuración, icono del sobre → pestaña *E-Mails*, con asunto, destinatarios y cuerpo renderizado. Suficiente para comprobar que tu servicio dispara el correo correcto sin mandar nada de verdad.

Para ver los emails en una bandeja real durante el desarrollo, [Mailpit](https://github.com/axllent/mailpit) o el antiguo MailHog: levantas el contenedor y pones `MAILER_DSN=smtp://localhost:1025`.

## 📚 Fuentes {: .topic-title }
| Fuente | Enlace |
|---|---|
| 📘 **Symfony — Sending Emails with Mailer** | [symfony.com/doc/current/mailer.html](https://symfony.com/doc/current/mailer.html) |
| 📘 **Symfony — Twig: HTML & CSS in emails** | [symfony.com/doc/current/mailer.html#html-content](https://symfony.com/doc/current/mailer.html#html-content) |
| 🎥 **SymfonyCasts — Symfony Mailer** | [symfonycasts.com/screencast/mailer](https://symfonycasts.com/screencast/mailer) |
