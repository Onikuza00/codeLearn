# Presentando MCP { .bloque-ia }

> Qué es el Protocolo de Contexto de Modelo, qué problema resuelve y en qué se diferencia del uso de herramientas.

---

## Qué es MCP { .topic-title }

El **Protocolo de Contexto de Modelo** (*Model Context Protocol*, MCP) es una capa de comunicación que le da a Claude el contexto y las herramientas que necesita, **sin que tengas que escribir un montón de código de integración**.

Piénsalo como una forma de **traspasar** la responsabilidad de definir y ejecutar las herramientas: en vez de que las escriba tu servidor, las proporcionan **servidores MCP** especializados.

## La arquitectura básica { .topic-title }

La arquitectura tiene dos piezas:

- **Cliente MCP:** tu propio servidor, es decir, la aplicación que habla con Claude.
- **Servidores MCP:** programas a los que se conecta el cliente. Cada uno contiene **herramientas**, **prompts** y **recursos**, y actúa como interfaz de un servicio externo.

## Un ejemplo real { .topic-title }

Supón que construyes un chat donde los usuarios preguntan a Claude por sus datos de GitHub. Un usuario podría escribir: «¿Qué *pull requests* abiertas tengo en todos mis repositorios?». Para responder, Claude necesita herramientas que consulten la API de GitHub.

### El problema: las funciones de herramienta

Sin MCP, tendrías que crear tú todas las herramientas de integración con GitHub. Y GitHub es enorme: repositorios, *pull requests*, incidencias (*issues*), proyectos y mucho más. Para cubrirlo todo, necesitarías desarrollar una cantidad enorme de herramientas.

De cada una hay que escribir **dos cosas**:

1. Su **esquema**, la descripción que le dice a Claude qué hace y qué datos necesita.
2. Su **función**, el código que realmente hace la llamada.

Todo eso hay que escribirlo, probarlo y mantenerlo.

### Cómo lo resuelve MCP

MCP traslada la responsabilidad de **definir y ejecutar** las herramientas desde tu servidor a los servidores MCP. En lugar de escribir todas las herramientas de GitHub, alguien las crea y las ejecuta dentro de un **servidor MCP dedicado**.

Ese servidor funciona como una **capa de abstracción** sobre GitHub: te ofrece herramientas ya preparadas que puedes usar sin implementarlas. Los servidores MCP dan acceso a datos o funciones implementadas por servicios externos, y empaquetan integraciones complejas en **componentes reutilizables** a los que puede conectarse cualquier aplicación.

## Preguntas frecuentes { .topic-title }

### ¿Quién crea los servidores MCP?

Cualquiera puede crear uno. A menudo son los propios proveedores de un servicio los que publican su implementación oficial. Por ejemplo, AWS podría lanzar un servidor MCP oficial con herramientas para sus servicios.

### ¿En qué se diferencia de llamar directamente a una API?

Un servidor MCP ya trae **definidos** los esquemas y las funciones de las herramientas. Si llamas a una API directamente, eres tú quien tiene que definir esas herramientas. MCP te ahorra ese trabajo de implementación.

### ¿MCP no es lo mismo que el uso de herramientas?

No, y es una confusión habitual. Son conceptos **complementarios pero distintos**:

| | Uso de herramientas | MCP |
|---|---|---|
| **Qué es** | El mecanismo por el que Claude pide que se ejecute una herramienta | Una forma de **obtener** herramientas ya hechas |
| **Se centra en** | Cómo Claude usa una herramienta | **Quién** crea y mantiene las herramientas |

Con MCP, alguien ya ha escrito las funciones y los esquemas, y vienen integrados en el servidor MCP. Después, Claude los usa igual que cualquier otra herramienta.

!!! tip "La idea clave"
    Los servidores MCP proporcionan esquemas de herramientas y funciones **ya definidos**. Eso elimina la necesidad de crear y mantener integraciones complejas por tu cuenta.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📘 **Model Context Protocol — sitio oficial** | https://modelcontextprotocol.io |
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
