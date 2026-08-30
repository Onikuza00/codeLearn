# Doctrine { .section-fundamentos }

> Doctrine es el ORM (Object-Relational Mapper) de Symfony: convierte filas de una tabla en objetos PHP y viceversa, para trabajar con clases en vez de SQL a mano. No sustituye el SQL — lo genera a partir de cómo mapeaste las entidades.

---

## Instalar el paquete {: .topic-title }

Doctrine no viene de fábrica en un proyecto Symfony nuevo — hay que traerlo con Composer, en dos pasos separados:

!!! example "💻 Comandos — instalación"
    ```bash
    composer require symfony/orm-pack           # [orm-pack] trae doctrine/orm + doctrine-bundle + migrations-bundle
    composer require --dev symfony/maker-bundle  # [dev] separado a propósito: solo genera código, no hace falta en producción
    ```

## Crear la base de datos {: .topic-title }

Antes de mapear una sola Entity, Doctrine necesita saber **a qué base de datos conectarse**. Si no usaras Docker (una BD instalada a mano), el primer paso es este comando:

!!! example "💻 Comandos — DoctrineBundle"
    ```bash
    symfony console doctrine:database:create   # [DoctrineBundle] crea la BD que indica DATABASE_URL, si todavía no existe
    ```

Ese comando lee de dónde crear la base en una única variable de entorno, `DATABASE_URL` — una sola línea que empaqueta toda la info de conexión:

```env
# .env / .env.local
DATABASE_URL="postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8"
```

Desglosada pieza por pieza (con valores reales de tu proyecto):

| Parte | Valor real | Qué es |
|---|---|---|
| Driver | `postgresql://` | Qué motor de BD hablar (`postgresql`, `mysql`, `sqlite`... cada uno con su propio prefijo) |
| Usuario | `app` | El usuario de la base de datos |
| Contraseña | `!ChangeMe!` | La contraseña de ese usuario |
| Host | `127.0.0.1` | Dónde vive el servidor de BD — sería otro valor si estuviera en otra máquina |
| Puerto | `5432` | El estándar de Postgres (MySQL usaría `3306`) |
| Nombre de BD | `app` | La base de datos en sí, dentro de ese servidor |
| Versión del motor | `?serverVersion=16` | Doctrine la necesita para saber qué sintaxis SQL generar |
| Codificación | `&charset=utf8` | El charset de la conexión |

| Archivo | Qué es |
|---|---|
| `.env` | Valores por defecto, se commitea (los genera el recipe de Flex al instalar `doctrine/doctrine-bundle`) |
| `.env.local` | Overrides personales de tu máquina, **nunca se commitea** (está en `.gitignore`) — ahí van credenciales reales si difieren de las de `.env` |

Si esa base la levanta Docker Compose (`compose.yaml`), ya trae usuario, contraseña y nombre de BD por defecto del propio recipe de Doctrine — los mismos tres valores que acabás de ver desglosados en `DATABASE_URL`:

```yaml
# compose.yaml
database:
  image: postgres:16-alpine
  environment:
    POSTGRES_DB: app
    POSTGRES_USER: app
    POSTGRES_PASSWORD: '!ChangeMe!'
```

Con el contenedor arriba (`docker compose up -d`), la base ya existe porque Postgres la crea sola al iniciar — no hace falta correr `doctrine:database:create` en este proyecto.

Recién con la conexión resuelta tiene sentido `make:migration` — sin una BD accesible, no hay contra qué comparar el esquema de las Entities.

---

## Bloques {: .topic-title }

| Bloque | Tema | Estado |
|---|---|---|
| 01 | [Entity](01-entity/index.md) | **Hecho** |
| 02 | [Repository y EntityManager](02-repository-entitymanager/index.md) | **Hecho** |
| 03 | [Enums](03-enums/index.md) | **Hecho** |
| 04 | [Relaciones](04-relaciones/index.md) | **Hecho** |

## 📚 Fuentes {: .topic-title }
| Fuente | Enlace |
|---|---|
| 📕 **Apuntes propios** (base de estos temarios — prevalece en caso de conflicto) | Apunts DAW2, Institut Montilivi |
| 📘 **Documentación oficial de Symfony — Doctrine** | [symfony.com/doc/current/doctrine.html](https://symfony.com/doc/current/doctrine.html) |
| 🏫 **Apunts del profesor — Institut Montilivi** | [apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/doctrine](https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/doctrine/) |
| 🎥 **SymfonyCasts — Doctrine, Symfony 7 y la base de datos** (ES, 15 capítulos) | [symfonycasts.com/es/screencast/symfony-doctrine/installing-doctrine](https://symfonycasts.com/es/screencast/symfony-doctrine/installing-doctrine) |
| 🎥 **SymfonyCasts — Configuración de la base de datos** (ES) | [symfonycasts.com/es/screencast/symfony-doctrine/database-setup](https://symfonycasts.com/es/screencast/symfony-doctrine/database-setup) |
