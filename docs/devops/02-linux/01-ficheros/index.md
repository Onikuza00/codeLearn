# Ficheros y directorios { .bloque-devops }

> Moverse, listar, crear, copiar y borrar. Es el mínimo para no estar perdido dentro de un contenedor o de un servidor.

---

## Listar {: .topic-title }

```bash
ls              # nombres, en columnas
ls -l           # una línea por fichero, con detalles
ls -a           # incluye los ocultos (los que empiezan por punto)
ls -lh          # tamaños legibles: 4,0K en vez de 4096
ls -la          # la combinación que se usa el 90 % de las veces
ls -lt          # ordenado por fecha, lo más reciente primero
```

Una línea de `ls -l` tiene siete columnas:

```
-rw-r--r--  1 www-data www-data  1234 Aug 30 14:22 config.yaml
│           │ │        │         │    │            └── nombre
│           │ │        │         │    └── fecha de modificación
│           │ │        │         └── tamaño en bytes
│           │ │        └── grupo propietario
│           │ └── usuario propietario
│           └── número de enlaces
└── tipo y permisos
```

El primer carácter dice qué es: `-` fichero normal, `d` directorio, `l` enlace simbólico. Los nueve siguientes son los permisos, que se explican en su [propia página](../03-permisos/index.md).

!!! tip "`ls -la` es el primer comando al entrar en cualquier sitio"
    Muestra los ficheros ocultos —donde viven `.env`, `.git` y `.dockerignore`— y los permisos, que es lo que suele explicar por qué algo no funciona.

---

## Crear y borrar {: .topic-title }

```bash
mkdir carpeta               # crear un directorio
mkdir -p uno/dos/tres       # crear toda la ruta, sin quejarse si ya existe
touch fichero.txt           # crear un fichero vacío
rm fichero.txt              # borrar un fichero
rm -r carpeta               # borrar un directorio y su contenido
rmdir carpeta               # borrar un directorio, solo si está vacío
```

!!! danger "En Linux no hay papelera: `rm` borra de verdad"
    No hay deshacer. Lo que borras deja de existir.

    Dos costumbres que evitan disgustos:

    ```bash
    ls carpeta/           # mira SIEMPRE qué hay dentro antes de borrarla
    rm -ri carpeta/       # -i pregunta por cada elemento
    ```

    Y una advertencia sobre `rm -rf`: la `f` significa "no preguntes nada". Combinada con una ruta mal escrita o una variable vacía, borra cosas que no querías. Escribe la ruta completa, léela dos veces, y desconfía de cualquier `rm -rf $VARIABLE` — si la variable está vacía, el comando se convierte en `rm -rf /`.

---

## Copiar y mover {: .topic-title }

```bash
cp origen.txt destino.txt          # copiar un fichero
cp -r carpeta/ copia/              # copiar un directorio entero
cp -p origen destino               # conservar permisos y fechas

mv viejo.txt nuevo.txt             # renombrar
mv fichero.txt carpeta/            # mover
```

`mv` hace las dos cosas —renombrar y mover— porque para el sistema son la misma operación: cambiar dónde está apuntado el fichero.

!!! warning "`cp` y `mv` sobrescriben sin avisar"
    Si el destino ya existe, se pierde. La opción `-i` obliga a confirmar:

    ```bash
    cp -i origen.txt destino.txt
    ```

---

## Comodines {: .topic-title }

La shell expande ciertos símbolos antes de ejecutar el comando.

| Comodín | Significa | Ejemplo |
|---|---|---|
| `*` | Cualquier texto, incluido vacío | `*.log` → todos los `.log` |
| `?` | Exactamente un carácter | `dato?.txt` → `dato1.txt`, `datoA.txt` |
| `[...]` | Uno de los caracteres del grupo | `dato[123].txt` |
| `{a,b}` | Cada una de las alternativas | `fichero.{js,css}` |

```bash
rm *.log                    # borrar todos los registros
cp *.php ../copia/          # copiar todos los PHP
ls -la /var/log/nginx/*.log
```

!!! danger "`rm *` con un espacio de más borra el directorio actual"
    ```bash
    rm * .log      # ❌ dos argumentos: "todo" y luego ".log"
    rm *.log       # ✅
    ```
    El primero borra **todos** los ficheros del directorio y después se queja de que no existe `.log`. Un espacio.

---

## Enlaces {: .topic-title }

Un enlace simbólico es un fichero que apunta a otro sitio, como un acceso directo.

```bash
ln -s /ruta/real/config.yaml config.yaml
```

Se reconocen en `ls -l` porque empiezan por `l` y muestran la flecha:

```
lrwxrwxrwx 1 root root 22 Aug 30 14:00 config.yaml -> /ruta/real/config.yaml
```

Se usan constantemente en servidores: para activar la configuración de un sitio en Nginx, o para que una carpeta de subidas apunte a un disco distinto.

!!! warning "Un enlace no sobrevive a cambiar el destino de sitio"
    Si mueves o borras el fichero original, el enlace queda roto y apunta a la nada. En `ls` sigue apareciendo, pero abrirlo da error de fichero no encontrado.

---

## Comprimir {: .topic-title }

```bash
tar -czf copia.tar.gz carpeta/     # comprimir
tar -xzf copia.tar.gz              # descomprimir
tar -tzf copia.tar.gz              # ver el contenido sin extraer
```

Las letras: `c` crear, `x` extraer, `t` listar, `z` comprimir con gzip, `f` el fichero sobre el que se opera.

!!! tip "Mira siempre el contenido antes de extraer"
    `tar -tzf` te dice qué va a salir. Algunos archivos vienen con una carpeta dentro y otros sueltan cincuenta ficheros en el directorio actual. Un vistazo evita tener que limpiar el estropicio.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `ls -la` antes de tocar nada en un sitio nuevo | Borrar sin haber mirado qué hay |
| Rutas absolutas en scripts y comandos peligrosos | Rutas relativas cuando no estás seguro de dónde estás |
| `mkdir -p` para crear rutas completas | Crear directorio a directorio |
| `cp -i` / `rm -i` cuando dudes | `rm -rf` de memoria y con prisa |
| Comprobar que una variable tiene valor antes de usarla en `rm` | `rm -rf $RUTA` sin comprobar `$RUTA` |
| `tar -tzf` antes de extraer | Extraer a ciegas en la carpeta actual |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — Comandos de Linux** | https://apunts.institutmontilivi.cat/DAW-MP08/altres/comandesLinux/ |
