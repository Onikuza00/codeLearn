# 01.03 Fixtures — AppFixtures

**Comando:**
```bash
php bin/console make:fixtures
```

## Opciones del Maker

| Pregunta | Respuesta | Por qué |
|----------|-----------|---------|
| Namespace (App\DataFixtures) | Enter (default) | Dejamos el que Symfony propone |
| Class name | `AppFixtures` | Nombre estándar |

## Datos cargados

6 productos, el último con `imageUrl: ''` para probar la condición `{% if %}` en Twig:

| Producto | Precio | Imagen |
|----------|--------|--------|
| Zapatillas Rojas | 89€ | ✅ |
| Reloj Clásico | 145€ | ✅ |
| Auriculares Bose | 299€ | ✅ |
| Mochila Urbana | 59€ | ✅ |
| Gafas Polarizadas | 99€ | ✅ |
| Pack Calcetines | 19€ | ❌ vacío |

```php
$productos = [
    ['name' => 'Zapatillas Rojas',  'price' => 89,  'imageUrl' => 'https://...', 'likes' => 0],
    ['name' => 'Reloj Clásico',     'price' => 145, 'imageUrl' => 'https://...', 'likes' => 0],
    // ...
    ['name' => 'Pack Calcetines',   'price' => 19,  'imageUrl' => '',            'likes' => 0],
];
```

## Cargar datos en BD

```bash
php bin/console doctrine:fixtures:load
```

## Archivo creado

- `src/DataFixtures/AppFixtures.php`

## Notas

- El 6º producto sin imagen **no es un error**, es intencional para probar que el `<img>` no se renderiza si no hay URL
- Las imágenes son de Unsplash (gratuitas, reales, de producto)
