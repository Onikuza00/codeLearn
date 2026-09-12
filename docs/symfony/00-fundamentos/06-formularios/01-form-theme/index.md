# Formularios — Form theme { .section-fundamentos }

> `form_row()`, `form_widget()` y compañía generan HTML de fábrica, sin clases de Tailwind ni de nada — solo `<input>`, `<label>` y poco más. Un **form theme** es la forma de decirle a Symfony "cuando generes un campo, usa este HTML en vez del de siempre", para que todos los formularios del proyecto salgan ya maquetados sin repetir clases campo a campo.

---

## Por qué hace falta {: .topic-title }

Symfony renderiza cada formulario llamando a una serie de bloques de Twig (uno para la fila completa, otro para el label, otro para el input...). Esos bloques por defecto viven en `form_div_layout.html.twig`, dentro del propio framework, y no llevan ninguna clase de CSS — están pensados para que cada proyecto los sobreescriba a su gusto.

Un form theme es justo eso: **tu propio archivo Twig que redefine algunos de esos bloques**, con las clases de Tailwind que quieras, para no tener que maquetar cada `<input>` a mano.

## Los bloques que existen {: .topic-title }

| Bloque | Qué genera |
|---|---|
| `form_row` | La fila completa: label + widget + errores |
| `form_label` | El `<label>` |
| `form_widget_simple` | Los inputs "simples" (`text`, `email`, `number`, `textarea`...) |
| `form_errors` | La lista de errores de validación de un campo |

Sobreescribir `form_row`, por ejemplo, cambia cómo se ve **la fila entera** de cualquier campo de cualquier formulario que use ese theme — no hace falta tocar nada más.

## Dos formas de aplicarlo {: .topic-title }

**Global**, para todos los formularios del proyecto — en `config/packages/twig.yaml`:

```yaml
twig:
    form_themes:
        - 'form/tailwind_theme.html.twig'
```

**Local**, solo para una plantilla — al principio del archivo, antes de renderizar el formulario:

```twig
{% form_theme form 'form/tailwind_theme.html.twig' %}

{{ form_start(form) }}
```

!!! tip "¿Cuál elegir?"
    Si todos los formularios del proyecto van a compartir el mismo estilo, la global evita repetir la línea `{% form_theme %}` en cada plantilla. La local sirve para el caso puntual de un formulario que necesita verse distinto al resto.

## Un theme mínimo {: .topic-title }

`templates/form/tailwind_theme.html.twig`:

```twig
{% use 'form_div_layout.html.twig' %}

{% block form_row %}
    <div class="flex flex-col gap-1">
        {{ form_label(form) }}
        {{ form_widget(form) }}
        {{ form_errors(form) }}
    </div>
{% endblock %}

{% block form_widget_simple %}
    {% set attr = attr|merge({class: (attr.class|default('') ~ ' w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sky-500 focus:ring-1 focus:ring-sky-500')|trim}) %}
    {{ parent() }}
{% endblock %}

{% block form_errors %}
    {% if errors|length > 0 %}
        <ul class="text-sm text-red-600">
            {% for error in errors %}
                <li>{{ error.message }}</li>
            {% endfor %}
        </ul>
    {% endif %}
{% endblock %}
```

!!! warning "`{{ parent() }}` en vez de reescribir el `<input>` entero"
    En `form_widget_simple`, la forma segura de añadir clases es meterlas en la variable `attr` y luego llamar a `{{ parent() }}` — eso deja que Symfony siga generando el `type`, `name`, `id` y `value` correctos según el campo (no es lo mismo un `text` que un `number` o un `textarea`). Reescribir el `<input>` a mano desde cero es fácil de dejar incompleto para algún tipo de campo que no sea texto plano.

!!! danger "`{{ parent() }}` exige `{% use %}`, aunque el theme ya esté registrado en `twig.yaml`"
    Registrar el archivo en `form_themes` le dice a Symfony "usa este theme además del de por defecto" — pero **no** basta para que `parent()` funcione dentro de un bloque. Sin la línea `{% use 'form_div_layout.html.twig' %}` al principio del archivo, Twig no sabe de qué plantilla heredar ese bloque y lanza: *"Calling the parent function on a template that does not call extends or use is forbidden"*.

    `{% use %}` no es lo mismo que `{% extends %}`: importa los bloques del theme base para poder llamarlos con `parent()`, sin convertir el archivo en una página completa (no hace falta `{% block body %}` ni nada de HTML alrededor).

## La alternativa: `attr` directo en el `FormType` {: .topic-title }

Para uno o dos campos sueltos, sin crear un archivo de theme, se puede pasar la clase directo al construir el formulario:

```php
$builder->add('title', TextType::class, [
    'attr' => ['class' => 'w-full rounded-md border border-gray-300 px-3 py-2'],
]);
```

Sirve para un caso aislado, pero si son varios formularios (como acá) termina siendo la misma clase repetida en cada `->add()` de cada `FormType` — el theme la escribe una sola vez.

---

## 📚 Fuentes {: .topic-title }

| Fuente | Enlace |
|---|---|
| 📘 **Symfony — Customizing Form Rendering** | [symfony.com/doc/current/form/form_customization.html](https://symfony.com/doc/current/form/form_customization.html) |
