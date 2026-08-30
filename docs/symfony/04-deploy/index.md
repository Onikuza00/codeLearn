# Deploy { .section-fundamentos }

> Desplegar es llevar la aplicación de tu ordenador a un servidor real. Lo que funciona en local no tiene por qué funcionar allí, y las diferencias son siempre las mismas media docena.

---

## Desarrollo frente a producción {: .topic-title }

Son dos entornos con objetivos opuestos.

En **desarrollo** quieres ver los errores: la traza completa, la barra de depuración, la caché reconstruyéndose sola en cuanto tocas un fichero.

En **producción** quieres que no se rompa y que vaya rápido: sin trazas visibles, con la caché generada de antemano y sin nada instalado que no haga falta.

| | Desarrollo | Producción | Qué falla si lo ignoras |
|---|---|---|---|
| Sistema | Windows con XAMPP o Docker | Linux (Ubuntu, Debian) | `User.php` y `user.php` son ficheros distintos en Linux |
| Permisos | Control total | El usuario `www-data` escribe poco | Error 500 al no poder escribir en `var/` |
| PHP | 8.3 con Xdebug y todo instalado | Puede ser 8.2 y sin `intl` | Funciones que no existen |
| Base de datos | `root` sin contraseña en `localhost` | Usuario restringido, servidor remoto | No conecta |
| Entorno | `APP_ENV=dev` | `APP_ENV=prod` | Dejar `dev` es un agujero de seguridad |
| Caché | Se rehace sola | Fría; hay que generarla | La web va lentísima |

!!! danger "`APP_ENV=dev` en producción expone la aplicación entera"
    Con el entorno de desarrollo activo, cualquier error muestra la traza completa: rutas de ficheros del servidor, fragmentos de tu código, valores de variables y a veces la cadena de conexión a la base de datos.

    Y el perfilador queda accesible en `/_profiler`, donde se ven las consultas, la configuración y las sesiones.

    Es el fallo más grave y más común de un primer despliegue. La comprobación es una línea:

    ```bash
    php bin/console about | grep -i environment
    ```

---

## Los cuatro niveles {: .topic-title }

Hay una escalera de formas de desplegar, y conviene saber en qué peldaño estás.

| Nivel | Cómo | Veredicto |
|---|---|---|
| **1 · Manual por FTP** | Arrastrar ficheros con FileZilla | **No lo hagas** |
| **2 · Git en el servidor** | `ssh` y `git pull`, luego los comandos a mano | Aceptable para aprender |
| **3 · Automatizado** | Deployer o un script de integración continua | El objetivo profesional |
| **4 · Contenedores** | Imagen de Docker, o una plataforma gestionada | Cuando la infraestructura lo pide |

!!! danger "Por qué el FTP es peor de lo que parece"
    No es solo que sea lento. Mientras se suben los ficheros, la aplicación está **a medias**: unos archivos son de la versión nueva y otros de la vieja. Cualquiera que entre en ese rato recibe errores incomprensibles.

    Además es fácil subir sin querer tu `var/cache` local —que apunta a rutas de tu ordenador— o tu `.env.local` con las credenciales de desarrollo.

    Y no hay forma de volver atrás: si algo va mal, toca resubir la versión anterior fichero a fichero, con la web rota mientras tanto.

!!! tip "El camino razonable"
    Empieza por el nivel 2 para entender qué pasa realmente en el servidor: los comandos, los permisos, las migraciones. Es un aprendizaje que luego no se puede saltar.

    En cuanto lo entiendas, sube al nivel 3. El nivel 2 funciona hasta el día que se te olvida un comando un viernes por la tarde.

---

## La estrategia {: .topic-title }

Tres piezas que separan un despliegue profesional de uno artesanal.

**Un entorno de pruebas previo** (*staging*): un clon del servidor real, con el mismo sistema y la misma versión de PHP, pero no público. Ahí se despliega primero. Si algo va a fallar, falla donde no lo ve nadie.

**Automatización**: que el despliegue sea un comando, no una lista de pasos que hay que recordar. Cada paso manual es un paso que algún día se hará mal o en el orden equivocado.

**Un plan de vuelta atrás**: saber exactamente cómo volver a la versión anterior, y haberlo probado. Descubrir cómo se hace el *rollback* mientras la web está caída es la peor forma de aprenderlo.

!!! info "Etiqueta cada versión en Git"
    ```bash
    git tag -a v1.4.0 -m "Versión 1.4.0"
    git push origin v1.4.0
    ```
    Con etiquetas, desplegar es "poner la `v1.4.0`" y volver atrás es "poner la `v1.3.2`". Sin ellas, hay que buscar el identificador del commit correcto en el historial, con la web caída y con prisa.

---

## Temario {: .topic-title }

| Temario | Concepto |
|---------|----------|
| [01 - Preparar el despliegue](01-preparacion/index.md) | `APP_ENV`, `dump-env`, `composer install --no-dev`, caché, permisos, migraciones, assets |
| [02 - El servidor web](02-servidor-web/index.md) | La raíz en `public/`, Apache, Nginx, HTTPS, OPcache |
| [03 - Automatizar](03-automatizacion/index.md) | Deployer, enlace simbólico, cero cortes, *rollback*, integración continua, Docker |

---

## 📚 Fuentes {: .topic-title }

| Recurso | Link |
|---------|------|
| 📙 **Institut Montilivi — Desplegament** | https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/desplegament/ |
| 🐘 **Symfony — Deploying** | https://symfony.com/doc/current/deployment.html |
