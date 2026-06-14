# 01.01 Entity — Product

**Comando:**
```bash
php bin/console make:entity Product
```

## Opciones del Maker

| Pregunta | Respuesta | Por qué |
|----------|-----------|---------|
| New property name | `name` | Nombre del producto |
| Field type | `string` | Texto corto |
| Length | `255` | Suficiente para un nombre |
| Can be null? | `no` | Todo producto tiene nombre |
| New property name | `price` | Precio del producto |
| Field type | `float` | Decimal con centavos |
| Can be null? | `no` | Todo producto tiene precio |
| New property name | `imageUrl` | URL de la imagen |
| Field type | `string` | Una URL es texto |
| Length | `500` | Algunas URLs son largas |
| Can be null? | `no` | Puede ir vacío pero no null |
| New property name | `likes` | Sistema de me gusta |
| Field type | `integer` | Número entero |
| Can be null? | `no` | Empieza en 0, nunca null |
| Add another? | `no` | Terminamos |

## Código generado

```php
#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    private ?int $id = null;
    private ?string $name = null;
    private ?float $price = null;
    private ?string $imageUrl = null;
    private int $likes = 0;
    // + getters/setters
}
```

## Archivos creados

- `src/Entity/Product.php`
- `src/Repository/ProductRepository.php`

## Notas

- `$likes` es `int` (no `?int`) porque **nunca es null** — empieza en 0 siempre
- `$imageUrl` es `?string` (nullable) para cuando no haya imagen, pero en fixtures le ponemos `''` vacío en vez de null
