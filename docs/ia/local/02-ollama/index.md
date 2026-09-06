# Ollama { .bloque-ia }

> Ollama es la forma más directa de ejecutar un modelo de lenguaje en tu máquina: descarga el modelo, lo gestiona y lo expone por una API HTTP local. Lo que antes exigía compilar y pelearse con dependencias son ahora dos comandos.

---

## Instalar y arrancar {: .topic-title }

```bash
# Linux
curl -fsSL https://ollama.com/install.sh | sh

# macOS y Windows: instalador desde ollama.com/download
```

Ollama corre como **servicio en segundo plano** escuchando en `http://localhost:11434`. Se comprueba con:

```bash
curl http://localhost:11434
# Ollama is running
```

## Los comandos {: .topic-title }

| Comando | Qué hace |
|---|---|
| `ollama pull llama3.1:8b` | Descarga el modelo |
| `ollama run llama3.1:8b` | Descarga si hace falta y abre un chat interactivo |
| `ollama list` | Modelos descargados y su tamaño |
| `ollama ps` | Modelos **cargados en memoria** ahora mismo |
| `ollama show llama3.1:8b` | Parámetros, plantilla, licencia, cuantización |
| `ollama rm llama3.1:8b` | Borra el modelo del disco |
| `ollama cp origen destino` | Copia con otro nombre |
| `ollama create mi-modelo -f Modelfile` | Crea una variante propia |
| `ollama serve` | Arranca el servidor a mano |

!!! tip "`ollama ps` distingue GPU de CPU"
    Muestra una columna `PROCESSOR` con el reparto: `100% GPU`, `100% CPU` o una mezcla como `70%/30%`. Es la forma rápida de comprobar si el modelo cabe entero en la tarjeta.

    Si ves reparto mixto y va lento, el modelo no cabe: hay que bajar de tamaño, cuantizar más o reducir el contexto.

## Las etiquetas {: .topic-title }

```
llama3.1:8b            → variante de 8B, cuantización por defecto (q4_K_M)
llama3.1:8b-instruct-q8_0  → explícita: instruct, 8 bits
llama3.1:latest        → lo que el mantenedor considere actual
```

!!! warning "`latest` es una etiqueta móvil"
    Apunta a lo que sea actual en ese momento, y puede cambiar bajo tus pies. En algo que vaya a producción se fija la etiqueta completa: modelo, tamaño y cuantización.

## El chat interactivo {: .topic-title }

```bash
ollama run qwen2.5:14b
```

Dentro de la sesión:

| Comando | Qué hace |
|---|---|
| `/set parameter temperature 0.2` | Cambia un parámetro sobre la marcha |
| `/set system "Eres un revisor de código conciso."` | Fija las instrucciones de sistema |
| `/show info` | Detalles del modelo cargado |
| `/clear` | Vacía el contexto de la conversación |
| `/bye` | Salir |

## `Modelfile`: variantes propias {: .topic-title }

Un `Modelfile` empaqueta un modelo base con sus instrucciones y parámetros, para no repetirlos en cada llamada:

```dockerfile
FROM qwen2.5:14b

PARAMETER temperature 0.2
PARAMETER num_ctx 8192

SYSTEM """
Eres un asistente de soporte técnico.
Respondes en español, de forma breve y concreta.
Si no tienes la información, dilo en lugar de suponer.
"""
```

```bash
ollama create soporte -f Modelfile
ollama run soporte
```

!!! tip "Es el equivalente a un Dockerfile"
    Partes de una imagen base, le añades configuración, y obtienes algo reutilizable con nombre propio. El fichero se versiona en el repositorio y cualquiera del equipo reconstruye exactamente el mismo asistente.

## La API HTTP {: .topic-title }

Lo que de verdad importa para integrarlo en una aplicación.

**Generar una respuesta**

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:14b",
  "prompt": "Resume en una frase qué es una consulta preparada.",
  "stream": false
}'
```

**Conversación con historial**

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "qwen2.5:14b",
  "messages": [
    {"role": "system", "content": "Responde en español, breve."},
    {"role": "user", "content": "¿Qué es un índice en una base de datos?"}
  ],
  "stream": false
}'
```

**Embeddings** — el que se usa para RAG:

```bash
curl http://localhost:11434/api/embed -d '{
  "model": "nomic-embed-text",
  "input": "El producto es de acero inoxidable y admite uso en exteriores."
}'
```

!!! danger "`stream` viene activado por defecto"
    Sin `"stream": false`, la respuesta llega como **una secuencia de objetos JSON, uno por línea**, no como un único JSON. Un `json_decode()` sobre eso falla.

    Es lo que quieres para mostrar el texto según se genera —igual que hace ChatGPT—, pero hay que leerlo trozo a trozo. Para una llamada de servidor a servidor donde solo necesitas el resultado final, `"stream": false`.

## Desde Symfony {: .topic-title }

```php
final class AsistenteLocal
{
    public function __construct(
        private HttpClientInterface $http,
        #[Autowire('%env(OLLAMA_URL)%')] private string $baseUrl,
    ) {}

    public function preguntar(string $pregunta, string $contexto): string
    {
        $respuesta = $this->http->request('POST', $this->baseUrl . '/api/chat', [
            'json' => [
                'model' => 'qwen2.5:14b',
                'messages' => [
                    ['role' => 'system', 'content' => "Responde solo con este contexto:\n{$contexto}"],
                    ['role' => 'user', 'content' => $pregunta],
                ],
                'stream' => false,
            ],
            'timeout' => 120,
        ]);

        return $respuesta->toArray()['message']['content'];
    }
}
```

!!! warning "El timeout por defecto se queda corto"
    Un modelo local puede tardar decenas de segundos en generar una respuesta larga, sobre todo si comparte GPU con otras peticiones. El timeout habitual de un cliente HTTP —unos 30 segundos— lo corta a mitad.

    Es un [adaptador](../../../backend/02-arquitectura/02-integracion-externa/index.md) como cualquier otro: dentro van el timeout, los reintentos y el cortocircuito, y el resto de la aplicación no se entera.

## Compatibilidad con la API de OpenAI {: .topic-title }

Ollama expone también `http://localhost:11434/v1/`, compatible con el formato de OpenAI. Eso permite usar librerías y herramientas ya existentes cambiando solo la URL base y poniendo una clave cualquiera.

Es la vía práctica para conectar herramientas que solo hablan ese formato, sin escribir un cliente propio.

## Variables de entorno útiles {: .topic-title }

| Variable | Para qué |
|---|---|
| `OLLAMA_HOST=0.0.0.0:11434` | Escuchar en la red, no solo en local |
| `OLLAMA_MODELS=/ruta/modelos` | Dónde guardar los ficheros (ocupan mucho) |
| `OLLAMA_KEEP_ALIVE=30m` | Cuánto mantener el modelo en memoria tras la última petición |
| `OLLAMA_NUM_PARALLEL` | Cuántas peticiones simultáneas atender |

!!! danger "`OLLAMA_HOST=0.0.0.0` deja la API abierta, sin autenticación"
    Ollama **no tiene control de acceso**. Exponerlo en una red sin protección significa que cualquiera que la alcance puede usar el modelo y leer lo que se le mande.

    Se pone detrás de un proxy inverso con autenticación, o se limita por cortafuegos a las máquinas que deben llegar. Nunca directo a internet.

---

## 📚 Fuentes {: .topic-title }

| Fuente | Enlace |
|---|---|
| 🦙 **Ollama** | [ollama.com](https://ollama.com/) |
| 📘 **Referencia de la API** | [github.com/ollama/ollama/blob/main/docs/api.md](https://github.com/ollama/ollama/blob/main/docs/api.md) |
| 📘 **Referencia del Modelfile** | [github.com/ollama/ollama/blob/main/docs/modelfile.md](https://github.com/ollama/ollama/blob/main/docs/modelfile.md) |
