# Messenger { .section-fundamentos }

> Messenger permite sacar trabajo de la petición web y ejecutarlo después, en segundo plano. Es la respuesta a «esto tarda demasiado para hacerlo mientras el usuario espera»: enviar un correo, generar un informe, mandar un pedido a un sistema externo, procesar un fichero de miles de líneas.

---

## Instalar {: .topic-title }

```bash
composer require symfony/messenger
symfony console make:message
```

`make:message` crea dos ficheros: el **mensaje** (`src/Message/`) y su **manejador** (`src/MessageHandler/`).

## Las tres piezas {: .topic-title }

```mermaid
flowchart LR
    C[Controlador] -->|dispatch| B[Bus de mensajes]
    B --> T[[Transporte<br/>la cola]]
    T --> W[Worker]
    W --> H[Handler]
```

| Pieza | Qué es |
|---|---|
| **Mensaje** | Un objeto plano con los datos. Sin lógica |
| **Bus** | Recibe el mensaje y decide qué hacer con él |
| **Transporte** | Dónde espera el mensaje: base de datos, Redis, AMQP |
| **Handler** | El código que lo procesa, ejecutado por un *worker* |

## El mensaje {: .topic-title }

```php
namespace App\Message;

final class EnviarPedidoAlErp
{
    public function __construct(
        public readonly int $pedidoId,
    ) {}
}
```

!!! danger "En el mensaje van identificadores, nunca entidades"
    El mensaje se **serializa** para guardarse en la cola y se deserializa después, quizá minutos más tarde y en otro proceso. Una entidad de Doctrine metida ahí llega desconectada del gestor de entidades, con relaciones sin cargar y con datos que ya pueden estar obsoletos.

    Se manda el **id** y el handler recarga la entidad fresca desde el repositorio. Además el mensaje pesa mucho menos.

## El handler {: .topic-title }

```php
namespace App\MessageHandler;

use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final class EnviarPedidoAlErpHandler
{
    public function __construct(
        private ErpAdapter $erp,
        private PedidoRepository $pedidos,
    ) {}

    public function __invoke(EnviarPedidoAlErp $mensaje): void
    {
        $pedido = $this->pedidos->find($mensaje->pedidoId);
        if ($pedido === null) {
            return;                       // ya no existe: nada que hacer
        }

        $this->erp->enviar($pedido);
        $pedido->setEstado(EstadoPedido::Confirmado);
        $this->pedidos->save($pedido, true);
    }
}
```

El tipo del argumento de `__invoke()` es lo que conecta handler y mensaje. No hay que registrar nada más.

## Despachar {: .topic-title }

```php
public function crear(MessageBusInterface $bus): Response
{
    // ... guardar el pedido en la BD ...

    $bus->dispatch(new EnviarPedidoAlErp($pedido->getId()));

    return $this->json(['estado' => 'recibido'], 202);
}
```

El controlador responde **al momento**, sin esperar al ERP.

!!! tip "El pedido va a la BD **y** a la cola, por razones distintas"
    La **base de datos** es el registro permanente: el pedido existe como fila consultable siempre. La **cola** es solo el tubo de entrega, transitoria — si pierde un mensaje, sin la fila en BD no quedaría rastro de que el pedido existió.

    Y el cliente ve el avance con un **campo de estado** (`recibido → enviado → confirmado / error`) que el handler actualiza.

## Transportes {: .topic-title }

```yaml
# config/packages/messenger.yaml
framework:
    messenger:
        transports:
            async: '%env(MESSENGER_TRANSPORT_DSN)%'
            failed: 'doctrine://default?queue_name=failed'

        routing:
            App\Message\EnviarPedidoAlErp: async
```

| DSN | Cuándo |
|---|---|
| `doctrine://default` | Sin infraestructura extra: la cola es una tabla. Perfecto para empezar |
| `redis://localhost:6379/messages` | Más rápido, aguanta más volumen |
| `amqp://...` (RabbitMQ) | Colas serias, reintentos y enrutado avanzado |
| `sync://` | **Sin cola**: se ejecuta al instante, en la misma petición |

!!! danger "Si el mensaje no está en `routing`, se ejecuta de forma síncrona"
    Y no avisa. Lo despachas, el handler corre **dentro de la petición**, y todo el propósito de Messenger se pierde sin ningún error visible.

    El síntoma es exactamente el contrario del esperado: la petición sigue tardando lo mismo. Lo primero que hay que mirar cuando «Messenger no hace nada» es la sección `routing`.

## Ejecutar el worker {: .topic-title }

```bash
symfony console messenger:consume async -vv
```

Un proceso que se queda escuchando la cola y ejecuta los handlers según llegan mensajes.

En producción no se lanza a mano: lo mantiene vivo un supervisor (systemd, Supervisor, o el propio contenedor) que lo reinicia si muere.

```bash
symfony console messenger:consume async --time-limit=3600 --memory-limit=128M
```

!!! warning "Un worker es un proceso largo, y eso cambia las reglas"
    PHP está pensado para vivir el tiempo de una petición y morir. Un worker vive horas, así que arrastra problemas que en web no existen:

    - **Fugas de memoria**: por eso `--memory-limit`, que lo reinicia limpio al alcanzarlo.
    - **Estado obsoleto**: Doctrine acumula entidades en memoria; conviene un `--time-limit` para que se reinicie de vez en cuando.
    - **Código viejo**: el worker sigue ejecutando el código que cargó al arrancar. **Tras cada despliegue hay que reiniciarlo** o seguirá con la versión anterior.

    Ese último es el fallo de despliegue más habitual con Messenger: se despliega, la web se actualiza y los mensajes se siguen procesando con la lógica antigua. Se resuelve con `messenger:stop-workers` en el guion de despliegue.

## Reintentos y mensajes fallidos {: .topic-title }

```yaml
transports:
    async:
        dsn: '%env(MESSENGER_TRANSPORT_DSN)%'
        retry_strategy:
            max_retries: 3
            delay: 1000          # ms antes del primer reintento
            multiplier: 2        # 1s, 2s, 4s
        failure_transport: failed
```

Si el handler lanza una excepción, Messenger **reintenta** con espera creciente. Agotados los intentos, el mensaje va al transporte de fallidos en lugar de perderse.

```bash
symfony console messenger:failed:show      # ver qué falló y por qué
symfony console messenger:failed:retry     # reintentar
symfony console messenger:failed:remove 42
```

!!! danger "Reintentar exige que el handler sea idempotente"
    Un reintento vuelve a ejecutar el handler **entero**. Si la primera vez llegó a enviar el pedido al ERP y falló justo después, el segundo intento lo envía otra vez: **pedido duplicado**.

    La defensa es la misma del [caso de integración](../../../backend/02-arquitectura/02-integracion-externa/index.md): un identificador único del pedido que se reenvía igual en cada intento y que el ERP usa para reconocer repetidos, o registrar en tu lado qué se confirmó antes de reintentar.

!!! tip "Despachar después de confirmar la transacción"
    Si despachas el mensaje antes del `flush()`, el worker puede ser tan rápido que busque el pedido en la BD **antes de que exista** y no lo encuentre.

    Symfony lo resuelve con el sello `DispatchAfterCurrentBusStamp` o, más simple, despachando siempre después de guardar.

## Cuándo usar Messenger {: .topic-title }

<div class="pros-cons" markdown>

| ✅ Sí | ❌ No |
|---|---|
| Enviar correos | Cualquier cosa que tarde milisegundos |
| Generar informes o exportaciones grandes | Algo cuyo resultado necesita el usuario **ahora** |
| Llamar a un sistema externo lento | Trabajo que no tolera ejecutarse dos veces y no puedes hacer idempotente |
| Procesar ficheros por lotes | |
| Redimensionar imágenes | |

</div>

La pregunta que decide: **¿el usuario necesita el resultado para continuar?** Si no, va a la cola.

---

## 📚 Fuentes {: .topic-title }

| Fuente | Enlace |
|---|---|
| 📘 **Symfony — Messenger** | [symfony.com/doc/current/messenger.html](https://symfony.com/doc/current/messenger.html) |
| 📘 **Symfony — Desplegar workers** | [symfony.com/doc/current/messenger.html#deploying-to-production](https://symfony.com/doc/current/messenger.html#deploying-to-production) |
