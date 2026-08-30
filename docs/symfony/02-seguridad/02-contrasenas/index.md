# Contraseñas { .section-fundamentos }

> Una contraseña nunca se guarda: se guarda su **hash**, un resumen del que no se puede volver atrás. Symfony elige el algoritmo, gestiona la sal y permite migrar a uno mejor sin pedirle nada al usuario.

---

## Instalar el paquete {: .topic-title }

!!! example "💻 Comandos — instalación"
    ```bash
    composer require symfony/password-hasher
    ```

Viene incluido con `symfony/security-bundle`, así que normalmente ya está.

## Generar con MakerBundle {: .topic-title }

!!! example "💻 Comandos — MakerBundle"
    ```bash
    symfony console security:hash-password       # calcula un hash de forma interactiva
    echo "$PASSWORD" | symfony console security:hash-password --no-interaction -
    ```

Sirve para generar el hash de un usuario de prueba que vas a escribir a mano en un *fixture* o en un proveedor en memoria.

---

## Hash, no cifrado {: .topic-title }

Es la distinción de fondo, y conviene tenerla clara antes de tocar la configuración.

**Cifrar** es reversible: con la clave correcta se recupera el original. **Hashear** no lo es: del resumen no se puede volver al texto.

Por eso el sistema nunca "recupera" tu contraseña. Cuando inicias sesión, hashea lo que has escrito y compara los dos resúmenes. Y por eso un "recordatorio de contraseña" que te envía la tuya por correo es una señal de que están guardadas mal.

!!! info "La sal ya no es cosa tuya"
    La **sal** es un valor aleatorio que se añade a cada contraseña antes de hashear, para que dos usuarios con la misma contraseña no produzcan el mismo hash.

    Los algoritmos modernos —bcrypt y sodium— la generan y la guardan **dentro del propio hash**. No hay que crear una columna `salt` ni gestionarla; los tutoriales que lo hacen son anteriores a 2018.

---

## Configuración {: .topic-title }

```yaml
# config/packages/security.yaml
security:
    password_hashers:
        Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface: 'auto'
```

La clave es una clase o interfaz, y el valor el algoritmo. Apuntar a la interfaz cubre cualquier clase de usuario del proyecto; apuntar a `App\Entity\User` permite configuraciones distintas por clase.

### Los algoritmos

| Algoritmo | Longitud del hash | Notas |
|---|---|---|
| `auto` | Variable | **La opción recomendada**: elige el mejor disponible |
| `bcrypt` | 60 caracteres | Sólido y muy extendido; opción `cost` de 4 a 31 |
| `sodium` | 96 caracteres | Argon2, resistente a ataques con tarjetas gráficas |
| `pbkdf2_sha256` | — | Obsoleto; solo para leer hashes antiguos |

```yaml
security:
    password_hashers:
        App\Entity\User:
            algorithm: 'bcrypt'
            cost: 13
```

`cost` es el número de rondas: cada incremento **duplica** el tiempo de cálculo. Eso protege contra ataques de fuerza bruta, porque probar millones de combinaciones se vuelve inviable.

!!! tip "Usa `auto` salvo que tengas un motivo concreto"
    `auto` selecciona hoy bcrypt y cambiará solo cuando aparezca algo mejor, sin que tengas que tocar nada. Fijar el algoritmo a mano te obliga a estar pendiente de la evolución criptográfica.

    Si lo usas, reserva `varchar(255)` para la columna: la longitud del hash puede cambiar si el algoritmo cambia, y una columna de 60 caracteres deja de valer.

!!! warning "Baja el coste en el entorno de pruebas"
    Con `cost: 13`, cada hash tarda unos cientos de milisegundos. En una batería de tests que crea decenas de usuarios, eso son minutos de espera por nada.

    ```yaml
    when@test:
        security:
            password_hashers:
                Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface:
                    algorithm: auto
                    cost: 4          # el mínimo de bcrypt
                    time_cost: 3     # el mínimo de argon
                    memory_cost: 10
    ```
    Solo afecta al entorno de pruebas: producción mantiene su coste real.

---

## Hashear y verificar {: .topic-title }

```php
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class RegistroController extends AbstractController
{
    public function registro(UserPasswordHasherInterface $hasher): Response
    {
        $user = new User();

        $user->setPassword(
            $hasher->hashPassword($user, $contrasenaEnClaro)
        );

        // ... persistir
    }
}
```

Verificar a mano solo hace falta fuera del proceso de acceso —por ejemplo, al pedir la contraseña para confirmar el borrado de una cuenta—:

```php
if (!$hasher->isPasswordValid($user, $contrasenaEnClaro)) {
    throw new AccessDeniedHttpException();
}
```

!!! info "El cortafuegos ya verifica por ti"
    En el acceso normal no llamas a `isPasswordValid()`: el autenticador del cortafuegos lo hace por dentro. Si te encuentras verificando la contraseña a mano en un controlador de acceso, es señal de que estás reimplementando algo que el componente ya hace.

`hashPassword()` recibe el usuario como primer argumento, no solo la contraseña. Es intencionado: así puede aplicar una configuración distinta según la clase del usuario.

---

## Migrar a otro algoritmo {: .topic-title }

Este es el mecanismo más útil del componente, y el menos conocido.

Cuando heredas un proyecto con hashes antiguos —MD5, SHA-1, o bcrypt con un coste bajo—, no puedes recalcularlos: no tienes las contraseñas originales. Lo que sí puedes es **actualizar cada hash en el momento en que su dueño inicia sesión**.

```yaml
security:
    password_hashers:
        legacy:
            algorithm: sha256
            encode_as_base64: false
            iterations: 1

        App\Entity\User:
            algorithm: sodium
            migrate_from:
                - bcrypt
                - legacy
```

El comportamiento es este:

- Los usuarios nuevos se hashean con `sodium`.
- Los antiguos se verifican con el algoritmo viejo y, si la contraseña es correcta, **se rehashean con el nuevo** y se guarda el resultado.

Para que ese guardado ocurra, el repositorio tiene que implementar `PasswordUpgraderInterface`:

```php
namespace App\Repository;

use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function upgradePassword(
        PasswordAuthenticatedUserInterface $user,
        string $newHashedPassword
    ): void {
        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->flush();
    }
}
```

!!! danger "Sin `PasswordUpgraderInterface`, la migración no se guarda"
    Symfony calcula el hash nuevo y lo descarta, porque nadie le ha dicho cómo persistirlo. La aplicación funciona —el acceso sigue siendo correcto— pero la migración no avanza nunca y los hashes viejos se quedan ahí para siempre.

    No hay ningún error ni aviso. Es un fallo silencioso, y solo se detecta mirando la base de datos.

    `make:user` genera este método automáticamente. Si el repositorio es anterior, hay que añadirlo a mano.

---

## Hashear algo que no es un usuario {: .topic-title }

A veces hay que guardar un secreto que no pertenece a una entidad `User`: un código de recuperación, un token de invitación. Para eso se declara un *hasher* con nombre y se inyecta:

```yaml
security:
    password_hashers:
        codigo_recuperacion: 'auto'
```

```php
use Symfony\Component\DependencyInjection\Attribute\Target;
use Symfony\Component\PasswordHasher\PasswordHasherInterface;

public function __construct(
    #[Target('codigo_recuperacion')]
    private PasswordHasherInterface $hasher,
) { }

public function generar(): void
{
    $hash = $this->hasher->hash($tokenEnClaro);      // hash(), no hashPassword()
    $valido = $this->hasher->verify($hash, $tokenEnClaro);
}
```

La diferencia de nombres importa: `hashPassword()`/`isPasswordValid()` trabajan sobre un usuario; `hash()`/`verify()` sobre una cadena suelta.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `algorithm: 'auto'` | Fijar el algoritmo sin una razón concreta |
| `varchar(255)` en la columna de contraseña | Ajustarla a los 60 caracteres de bcrypt |
| Bajar el coste con `when@test` | Tests que tardan minutos por el hasheo |
| Implementar `PasswordUpgraderInterface` al migrar | Configurar `migrate_from` y no persistir nada |
| Dejar que el cortafuegos verifique en el acceso | Comprobar la contraseña a mano en el controlador de login |
| Confiar la sal al algoritmo | Crear una columna `salt` propia |
| `hash()`/`verify()` para secretos que no son usuarios | Forzar una entidad `User` para guardar un token |

</div>

---

## 📚 Fuentes {: .topic-title }

| Recurso | Link |
|---------|------|
| 🐘 **Symfony — Hashing and Verifying Passwords** | https://symfony.com/doc/current/security/passwords.html |
| 🐘 **Symfony — Security** | https://symfony.com/doc/current/security.html |
