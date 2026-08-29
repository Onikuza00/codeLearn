# Formularios { .section-fundamentos }

> El componente Form automatiza todo el ciclo de vida de un formulario: renderizado de campos, validación de datos y mapeo automático a un objeto (normalmente una entidad).

---

## Instalar el paquete {: .topic-title }

El componente Form no viene de fábrica — hay que traerlo con Composer:

!!! example "💻 Comandos — instalación"
    ```bash
    composer require symfony/form
    ```

## Generar con MakerBundle {: .topic-title }

La forma más rápida de crear un formulario es con el maker:

!!! example "💻 Comandos — MakerBundle"
    ```bash
    symfony console make:form   # [MakerBundle] crea una clase FormType en src/Form/
    ```

## `make:form` paso a paso {: .topic-title }

A diferencia de `make:entity`, aquí no hay un loop campo por campo — si vinculas el formulario a una clase, el maker lee sus propiedades y genera los campos solo:

1. **Nombre de la clase del formulario** — pregunta *"The name of the form class (e.g. `GentleGiraffeType`)"*. Por convención termina siempre en `Type` (`TareaType`).
2. **¿Vincular a una clase?** — *"Do you want to bind this form to a class? (yes/no)"*.
   - **Sí** → pregunta *"For which model class does this form build?"* (ej. `\App\Entity\Tarea`) y genera automáticamente un campo `->add()` por cada propiedad pública/mapeada de esa clase, con el tipo de campo que mejor encaja según el tipo de dato.
   - **No** → genera la clase vacía, con `buildForm()` sin campos — los añadís a mano.
3. Genera el archivo en `src/Form/` y, si se vinculó a una clase, deja `data_class` ya puesto en `configureOptions()`.

| Prompt | Respuesta (ej. formulario de `Tarea`) |
|---|---|
| The name of the form class | `TareaType` |
| Do you want to bind this form to a class? | `yes` |
| For which model class does this form build? | `\App\Entity\Tarea` |

Reconstruido, así queda el resultado — antes de tocar nada a mano:

```php
use App\Entity\Tarea;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TareaType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('titulo')
            ->add('fechaLimite')
            ->add('done');
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Tarea::class,
        ]);
    }
}
```

A partir de aquí se ajustan los tipos de campo y las opciones a mano — el maker adivina un tipo por defecto, pero no siempre es el que quieres.

## `configureOptions()` {: .topic-title }

Es el mecanismo de configuración global del formulario: define los valores por defecto que afectan a todo el `Type`. Recibe un único argumento, `OptionsResolver` — un objeto de Symfony pensado para definir, validar y establecer valores por defecto de las opciones del formulario.

```php
public function configureOptions(OptionsResolver $resolver): void
{
    $resolver->setDefaults([
        'data_class' => Tarea::class, // vincula el formulario a la entidad
        'esAdmin' => false,           // opción personalizada propia, no viene de Symfony
    ]);
}
```

`data_class` es la opción clave: le dice a Symfony a qué entidad pertenecen los campos, y habilita el mapeo automático campo → propiedad. Además de las opciones que trae Symfony, se pueden añadir opciones propias (como `esAdmin`) para leerlas después dentro de `buildForm()`.

## `buildForm()` {: .topic-title }

Define el constructor del formulario: qué campos aparecen, con qué tipo y con qué opciones. Recibe las opciones resueltas en `configureOptions()` como segundo parámetro — aunque no se usen, ese segundo parámetro es obligatorio en la firma del método.

```php
public function buildForm(FormBuilderInterface $builder, array $options): void
{
    // Las opciones personalizadas definidas en configureOptions() llegan aquí
    $esAdmin = $options['esAdmin'] ?? false;

    $builder
        ->add('titulo', TextType::class, [
            'label' => 'Título',
            'disabled' => $esAdmin,
            'required' => true,
        ])
        ->add('fechaLimite', DateType::class)
        ->add('guardar', SubmitType::class);
}
```

`add()` recibe tres argumentos — solo el tercero es opcional:

| Argumento | Qué es |
|---|---|
| 1º | Nombre exacto de la propiedad de la entidad |
| 2º | Tipo de campo, siempre con `::class` (ej. `TextType::class`) |
| 3º | Array de opciones para ese campo (opcional) |

### Tipos de campo más comunes

`TextType`, `TextareaType`, `EmailType`, `PasswordType`, `HiddenType`, `IntegerType`, `NumberType`, `MoneyType`, `DateType`, `TimeType`, `DateTimeType`, `FileType`, `CheckboxType`, `RadioType`, `ChoiceType`, `EntityType`, `CollectionType`, `SubmitType`, `ButtonType`.

!!! tip "Cada tipo de campo se importa aparte"
    Cada tipo que uses hay que importarlo explícitamente (`use Symfony\Component\Form\Extension\Core\Type\TextType;`, `...\DateType;`, etc.) — el mismo principio de namespaces que ya viste con `OptionsResolver`. Olvidar el `use` de un tipo nuevo (por ejemplo al cambiar `TextType` por `DateType`) da un error de clase no encontrada, no un fallo silencioso.

    PHP no tiene un `use` comodín que importe TODO un paquete de golpe (a diferencia de `import *` en JS) — pero sí existe el **`use` agrupado** (desde PHP 7), para no repetir el namespace completo en cada línea cuando usas varios tipos del mismo sitio:

    ```php
    use Symfony\Component\Form\Extension\Core\Type\{
        TextType,
        SubmitType,
        ChoiceType,
    };
    ```

    Sigue siendo obligatorio nombrar cada tipo que realmente uses — solo agrupa la sintaxis, no importa el paquete entero.

### Opciones del tercer argumento

| Opción | Qué hace |
|---|---|
| `label` | Texto de la etiqueta del campo (`'label' => 'Nombre:'`) |
| `choice_label` | Propiedad de la entidad relacionada a mostrar como texto del desplegable (`ChoiceType`/`EntityType`) |
| `mapped` | Si es `false`, el campo NO se vincula a ninguna propiedad de la entidad — útil para un campo de "confirmar contraseña" |
| `data` | Valor inicial por defecto, sobrescribe el valor que traiga la entidad |
| `required` | Si el campo es obligatorio (validación HTML) |
| `empty_data` | Valor por defecto si el campo se deja vacío |
| `disabled` | Si es `true`, el campo se muestra deshabilitado, no editable |
| `help` | Texto de ayuda debajo del campo (`'help' => 'Escribe un título breve'`) |
| `choices` | Lista de opciones como `clave => valor` (`['Pendiente' => 0, 'Hecho' => 1]`) |
| `expanded` | `true` → radio buttons/checkboxes; `false` → `<select>` |
| `attr` | Array de atributos HTML: `class`, `placeholder`, `maxlength`, `min`, `rows`, `readonly`, `autofocus`, `pattern`, `autocomplete`... |

`attr` es a su vez un array, así que se combinan varios atributos HTML en la misma opción:

```php
'attr' => [
    'class' => 'form-control',
    'placeholder' => 'Escribe el título...',
    'maxlength' => 100,
    'autocomplete' => 'off',
],
```

!!! tip "Un campo `disabled` no llega en el envío"
    Un campo con `disabled: true` no forma parte de los datos que Symfony procesa al enviar el formulario — el navegador ni siquiera lo incluye en el `POST`. Es útil para *mostrar* un valor de solo lectura, pero si necesitas que ese valor persista al guardar, tiene que venir ya puesto en la entidad de antemano (por ejemplo con `data`), no esperar a que llegue "deshabilitado" desde el formulario.

!!! tip "Un campo `mapped: false` no se autorrellena en la entidad"
    Al marcar `mapped: false` (típico en "confirmar contraseña"), Symfony deja de escribir ese valor en la entidad automáticamente — tienes que leerlo tú a mano en el controlador con `$form->get('nombreCampo')->getData()` y decidir qué hacer con él (compararlo, hashearlo, etc.).

## Constraints {: .topic-title }

Reglas que deben cumplir los datos para considerarse válidos. Se definen directamente en las propiedades de la **entidad** — el listado completo de Constraints, cómo se declaran y cómo personalizar los mensajes de error ya está en [Doctrine → Entity → Validator](../04-doctrine/01-entity/index.md#validator-constraints-sobre-la-entity). Aquí solo lo que cambia al usarlas **a través de un formulario**:

!!! tip "La validación corre sola dentro de `handleRequest()`"
    A diferencia de validar una entidad "a mano" (inyectando `ValidatorInterface` y llamando `$validator->validate($entity)`), con un formulario no hace falta llamar a nada: `$form->handleRequest($request)` ya dispara la validación internamente sobre la entidad recién rellenada. `isValid()` no valida nada en ese momento — solo pregunta si la validación que ya corrió encontró errores. Por eso el orden es siempre `isSubmitted() && isValid()`, nunca al revés.

## Renderizado en Twig {: .topic-title }

En el controlador, `createForm()` crea el formulario a partir del `Type` y lo vincula a una instancia de la entidad; `createView()` lo convierte en un objeto ligero y seguro para pasar a Twig:

```php
use App\Entity\Tarea;
use App\Form\TareaType;

public function crear(Request $request, EntityManagerInterface $em): Response
{
    $tarea = new Tarea();
    $form = $this->createForm(TareaType::class, $tarea);

    return $this->render('tarea/crear.html.twig', [
        'formularioTarea' => $form->createView(),
    ]);
}
```

En la plantilla, tres funciones de Twig especializadas pintan el HTML:

```twig
{# templates/tarea/crear.html.twig #}
{% extends 'base.html.twig' %}
{% block body %}
    <h1>Crear tarea</h1>
    {{ form_start(formularioTarea) }}
        {{ form_widget(formularioTarea) }}
    {{ form_end(formularioTarea) }}
{% endblock %}
```

| Función | Qué hace |
|---|---|
| `form_start(form)` | Renderiza la etiqueta de apertura `<form>` |
| `form_widget(form)` | Renderiza TODOS los campos visibles definidos en el `Type` |
| `form_end(form)` | Renderiza los campos ocultos y cierra `</form>` |

!!! tip "Ese campo oculto incluye el token CSRF"
    Entre los "campos ocultos" que renderiza `form_end()` va, por defecto, un token CSRF — Symfony lo genera y lo valida solo, sin que tengas que tocar nada. Es la razón por la que nunca hay que reemplazar `form_end()` por HTML a mano sin más: perderías esa protección salvo que la reimplementes tú mismo.

`form_widget(form)` es rápido pero no da control fino sobre cómo se ve cada campo. Para eso existe el renderizado individual, campo por campo, con `form_row`:

```twig
{{ form_start(formularioTarea) }}
    <div class="row">
        <div class="col-md-6">
            {{ form_row(formularioTarea.title) }} {# label + input + errores #}
        </div>
        <div class="col-md-6">
            {{ form_row(formularioTarea.fechaLimite) }}
        </div>
    </div>
    {{ form_row(formularioTarea.guardar) }}
{{ form_end(formularioTarea) }}
```

`form_row` no es una función aparte — es un atajo que llama, en orden, a tres funciones más pequeñas: `form_label()`, `form_widget()` (aquí sí aplicado a UN campo, no a todo el formulario) y `form_errors()`. Si necesitas más control todavía (por ejemplo, meter el label y el input en `<div>` distintos), las llamas tú por separado en vez de `form_row`:

```twig
<div class="label-wrapper">{{ form_label(formularioTarea.title) }}</div>
<div class="input-wrapper">
    {{ form_widget(formularioTarea.title) }}
    {{ form_errors(formularioTarea.title) }}
</div>
```

El `label` (y el resto de opciones) normalmente se define UNA sola vez, en `buildForm()` — `form_row` ya lo usa solo, sin que haga falta repetirlo en la plantilla. `form_row` también acepta un segundo argumento opcional para el caso EXCEPCIONAL de sobrescribir esa opción solo en ese renderizado puntual (por ejemplo, si reutilizas el mismo `Type` en dos plantillas distintas y en una necesitas un texto diferente, sin cambiar la clase para todos los usos):

```twig
{{ form_row(formularioTarea.title, {label: 'Título de la tarea', attr: {class: 'input-grande'}}) }}
```

!!! tip "`form_errors(formularioTarea)` sin campo: errores globales"
    Los `form_row`/`form_errors` de cada campo solo muestran los errores DE ESE campo. Si una constraint falla a nivel de la entidad completa (no de una propiedad concreta, ej. `UniqueEntity` sobre toda la clase), ese error no aparece en ningún campo — hay que renderizarlo aparte con `{{ form_errors(formularioTarea) }}` (sin `.campo`), normalmente justo después de `form_start()`.

## Procesamiento con el controlador {: .topic-title }

El mismo método que crea el formulario también lo procesa.

### Los tres argumentos de `createForm()`

`$this->createForm()` acepta tres argumentos; solo el primero es obligatorio:

| # | Argumento | Para qué |
|---|---|---|
| 1 | `TareaType::class` | Qué formulario construir. |
| 2 | La entidad (`$tarea`) o `null` | El dato al que se ata el formulario: precarga los campos y recibe los valores enviados. Con `data_class` se pasa la entidad; sin `data_class` (un buscador) se pasa `null`. Por defecto `null`. |
| 3 | Array de opciones | `method`, `action`, opciones propias declaradas en `configureOptions()` (como `is_edit`), `csrf_protection`… Por defecto `[]`. |

Estos tres argumentos son lo que cambia entre **crear** (`new Tarea()` como 2º), **editar** (la entidad ya cargada) y **buscar** (`null` + `['method' => 'GET']`, ver [Formulario sin entidad](#formulario-sin-entidad)).

### El flujo sobre `$form`

Una vez creado, el procesamiento se basa en tres llamadas sobre el objeto `$form`:

| Método | Qué hace |
|---|---|
| `handleRequest($request)` | Comprueba si la petición actual es un envío del formulario (normalmente `POST`) y, si lo es, rellena la entidad con los datos recibidos |
| `isSubmitted()` | `true` si el usuario envió el formulario — primera comprobación antes de procesar nada |
| `isValid()` | `true` si se cumplen todas las Constraints definidas en la entidad |

```php
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Tarea;
use App\Form\TareaType;

#[Route('/tareas/crear', name: 'tarea_crear')]
public function crear(Request $request, EntityManagerInterface $em): Response
{
    $tarea = new Tarea();
    $form = $this->createForm(TareaType::class, $tarea);
    $form->handleRequest($request);

    if ($form->isSubmitted() && $form->isValid()) {
        $em->persist($tarea);
        $em->flush();

        $this->addFlash('success', 'Tarea creada correctamente.');
        return $this->redirectToRoute('app_tareas'); // evita el reenvío del formulario
    }

    // Si no se envió, o hay errores: se renderiza el formulario y Twig muestra los errores
    return $this->render('tarea/crear.html.twig', [
        'formularioTarea' => $form->createView(),
    ]);
}
```

!!! info "`persist()` solo para entidades nuevas; `flush()` siempre"
    `persist($tarea)` no guarda nada — le dice a Doctrine *"empieza a seguir este objeto, es nuevo y todavía no está en la base de datos"*. `flush()` es el que ejecuta: mira todo lo que Doctrine está siguiendo, calcula los `INSERT`/`UPDATE`/`DELETE` necesarios y los lanza en una transacción.

    Por eso al **crear** hacen falta los dos, pero al **editar** una entidad que viene de la base de datos solo hace falta `flush()`: esa entidad ya la sigue Doctrine desde que la cargó, y detecta los cambios de propiedades por su cuenta (*dirty checking*). Llamar a `persist()` sobre ella no hace daño, pero sobra.

!!! tip "Post/Redirect/Get: por qué el `redirectToRoute()` no es opcional"
    Tras guardar con éxito, redirigir (en vez de renderizar directamente una vista de confirmación) no es una cuestión de estilo — es el patrón **Post/Redirect/Get**. Sin la redirección, el navegador recuerda ese `POST` como la "última petición" de esa pestaña: si el usuario pulsa F5, el navegador reenvía el mismo formulario otra vez, duplicando la tarea en la base de datos. Al redirigir a una ruta `GET`, un F5 posterior repite esa `GET` (inofensiva), nunca el `POST` original.

## Editar: el mismo formulario para crear y actualizar {: .topic-title }

El `Type` no distingue entre crear y editar — el mismo `TareaType` sirve para las dos cosas. Lo único que cambia es de dónde sale la entidad que se le pasa a `createForm()`:

- **Crear:** `new Tarea()` — un objeto vacío. El formulario nace sin valores.
- **Editar:** una `Tarea` ya cargada de la base de datos. El formulario nace **relleno con sus valores actuales**, sin hacer nada extra.

En el controlador de edición, la entidad llega por el type-hint gracias al `EntityValueResolver` (ver [Doctrine → ParamConverter / EntityValueResolver](../04-doctrine/02-repository-entitymanager/index.md#paramconverter)) — no hay que buscarla a mano:

```php hl_lines="2 4 8"
#[Route('/tareas/{id}/editar', name: 'tarea_editar', methods: ['GET', 'POST'])]
public function editar(Tarea $tarea, Request $request, EntityManagerInterface $em): Response
{
    $form = $this->createForm(TareaType::class, $tarea); // $tarea ya trae sus datos → el form nace relleno
    $form->handleRequest($request);

    if ($form->isSubmitted() && $form->isValid()) {
        $em->flush(); // sin persist(): Doctrine ya sigue a $tarea desde que la cargó

        return $this->redirectToRoute('app_tareas');
    }

    return $this->render('tarea/crear.html.twig', [ // se puede reutilizar la misma plantilla
        'formularioTarea' => $form->createView(),
    ]);
}
```

Diferencias respecto a `crear()`, resaltadas arriba: la entidad es un parámetro (no un `new`), y se guarda con `flush()` a secas.

!!! tip "El `methods: ['GET', 'POST']` no es opcional aquí"
    La acción de editar sirve dos peticiones distintas: en `GET` muestra el formulario ya relleno, en `POST` procesa el envío. Si solo declaras `methods: ['POST']`, entrar a la URL desde el navegador (que es un `GET`) devuelve un `405 Method Not Allowed` y nunca llegas a ver el formulario.

## Formulario sin entidad {: .topic-title }

No todo formulario mapea a una entidad. Un buscador, un filtro, un "contactar" que solo manda un email — recogen datos sueltos que no se guardan como fila. Para eso, el `Type` se crea **sin `data_class`**:

```php
class TareaBusquedaType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('texto', TextType::class, ['required' => false, 'label' => false])
            ->add('buscar', SubmitType::class);
    }

    // configureOptions se queda vacío: sin data_class
}
```

Sin `data_class`, `$form->getData()` devuelve un **array asociativo** (`['texto' => 'symfony']`) en vez de un objeto hidratado. El valor de cada campo se lee con `$form->get('nombre')->getData()`:

```php
#[Route('/tareas', name: 'app_tareas')]
public function index(Request $request, TareaRepository $repo): Response
{
    $form = $this->createForm(TareaBusquedaType::class, null, ['method' => 'GET']);
    $form->handleRequest($request);

    $texto = $form->get('texto')->getData();
    $tareas = $texto
        ? $repo->findByTituloLike($texto)
        : $repo->findAll();

    return $this->render('tarea/index.html.twig', [
        'tareas' => $tareas,
        'formularioBusqueda' => $form->createView(),
    ]);
}
```

!!! tip "Un buscador va por `GET`, no por `POST`"
    `['method' => 'GET']` en `createForm()` hace que el formulario envíe por `GET`: los datos van en la URL (`?tarea_busqueda[texto]=symfony`), la búsqueda se puede compartir y guardar en favoritos, y un F5 no reenvía nada. `POST` es para lo que cambia estado; una consulta no lo hace.

## Borrar con CSRF a mano {: .topic-title }

Un enlace de borrado (`<a href="/tareas/5/borrar">`) tiene dos problemas: hace `GET` (que no debe cambiar estado) y no lleva token CSRF — cualquier web podría incrustar ese enlace y disparar el borrado con tu sesión. La solución es un mini-formulario de un solo botón, con el token puesto a mano:

```twig
<form method="post" action="{{ path('tarea_borrar', { id: tarea.id }) }}">
    <input type="hidden" name="_token" value="{{ csrf_token('borrar' ~ tarea.id) }}">
    <button>Borrar</button>
</form>
```

- `csrf_token('borrar' ~ tarea.id)` genera un token para una **intención** — el string `'borrar' ~ tarea.id` (`~` concatena en Twig). Meter la id en la intención evita que un token válido para una tarea sirva para borrar otra.
- Ese `<button>` **sí es semánticamente correcto**: es una acción sobre esta página (enviar el formulario), no navegación a otra.

En el controlador se valida esa misma intención antes de tocar la base de datos:

```php
#[Route('/tareas/{id}/borrar', name: 'tarea_borrar', methods: ['POST'])]
public function borrar(Request $request, Tarea $tarea, EntityManagerInterface $em): Response
{
    if ($this->isCsrfTokenValid('borrar' . $tarea->getId(), $request->request->get('_token'))) {
        $em->remove($tarea);
        $em->flush();
    }

    return $this->redirectToRoute('app_tareas');
}
```

!!! warning "La intención tiene que ser idéntica en los dos sitios"
    `'borrar' ~ tarea.id` en Twig y `'borrar' . $tarea->getId()` en PHP tienen que producir exactamente el mismo string. Y el `name` del `<input>` (`_token`) tiene que coincidir con lo que lee el controlador (`$request->request->get('_token')`) — son los dos extremos del mismo cable. Si algo no cuadra, `isCsrfTokenValid()` devuelve `false` siempre y el borrado nunca ocurre.

    `remove()` marca la entidad para borrar (el opuesto simétrico de `persist()`); `flush()` ejecuta el `DELETE`.

## 📚 Fuentes {: .topic-title }
| Fuente | Enlace |
|---|---|
| 📕 **Apuntes propios** (base de estos temarios — prevalece en caso de conflicto) | `Symfony.pdf` — apunts DAW2, sección 5 |
| 📘 **Documentación oficial de Symfony — Forms** | [symfony.com/doc/current/forms.html](https://symfony.com/doc/current/forms.html) |
| 🏫 **Apunts del profesor — Institut Montilivi** | [apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/formularis](https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/formularis/) |
