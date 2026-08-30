# El usuario y los proveedores { .section-fundamentos }

> Symfony no impone una entidad `User`: impone un **contrato**. Cualquier clase que implemente `UserInterface` sirve como usuario, y un *proveedor* es lo que sabe dónde encontrarla.

---

## Generar con MakerBundle {: .topic-title }

!!! example "💻 Comandos — MakerBundle"
    ```bash
    symfony console make:user
    ```

El comando pregunta cuatro cosas:

1. **Nombre de la clase** — por convención, `User`.
2. **¿Guardar en base de datos?** — `yes` si es una entidad de Doctrine.
3. **Propiedad que identifica al usuario** — `email` o `username`. Debe ser única.
4. **¿Se guardan contraseñas?** — `yes` salvo que autentiques por otro medio.

---

## La entidad `User` {: .topic-title }

```php
namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private ?string $email = null;

    /** @var list<string> */
    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column]
    private ?string $password = null;

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';   // todo usuario tiene al menos este

        return array_unique($roles);
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }
}
```

!!! warning "`user` es una palabra reservada en varias bases de datos"
    Por eso el maker genera `#[ORM\Table(name: '`user`')]` con acentos graves alrededor. En PostgreSQL, y en algunas configuraciones de MySQL, una tabla llamada `user` sin escapar produce un error de sintaxis al crear el esquema.

    No quites esos acentos graves aunque parezcan un error de escritura.

---

## Las dos interfaces {: .topic-title }

| Interfaz | Qué obliga a implementar | Cuándo hace falta |
|---|---|---|
| `UserInterface` | `getUserIdentifier()`, `getRoles()`, `eraseCredentials()` | **Siempre** |
| `PasswordAuthenticatedUserInterface` | `getPassword()` | Solo si hay contraseñas |

La segunda es independiente a propósito: un usuario que entra por enlace mágico, por certificado o por un token de API no tiene contraseña, y no debería verse obligado a fingir que la tiene.

### `getUserIdentifier()`

Devuelve el texto que identifica de forma única al usuario. Es lo que se guarda en la sesión y lo que se usa para volver a cargarlo en la petición siguiente.

!!! danger "El identificador debe ser único e inmutable"
    Si usas el correo como identificador y un usuario lo cambia, su sesión deja de resolver: en la siguiente petición Symfony busca un usuario con el correo antiguo, no lo encuentra y lo expulsa.

    Tienes dos opciones: forzar el cierre de sesión al cambiar el correo, o usar como identificador algo que no cambie nunca —un `uuid`— y dejar el correo como un campo más.

### `getRoles()`

Devuelve el array de roles. Fíjate en que el método **añade `ROLE_USER` a mano** antes de devolver: eso garantiza que cualquier usuario autenticado tenga ese rol aunque su columna en la base de datos esté vacía.

!!! warning "Todos los roles empiezan por `ROLE_`"
    Es una regla del componente, no una convención de estilo. Un valor como `ADMIN` o `admin` no se trata como rol y las comprobaciones fallarán en silencio.

### `eraseCredentials()`

Servía para borrar de la memoria datos sensibles —típicamente la contraseña en claro— después de autenticar. En Symfony 7.3 está **marcado como obsoleto** y el maker lo genera vacío con el atributo `#[\Deprecated]`.

En su lugar se usa `__serialize()`, que el maker también genera, para controlar qué se guarda en la sesión:

```php
public function __serialize(): array
{
    $data = (array) $this;
    // solo un resumen de la contraseña, no la contraseña entera
    $data["\0".self::class."\0password"] = hash('crc32c', $this->password);

    return $data;
}
```

Ese resumen permite a Symfony detectar que la contraseña cambió y cerrar las sesiones antiguas, sin guardar el hash completo en la sesión.

---

## Los proveedores {: .topic-title }

Un **proveedor de usuarios** es lo que sabe cargar un usuario a partir de su identificador. Se configura en `security.yaml`, y `make:user` lo escribe por ti:

```yaml
# config/packages/security.yaml
security:
    providers:
        app_user_provider:
            entity:
                class: App\Entity\User
                property: email
```

`property` es el campo con el que se busca, y tiene que coincidir con lo que devuelve `getUserIdentifier()`.

### Tipos disponibles

| Tipo | De dónde carga | Cuándo se usa |
|---|---|---|
| `entity` | Base de datos, vía Doctrine | El caso normal |
| `ldap` | Un directorio corporativo | Empresa con Active Directory u OpenLDAP |
| `memory` | Escritos en el propio YAML | Pruebas y prototipos |
| `chain` | Varios proveedores encadenados | Usuarios de dos orígenes distintos |

```yaml
# En memoria: rápido para probar, nunca para producción
providers:
    usuarios_de_prueba:
        memory:
            users:
                admin: { password: '$2y$13$...', roles: ['ROLE_ADMIN'] }

# Encadenado: busca primero en la base de datos, luego en LDAP
providers:
    combinado:
        chain:
            providers: ['app_user_provider', 'mi_ldap']
```

!!! info "La configuración por defecto trae `users_in_memory` vacío"
    El `security.yaml` recién instalado incluye `users_in_memory: { memory: null }`. Es un marcador de posición para que la aplicación arranque antes de que exista ninguna entidad.

    En cuanto ejecutas `make:user`, el maker añade el proveedor de entidad y cambia el cortafuegos para que lo use. Si tras crear el usuario el acceso sigue fallando, comprueba que `provider:` dentro del cortafuegos apunta a `app_user_provider` y no al de memoria.

### Consulta personalizada

Cuando cargar al usuario requiere algo más que buscar por un campo —por ejemplo, excluir a los desactivados—, se apunta a un método del repositorio:

```yaml
providers:
    app_user_provider:
        entity:
            class: App\Entity\User
            property: email
```

```php
// src/Repository/UserRepository.php
public function findOneByEmailActivo(string $email): ?User
{
    return $this->createQueryBuilder('u')
        ->andWhere('u.email = :email')
        ->andWhere('u.activo = true')
        ->setParameter('email', $email)
        ->getQuery()
        ->getOneOrNullResult();
}
```

Se enlaza sustituyendo `property` por `managerName` y un método propio, o implementando `UserProviderInterface` en una clase propia cuando la lógica crece.

---

## Registrar usuarios {: .topic-title }

Crear un usuario es crear una entidad normal, con un paso obligatorio: **la contraseña se guarda hasheada, nunca en claro**.

```php
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

public function registro(
    Request $request,
    EntityManagerInterface $em,
    UserPasswordHasherInterface $hasher
): Response {
    $user = new User();
    $form = $this->createForm(RegistroType::class, $user);
    $form->handleRequest($request);

    if ($form->isSubmitted() && $form->isValid()) {
        $user->setPassword(
            $hasher->hashPassword($user, $form->get('plainPassword')->getData())
        );

        $em->persist($user);
        $em->flush();

        return $this->redirectToRoute('app_login');
    }

    return $this->render('registro.html.twig', ['form' => $form]);
}
```

!!! danger "El campo de contraseña del formulario NO se mapea a la entidad"
    El formulario recoge la contraseña en claro, pero la entidad guarda el hash. Si el campo se mapea directamente, la contraseña en claro acaba escrita en la base de datos.

    Por eso el campo se declara con `'mapped' => false` y se lee con `$form->get('plainPassword')->getData()`:

    ```php
    ->add('plainPassword', PasswordType::class, [
        'mapped' => false,
        'constraints' => [new Length(min: 8)],
    ])
    ```
    Es el mismo motivo por el que la validación de longitud va en el campo del formulario y no en la entidad: la entidad solo ve un hash de sesenta caracteres, sobre el que una regla de longitud no significa nada.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `make:user` antes de tocar `security.yaml` a mano | Escribir el proveedor a mano y olvidarte del cortafuegos |
| Identificador único e inmutable | Usar como identificador un campo que el usuario puede cambiar |
| Dejar que `getRoles()` añada `ROLE_USER` | Confiar en que la columna de roles nunca esté vacía |
| Prefijo `ROLE_` en todos los roles | `admin` o `ADMIN` sin prefijo |
| `'mapped' => false` en el campo de contraseña | Mapear la contraseña en claro a la entidad |
| Mantener los acentos graves en `` `user` `` | Quitarlos por parecer un error |

</div>

---

## 📚 Fuentes {: .topic-title }

| Recurso | Link |
|---------|------|
| 🐘 **Symfony — The User** | https://symfony.com/doc/current/security.html#the-user |
| 📙 **Institut Montilivi — Seguretat** | https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/seguretat/ |
