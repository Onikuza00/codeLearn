# Dockerfile { .bloque-devops }

> Un `Dockerfile` es un fichero de texto con la receta para construir una imagen: de qué se parte, qué se instala, qué se copia y qué se ejecuta al arrancar. Es la pieza que hace que un entorno sea reproducible.

---

## Estructura {: .topic-title }

Cada línea es una instrucción en mayúsculas seguida de sus argumentos. Se ejecutan en orden, de arriba abajo.

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
```

Se construye desde el directorio donde está el fichero:

```bash
docker build -t mi-api:1.0 .
```

Ese punto final no es decoración: es el **contexto de construcción**, el directorio que se envía al motor de Docker para que pueda copiar ficheros. Todo lo que haya ahí dentro viaja, aunque no lo uses.

---

## Las instrucciones {: .topic-title }

| Instrucción | Qué hace |
|---|---|
| `FROM` | Imagen de partida. **Siempre la primera** |
| `WORKDIR` | Directorio de trabajo dentro de la imagen; lo crea si no existe |
| `RUN` | Ejecuta un comando **durante la construcción** |
| `COPY` | Copia ficheros de tu máquina a la imagen |
| `ADD` | Como `COPY`, pero además acepta URLs y descomprime |
| `ENV` | Variable de entorno que persiste en el contenedor |
| `ARG` | Variable disponible **solo durante la construcción** |
| `EXPOSE` | Documenta qué puerto escucha el contenedor |
| `USER` | Cambia el usuario con el que se ejecuta lo siguiente |
| `CMD` | Comando por defecto al arrancar el contenedor |
| `ENTRYPOINT` | Comando fijo; convierte la imagen en un ejecutable |

### `COPY` frente a `ADD`

| | `COPY` | `ADD` |
|---|---|---|
| Copiar ficheros locales | ✅ | ✅ |
| Descargar una URL | ❌ | ✅ |
| Descomprimir un `.tar` automáticamente | ❌ | ✅ |

**Usa `COPY` siempre**, salvo que necesites específicamente descomprimir. `ADD` hace magia implícita: un fichero comprimido que solo querías copiar acaba descomprimido sin que lo pidieras. Para descargar de una URL es más claro un `RUN curl`, porque queda explícito.

### `CMD` frente a `ENTRYPOINT`

Los dos definen qué se ejecuta al arrancar, pero se comportan distinto ante los argumentos:

- `CMD` es un **valor por defecto**. Si al hacer `docker run imagen otro-comando` pasas algo, sustituye al `CMD` por completo.
- `ENTRYPOINT` es **fijo**. Lo que pases en `docker run` se le añade como argumentos en vez de reemplazarlo.

```dockerfile
ENTRYPOINT ["python3", "herramienta.py"]
CMD ["--ayuda"]
```

```bash
docker run mi-imagen              # python3 herramienta.py --ayuda
docker run mi-imagen --version    # python3 herramienta.py --version
```

Para una aplicación normal, `CMD` basta. `ENTRYPOINT` se usa cuando la imagen es una herramienta de línea de comandos empaquetada.

!!! warning "Escribe los comandos en forma de lista, no de texto"
    ```dockerfile
    CMD ["node", "server.js"]     # ✅ forma exec
    CMD node server.js            # ⚠️ forma shell
    ```
    La forma de texto arranca el proceso dentro de una shell, y esa shell **no reenvía las señales** de parada. El resultado: `docker stop` espera diez segundos y acaba matando el proceso a la fuerza, sin darle ocasión de cerrar conexiones ni terminar peticiones.

    Con la forma de lista, tu proceso es el principal y recibe la señal directamente.

!!! danger "`EXPOSE` no abre ningún puerto"
    Es solo documentación: le dice a quien lea el fichero qué puerto usa la aplicación. Para que sea accesible desde fuera hace falta `-p 8080:3000` en el `docker run`, o `ports:` en Compose.

    Es una confusión muy frecuente: se pone el `EXPOSE`, no se pone el `-p`, y el contenedor parece no funcionar.

---

## Elegir la imagen base {: .topic-title }

El `FROM` decide el peso de todo lo que venga detrás. Los tamaños de las bases más habituales:

| Imagen base | Tamaño aproximado |
|---|---|
| `busybox` | 1,2 MB |
| `alpine` | 4,4 MB |
| `ubuntu` | 84 MB |
| `debian` | 101 MB |
| `centos` | 200 MB |

La diferencia entre `alpine` y `debian` son casi cien megabytes que se descargan en cada despliegue y ocupan espacio en cada servidor.

!!! warning "Alpine no siempre es la elección correcta"
    Alpine usa `musl` en lugar de la librería estándar de C habitual (`glibc`). La mayoría de cosas funcionan, pero algunas extensiones compiladas fallan o se comportan distinto, y en Python la instalación de paquetes con partes en C puede alargarse muchísimo porque no hay binarios precompilados.

    Regla práctica: empieza por la variante `-alpine` de tu lenguaje (`php:8.3-fpm-alpine`, `node:22-alpine`). Si algo falla de forma rara al compilar una dependencia, baja a `-slim`, que es Debian recortado. Cambiar cien megabytes por dos horas de pelea no compensa.

---

## Capas y caché {: .topic-title }

Aquí está la parte que separa un Dockerfile lento de uno rápido.

**Cada instrucción crea una capa**, y Docker guarda el resultado de cada una. Al reconstruir, reutiliza las capas cuyo contenido no ha cambiado. Pero en cuanto una capa cambia, **todas las siguientes se rehacen**.

De ahí sale la regla de oro: **lo que cambia poco va arriba; lo que cambia mucho, abajo.**

```dockerfile
# ❌ Cada cambio en el código reinstala TODAS las dependencias
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm ci
CMD ["node", "server.js"]
```

```dockerfile
# ✅ Las dependencias solo se reinstalan si cambia package.json
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "server.js"]
```

El truco es copiar **primero** el fichero de dependencias, instalarlas, y solo después copiar el resto del código. Como el código cambia en cada commit pero `package.json` casi nunca, la capa de instalación se reaprovecha. La diferencia práctica es pasar de dos minutos de construcción a cinco segundos.

El mismo patrón vale en cualquier lenguaje: `composer.json` en PHP, `requirements.txt` en Python, `go.mod` en Go.

!!! tip "Agrupa los `RUN` relacionados en uno solo"
    ```dockerfile
    # ❌ tres capas, y la caché de apt queda dentro de la imagen
    RUN apt-get update
    RUN apt-get install -y curl
    RUN apt-get install -y git

    # ✅ una capa, y la caché se borra antes de cerrarla
    RUN apt-get update \
        && apt-get install -y curl git \
        && rm -rf /var/lib/apt/lists/*
    ```
    Hay un motivo de peso además del número de capas: **una capa nunca borra lo que hizo la anterior**. Si instalas en una capa y borras en la siguiente, el peso sigue en la imagen aunque el fichero ya no se vea. La limpieza tiene que ir en el mismo `RUN`.

    Separar `apt-get update` de `apt-get install` tiene otro peligro: si el `update` queda cacheado de hace semanas, el `install` usa una lista de paquetes caducada.

---

## `.dockerignore` {: .topic-title }

Funciona como un `.gitignore`, pero para el contexto de construcción: lo que aparezca ahí no se envía al motor de Docker.

```
node_modules
vendor
.git
.env
*.log
dist
```

!!! danger "Sin `.dockerignore` puedes acabar copiando secretos en la imagen"
    Un `COPY . .` sin filtro se lleva dentro de la imagen el `.git` entero (con todo el historial), el `.env` con las contraseñas y el `node_modules` local, que además puede estar compilado para otro sistema operativo.

    Y una imagen se publica y se comparte. Cualquiera que la descargue puede extraer esos ficheros. **El `.dockerignore` se crea en el mismo momento que el `Dockerfile`**, no después.

---

## Construcción multietapa {: .topic-title }

Muchas aplicaciones necesitan herramientas para **construirse** que no hacen falta para **ejecutarse**: compiladores, dependencias de desarrollo, el propio `npm`.

La construcción multietapa usa varios `FROM` en el mismo fichero. En la primera etapa se compila; en la última solo se copia el resultado. Todo lo que quedó atrás no llega a la imagen final.

```dockerfile
# Etapa 1: construir
FROM node:22-alpine AS constructor
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: servir — solo el resultado
FROM nginx:1.27-alpine
COPY --from=constructor /app/dist /usr/share/nginx/html
EXPOSE 80
```

La clave es `COPY --from=constructor`, que trae ficheros de una etapa anterior. La imagen final no contiene ni Node, ni `node_modules`, ni el código fuente: solo los ficheros estáticos ya compilados y un Nginx. Se pasa de cientos de megabytes a unas decenas.

---

## Ejecutar sin ser `root` {: .topic-title }

Por defecto, todo dentro de un contenedor se ejecuta como `root`. Si alguien logra ejecutar código en tu aplicación, lo hace con todos los permisos.

```dockerfile
FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

USER node          # las imágenes oficiales de Node ya traen este usuario
CMD ["node", "server.js"]
```

`USER` afecta a todo lo que venga **después**, así que va justo antes del `CMD`: las instalaciones necesitan permisos de administrador, la ejecución no.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Fijar la versión de la imagen base (`node:22-alpine`) | `FROM node` o `FROM node:latest` |
| Copiar el fichero de dependencias antes que el código | `COPY . .` al principio de todo |
| Agrupar `RUN` relacionados y limpiar en el mismo comando | Un `RUN` por línea y borrar en el siguiente |
| Crear el `.dockerignore` junto al `Dockerfile` | Copiar `.git`, `.env` y `node_modules` a la imagen |
| Multietapa cuando hay compilación | Dejar el compilador en la imagen de producción |
| `CMD ["comando", "arg"]` en forma de lista | `CMD comando arg` en forma de texto |
| `USER` antes del `CMD` | Ejecutar la aplicación como `root` |
| `COPY` | `ADD` para copiar ficheros normales |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — Dockerfile** | https://apunts.institutmontilivi.cat/DAW-MP08/dockerWindows/dockerWin003/ |
| 🐳 **Docker — Referencia del Dockerfile** | https://docs.docker.com/reference/dockerfile/ |
| 🐳 **Docker — Buenas prácticas de construcción** | https://docs.docker.com/build/building/best-practices/ |
