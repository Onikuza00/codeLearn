# Procesos y servicios { .bloque-devops }

> Qué se está ejecutando, cuánto consume, cómo pararlo y por qué el disco está lleno. Es lo que se mira cuando algo va lento o ha dejado de responder.

---

## Ver los procesos {: .topic-title }

Un **proceso** es un programa en ejecución. Cada uno tiene un número identificador, el **PID**, que es como se le señala para actuar sobre él.

```bash
ps aux                    # todos los procesos del sistema
ps aux | grep php         # solo los que tienen que ver con PHP
```

La salida de `ps aux` tiene las columnas importantes al principio y al final:

```
USER   PID  %CPU %MEM   VSZ   RSS TTY STAT START TIME COMMAND
www-data 42  0.3  1.2 285432 24680 ?  S   14:22 0:03 php-fpm: pool www
│        │   │    │                                    └── qué se ejecuta
│        │   │    └── porcentaje de memoria
│        │   └── porcentaje de CPU
│        └── identificador del proceso
└── usuario que lo ejecuta
```

!!! tip "La primera columna resuelve los problemas de permisos"
    `ps aux | grep -E "nginx|php-fpm"` te dice **con qué usuario** corre el servidor. Ese es el usuario que tiene que ser propietario de los ficheros que la aplicación necesita escribir.

    Es el paso previo a cualquier `chown`, y lo que evita acabar poniendo `chmod 777`.

---

## Consumo en tiempo real {: .topic-title }

```bash
top           # tabla que se refresca sola
htop          # versión con colores y navegación; hay que instalarla
```

Dentro de `top`: `q` para salir, `M` para ordenar por memoria, `P` por CPU, `k` para matar un proceso.

Es el primer sitio donde mirar cuando el servidor va lento: normalmente hay un proceso comiéndose la CPU o la memoria, y el nombre dice de qué se trata.

---

## Terminar un proceso {: .topic-title }

```bash
kill 1234              # pedir que termine con orden (señal TERM)
kill -9 1234           # matarlo sin contemplaciones (señal KILL)
killall php-fpm        # todos los procesos con ese nombre
pkill -f "worker"      # los que contengan ese texto en su línea de comandos
```

!!! danger "`kill -9` es el último recurso, no el primero"
    `kill` a secas envía una señal que el programa puede atender: cierra sus conexiones, termina lo que estaba escribiendo y sale ordenadamente.

    `kill -9` no se puede atender. El proceso muere en el acto, dejando a medias lo que estuviera haciendo: transacciones abiertas, ficheros a medio escribir, bloqueos sin liberar.

    Prueba primero con `kill`. Dale unos segundos. Solo si no responde, `-9`.

    Es exactamente lo mismo que la diferencia entre `docker stop` y `docker kill`, y la razón por la que un `CMD` en forma de texto rompe el apagado ordenado de un contenedor.

---

## Servicios {: .topic-title }

Un **servicio** es un proceso que el sistema gestiona: lo arranca al encender, lo reinicia si se cae y lo para al apagar. Nginx, MySQL y PHP-FPM son servicios.

```bash
systemctl status nginx       # ¿está corriendo? ¿desde cuándo? últimas líneas de log
systemctl start nginx
systemctl stop nginx
systemctl restart nginx      # parar y arrancar
systemctl reload nginx       # releer la configuración SIN cortar el servicio
systemctl enable nginx       # que arranque solo al encender la máquina
```

!!! tip "`reload` frente a `restart` en un servidor con tráfico"
    `restart` corta el servicio: durante uno o dos segundos, las peticiones que lleguen fallan.

    `reload` hace que el servicio relea su configuración sin dejar de atender. Después de tocar un fichero de Nginx, lo correcto es:

    ```bash
    nginx -t                    # comprobar que la configuración es válida
    systemctl reload nginx      # aplicarla sin cortar
    ```
    El `nginx -t` es obligatorio: si la configuración tiene un error y haces `restart`, el servicio no vuelve a levantar y el sitio se queda caído.

!!! info "Dentro de un contenedor no hay `systemctl`"
    Un contenedor ejecuta **un solo proceso principal**, no un sistema con gestor de servicios. Por eso no hay `systemctl` dentro, y por eso "reiniciar el servicio" en Docker es reiniciar el contenedor entero:

    ```bash
    docker compose restart nginx
    ```

---

## Espacio en disco {: .topic-title }

```bash
df -h                    # espacio libre por partición
du -sh carpeta/          # cuánto ocupa una carpeta
du -sh * | sort -h       # ordenar las carpetas de aquí por tamaño
```

La `h` de las dos significa *human readable*: muestra `4,2G` en vez del número de bloques.

El procedimiento cuando el disco se llena:

```bash
df -h                              # 1. qué partición está llena
du -sh /var/* | sort -h            # 2. qué carpeta pesa dentro
du -sh /var/log/* | sort -h        # 3. bajar hasta encontrar al culpable
```

!!! warning "En un servidor con Docker, el culpable suele ser Docker"
    Imágenes viejas, contenedores parados, volúmenes huérfanos y caché de construcción se acumulan hasta llenar decenas de gigabytes.

    ```bash
    docker system df       # el desglose
    docker system prune    # la limpieza segura
    ```
    El otro sospechoso habitual son los ficheros de registro sin rotación: un `prod.log` que nadie ha limitado crece indefinidamente.

---

## Otros comandos útiles {: .topic-title }

```bash
uptime               # cuánto lleva encendida y la carga media
free -h              # memoria libre y usada
uname -a             # versión del núcleo y arquitectura
dmesg | tail         # últimos mensajes del núcleo
curl -I https://ejemplo.com    # solo las cabeceras de una respuesta HTTP
```

`curl -I` es el más práctico de todos para el trabajo diario: comprueba desde el servidor si un servicio responde y con qué código, sin salir de la terminal.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `ps aux \| grep` para saber quién ejecuta qué | Cambiar permisos sin comprobar el usuario del proceso |
| `kill` primero, `kill -9` solo si no responde | `kill -9` por costumbre |
| `nginx -t` antes de recargar | `restart` sin validar la configuración |
| `reload` en servicios con tráfico | `restart` cuando bastaba con recargar |
| `df -h` → `du -sh` para localizar qué llena el disco | Borrar ficheros al azar para hacer sitio |
| `docker system prune` en servidores con contenedores | Ignorar lo que acumula Docker |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — Comandos de Linux** | https://apunts.institutmontilivi.cat/DAW-MP08/altres/comandesLinux/ |
