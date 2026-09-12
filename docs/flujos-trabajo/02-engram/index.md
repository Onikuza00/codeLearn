# Engram

> Memoria persistente que sobrevive entre sesiones y compactaciones — el agente recuerda decisiones, bugs y convenciones de sesiones anteriores sin que se le tengan que repetir.

---

## Qué es

Un servidor MCP + CLI de memoria persistente. Detecta el proyecto actual solo, por el directorio de trabajo (`cwd`) — no hay configuración por proyecto que hacer, a diferencia de OpenSpec.

## Para qué sirve

Guarda lo que no está en el código: decisiones tomadas y por qué, bugs ya resueltos, convenciones acordadas en conversación, contexto de quién es el usuario y en qué está trabajando. Sin esto, cada sesión nueva empieza de cero, aunque el trabajo lleve semanas.

## Cómo funciona

Un puñado de herramientas MCP, cada una con un momento concreto para usarse:

| Herramienta | Cuándo se usa |
|---|---|
| `mem_context` | Al arrancar una sesión (o tras una compactación) — recupera el historial reciente |
| `mem_search` | Al referenciar trabajo pasado — busca por palabras clave |
| `mem_get_observation` | Tras un `mem_search`, para leer el contenido completo (sin truncar) de un resultado |
| `mem_save` | Proactivo, después de CUALQUIER decisión, bugfix, descubrimiento o convención — nunca hay que esperar a que se pida |
| `mem_session_summary` | Antes de dar algo por terminado, o antes de compactar — guarda un resumen estructurado de la sesión |
| `mem_update` | Corregir un guardado anterior (necesita el ID exacto del documento, no una búsqueda por texto) |

## Cómo se usa

!!! note "Al empezar o retomar sesión"
    `mem_context` primero. Si hace falta más detalle sobre algo concreto, `mem_search` con las palabras clave, y `mem_get_observation` para leer el resultado completo si aparece truncado.

!!! tip "Durante el trabajo — proactivo, no reactivo"
    `mem_save` se llama solo, sin que nadie lo pida, justo después de cualquier decisión, bugfix, descubrimiento o convención nueva. Esperar a que termine toda la sesión para guardar de golpe es la forma de perder detalle.

!!! example "Antes de terminar o compactar"
    `mem_session_summary` es obligatorio antes de decir "listo" o "hecho" — y también antes de que el contexto se compacte, para no perder lo que no llegó a guardarse suelto.

!!! info "Guardar nunca sustituye la respuesta"
    Guardar en memoria es logística interna, no la respuesta en sí. El mensaje final al usuario siempre lleva la respuesta completa, nunca un simple "guardado" a secas.

??? example "Instalación"
    ```powershell
    # el binario (Go)
    go install github.com/Gentleman-Programming/engram/cmd/engram@latest

    # registrar el servidor MCP en Claude Code
    claude mcp add engram -s user -- engram mcp --tools=agent
    ```
    Verificación rápida: `engram --version`. Si el comando no existe, el CLI no está instalado — no hay que asumirlo, comprobarlo primero.

!!! warning "Si un guardado falla"
    Un fallo o timeout de memoria nunca bloquea ni sustituye la respuesta — se entrega igual, sin memoria guardada de ese paso.

---

## Checklist

- [ ] `engram --version` responde antes de asumir que está instalado
- [ ] Los guardados (`mem_save`) pasan durante la sesión, no todos de golpe al final
- [ ] `mem_session_summary` se llama antes de cerrar o compactar, no se salta
- [ ] Ningún mensaje final es solo "guardado" — siempre lleva la respuesta completa
