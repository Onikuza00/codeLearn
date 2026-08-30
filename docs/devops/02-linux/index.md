# Comandos de Linux { .bloque-devops }

> Un contenedor es un Linux, y un servidor casi siempre también. En cuanto sales de tu entorno de desarrollo dejas de tener interfaz gráfica: solo hay una terminal, y hay que saber moverse por ella.

---

## Por qué hace falta {: .topic-title }

En el momento en que escribes `docker exec -it web bash`, estás dentro de una máquina Linux sin escritorio. Ahí no hay explorador de archivos ni editor con ratón. Las tareas más habituales son estas:

| Situación | Lo que necesitas |
|---|---|
| Ver por qué falla una aplicación | Leer un fichero de registro con `tail -f` |
| Comprobar que un fichero llegó a su sitio | Moverte con `cd` y `ls` |
| Symfony no puede escribir la caché | Entender y arreglar permisos con `chown` |
| Buscar dónde se define una variable | `grep -r` por todo el proyecto |
| Un proceso consume toda la memoria | `top`, `ps` y `kill` |
| El disco está lleno | `df -h` y `du -sh` |

No hace falta dominar Linux. Hace falta un repertorio corto que resuelva el noventa por ciento de los casos.

---

## La forma de un comando {: .topic-title }

Todos siguen el mismo esquema:

```bash
comando -opciones argumentos
```

```bash
ls -la /var/www
#│   │    └── argumento: sobre qué actúa
#│   └── opciones: cómo se comporta
#└── qué se ejecuta
```

Las opciones tienen dos formas: corta con un guion (`-l`) y larga con dos (`--long`). Las cortas se pueden agrupar: `-la` equivale a `-l -a`.

!!! tip "Cuando no recuerdes una opción"
    ```bash
    ls --help          # resumen rápido, cabe en pantalla
    man ls             # manual completo; se sale con q
    ```
    En imágenes de contenedor muy ligeras `man` no está instalado, pero `--help` casi siempre sí.

---

## Rutas {: .topic-title }

Una **ruta absoluta** empieza por `/` y describe el camino desde la raíz del sistema: `/var/www/html`. Funciona escribas donde escribas.

Una **ruta relativa** parte de donde estás ahora: `docker/nginx`. Depende de tu posición.

| Símbolo | Significa |
|---|---|
| `/` | La raíz del sistema |
| `.` | El directorio actual |
| `..` | El directorio padre |
| `~` | La carpeta personal del usuario |
| `-` | El directorio anterior (solo con `cd`) |

```bash
pwd            # dónde estoy exactamente
cd /var/www    # ir a una ruta absoluta
cd ..          # subir un nivel
cd -           # volver a donde estaba antes
cd             # ir a mi carpeta personal
```

!!! warning "Linux distingue mayúsculas de minúsculas"
    `Config.yaml` y `config.yaml` son dos ficheros distintos. En Windows no, y eso produce un fallo clásico: el proyecto funciona en tu equipo y al desplegarlo el servidor no encuentra un fichero que "está ahí".

    Lo mismo con las barras: en Linux se separa con `/`, nunca con `\`.

---

## Directorios que conviene reconocer {: .topic-title }

| Ruta | Qué contiene |
|---|---|
| `/etc` | Ficheros de configuración de todo el sistema |
| `/var/log` | Registros de actividad |
| `/var/www` | Raíz habitual de las webs |
| `/home/usuario` | Carpeta personal |
| `/tmp` | Temporales; se borran al reiniciar |
| `/usr/bin` | Programas instalados |
| `/opt` | Software añadido aparte |

---

## Temario {: .topic-title }

| Temario | Concepto |
|---------|----------|
| [Ficheros y directorios](01-ficheros/index.md) | `ls`, `cd`, `mkdir`, `cp`, `mv`, `rm`, `ln`, comodines |
| [Ver y buscar](02-ver-buscar/index.md) | `cat`, `less`, `head`, `tail -f`, `find`, `grep`, tuberías y redirección |
| [Permisos](03-permisos/index.md) | Usuario y grupo, `chmod`, `chown`, notación octal, bits especiales |
| [Procesos y servicios](04-procesos/index.md) | `ps`, `top`, `kill`, `systemctl`, `df`, `du` |

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — Comandos de Linux** | https://apunts.institutmontilivi.cat/DAW-MP08/altres/comandesLinux/ |
| 📗 **Aula Software Libre — Taller de Docker** | https://aulasoftwarelibre.github.io/taller-de-docker/introduction/ |
