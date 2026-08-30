# Docker { .bloque-devops }

> Docker empaqueta una aplicación junto con todo lo que necesita para funcionar —sistema, librerías, configuración— en una unidad que se ejecuta igual en cualquier máquina. Resuelve el problema de "en mi ordenador funciona".

---

## El problema {: .topic-title }

Una aplicación no es solo su código. Necesita una versión concreta de PHP o de Node, unas extensiones instaladas, una base de datos, unas variables de entorno. Todo eso vive en la máquina, no en el repositorio.

De ahí salen los problemas clásicos: el proyecto funciona en tu portátil y falla en el del compañero; funciona en desarrollo y se rompe en el servidor; dos proyectos necesitan versiones distintas de la misma herramienta y no pueden convivir.

Docker mete todo el entorno **dentro** del paquete. Lo que se mueve entre máquinas ya no es solo el código: es el código con su sistema operativo y sus dependencias.

---

## Contenedor y máquina virtual {: .topic-title }

La comparación obligada, porque resuelven un problema parecido de forma muy distinta.

Una **máquina virtual** simula un ordenador entero: tiene su propio sistema operativo completo, con su núcleo. Arrancarla es arrancar un ordenador, y ocupa gigabytes.

Un **contenedor** comparte el núcleo del sistema operativo de la máquina que lo aloja. Solo lleva lo que hay por encima: librerías, ficheros, procesos. Por eso pesa megabytes y arranca en segundos.

| | Máquina virtual | Contenedor |
|---|---|---|
| Qué virtualiza | El hardware completo | Solo el espacio de procesos y ficheros |
| Sistema operativo | Uno completo por máquina | Comparte el núcleo del anfitrión |
| Tamaño típico | Gigabytes | Megabytes |
| Arranque | Minutos | Segundos |
| Aislamiento | Total | Suficiente para la mayoría de casos |
| Cuántos caben | Unos pocos | Decenas o cientos |

!!! info "Docker en Windows y en macOS usa una máquina virtual por debajo"
    Los contenedores son una función del núcleo de Linux. En Windows y macOS, Docker Desktop arranca una máquina virtual ligera con Linux y ejecuta los contenedores dentro.

    Es transparente al usar los comandos, pero explica dos cosas: por qué Docker Desktop consume memoria aunque no tengas contenedores, y por qué el acceso a ficheros del disco de Windows desde un contenedor es notablemente más lento (en Windows, trabajar dentro de WSL 2 lo mejora mucho).

    En Linux esa máquina virtual no hace falta: Docker Engine se instala directamente. Ahí Docker Desktop añade una capa que sobra, y además no es software libre — el motor (Docker CE) sí lo es.

---

## Instalación {: .topic-title }

En Windows y macOS se instala **Docker Desktop**, que trae el motor, la interfaz gráfica y `docker compose`. En Windows conviene activar el soporte de WSL 2 y trabajar con los proyectos dentro del sistema de ficheros de Linux, no en `C:\`.

En Linux se instala **Docker CE** desde los repositorios de tu distribución, sin Docker Desktop.

```bash
docker version     # comprobar que cliente y motor responden
docker run hello-world
```

!!! danger "En Linux, sin añadirte al grupo `docker` todo falla con «permission denied»"
    El cliente habla con el motor a través de un fichero especial, `/var/run/docker.sock`, que pertenece al usuario administrador. Sin permisos sobre él, **cualquier** comando falla con un error sobre el socket que no menciona la palabra "permisos" de forma clara.

    ```bash
    sudo usermod -aG docker $USER
    newgrp docker              # o cerrar sesión y volver a entrar
    ```
    La alternativa —escribir `sudo docker` siempre— funciona, pero deja los ficheros que crea el contenedor como propiedad del administrador, y eso trae otro problema distinto.

---

## Los tres conceptos {: .topic-title }

Casi toda la confusión inicial con Docker viene de mezclar estos tres nombres.

### Imagen

Una **plantilla inmutable** con el contenido de lo que se va a ejecutar: el sistema base, las librerías, tu aplicación. Una imagen no se ejecuta y no cambia nunca.

### Contenedor

Una **instancia en ejecución** de una imagen. Es un proceso aislado, con su propio sistema de ficheros, su red y sus variables.

La relación es la misma que hay entre una clase y un objeto en programación orientada a objetos: la imagen es la clase, el contenedor es la instancia. De una sola imagen puedes arrancar veinte contenedores idénticos.

### Registro

Un **repositorio de imágenes**, público o privado. El más conocido es Docker Hub, de donde se descargan las imágenes oficiales de MySQL, PHP, Node o Nginx.

!!! warning "Un contenedor es efímero: lo que escribe dentro, se pierde"
    Al borrar un contenedor desaparece todo lo que se haya escrito en su sistema de ficheros. Los datos de una base de datos, los ficheros que suben los usuarios y los registros de actividad **no** sobreviven.

    Eso no es un defecto, es el modelo: un contenedor debe poder destruirse y recrearse sin consecuencias. Lo que tiene que persistir se guarda fuera, en un [volumen](03-volumenes/index.md).

---

## La arquitectura {: .topic-title }

Docker funciona como cliente y servidor:

| Pieza | Qué hace |
|---|---|
| **Cliente** (`docker`) | El comando que escribes en la terminal |
| **Docker Engine** (*daemon*) | El servicio que construye imágenes y ejecuta contenedores |
| **Registro** | Donde viven las imágenes que se descargan y se publican |

Cuando escribes `docker run`, el cliente envía la orden al motor; el motor busca la imagen en local, y si no la tiene la descarga del registro. Por eso la primera ejecución de una imagen tarda y las siguientes son instantáneas.

---

## El flujo completo {: .topic-title }

Los cuatro pasos de cualquier proyecto con Docker:

```bash
# 1. Describir el entorno en un Dockerfile
#    (fichero de texto con las instrucciones)

# 2. Construir la imagen a partir de ese fichero
docker build -t mi-aplicacion:1.0 .

# 3. Arrancar un contenedor desde la imagen
docker run -d -p 8080:80 --name web mi-aplicacion:1.0

# 4. Comprobar que está corriendo
docker ps
```

Cuando hay más de un servicio —una aplicación y su base de datos— el paso 3 se sustituye por Docker Compose, que arranca todo el conjunto con un solo comando.

---

## Temario {: .topic-title }

| Temario | Concepto |
|---------|----------|
| [Comandos básicos](01-comandos/index.md) | Ciclo de vida, `run`/`ps`/`exec`/`logs`, banderas de `run`, limpieza |
| [Dockerfile](02-dockerfile/index.md) | `FROM`, `RUN`, `COPY`, `CMD`, capas y caché, multietapa, `.dockerignore` |
| [Volúmenes](03-volumenes/index.md) | Persistencia, volúmenes con nombre, montajes de directorio, `tmpfs` |
| [Docker Compose](04-compose/index.md) | Servicios, redes, dependencias, variables de entorno, perfiles |
| [Redes](05-redes/index.md) | Tipos de red, redes propias, publicar puertos, `host.docker.internal` |
| [Publicar imágenes](06-publicar/index.md) | `tag`, `login`, `push`, registros, credenciales, integración continua |
| [Un stack de Symfony](07-stack-symfony/index.md) | Nginx + PHP-FPM + MySQL, permisos de `var/`, desarrollo frente a producción |

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — Introducción a Docker** | https://apunts.institutmontilivi.cat/DAW-MP08/uf3/0614_Bloc3_docker_001/ |
| 📙 **Institut Montilivi — Docker en Windows** | https://apunts.institutmontilivi.cat/DAW-MP08/dockerWindows/dockerProj001/ |
| 🐳 **Documentación oficial de Docker** | https://docs.docker.com/get-started/ |
