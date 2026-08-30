# LDAP { .section-fundamentos }

> En una empresa, los usuarios no suelen estar en la base de datos de tu aplicación: están en un directorio corporativo. LDAP es el protocolo estándar para consultarlo, y Symfony permite autenticar contra él sin gestionar contraseñas propias.

---

## Instalar el paquete {: .topic-title }

!!! example "💻 Comandos — instalación"
    ```bash
    composer require symfony/ldap
    ```

Requiere además la extensión `ldap` de PHP activada en el servidor.

---

## Qué es y cuándo aparece {: .topic-title }

**LDAP** (*Lightweight Directory Access Protocol*) es un protocolo para consultar servicios de directorio: bases de datos jerárquicas donde las organizaciones guardan usuarios, grupos, equipos e impresoras. Las implementaciones más habituales son **OpenLDAP** y el **Active Directory** de Microsoft.

El escenario típico es este: una empresa ya tiene a todos sus empleados en Active Directory, con sus contraseñas y sus grupos. Una aplicación interna nueva no debe crear otro registro de usuarios ni pedir una contraseña distinta: debe autenticar contra el directorio que ya existe.

!!! info "La ventaja real es que tu aplicación deja de gestionar contraseñas"
    No las guarda, no las hashea, no las restablece. Cuando alguien deja la empresa, se desactiva su cuenta en el directorio y pierde el acceso a todas las aplicaciones a la vez.

    A cambio, tu aplicación depende de que el directorio esté disponible. Si el servidor LDAP cae, nadie entra.

Symfony lo integra en dos niveles:

| Nivel | Para qué |
|---|---|
| Componente `Ldap` | Cliente genérico: conectar, consultar, crear y modificar entradas |
| Integración con Security | Proveedor de usuarios y autenticadores que validan contra el directorio |

---

## Configurar el cliente {: .topic-title }

```yaml
# config/services.yaml
services:
    Symfony\Component\Ldap\Ldap:
        arguments: ['@Symfony\Component\Ldap\Adapter\ExtLdap\Adapter']
        tags:
            - ldap

    Symfony\Component\Ldap\Adapter\ExtLdap\Adapter:
        arguments:
            -   host: mi-servidor
                port: 389
                encryption: tls
                options:
                    protocol_version: 3
                    referrals: false
```

| Opción | Qué indica |
|---|---|
| `host` | Nombre o dirección del servidor |
| `port` | Puerto; `389` sin cifrar, `636` con SSL |
| `encryption` | `ssl`, `tls` o `none` |
| `connection_string` | Alternativa a `host` y `port` (`ldaps://servidor:636`) |
| `options` | Opciones adicionales del protocolo |

!!! danger "Sin cifrado, las contraseñas viajan en claro por la red"
    LDAP en el puerto 389 sin `encryption` transmite las credenciales sin proteger. Cualquiera en la misma red puede leerlas.

    Usa siempre `tls` —que cifra sobre la conexión estándar— o `ssl` con el puerto 636. En un directorio corporativo esto no es opcional.

---

## El proveedor de usuarios {: .topic-title }

Sustituye al proveedor de entidad: en vez de buscar en tu base de datos, busca en el directorio.

```yaml
# config/packages/security.yaml
security:
    providers:
        mi_ldap:
            ldap:
                service: Symfony\Component\Ldap\Ldap
                base_dn: dc=empresa,dc=com
                search_dn: "cn=lector,dc=empresa,dc=com"
                search_password: '%env(LDAP_PASSWORD)%'
                default_roles: ROLE_USER
                uid_key: uid
                extra_fields: ['mail', 'displayName']
```

| Opción | Qué indica |
|---|---|
| `base_dn` | Rama del directorio desde la que se busca |
| `search_dn` | Cuenta de solo lectura que hace la búsqueda |
| `search_password` | Su contraseña |
| `default_roles` | Roles que reciben todos los usuarios del directorio |
| `uid_key` | Atributo que identifica al usuario |
| `extra_fields` | Atributos adicionales a recuperar |
| `filter` | Consulta propia, con `{uid_key}` y `{user_identifier}` |

!!! warning "`uid_key` cambia según el directorio"
    En OpenLDAP suele ser `uid`. En Active Directory es `sAMAccountName` o `userPrincipalName`.

    Poner el que no es produce un error de "usuario no encontrado" para credenciales perfectamente válidas. Es lo primero que hay que comprobar cuando la integración no funciona.

!!! danger "`search_password` nunca va escrita en el YAML"
    Ese fichero está en el repositorio. La contraseña va en variables de entorno, referenciada con `%env(...)%`, igual que las credenciales de la base de datos.

### Roles desde los grupos

Un directorio ya organiza a la gente en grupos, y lo natural es traducirlos a roles:

```yaml
# config/services.yaml
services:
    Symfony\Component\Ldap\Security\MemberOfRoles:
        arguments:
            $mapping:
                admins: 'ROLE_ADMIN'
                users: 'ROLE_USER'
```

```yaml
# config/packages/security.yaml
providers:
    mi_ldap:
        ldap:
            service: Symfony\Component\Ldap\Ldap
            base_dn: dc=empresa,dc=com
            uid_key: uid
            extra_fields: ['ismemberof']
            role_fetcher: Symfony\Component\Ldap\Security\MemberOfRoles
```

Así los permisos se administran en el directorio, no en tu aplicación: añadir a alguien al grupo `admins` le concede `ROLE_ADMIN` sin tocar código ni base de datos.

---

## Autenticar contra el directorio {: .topic-title }

El proveedor solo carga los datos del usuario. Para que la contraseña se valide contra LDAP hay que usar un autenticador específico.

```yaml
security:
    firewalls:
        main:
            provider: mi_ldap
            form_login_ldap:
                service: Symfony\Component\Ldap\Ldap
                dn_string: 'uid={user_identifier},dc=empresa,dc=com'
```

`dn_string` es la plantilla del identificador completo del usuario dentro del directorio; `{user_identifier}` se sustituye por lo que escriba en el formulario.

Para una API o una herramienta interna:

```yaml
security:
    firewalls:
        api:
            stateless: true
            http_basic_ldap:
                service: Symfony\Component\Ldap\Ldap
                dn_string: 'uid={user_identifier},dc=empresa,dc=com'
```

Cuando la estructura del directorio no permite construir el identificador con una simple plantilla, se busca primero:

```yaml
form_login_ldap:
    service: Symfony\Component\Ldap\Ldap
    dn_string: 'dc=empresa,dc=com'
    query_string: '(&(uid={user_identifier})(memberOf=cn=usuarios,ou=Servicios,dc=empresa,dc=com))'
    search_dn: 'cn=lector,dc=empresa,dc=com'
    search_password: '%env(LDAP_PASSWORD)%'
```

Ese filtro hace dos cosas a la vez: localiza al usuario y comprueba que pertenece al grupo autorizado. Quien esté en el directorio pero fuera de ese grupo no entra.

!!! danger "Un directorio que acepta enlaces anónimos convierte cualquier contraseña en válida"
    La autenticación consiste en intentar un *bind* con las credenciales del usuario. Si el servidor está configurado para aceptar enlaces sin autenticar, **una contraseña vacía tendrá éxito** y la aplicación dará por bueno el acceso.

    Es un fallo de configuración del servidor, no de Symfony, pero el agujero acaba en tu aplicación. Comprueba explícitamente que un intento con contraseña vacía se rechaza.

---

## Consultar el directorio {: .topic-title }

Fuera de la autenticación, el componente sirve como cliente general:

```php
use Symfony\Component\Ldap\Ldap;

class DirectorioService
{
    public function __construct(private Ldap $ldap) { }

    public function buscarMantenedores(): array
    {
        $this->ldap->bind('cn=lector,dc=empresa,dc=com', $contrasena);

        $consulta = $this->ldap->query(
            'dc=empresa,dc=com',
            '(&(objectclass=person)(ou=Mantenimiento))'
        );

        return $consulta->execute()->toArray();
    }
}
```

Crear y modificar entradas se hace con el gestor de entradas:

```php
use Symfony\Component\Ldap\Entry;

$entrada = new Entry('cn=Ana Ruiz,dc=empresa,dc=com', [
    'sn' => ['Ruiz'],
    'objectClass' => ['inetOrgPerson'],
]);

$gestor = $this->ldap->getEntryManager();
$gestor->add($entrada);

$entrada->setAttribute('mail', ['ana@empresa.com']);
$gestor->update($entrada);
```

!!! danger "El componente NO escapa lo que le pasas: hay inyección LDAP"
    Es el aviso más importante de la documentación oficial. El componente Security sí escapa los datos cuando usa el proveedor `ldap`, pero **el componente `Ldap` usado directamente no**.

    Concatenar entrada del usuario en un filtro permite alterar la consulta, igual que una inyección SQL:

    ```php
    // ❌ el usuario puede escribir *)(objectClass=* y ver el directorio entero
    $this->ldap->query($baseDn, "(uid=$entradaDelUsuario)");
    ```

    Escapa siempre antes de construir el filtro:

    ```php
    $seguro = $this->ldap->escape($entradaDelUsuario, '', LDAP_ESCAPE_FILTER);
    $this->ldap->query($baseDn, "(uid=$seguro)");
    ```

!!! warning "Los nombres de atributo distinguen mayúsculas por defecto"
    `$entry->getAttribute('mail')` y `$entry->getAttribute('Mail')` no son lo mismo, y los directorios no son consistentes entre sí. `hasAttribute('mail', false)` desactiva esa distinción cuando no controlas cómo vienen escritos.

---

## Buenas prácticas {: .topic-title }

<div class="pros-cons" markdown="1">

| ✅ Haz | ❌ No hagas |
|---|---|
| `encryption: tls` o `ssl` siempre | Puerto 389 sin cifrar con credenciales reales |
| `search_password` en variables de entorno | La contraseña del lector escrita en el YAML |
| Comprobar el `uid_key` del directorio real | Asumir `uid` en un Active Directory |
| `escape()` antes de construir un filtro | Concatenar entrada del usuario en la consulta |
| Cuenta de solo lectura para las búsquedas | Buscar con una cuenta con permisos de escritura |
| Verificar que una contraseña vacía se rechaza | Confiar en que el servidor no acepta enlaces anónimos |
| Mapear grupos a roles con `role_fetcher` | Duplicar la administración de permisos en tu base de datos |

</div>

---

## 📚 Fuentes {: .topic-title }

| Recurso | Link |
|---------|------|
| 🐘 **Symfony — LDAP** | https://symfony.com/doc/current/security/ldap.html |
| 🐘 **Symfony — Security** | https://symfony.com/doc/current/security.html |
