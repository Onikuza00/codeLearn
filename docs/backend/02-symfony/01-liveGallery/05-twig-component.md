# 01.05 Twig Component — ImageCard

**Comando:**
```bash
php bin/console make:twig-component ImageCard
```

## Opciones del Maker

| Pregunta | Respuesta | Por qué |
|----------|-----------|---------|
| Component name | `ImageCard` | Nombre que usaremos en `<twig:ImageCard>` |

## Archivos creados

- `src/Twig/Components/ImageCard.php`
- `templates/components/ImageCard.html.twig`

## Código PHP

```php
#[AsTwigComponent('ImageCard')]
final class ImageCard
{
    public Product $producto;
}
```

- **`#[AsTwigComponent('ImageCard')]`** — atributo PHP 8 que registra el componente. El nombre `ImageCard` es el tag que se usa en Twig
- **`public Product $producto`** — prop que recibe desde afuera. Tipada como `Product`

## Template del componente

```twig
{# templates/components/ImageCard.html.twig #}
<article>
    {% if producto.imageUrl %}
        <img src="{{ producto.imageUrl }}" alt="{{ producto.name }}">
    {% endif %}
    <h2>{{ producto.name }}</h2>
    <p>Precio: {{ producto.price }} €</p>
</article>
```

## Cómo se usa

```twig
<twig:ImageCard :producto="producto" />
```

| Sintaxis | Resultado |
|----------|-----------|
| `:producto="producto"` | Pasa el **objeto** Product |
| `producto="producto"` | Pasa el **string** "producto" |

Los `:` convierten el valor en expresión Twig en vez de string literal.

## Reglas de nombre

- El template **debe** llamarse igual que el componente → `ImageCard.html.twig`
- Symfony busca los templates en `templates/components/` por defecto
- No hace falta importar nada: una vez registrado, está disponible como `<twig:ImageCard />`
