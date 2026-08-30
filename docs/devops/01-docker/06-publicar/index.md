# Publicar imágenes { .bloque-devops }

> Construir una imagen la deja en tu máquina y en ningún sitio más. Para que un servidor o un compañero puedan usarla hay que subirla a un registro. Es la mitad del ciclo que va del código a producción.

---

## Cómo se nombra una imagen {: .topic-title }

El nombre completo de una imagen tiene cuatro partes, y las tres primeras suelen estar implícitas:

```
registro/usuario/nombre:etiqueta
```

```
mysql:8.4                              → docker.io/library/mysql:8.4
paucros/mi-api:1.2.0                   → docker.io/paucros/mi-api:1.2.0
ghcr.io/miempresa/mi-api:1.2.0         → registro propio de GitHub
```

Cuando no indicas registro, Docker asume Docker Hub. Cuando no indicas usuario, asume las imágenes oficiales.

!!! warning "El nombre tiene que coincidir con el destino"
    No puedes subir una imagen llamada `mi-api:1.0` a Docker Hub: el registro no sabe de quién es. Tiene que llevar tu usuario delante — `paucros/mi-api:1.0` — o el registro rechaza la subida con un error de permisos que no explica el motivo real.

---

## Etiquetar {: .topic-title }

`docker tag` **no copia nada**: crea otro nombre que apunta a la misma imagen. Es como un enlace.

```bash
docker build -t mi-api:1.2.0 .

docker tag mi-api:1.2.0 paucros/mi-api:1.2.0
docker tag mi-api:1.2.0 paucros/mi-api:latest
```

También puedes ahorrarte el paso construyendo ya con el nombre final:

```bash
docker build -t paucros/mi-api:1.2.0 .
```

!!! tip "Etiqueta con la versión Y con `latest`"
    La etiqueta de versión (`1.2.0`) es la que fijas en producción, para saber exactamente qué está corriendo y poder volver atrás. La etiqueta `latest` es una comodidad para quien solo quiere probar.

    Publicar las dos cuesta un comando. Desplegar apuntando a `latest` es lo que no debes hacer: no sabrás qué versión hay en el servidor.

Una convención útil es etiquetar también con el identificador del commit:

```bash
docker tag mi-api:1.2.0 paucros/mi-api:$(git rev-parse --short HEAD)
```

Así cualquier imagen es rastreable hasta el código exacto que la produjo.

---

## Autenticarse y subir {: .topic-title }

```bash
docker login                      # Docker Hub
docker login ghcr.io              # otro registro

docker push paucros/mi-api:1.2.0
docker push paucros/mi-api:latest
```

Y desde el servidor, para traerla:

```bash
docker pull paucros/mi-api:1.2.0
```

!!! danger "Las credenciales se guardan sin cifrar"
    Por defecto, `docker login` escribe el token en `~/.docker/config.json` codificado en base64. **Base64 no es cifrado**: cualquiera con acceso a ese fichero lo descifra al instante.

    Dos medidas concretas:

    1. Configura un almacén de credenciales del sistema (`credsStore` en ese mismo fichero) para que el token quede en el llavero del sistema operativo.
    2. En servidores y en integración continua, **nunca uses tu contraseña**: crea un token de acceso con permisos limitados, que puedes revocar sin cambiar tu cuenta.

    ```bash
    echo "$TOKEN" | docker login -u usuario --password-stdin
    ```
    Pasar el token por la entrada estándar evita que quede escrito en el historial de la terminal.

---

## Registros privados {: .topic-title }

Docker Hub es el registro público por defecto, pero rara vez es donde acaba una imagen de empresa.

| Registro | Cuándo encaja |
|---|---|
| **Docker Hub** | Proyectos públicos, pruebas, imágenes base |
| **GitHub Container Registry** (`ghcr.io`) | El código ya está en GitHub; se integra con Actions |
| **GitLab Container Registry** | Lo mismo con GitLab |
| **Registros de la nube** (ECR, GCR, ACR) | El despliegue está en AWS, Google Cloud o Azure |

!!! info "Docker Hub limita las descargas anónimas"
    Hay un tope de descargas por dirección IP y por hora para cuentas anónimas. En un servidor de integración continua que construye muchas veces al día, ese tope se alcanza y las construcciones empiezan a fallar con un error de límite.

    La solución es autenticarse también para descargar, no solo para subir.

---

## Publicar desde integración continua {: .topic-title }

Lo habitual no es subir imágenes a mano desde tu portátil, sino que lo haga el servidor de integración continua cuando se fusiona código.

```yaml
# .github/workflows/publicar.yml — esquema mínimo
name: Publicar imagen

on:
  push:
    tags: ["v*"]

jobs:
  publicar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Iniciar sesión en el registro
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Construir y subir
        uses: docker/build-push-action@v6
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:${{ github.ref_name }}
```

El detalle que importa: la imagen se etiqueta con el nombre de la etiqueta de Git (`v1.2.0`). Cada versión publicada del código produce una imagen con ese mismo nombre, y las dos cosas quedan enlazadas.

!!! warning "Una imagen construida en tu portátil no es la misma que la del servidor"
    Puede llevar dependencias resueltas en otro momento, ficheros que solo existen en tu disco o una arquitectura distinta —un Mac reciente construye para ARM, y el servidor casi siempre es x86—.

    Si te encuentras un `exec format error` al arrancar en el servidor, es exactamente eso. Se resuelve construyendo para la plataforma correcta:

    ```bash
    docker build --platform linux/amd64 -t paucros/mi-api:1.2.0 .
    ```
    Lo robusto, de todas formas, es que la imagen de producción la construya siempre la misma máquina: el servidor de integración continua.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| Etiquetar con versión concreta y también con `latest` | Publicar solo `latest` |
| Desplegar apuntando a una versión fija | Desplegar apuntando a `latest` |
| Token de acceso revocable en servidores y CI | Tu contraseña de la cuenta en un fichero de configuración |
| `--password-stdin` para no dejar rastro en el historial | `docker login -p contraseña` en la línea de comandos |
| Construir la imagen de producción en integración continua | Subir la que construiste en tu portátil |
| Autenticarse también para descargar en CI | Descargar de forma anónima y toparse con el límite |
| Comprobar el `.dockerignore` antes de publicar | Publicar una imagen con el `.env` dentro |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📗 **Aula Software Libre — Taller de Docker** | https://aulasoftwarelibre.github.io/taller-de-docker/dockerfile/ |
| 🐳 **Docker — docker push** | https://docs.docker.com/reference/cli/docker/image/push/ |
| 🐳 **Docker — Almacén de credenciales** | https://docs.docker.com/reference/cli/docker/login/#credential-stores |
