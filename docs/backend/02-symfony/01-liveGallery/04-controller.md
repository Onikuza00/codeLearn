# 01.04 Controller — GaleriaController

**Comando:**
```bash
php bin/console make:controller GaleriaController
```

## Opciones del Maker

| Pregunta | Respuesta | Por qué |
|----------|-----------|---------|
| Controller class name | `GaleriaController` | Nombre descriptivo en español |

## Código

```php
#[Route('/galeria', name: 'app_galeria')]
public function index(ProductRepository $productRepository): Response
{
    $products = $productRepository->findAll();

    return $this->render('galeria/index.html.twig', [
        'productos' => $products,
    ]);
}
```

## Archivos creados por el Maker

- `src/Controller/GaleriaController.php`
- `templates/galeria/index.html.twig`

## Cómo funciona

1. **Ruta** `/galeria` responde a GET
2. **ProductRepository** se inyecta automáticamente (autowiring) — Symfony lo detecta por el type-hint
3. `findAll()` trae todos los productos de la BD
4. Se pasan a la vista como `productos` (array de objetos Product)
5. La vista itera con `{% for %}` y renderiza un `<twig:ImageCard>` por cada uno

## Template de la galería

```twig
{% extends 'base.html.twig' %}

{% block body %}
    {% for producto in productos %}
        <twig:ImageCard :producto="producto" />
    {% endfor %}
{% endblock %}
```

**Clave:** `:producto="producto"` — el `:` delante hace que Symfony interprete `producto` como **variable de Twig**, no como string literal.
