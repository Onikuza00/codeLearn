# Permisos { .bloque-devops }

> El motivo real detrás de la mitad de los errores 500 en un despliegue. Symfony no puede escribir la caché, el servidor web no puede leer un fichero, el contenedor deja carpetas que no puedes borrar: todo es lo mismo.

---

## El modelo {: .topic-title }

Cada fichero tiene un **usuario propietario** y un **grupo propietario**. Y tiene tres permisos, definidos por separado para tres destinatarios.

| Destinatario | Quién es |
|---|---|
| Usuario (*user*) | El propietario del fichero |
| Grupo (*group*) | Los miembros del grupo propietario |
| Otros (*others*) | Todos los demás |

| Permiso | Sobre un fichero | Sobre un directorio |
|---|---|---|
| **r** (leer) | Ver el contenido | Listar lo que hay dentro |
| **w** (escribir) | Modificarlo | Crear y borrar dentro |
| **x** (ejecutar) | Ejecutarlo como programa | **Entrar** en él |

!!! warning "En un directorio, `x` significa poder atravesarlo"
    Es lo que más despista. Un directorio con `r` pero sin `x` deja ver la lista de nombres pero no acceder a nada de dentro. Un directorio con `x` pero sin `r` permite abrir un fichero si sabes su nombre exacto, pero no listar el contenido.

    Por eso los directorios llevan casi siempre `x` donde llevan `r`: `755` y no `644`.

---

## Leer la salida de `ls -l` {: .topic-title }

```
-rwxr-xr--  1 www-data www-data  1234 Aug 30 14:22 script.sh
│└┬┘└┬┘└┬┘
│ │  │  └── otros:   r--  (solo leer)
│ │  └───── grupo:   r-x  (leer y ejecutar)
│ └──────── usuario: rwx  (todo)
└────────── tipo: - fichero, d directorio, l enlace
```

Diez caracteres: el primero es el tipo, y los otros nueve son tres bloques de tres.

---

## Notación octal {: .topic-title }

Cada permiso tiene un valor numérico, y se suman:

| Permiso | Valor |
|---|---|
| `r` leer | 4 |
| `w` escribir | 2 |
| `x` ejecutar | 1 |

Un bloque de tres permisos se convierte en un dígito, y los tres bloques en tres dígitos.

| Octal | Letras | Significa |
|---|---|---|
| `7` | `rwx` | Todo |
| `6` | `rw-` | Leer y escribir |
| `5` | `r-x` | Leer y ejecutar |
| `4` | `r--` | Solo leer |
| `0` | `---` | Nada |

Los cuatro valores que se usan de verdad:

| Valor | Para qué |
|---|---|
| `644` | Ficheros normales: el dueño escribe, los demás leen |
| `755` | Directorios y programas ejecutables |
| `600` | Ficheros con secretos: solo el dueño, nadie más |
| `775` | Ficheros que un grupo entero debe poder modificar |

---

## `chmod`: cambiar permisos {: .topic-title }

```bash
chmod 644 config.yaml
chmod 755 script.sh
chmod -R 755 public/          # -R aplica a todo lo de dentro
```

También admite una notación con letras, más legible para cambios pequeños:

```bash
chmod +x script.sh            # dar permiso de ejecución a todos
chmod u+w fichero             # el usuario puede escribir
chmod g-w fichero             # quitar escritura al grupo
chmod o-rwx secreto.env       # que "otros" no puedan nada
```

!!! danger "`chmod 777` no es una solución, es rendirse"
    Es el consejo más repetido en los foros y el peor de todos. `777` significa que **cualquier usuario del sistema** puede leer, modificar y ejecutar ese fichero.

    En un servidor compartido o comprometido, eso permite a un atacante sustituir tu código por el suyo. Y muchos servidores web se niegan a ejecutar ficheros con permisos tan abiertos precisamente por eso, así que a menudo ni siquiera arregla el problema.

    Cuando algo no puede escribir, la pregunta correcta no es "¿cómo abro los permisos?" sino **"¿qué usuario está ejecutando el proceso, y por qué no es el propietario?"**. La respuesta suele ser un `chown`, no un `chmod`.

!!! warning "Cuidado con `chmod -R` sobre un proyecto entero"
    Ficheros y directorios necesitan permisos distintos: `644` para unos, `755` para otros. Un `chmod -R 644` deja los directorios sin `x` y el proyecto entero deja de ser accesible.

    Si necesitas hacerlo, sepáralos:

    ```bash
    find . -type f -exec chmod 644 {} \;
    find . -type d -exec chmod 755 {} \;
    ```

---

## `chown`: cambiar propietario {: .topic-title }

```bash
chown usuario fichero
chown usuario:grupo fichero
chown -R www-data:www-data var/
```

`www-data` es el usuario con el que corren Apache y Nginx en Debian y Ubuntu. Cuando Symfony no puede escribir la caché, la causa casi siempre es que `var/` pertenece a otro usuario.

```bash
sudo chown -R www-data:www-data var/
sudo chmod -R 775 var/
```

!!! tip "Averigua siempre quién ejecuta el proceso antes de tocar nada"
    ```bash
    ps aux | grep -E "nginx|php-fpm"     # en la primera columna sale el usuario
    ```
    Con ese nombre ya sabes a quién tienen que pertenecer los ficheros. Cambiar permisos a ciegas es lo que lleva al `777`.

---

## UID y GID {: .topic-title }

Los nombres de usuario son una comodidad: el sistema trabaja con números. El **UID** identifica al usuario y el **GID** al grupo.

```bash
id            # tus identificadores
id -u         # solo el UID (normalmente 1000 para el primer usuario)
whoami        # tu nombre de usuario
```

El UID `0` es siempre el administrador (`root`). Los usuarios normales suelen empezar en `1000`.

!!! danger "Aquí está la explicación del problema de permisos con Docker"
    Cuando montas una carpeta de tu equipo dentro de un contenedor, los dos sistemas comparten los ficheros pero **no comparten la lista de usuarios**. Lo único que viaja es el número.

    Si dentro del contenedor el proceso corre como UID 33 (`www-data`) y en tu equipo tú eres el UID 1000, los ficheros que cree el contenedor te aparecerán como propiedad de "otro". No podrás editarlos ni borrarlos.

    Por eso la solución es construir la imagen con un usuario que tenga **tu mismo número**, no abrir permisos. Está desarrollado en la página de [volúmenes de Docker](../../01-docker/03-volumenes/index.md).

---

## Bits especiales {: .topic-title }

Tres permisos adicionales que aparecen en sistemas ya montados. Conviene reconocerlos, no aplicarlos a la ligera.

| Bit | Cómo se pone | Qué hace |
|---|---|---|
| **SUID** | `chmod u+s` | El programa se ejecuta como su propietario, no como quien lo lanza |
| **SGID** | `chmod g+s` | En un directorio, lo que se cree dentro hereda el grupo |
| **Sticky** | `chmod o+t` | En un directorio compartido, solo el dueño de cada fichero puede borrarlo |

El sticky bit es el que está puesto en `/tmp`: todo el mundo puede crear ficheros ahí, pero nadie puede borrar los de otro.

!!! danger "SUID en un programa es un riesgo de seguridad real"
    Un ejecutable con SUID y propietario `root` corre como administrador aunque lo lance cualquiera. Si ese programa tiene un fallo, se convierte en la vía para tomar el control del sistema.

    No es algo que pongas tú. Si lo ves en un fichero que no esperabas, es motivo para investigar.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `644` ficheros, `755` directorios | `chmod 777` para salir del paso |
| Comprobar qué usuario ejecuta el proceso | Cambiar permisos sin saber quién necesita acceso |
| `chown` al usuario correcto | Abrir permisos a todo el mundo |
| `600` en ficheros con credenciales | Un `.env` legible por cualquiera |
| Separar ficheros y directorios al aplicar en cascada | `chmod -R 644` sobre un proyecto entero |
| Alinear el UID del contenedor con el tuyo | Pelearte con los permisos de los ficheros que crea Docker |

</div>

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — Comandos de Linux** | https://apunts.institutmontilivi.cat/DAW-MP08/altres/comandesLinux/ |
| 🐘 **Symfony — Permisos de ficheros** | https://symfony.com/doc/current/setup/file_permissions.html |
