# Ver y buscar { .bloque-devops }

> Leer un fichero de registro, encontrar dónde se define algo y encadenar comandos. Es lo que más se hace en un servidor, porque casi siempre se entra a averiguar por qué algo ha fallado.

---

## Ver el contenido de un fichero {: .topic-title }

| Comando | Qué hace | Cuándo |
|---|---|---|
| `cat` | Vuelca el fichero entero de golpe | Ficheros cortos |
| `less` | Lo abre para navegarlo, con búsqueda | Ficheros largos |
| `head` | Las primeras 10 líneas | Ver la cabecera de algo |
| `tail` | Las últimas 10 líneas | **Ver los errores más recientes** |

```bash
cat config.yaml
less var/log/dev.log
head -n 20 datos.csv
tail -n 50 var/log/prod.log
```

Dentro de `less`: `q` para salir, flechas o espacio para moverse, `/texto` para buscar, `n` para el siguiente resultado, `G` para ir al final.

!!! danger "`cat` sobre un fichero de registro de producción llena la terminal"
    Un `prod.log` puede tener cientos de miles de líneas. `cat` las escupe todas y te deja la terminal inutilizable durante un rato largo.

    Para registros, siempre `tail` o `less`.

### `tail -f`: el comando estrella

```bash
tail -f var/log/dev.log
```

La opción `-f` (*follow*) deja el comando abierto mostrando las líneas nuevas **según se escriben**. Es la forma de ver qué pasa mientras reproduces un error.

```bash
tail -f -n 100 var/log/dev.log     # las últimas 100 y sigue
tail -f var/log/*.log              # varios ficheros a la vez
```

Se sale con `Ctrl+C`.

!!! tip "El equivalente en Docker ya lo conoces"
    `docker logs -f contenedor` hace exactamente esto sobre la salida de un contenedor. Es el mismo gesto: dejar una ventana abierta viendo el registro mientras provocas el fallo en otra.

---

## Buscar ficheros: `find` {: .topic-title }

```bash
find . -name "*.php"                  # por nombre, desde aquí hacia abajo
find /var/www -name "config.yaml"     # en una ruta concreta
find . -type d -name "cache"          # solo directorios
find . -mtime -1                      # modificados en las últimas 24 horas
find . -size +100M                    # de más de 100 MB
```

La estructura es siempre `find <dónde> <qué condición>`.

!!! tip "Encontrar qué está llenando el disco"
    ```bash
    find /var -size +100M -exec ls -lh {} \;
    ```
    `-exec` ejecuta un comando sobre cada resultado; `{}` se sustituye por cada fichero encontrado. Es la forma rápida de localizar el registro de veinte gigas que ha llenado el servidor.

---

## Buscar dentro de los ficheros: `grep` {: .topic-title }

`grep` busca **texto dentro** de los ficheros, no nombres de fichero.

```bash
grep "error" var/log/prod.log            # líneas que contienen "error"
grep -i "error" var/log/prod.log         # sin distinguir mayúsculas
grep -r "DATABASE_URL" .                 # recursivo por todo el proyecto
grep -n "TODO" src/Controller/*.php      # con número de línea
grep -c "error" var/log/prod.log         # solo contar cuántas hay
grep -v "debug" var/log/prod.log         # las que NO lo contienen
```

Las opciones que más se combinan: `-rin` (recursivo, sin distinguir mayúsculas, con número de línea).

```bash
grep -rin "apikey" .
```

!!! warning "Un `grep -r` en la raíz del proyecto entra en `vendor/` y `node_modules/`"
    Y ahí hay decenas de miles de ficheros: la búsqueda tarda una eternidad y devuelve resultados de librerías de terceros que no te interesan.

    ```bash
    grep -rin "apikey" src/ config/
    grep -rin --exclude-dir={vendor,node_modules,var} "apikey" .
    ```

Añadir contexto alrededor de cada resultado ayuda a entender qué pasaba:

```bash
grep -B 3 -A 5 "Exception" var/log/prod.log
```

`-B` son las líneas de antes (*before*) y `-A` las de después (*after*). En una traza de error, lo interesante casi nunca es la línea que coincide, sino las de alrededor.

---

## Tuberías y redirección {: .topic-title }

La idea que hace potente a la terminal: la salida de un comando puede ser la entrada de otro.

### La tubería `|`

```bash
cat var/log/prod.log | grep "error" | tail -n 20
```

Se lee de izquierda a derecha: coge el fichero, quédate solo con las líneas que contienen "error", y de esas muestra las veinte últimas.

```bash
ps aux | grep php                        # procesos de PHP
docker ps -a | grep Exited               # contenedores parados
grep "error" prod.log | wc -l            # cuántos errores hay
history | grep docker                    # qué comandos de docker usé
```

`wc -l` cuenta líneas, y es el final natural de muchas tuberías cuando lo que quieres es un número.

### Redirección

| Símbolo | Qué hace |
|---|---|
| `>` | Manda la salida a un fichero, **sobrescribiéndolo** |
| `>>` | La añade al final del fichero |
| `2>` | Manda solo los errores |
| `&>` | Manda la salida y los errores juntos |

```bash
docker compose logs > registro.txt        # guardar en un fichero
echo "una línea más" >> notas.txt         # añadir sin borrar
comando 2> errores.txt                    # separar los errores
comando &> todo.txt                       # todo junto
comando > /dev/null 2>&1                  # descartar toda la salida
```

!!! danger "`>` borra el fichero antes de escribir"
    ```bash
    grep "error" prod.log > prod.log       # ❌ deja el fichero vacío
    ```
    La shell vacía el destino **antes** de que `grep` empiece a leer, así que no queda nada que buscar. Para filtrar un fichero sobre sí mismo hay que pasar por uno intermedio.

    Y si lo que quieres es añadir, comprueba dos veces que has escrito `>>` y no `>`. Un `>` de menos sobre un fichero de configuración lo deja vacío.

`/dev/null` es un destino especial que descarta todo lo que recibe. Se usa para silenciar comandos en scripts y tareas programadas.

---

## Ver diferencias {: .topic-title }

```bash
diff config.yaml config.yaml.bak
diff -u antes.txt despues.txt        # formato unificado, como en Git
```

Es lo que se usa para comparar la configuración de un servidor con la de otro cuando "en uno funciona y en el otro no".

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `tail -f` para seguir un registro en vivo | `cat` sobre un registro de producción |
| `grep -rin` limitado a las carpetas del código | `grep -r` en la raíz, entrando en `vendor/` |
| `-B`/`-A` para ver el contexto de un error | Leer solo la línea que coincide |
| `>>` cuando quieres añadir | `>` por descuido sobre un fichero con contenido |
| Fichero intermedio al filtrar sobre sí mismo | `grep ... fichero > fichero` |
| Encadenar con tuberías en vez de ficheros temporales | Guardar resultados intermedios que no vas a usar |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — Comandos de Linux** | https://apunts.institutmontilivi.cat/DAW-MP08/altres/comandesLinux/ |
