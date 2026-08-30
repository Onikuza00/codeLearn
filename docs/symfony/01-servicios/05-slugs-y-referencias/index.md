# Slugs y referencias únicas { .section-fundamentos }

> Dos necesidades parecidas: convertir un texto libre en algo apto para una URL (un *slug*), y generar un código legible y único para un pedido, una factura o una tarea. Ambas viven en un servicio, y ambas tienen que resolver el mismo problema: qué pasa cuando el resultado ya existe.

---

## `SluggerInterface` {: .topic-title }

Symfony trae un slugger listo para inyectar (`AsciiSlugger`). Convierte acentos, espacios y símbolos en un texto seguro para URL.

```php
use Symfony\Component\String\Slugger\SluggerInterface;

class ArticleSlugger
{
    public function __construct(
        private SluggerInterface $slugger,
    ) {
    }

    public function fromTitle(string $title): string
    {
        return $this->slugger->slug($title)->lower();
    }
}
```

```php
$slugger->slug('Cómo montar un SaaS en 2026')->lower();   // "como-montar-un-saas-en-2026"
$slugger->slug('Precio: 20 € (IVA incl.)')->lower();       // "precio-20-eur-iva-incl"
```

`slug()` devuelve un objeto `UnicodeString`, por eso el `->lower()` encadenado. Segundo argumento opcional: el separador (`->slug($t, '_')`).

## Slug único frente a colisiones {: .topic-title }

Dos artículos titulados "Novedades" darían el mismo slug. Si el slug es la clave de la URL (`/blog/{slug}`), tiene que ser único. El servicio comprueba contra el repositorio y añade un sufijo si hace falta:

```php
class ArticleSlugger
{
    public function __construct(
        private SluggerInterface $slugger,
        private ArticleRepository $articles,
    ) {
    }

    public function uniqueFromTitle(string $title, ?int $ignoreId = null): string
    {
        $base = $this->slugger->slug($title)->lower();
        $slug = $base;
        $i = 2;

        while ($this->existsForOther($slug, $ignoreId)) {
            $slug = $base . '-' . $i;   // "novedades", "novedades-2", "novedades-3"...
            $i++;
        }

        return $slug;
    }

    private function existsForOther(string $slug, ?int $ignoreId): bool
    {
        $found = $this->articles->findOneBy(['slug' => $slug]);

        return $found !== null && $found->getId() !== $ignoreId;
    }
}
```

El `$ignoreId` es para editar: al re-guardar un artículo que ya tiene ese slug, no debe chocar consigo mismo.

## Referencias tipo pedido o factura {: .topic-title }

Un código para enseñar al usuario (`FAC-20260830-4F2A`, `TSK-000173`). Dos estrategias:

**Con parte aleatoria** — no hace falta consultar la BD, la probabilidad de choque es mínima:

```php
class ReferenceGenerator
{
    public function forInvoice(\DateTimeInterface $date): string
    {
        return sprintf(
            'FAC-%s-%s',
            $date->format('Ymd'),
            strtoupper(bin2hex(random_bytes(2))),   // 2 bytes → 4 caracteres hex
        );
    }
}
```

**Correlativa** (`FAC-000001`, `FAC-000002`...) — más limpia, pero necesita un contador y cuidado con la concurrencia:

```php
public function nextInvoiceNumber(): string
{
    $last = $this->invoices->createQueryBuilder('i')
        ->orderBy('i.id', 'DESC')
        ->setMaxResults(1)
        ->getQuery()
        ->getOneOrNullResult();

    $n = $last ? $last->getId() + 1 : 1;

    return sprintf('FAC-%06d', $n);   // %06d → rellena con ceros a 6 dígitos
}
```

!!! warning "El número correlativo y la concurrencia"
    Si dos peticiones piden `nextInvoiceNumber()` a la vez, las dos pueden leer el mismo "último" y generar el mismo código. Para numeración correlativa de verdad (facturación legal) hace falta una tabla de contador con bloqueo, o delegar en una secuencia de la base de datos. Para un código interno de seguimiento, la versión con parte aleatoria evita el problema entero.

!!! tip "Guarda la referencia, no la recalcules"
    La referencia se genera **una vez**, al crear la entidad, y se guarda en una columna propia. No la derives al vuelo cada vez que la muestras: si el formato cambia el año que viene, los registros viejos tienen que seguir enseñando su código original.

## 📚 Fuentes {: .topic-title }
| Fuente | Enlace |
|---|---|
| 📘 **Symfony — The String Component** | [symfony.com/doc/current/string.html](https://symfony.com/doc/current/string.html) |
| 📘 **Symfony — Slugger** | [symfony.com/doc/current/components/string.html#slugger](https://symfony.com/doc/current/components/string.html#slugger) |
| 📘 **PHP — `random_bytes`** | [php.net/manual/es/function.random-bytes.php](https://www.php.net/manual/es/function.random-bytes.php) |
