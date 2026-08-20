# Twig { .section-fundamentos }

> Twig es el motor de plantillas de Symfony: separa la lógica (controller) de la presentación (HTML). No es PHP — es un lenguaje propio, más simple y más seguro, que se compila a PHP por detrás.

---

## Instalar el paquete {: .topic-title }

!!! example "💻 Comandos — instalación"
    ```bash
    composer require symfony/twig-bundle
    ```

## Sintaxis {: .topic-title }

Tres delimitadores, ningún otro:

```twig
{{ variable }}      {# imprime un valor #}
{% if condicion %}  {# ejecuta lógica: if, for, block... #}
{# comentario #}     {# no llega al HTML final #}
```

## Estructuras de control {: .topic-title }

`if`/`elseif`/`else`, así se ve ya en tu propio `ImageCard.html.twig`:

```twig
{% if producto.imageUrl %}
    <img src="{{ producto.imageUrl }}">
{% endif %}
```

```twig
{% if producto.stock > 10 %}
    Disponible
{% elseif producto.stock > 0 %}
    Solo quedan {{ producto.stock }}
{% else %}
    Agotado
{% endif %}
```

### Comprobar si una variable existe: `is defined`

Antes de usar una variable que puede o no existir en el contexto (por ejemplo, un campo de formulario que solo se añade en ciertas condiciones), `is defined` comprueba su existencia SIN tirar error si no está — a diferencia de acceder directo, que rompería la plantilla entera:

```twig
{% if formulario.campoOpcional is defined %}
    {{ form_row(formulario.campoOpcional) }}
{% endif %}
```

!!! tip "`is defined` no es lo mismo que `is null` o `is empty`"
    `is defined` pregunta "¿existe esta variable en absoluto?". `is null` pregunta "¿existe, pero su valor es `null`?" (la variable YA tiene que existir para preguntar esto sin error). `is empty` pregunta "¿está vacía?" (string `""`, array `[]`, `0`, `null`, `false` — todos cuentan como vacíos). Son tres preguntas distintas, para tres situaciones distintas.

`for`, con `{% else %}` opcional para el caso vacío — así se ve en tu `galeria/index.html.twig`:

```twig
{% for producto in productos %}
    <twig:ImageCard :producto="producto" />
{% else %}
    <p>No hay productos.</p>
{% endfor %}
```

Dentro de cualquier `for`, la variable especial `loop` da contexto de la vuelta actual:

| Variable | Qué es |
|---|---|
| `loop.index` | Número de vuelta, empezando en 1 |
| `loop.first` / `loop.last` | `true` en la primera / última vuelta |
| `loop.length` | Total de elementos que recorre el loop |

## Renderización {: .topic-title }

`$this->render()` recibe dos argumentos: la ruta de la plantilla y un array asociativo con las variables:

```php
return $this->render('galeria/index.html.twig', ['productos' => $productos]);
```

Convención de nombres: `snake_case` + doble extensión `.html.twig`. Las plantillas viven en `templates/`.

## Tipos de variables {: .topic-title }

**`app`** — variable global disponible en cualquier plantilla, sin pasarla desde el controlador:

| Variable | Qué trae |
|---|---|
| `app.user` | El usuario autenticado, o `null` |
| `app.request` | La petición actual — `{{ app.request.uri }}` |
| `app.session` | La sesión — `{{ app.session.get('clave') }}` |

**Notación de punto** (`producto.name`) — accede a propiedades y a métodos indistintamente, probando en este orden hasta que uno funcione:

```twig
{{ producto.name }}
```

1. Propiedad pública (`$producto->name`)
2. Getter (`getName()`, `isName()`, `hasName()`)
3. Método público (`$producto->name()`)

Por eso `producto.name` en Twig llama solo a `getName()` de la Entity — nunca accede a la propiedad privada directamente.

## Enlaces dinámicos {: .topic-title }

`path()` genera la URL a partir del **nombre** de la ruta — nunca se escribe la URL literal:

```twig
<a href="{{ path('producto_show', {id: producto.id}) }}">Ver producto</a>
```

`url()` hace lo mismo pero devuelve la URL **absoluta** (`https://...`), útil para emails o sitemaps — `path()` siempre es relativa.

## Herencia — `extends` y `block` {: .topic-title }

Una plantilla base define huecos (`block`); las hijas heredan todo y solo rellenan esos huecos. Así se ve en tu propio `galeria/index.html.twig`:

```twig
{% extends 'base.html.twig' %}

{% block title %}Hello GaleriaController!{% endblock %}

{% block body %}
    {% for producto in productos %}
        {# ... #}
    {% endfor %}
{% endblock %}
```

Todo lo que no esté dentro de un `{% block %}` de la hija simplemente no se usa — el resto del HTML (`<head>`, scripts, footer...) lo pone la base.

## Include {: .topic-title }

Reutiliza un fragmento Twig completo dentro de otro, pasando variables explícitamente:

```twig
{% include 'components/_alert.html.twig' with {mensaje: '¡Guardado!'} %}
```

Diferencia con `extends`: `include` mete un trozo pequeño en un punto cualquiera de la plantilla; `extends` hereda la estructura entera de otra.

## Filtros útiles {: .topic-title }

Se aplican con `|`, encadenables:

| Filtro | Qué hace | Ejemplo |
|---|---|---|
| `upper` / `lower` | Mayúsculas / minúsculas | `{{ 'pau'|upper }}` → `PAU` |
| `length` | Longitud de string o array | `{{ nombre|length }}` |
| `date('d/m/Y')` | Formatea una fecha | `{{ creado|date('d/m/Y') }}` |
| `default('valor')` | Valor de respaldo si es `null`/vacío | `{{ apodo|default('Anónimo') }}` |
| `raw` | Desactiva el auto-escape — imprime HTML tal cual | `{{ html_de_confianza|raw }}` |
| `join(', ')` | Une un array en un string | `{{ tags|join(', ')}}` |

`raw` es el único peligroso: Twig escapa todo por defecto (auto-escape, previene XSS) — usarlo solo con contenido que controlás vos, nunca con input de usuario.

## Gestión de assets {: .topic-title }

`asset()` genera la ruta pública correcta a CSS/JS/imágenes, gestionadas por AssetMapper desde `assets/`:

```twig
<link rel="stylesheet" href="{{ asset('styles/app.css') }}">
```

## 📚 Fuentes {: .topic-title }
| Fuente | Enlace |
|---|---|
| 📕 **Apuntes propios** (base de estos temarios — prevalece en caso de conflicto) | `Symfony.pdf` — apunts DAW2, sección 3 |
| 📘 **Documentación oficial de Symfony — Templates** | [symfony.com/doc/current/templates.html](https://symfony.com/doc/current/templates.html) |
| 📘 **Documentación oficial de Twig** | [twig.symfony.com/doc/3.x](https://twig.symfony.com/doc/3.x/) |
| 🏫 **Apunts del profesor — Institut Montilivi** | [apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/plantilles](https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/plantilles/) |
| 🎥 **SymfonyCasts — Codificación cósmica con Symfony 7** (ES, cap. 5 "Twig y plantillas") | [symfonycasts.com/es/screencast/symfony/twig](https://symfonycasts.com/es/screencast/symfony/twig) |
