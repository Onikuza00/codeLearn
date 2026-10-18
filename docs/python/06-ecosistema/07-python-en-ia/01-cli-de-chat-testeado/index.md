# Un CLI de chat testeado { .section-python .bloque-python }

> Un proyecto completo y pequeño que une todo el pilar: paquete con `src/`, configuración por `.env`, cliente `httpx` con reintentos y validación, CLI con `argparse` y una batería de tests con `pytest` que no tocan la red. Habla con un servidor simulado local, nunca con una API real.

---

## Qué vamos a construir {: .topic-title }

`chatcli` es una herramienta de terminal para preguntar a un servicio de chat:

```text
chatcli ask "¿Qué es un token?" --temperature 0.2 --show-usage
chatcli chat
```

La estructura del proyecto:

```text
chatcli/
├── pyproject.toml
├── .env                  (no se sube a Git)
├── .env.example
├── src/chatcli/
│   ├── __init__.py
│   ├── __main__.py
│   ├── config.py         (Settings)
│   ├── client.py         (ChatClient)
│   ├── cli.py            (argparse)
│   └── fake_server.py    (servidor simulado, solo para desarrollo)
└── tests/
    ├── conftest.py
    ├── test_config.py
    ├── test_client.py
    └── test_cli.py
```

| Pieza | Capítulo |
|---|---|
| Paquete con `src/` e instalación editable | [Módulos y paquetes](../../01-modulos-y-paquetes/01-modulos-y-paquetes/index.md) |
| `pyproject.toml`, `.env`, `Settings` | [Proyecto y configuración](../../02-proyecto-y-configuracion/01-proyecto-y-configuracion/index.md) |
| `httpx`, reintentos, timeouts | [HTTP con httpx](../../03-http/01-http-con-httpx/index.md) |
| Argumentos y subcomandos | [argparse](../../06-cli/01-argparse/index.md) |
| Tests, fixtures, `monkeypatch` | [Tests con pytest](../../05-tests/01-pytest/index.md) |
| Validación de la respuesta | [Pydantic](../../../05-objetos/05-pydantic/01-pydantic/index.md) |

(La parte asíncrona, [async y await](../../04-asincronia/01-async-await/index.md), queda fuera de este proyecto: un CLI de una pregunta a la vez no la necesita.)

`pyproject.toml` es el del capítulo de proyecto y configuración, y `__init__.py` solo define `__version__ = "0.1.0"`. El resto del código:

---

## El servidor simulado {: .topic-title }

Para desarrollar sin red ni gastar dinero, un servidor mínimo que imita la API de chat. Valida la clave, comprueba el JSON y responde con un texto y un recuento de tokens. También tiene las rutas `/health`, `/slow` y `/flaky` que usaron los ejemplos de HTTP.

```python
# src/chatcli/fake_server.py
"""Servidor HTTP local que imita una API de chat. Solo para pruebas y ejemplos."""
import json
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

VALID_KEY = "clave-de-prueba-no-real"


class Handler(BaseHTTPRequestHandler):
    flaky_calls = 0

    def log_message(self, format, *args):
        pass

    def handle(self):
        try:
            super().handle()
        except ConnectionError:
            pass

    def _send_json(self, status, payload, headers=None):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        for name, value in (headers or {}).items():
            self.send_header(name, value)
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/health":
            self._send_json(200, {"status": "ok"})
        elif self.path == "/slow":
            time.sleep(0.5)
            self._send_json(200, {"status": "tarde"})
        elif self.path == "/flaky":
            Handler.flaky_calls += 1
            if Handler.flaky_calls <= 2:
                self._send_json(503, {"error": "ocupado"}, {"Retry-After": "0"})
            else:
                self._send_json(200, {"status": f"ok tras {Handler.flaky_calls} intentos"})
        else:
            self._send_json(404, {"error": "no existe"})

    def do_POST(self):
        if self.path != "/v1/chat":
            self._send_json(404, {"error": "no existe"})
            return
        if self.headers.get("Authorization") != f"Bearer {VALID_KEY}":
            self._send_json(401, {"error": "clave no válida"})
            return
        length = int(self.headers.get("Content-Length", 0))
        try:
            data = json.loads(self.rfile.read(length))
            messages = data["messages"]
        except (json.JSONDecodeError, KeyError):
            self._send_json(422, {"error": "petición mal formada"})
            return
        time.sleep(0.2)
        question = messages[-1]["content"]
        self._send_json(200, {
            "model": data.get("model", "modelo-demo"),
            "reply": f"Respuesta simulada a: {question}",
            "usage": {"input_tokens": sum(len(m["content"].split()) for m in messages), "output_tokens": 5},
        })


def start_server():
    """Arranca el servidor en un hilo y devuelve (servidor, url_base)."""
    Handler.flaky_calls = 0
    server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server, f"http://127.0.0.1:{server.server_address[1]}"


def stop_server(server):
    """Para el servidor y libera el puerto."""
    server.shutdown()
    server.server_close()


if __name__ == "__main__":
    import sys

    lifetime = float(sys.argv[1]) if len(sys.argv) > 1 else None
    server = ThreadingHTTPServer(("127.0.0.1", 8765), Handler)
    print("servidor simulado en http://127.0.0.1:8765 (Ctrl+C para parar)", flush=True)
    if lifetime is not None:
        threading.Timer(lifetime, server.shutdown).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
```

- `start_server()` / `stop_server()` lo arrancan y paran dentro de un programa (en un hilo y en un puerto libre).
- Ejecutado con `python -m chatcli.fake_server`, escucha en el puerto 8765 hasta que lo paras (o, si le pasas segundos como argumento, hasta que pasen).
- Es un ejemplo **didáctico**: no es seguro ni sirve para producción.

---

## Configuración y cliente {: .topic-title }

```python
# src/chatcli/config.py
import os
from dataclasses import dataclass

from dotenv import load_dotenv


class ConfigError(Exception):
    """Falta algo obligatorio o algo no es válido en la configuración."""


@dataclass(frozen=True)
class Settings:
    api_key: str
    base_url: str = "http://127.0.0.1:8000"
    model: str = "modelo-demo"
    temperature: float = 0.7

    def __post_init__(self) -> None:
        if not 0 <= self.temperature <= 2:
            raise ConfigError("la temperatura debe estar entre 0 y 2")

    def __repr__(self) -> str:
        return f"Settings(base_url={self.base_url!r}, model={self.model!r}, temperature={self.temperature}, api_key='***')"

    @classmethod
    def from_env(cls) -> "Settings":
        load_dotenv()
        api_key = os.getenv("CHAT_API_KEY")
        if not api_key:
            raise ConfigError("falta CHAT_API_KEY (defínela en el entorno o en .env)")
        try:
            temperature = float(os.getenv("CHAT_TEMPERATURE", "0.7"))
        except ValueError as error:
            raise ConfigError("CHAT_TEMPERATURE debe ser un número") from error
        return cls(
            api_key=api_key,
            base_url=os.getenv("CHAT_BASE_URL", "http://127.0.0.1:8000"),
            model=os.getenv("CHAT_MODEL", "modelo-demo"),
            temperature=temperature,
        )
```

`Settings` valida en `__post_init__`, así que **cualquier** origen de datos (entorno, argumentos del CLI) pasa por la misma comprobación. Oculta la clave en `repr`.

```python
# src/chatcli/client.py
import logging
import time

import httpx
from pydantic import BaseModel, ValidationError

from chatcli.config import Settings

logger = logging.getLogger(__name__)

RETRYABLE_STATUS = {429, 500, 502, 503, 504}


class ChatError(Exception):
    """Error al hablar con el servicio de chat."""


class Usage(BaseModel):
    input_tokens: int
    output_tokens: int


class ChatResponse(BaseModel):
    reply: str
    usage: Usage
    model: str = ""


class ChatClient:
    def __init__(self, settings: Settings, *, transport: httpx.BaseTransport | None = None,
                 max_attempts: int = 3, base_delay: float = 0.1) -> None:
        self.settings = settings
        self.max_attempts = max_attempts
        self.base_delay = base_delay
        self._http = httpx.Client(
            base_url=settings.base_url,
            headers={"Authorization": f"Bearer {settings.api_key}"},
            timeout=httpx.Timeout(10.0, connect=3.0),
            transport=transport,
        )

    def close(self) -> None:
        self._http.close()

    def __enter__(self) -> "ChatClient":
        return self

    def __exit__(self, *exc_info) -> None:
        self.close()

    def ask(self, question: str, history: list[dict[str, str]] | None = None) -> ChatResponse:
        if not question.strip():
            raise ChatError("la pregunta está vacía")
        messages = [*(history or []), {"role": "user", "content": question}]
        payload = {"model": self.settings.model, "temperature": self.settings.temperature, "messages": messages}
        response = self._post_with_retry(payload)
        try:
            return ChatResponse.model_validate_json(response.content)
        except ValidationError as error:
            raise ChatError("respuesta con formato inesperado") from error

    def _post_with_retry(self, payload: dict) -> httpx.Response:
        for attempt in range(1, self.max_attempts + 1):
            try:
                response = self._http.post("/v1/chat", json=payload)
            except httpx.TransportError as error:
                reason = type(error).__name__
            else:
                if response.status_code in RETRYABLE_STATUS:
                    reason = f"HTTP {response.status_code}"
                elif response.is_success:
                    return response
                else:
                    raise ChatError(f"el servicio rechazó la petición (HTTP {response.status_code})")
            if attempt == self.max_attempts:
                raise ChatError(f"agotados {self.max_attempts} intentos ({reason})")
            delay = self.base_delay * 2 ** (attempt - 1)
            logger.warning("intento %d falló (%s); espero %.1f s", attempt, reason, delay)
            time.sleep(delay)
        raise ChatError("sin intentos")
```

- **Dos pasos:** primero `_post_with_retry` (red, reintentos, códigos de estado) y después `ChatResponse.model_validate_json` (validación de la forma, [Pydantic](../../../05-objetos/05-pydantic/01-pydantic/index.md)). Cualquier fallo sale como `ChatError`.
- **Reintenta** solo 429/5xx y fallos de red, con espera creciente. Un 4xx se rechaza al primer intento.
- Recibe el **`transport`** como parámetro opcional: con `httpx.MockTransport` los tests sustituyen la red entera sin tocar el código.
- Es un gestor de contexto (`with ChatClient(...) as client:`) para cerrar la conexión siempre.

---

## El CLI {: .topic-title }

```python
# src/chatcli/cli.py
import argparse
import sys

from chatcli import __version__
from chatcli.client import ChatClient, ChatError
from chatcli.config import ConfigError, Settings


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="chatcli", description="Cliente de chat de ejemplo")
    parser.add_argument("--version", action="version", version=f"%(prog)s {__version__}")
    subparsers = parser.add_subparsers(dest="command", required=True)

    ask = subparsers.add_parser("ask", help="hace una sola pregunta")
    ask.add_argument("question", help="la pregunta, entre comillas")
    ask.add_argument("--model", help="nombre del modelo (por defecto, el de la configuración)")
    ask.add_argument("--temperature", type=float, help="entre 0 y 2")
    ask.add_argument("--show-usage", action="store_true", help="muestra los tokens usados")

    subparsers.add_parser("chat", help="conversación interactiva (/exit para salir)")
    return parser


def run(args: argparse.Namespace, settings: Settings) -> int:
    overrides = {name: getattr(args, name, None) for name in ("model", "temperature")}
    settings = Settings(**{**settings.__dict__, **{k: v for k, v in overrides.items() if v is not None}})
    with ChatClient(settings) as client:
        if args.command == "ask":
            reply = client.ask(args.question)
            print(reply.reply)
            if args.show_usage:
                print(f"tokens: {reply.usage.input_tokens} entrada, {reply.usage.output_tokens} salida")
            return 0
        history: list[dict[str, str]] = []
        while True:
            question = input("Tú: ").strip()
            if question == "/exit":
                return 0
            if not question:
                continue
            reply = client.ask(question, history)
            history += [{"role": "user", "content": question}, {"role": "assistant", "content": reply.reply}]
            print(f"Bot: {reply.reply}")


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        return run(args, Settings.from_env())
    except (ConfigError, ChatError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
```

- **`build_parser`** declara los comandos; **`run`** hace el trabajo; **`main`** une las dos y traduce los errores esperados (`ConfigError`, `ChatError`) a un mensaje por `stderr` y un código de salida 1.
- Las opciones `--model` y `--temperature` **sobrescriben** la configuración del entorno.
- `main(argv)` recibe la lista de argumentos: los tests la llaman directamente.
- `__main__.py` solo hace `sys.exit(main())`, y `pyproject.toml` crea el comando `chatcli`.

El `.env` de desarrollo (con una clave **falsa**, que solo vale para el servidor simulado):

```text
# .env
CHAT_API_KEY=clave-de-prueba-no-real
CHAT_BASE_URL=http://127.0.0.1:8765
CHAT_MODEL=modelo-demo
```

---

## Ejecutarlo de verdad {: .topic-title }

Con el servidor simulado en marcha (`python -m chatcli.fake_server`, en otra terminal) y el paquete instalado (`python -m pip install -e ".[dev]"`):

```text
$ chatcli ask "¿Qué es un token?" --show-usage --temperature 0.2
Respuesta simulada a: ¿Qué es un token?
tokens: 4 entrada, 5 salida
$ chatcli ask "Hola" --model otro-modelo
Respuesta simulada a: Hola
```

El modo `chat`, con la entrada simulada (hola, una línea vacía, adiós, `/exit`) y mostrada como la vería una terminal:

```text
Tú: hola
Bot: Respuesta simulada a: hola
Tú: 
Tú: adiós
Bot: Respuesta simulada a: adiós
Tú: /exit
```

Y los fallos, cada uno con su mensaje y su código de salida:

```text
$ chatcli ask ""
error: la pregunta está vacía                              (exit 1)
$ CHAT_API_KEY=mala chatcli ask "Hola"
error: el servicio rechazó la petición (HTTP 401)          (exit 1)
$ chatcli ask "Hola" --temperature 9
error: la temperatura debe estar entre 0 y 2               (exit 1)
$ chatcli ask "Hola"                         (sin CHAT_API_KEY ni .env)
error: falta CHAT_API_KEY (defínela en el entorno o en .env)   (exit 1)
$ chatcli --version
chatcli 0.1.0
```

(Los textos entre paréntesis, `(exit 1)`, los añadí yo para marcar el código de salida; el programa no los imprime. Las salidas con la entrada simulada y con el servidor local son reales.)

---

## Los tests {: .topic-title }

Ninguno toca la red real.

```python
# tests/conftest.py
import json

import httpx
import pytest

from chatcli.config import Settings


@pytest.fixture(autouse=True)
def no_dotenv(monkeypatch):
    """Los tests no deben leer el .env real del proyecto."""
    monkeypatch.setattr("chatcli.config.load_dotenv", lambda *args, **kwargs: None)


@pytest.fixture
def settings():
    return Settings(api_key="clave-falsa", base_url="http://prueba.local")


@pytest.fixture
def make_transport():
    def build(*responses):
        queue = list(responses)
        calls = []

        def handler(request: httpx.Request) -> httpx.Response:
            calls.append(request)
            item = queue.pop(0) if len(queue) > 1 else queue[0]
            if isinstance(item, Exception):
                raise item
            return item

        transport = httpx.MockTransport(handler)
        transport.calls = calls
        return transport

    return build


def ok_response(reply="Hola"):
    body = {"reply": reply, "usage": {"input_tokens": 3, "output_tokens": 2}, "model": "modelo-demo"}
    return httpx.Response(200, content=json.dumps(body))
```

- **`no_dotenv`** (automática) evita que los tests lean el `.env` real. Importa mucho: `load_dotenv()` busca el archivo **subiendo desde la carpeta del módulo que lo llama**, no desde donde ejecutes el test, así que sin esta fixture un `.env` del proyecto contaminaría los resultados.
- **`make_transport`** fabrica un `MockTransport` que devuelve las respuestas que le des, en orden (o lanza una excepción de red) y guarda las peticiones recibidas en `.calls`.

```python
# tests/test_client.py
import httpx
import pytest

from chatcli.client import ChatClient, ChatError
from conftest import ok_response


def test_ask_returns_validated_reply(settings, make_transport):
    transport = make_transport(ok_response("Un token es un trozo de texto."))
    with ChatClient(settings, transport=transport) as client:
        reply = client.ask("¿Qué es un token?")
    assert reply.reply == "Un token es un trozo de texto."
    assert reply.usage.input_tokens == 3
    request = transport.calls[0]
    assert request.headers["authorization"] == "Bearer clave-falsa"


def test_empty_question_does_not_call_the_service(settings, make_transport):
    transport = make_transport(ok_response())
    with ChatClient(settings, transport=transport) as client:
        with pytest.raises(ChatError, match="vacía"):
            client.ask("   ")
    assert transport.calls == []


def test_retries_on_503_then_succeeds(settings, make_transport):
    transport = make_transport(httpx.Response(503), httpx.Response(503), ok_response("al fin"))
    with ChatClient(settings, transport=transport, base_delay=0) as client:
        assert client.ask("hola").reply == "al fin"
    assert len(transport.calls) == 3


def test_gives_up_after_max_attempts(settings, make_transport):
    transport = make_transport(httpx.ConnectError("sin red"))
    with ChatClient(settings, transport=transport, max_attempts=2, base_delay=0) as client:
        with pytest.raises(ChatError, match="agotados 2 intentos"):
            client.ask("hola")
    assert len(transport.calls) == 2


@pytest.mark.parametrize("status", [400, 401, 404, 422])
def test_client_errors_are_not_retried(settings, make_transport, status):
    transport = make_transport(httpx.Response(status))
    with ChatClient(settings, transport=transport, base_delay=0) as client:
        with pytest.raises(ChatError, match=str(status)):
            client.ask("hola")
    assert len(transport.calls) == 1


def test_unexpected_format_is_reported(settings, make_transport):
    transport = make_transport(httpx.Response(200, content='{"otra": "cosa"}'))
    with ChatClient(settings, transport=transport) as client:
        with pytest.raises(ChatError, match="formato inesperado"):
            client.ask("hola")
```

```python
# tests/test_cli.py
import pytest

from chatcli import cli
from chatcli.client import ChatError, ChatResponse, Usage


class FakeClient:
    def __init__(self, settings, **kwargs):
        self.settings = settings

    def __enter__(self):
        return self

    def __exit__(self, *exc_info):
        pass

    def ask(self, question, history=None):
        return ChatResponse(reply=f"eco: {question} [{self.settings.model}]", usage=Usage(input_tokens=1, output_tokens=2))


@pytest.fixture(autouse=True)
def fake_environment(monkeypatch):
    monkeypatch.setenv("CHAT_API_KEY", "clave-falsa")
    monkeypatch.setattr(cli, "ChatClient", FakeClient)


def test_ask_prints_the_reply(capsys):
    assert cli.main(["ask", "Hola"]) == 0
    assert "eco: Hola [modelo-demo]" in capsys.readouterr().out


def test_options_override_the_configuration(capsys):
    cli.main(["ask", "Hola", "--model", "otro", "--show-usage"])
    out = capsys.readouterr().out
    assert "[otro]" in out
    assert "tokens: 1 entrada, 2 salida" in out


def test_chat_loop_reads_until_exit(monkeypatch, capsys):
    answers = iter(["hola", "", "adiós", "/exit"])
    monkeypatch.setattr("builtins.input", lambda prompt="": next(answers))
    assert cli.main(["chat"]) == 0
    out = capsys.readouterr().out
    assert out.count("Bot:") == 2


def test_service_error_gives_exit_code_1(monkeypatch, capsys):
    def failing_ask(self, question, history=None):
        raise ChatError("servicio caído")

    monkeypatch.setattr(FakeClient, "ask", failing_ask)
    assert cli.main(["ask", "Hola"]) == 1
    assert "servicio caído" in capsys.readouterr().err


def test_missing_key_gives_exit_code_1(monkeypatch, capsys):
    monkeypatch.delenv("CHAT_API_KEY")
    assert cli.main(["ask", "Hola"]) == 1
    assert "CHAT_API_KEY" in capsys.readouterr().err


def test_unknown_command_exits_with_2(capsys):
    with pytest.raises(SystemExit) as info:
        cli.main(["borrar"])
    assert info.value.code == 2
```

```python
# tests/test_config.py
import pytest

from chatcli.config import ConfigError, Settings


def test_loads_values_from_environment(monkeypatch):
    monkeypatch.setenv("CHAT_API_KEY", "secreta")
    monkeypatch.setenv("CHAT_TEMPERATURE", "0.3")
    monkeypatch.setenv("CHAT_MODEL", "otro-modelo")
    settings = Settings.from_env()
    assert settings.api_key == "secreta"
    assert settings.temperature == 0.3
    assert settings.model == "otro-modelo"


def test_missing_key_raises(monkeypatch):
    monkeypatch.delenv("CHAT_API_KEY", raising=False)
    with pytest.raises(ConfigError, match="CHAT_API_KEY"):
        Settings.from_env()


@pytest.mark.parametrize("value", ["alta", "-1", "5", ""])
def test_invalid_temperature(monkeypatch, value):
    monkeypatch.setenv("CHAT_API_KEY", "secreta")
    monkeypatch.setenv("CHAT_TEMPERATURE", value)
    with pytest.raises(ConfigError):
        Settings.from_env()


def test_repr_hides_the_key():
    assert "secreta" not in repr(Settings(api_key="secreta"))
```

Resultado de `python -m pytest -q`:

```text
......................                                                   [100%]
22 passed in 0.16s
```

22 tests (algunos parametrizados) en una décima de segundo, sin red, sin claves y sin gastar nada. Cubren: el camino feliz, las validaciones, los reintentos (éxito tras 503 y rendición tras agotar intentos), que un 4xx **no** se reintenta, la respuesta mal formada, las opciones del CLI, el bucle del chat, los códigos de salida y el ocultar la clave.

!!! warning "Cuidado con `load_dotenv` en los tests"
    Antes de añadir la fixture `no_dotenv`, dos tests fallaron al crear un `.env` en el proyecto: `Settings.from_env()` encontraba la clave del `.env` y dejaba de lanzar `ConfigError`. Un test cuyo resultado depende de un archivo local no es fiable.

!!! warning "La clave de ejemplo es falsa"
    `clave-de-prueba-no-real` solo es válida para el servidor simulado. Con una API real, la clave viene del entorno y nunca se escribe en el código ni en un test.

---

## Python en IA {: .topic-title }

Este esqueleto es el de una aplicación real con modelos de lenguaje. Para pasar del servidor simulado a un proveedor real, se cambian **tres cosas**: la URL base y el formato de la petición/respuesta (en `client.py`, o usando el SDK oficial, [pilar 07](../../../07-python-para-ia/index.md)), la clave (en `.env`) y el modelo. La configuración, el CLI, los reintentos, la validación y los tests se quedan.

Lo que se ha ganado con este diseño:

- **Reproducibilidad**: los tests no dependen del servicio.
- **Seguridad**: la clave está en el entorno y se oculta en los logs y los `repr`.
- **Robustez**: reintentos acotados, validación de la respuesta, errores con mensajes claros.
- **Cambiabilidad**: cada pieza (configuración, cliente, CLI) se prueba y se sustituye por separado.

!!! tip "Primero el servidor simulado, después el real"
    Un servidor simulado que también falla a propósito (503, respuestas rotas) te deja desarrollar los casos malos antes de que ocurran de verdad, y sin gastar nada.

---

## Comparación con JavaScript {: .topic-title }

| En JS / Node.js | En este proyecto de Python |
|---|---|
| `package.json` + `npm install` | `pyproject.toml` + `pip install -e ".[dev]"` |
| `bin` en `package.json` | `[project.scripts]` |
| `commander` / `yargs` | `argparse` |
| `axios` / `fetch` con reintentos | `httpx` + bucle de reintentos |
| Zod para validar respuestas | Pydantic |
| Jest + `jest.mock` / `msw` | pytest + `MockTransport` + `monkeypatch` |
| `dotenv` | `python-dotenv` |

!!! tip "Consejos"
    - **Tests rápidos y sin red** como base; integración con servidor local, pocos.
    - **Un solo sitio para la configuración**, validada al arrancar.
    - **Códigos de salida y mensajes en `stderr`** para que el CLI se pueda automatizar.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Sin fuente en los apuntes: el curso no incluye proyectos empaquetados, `httpx`, `argparse` ni `pytest` | — |
| Gestió d'errors — «Capturem diferents tipus d'errors» (base de la gestión de fallos del cliente) | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_600/#2-capturem-diferents-tipus-derrors-excepcions> |
| **Documentación oficial** | |
| Guía de empaquetado — `src` frente a estructura plana | <https://packaging.python.org/en/latest/discussions/src-layout-vs-flat-layout/> |
| Guía de empaquetado — Escribir `pyproject.toml` | <https://packaging.python.org/en/latest/guides/writing-pyproject-toml/> |
| httpx — Clientes | <https://www.python-httpx.org/advanced/clients/> |
| httpx — Transportes (`MockTransport`) | <https://www.python-httpx.org/advanced/transports/> |
| `argparse` | <https://docs.python.org/3/library/argparse.html> |
| pytest — Fixtures | <https://docs.pytest.org/en/stable/how-to/fixtures.html> |
| pytest — `monkeypatch` | <https://docs.pytest.org/en/stable/how-to/monkeypatch.html> |
| Pydantic — Validar datos | <https://docs.pydantic.dev/latest/concepts/models/#validating-data> |
