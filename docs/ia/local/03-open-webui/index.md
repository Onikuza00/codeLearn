# Open WebUI { .bloque-ia }

> Open WebUI es una interfaz web sobre uno o varios modelos —típicamente Ollama— con cuentas de usuario, historial, subida de documentos y RAG integrado. Es lo que convierte «tengo un modelo corriendo en un servidor» en «el equipo puede usarlo desde el navegador».

---

## Qué aporta sobre Ollama a secas {: .topic-title }

| | Ollama | Open WebUI |
|---|---|---|
| Interfaz | Terminal o API | Web, tipo chat |
| Usuarios | No existen | Cuentas, roles y permisos |
| Historial | Se pierde al salir | Guardado por usuario |
| Documentos | No | Subir ficheros y preguntar sobre ellos |
| RAG | Hay que montarlo | Integrado |
| Modelos | Uno por comando | Varios, elegibles en un desplegable |

## Levantarlo con Docker {: .topic-title }

```bash
docker run -d \
  --name open-webui \
  -p 3000:8080 \
  -v open-webui:/app/backend/data \
  -e OLLAMA_BASE_URL=http://host.docker.internal:11434 \
  --restart always \
  ghcr.io/open-webui/open-webui:main
```

En `docker compose`, junto a Ollama:

```yaml
services:
  ollama:
    image: ollama/ollama
    volumes:
      - ollama:/root/.ollama
    ports:
      - "11434:11434"

  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    depends_on:
      - ollama
    environment:
      OLLAMA_BASE_URL: http://ollama:11434
    volumes:
      - open-webui:/app/backend/data
    ports:
      - "3000:8080"

volumes:
  ollama:
  open-webui:
```

!!! danger "El volumen no es opcional"
    `/app/backend/data` guarda usuarios, conversaciones, documentos subidos y el índice vectorial. Sin volumen, **todo eso desaparece** al recrear el contenedor: cuentas incluidas.

!!! warning "`host.docker.internal` no funciona igual en todas partes"
    Sirve para que el contenedor alcance un Ollama que corre en la máquina anfitriona, y en Linux hace falta añadir `--add-host=host.docker.internal:host-gateway`.

    Si los dos están en el mismo `compose`, la solución limpia es la del ejemplo: llamar al servicio por su nombre (`http://ollama:11434`), que funciona igual en todos los sistemas.

## La primera cuenta es la de administración {: .topic-title }

!!! danger "Regístrate tú antes de exponerlo"
    **El primer usuario que se registra se convierte en administrador.** Si publicas la URL antes de crear tu cuenta, el primero que llegue se queda con el control de la instancia.

    Después, en los ajustes de administración conviene desactivar el registro abierto o exigir que un administrador apruebe las cuentas nuevas.

## Documentos y RAG integrado {: .topic-title }

Open WebUI trae el flujo completo: subes PDF, Word o Markdown, los trocea, genera los vectores y busca por significado al preguntar.

Los ajustes que importan, en **Documentos**:

| Ajuste | Qué decide |
|---|---|
| **Modelo de embeddings** | Cuál convierte el texto en vectores |
| **Tamaño del trozo** | Cuánto texto por fragmento |
| **Solapamiento** | Cuánto comparten dos trozos consecutivos |
| **Top K** | Cuántos fragmentos se pasan al modelo |

!!! danger "Cambiar el modelo de embeddings obliga a reindexar todo"
    Los vectores de un modelo **no son comparables** con los de otro. Al cambiarlo, la documentación ya indexada deja de encontrarse correctamente y hay que volver a procesarla entera.

    Es una decisión que conviene tomar al principio, no a mitad.

!!! tip "El troceado es lo que más afecta al resultado"
    Trozos demasiado grandes meten ruido y el modelo se pierde; demasiado pequeños pierden el contexto y devuelven frases sueltas. Un punto de partida razonable son unas 500 palabras con solapamiento.

    Si las respuestas salen vagas o citan cosas que no vienen a cuento, lo primero que se toca es esto, no el modelo.

Las **colecciones** (*knowledge*) agrupan documentos y se asignan a un modelo concreto, que es la forma de tener un asistente por área sin mezclar fuentes.

## Modelos a medida {: .topic-title }

Desde la interfaz se crean variantes con su prompt de sistema, sus parámetros y su colección de documentos asociada, sin escribir un `Modelfile`. Aparecen en el desplegable como un modelo más.

Es el equivalente visual del `Modelfile` de Ollama, con la ventaja de que lo puede montar alguien que no toca la terminal.

## Conectar otros proveedores {: .topic-title }

Además de Ollama, admite cualquier API compatible con el formato de OpenAI. Eso permite tener modelos locales y externos en la misma interfaz.

!!! danger "Si conectas un proveedor externo, los datos salen"
    Es fácil perder de vista que en el mismo desplegable conviven modelos que **no salen de la organización** y otros que **envían todo a un tercero**. Un usuario que elige el modelo equivocado manda documentación interna fuera sin saberlo.

    Si el motivo de montar esto es que los datos no salgan, no se conectan proveedores externos — o se restringen por rol y se deja clarísimo cuál es cuál en el nombre.

## Seguridad {: .topic-title }

<div class="pros-cons" markdown>

| ✅ Haz | ❌ No hagas |
|---|---|
| Crear tu cuenta de administración antes de exponerlo | Publicar la URL sin registrarte primero |
| Desactivar el registro abierto o exigir aprobación | Dejar que cualquiera se cree cuenta |
| Ponerlo tras HTTPS y un proxy inverso | Exponer el puerto 3000 directo a internet |
| Restringir el puerto de Ollama al contenedor | Dejar Ollama accesible en la red |
| Separar colecciones públicas de internas | Un único índice con todo mezclado |

</div>

!!! warning "Documentación interna y pública no van en la misma colección"
    Si un usuario no debe ver ciertos documentos, **no pueden estar en el índice al que accede**. Filtrar después de recuperar llega tarde: la comprobación tiene que estar donde la consulta no puede saltársela.

---

## 📚 Fuentes {: .topic-title }

| Fuente | Enlace |
|---|---|
| 🌐 **Documentación de Open WebUI** | [docs.openwebui.com](https://docs.openwebui.com/) |
| 🐳 **Imagen del contenedor** | [github.com/open-webui/open-webui](https://github.com/open-webui/open-webui) |
