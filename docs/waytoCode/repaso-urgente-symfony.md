# 🚨 Repaso urgente — Symfony

> Repaso antes de rehacer desde 0. Sale del checkpoint S1 (rehacer el slice de `Product` de memoria) y de los fallos **conceptuales** de la card de Formularios del 29/08. Mirar esto antes de escribir el primer controlador.
>
> JS / DOM tiene su propia página: [Repaso urgente — JS / DOM](repaso-urgente-js.md).

---

## 📊 Prioridad — de más a menos urgente

| Nivel | Patrón | Dónde falló |
|:---:|---|---|
| 🔴 1 | El flujo del controlador `new`/`edit` no sale de memoria | S1 (2 respuestas seguidas mal) |
| 🔴 1 | Tipo PHP vs tipo de columna Doctrine son dos capas | P1 |
| 🔴 1 | Cada nombre corto necesita su `use` con el namespace correcto | P1, P3, P4, S2 |
| 🟠 2 | `redirectToRoute()` recibe el **nombre** de la ruta, no la URL | P4 |
| 🟠 2 | `persist()` solo para lo nuevo; `flush()` siempre | P5, S2 |
| 🟠 2 | Las Constraints van sobre la **entidad**, no el formulario | P2 |
| 🟡 3 | Servicio = **transforma**, no valida; su resultado necesita hueco en la entidad | S2 |
| 🟡 3 | Autowiring: servicio por type-hint, escalar con `#[Autowire]` | S2 |
| 🟡 3 | CSRF a mano: la intención y el `name` idénticos en los dos extremos | P10 |
| 🟡 3 | Form sin `data_class`: leer del **form**, no del `Request` | P12 |
| 🟢 4 | Twig: `{% endblock %}`, `{% for X in LISTA %}`, `==` (no `===`) | S2, P7, P9 |
| 🟢 4 | Un `{% block %}` es un hueco: lo de fuera es fijo | P6 |
| 🟢 4 | PSR-4: el namespace es espejo exacto de la carpeta | S2 (`App\Services` vs `src/Service/`) |

---

## 🔴 1. El flujo del controlador `new` / `edit` — de memoria

El hueco del checkpoint S1. En dos preguntas seguidas salió `$form = new form()` y `$form->createForm(...)` — las dos mal.

```php
// ✅ La secuencia, sin hueco
$product = new Product();                                 // getName() → null
$form = $this->createForm(ProductType::class, $product);  // solo ENVUELVE. getName() sigue null
$form->handleRequest($request);                           // GET → sigue null | POST → AHORA rellena la entidad

if ($form->isSubmitted() && $form->isValid()) {           // isSubmitted primero: && corta en un GET
    // cualquier lógica que use datos del form va AQUÍ (slug, notificar...)
    $em->persist($product);                               // solo entidades nuevas
    $em->flush();
    $this->addFlash('success', '...');
    return $this->redirectToRoute('product_index');       // nombre de ruta · Post/Redirect/Get
}

return $this->render('product/new.html.twig', ['form' => $form]);  // misma línea para GET y POST-inválido
```

!!! danger "Las tres cosas que se cayeron"
    1. Un formulario **nunca** se hace con `new`. Sale de `$this->createForm(...)`.
    2. `createForm` solo envuelve la entidad — **`handleRequest` es lo único** que la rellena con lo que envió el usuario.
    3. Cualquier cálculo que dependa de los datos (generar un slug, notificar) va **dentro del `if`**, antes del `persist` — nunca antes de `handleRequest`.

`edit()` cambia **dos** cosas frente a `new()`: la entidad llega como argumento (`Product $product`, vía `EntityValueResolver`) en vez de `new Product()`, y al guardar es **`flush()` sin `persist()`**.

📖 [Formularios → Procesamiento con el controlador](/symfony/00-fundamentos/06-formularios/#los-tres-argumentos-de-createform)

---

## 🔴 2. Tipo PHP vs tipo de columna Doctrine

```php
// ❌ P1 — decimal y TEXT no son tipos de PHP
private ?decimal $price = null;
private ?TEXT $description = null;
```

```php
// ✅ El tipo de columna va DENTRO del atributo; el type-hint es un tipo PHP real
use Doctrine\DBAL\Types\Types;

#[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
private ?string $price = null;        // DECIMAL vuelve como string (no perder precisión)

#[ORM\Column(type: Types::TEXT)]
private ?string $description = null;
```

!!! tip "El puente"
    `DECIMAL` ↔ `#[ORM\Column(type: Types::DECIMAL)]` ↔ type-hint `?string`. Dinero **nunca** `float` (errores de céntimo al operar).

---

## 🔴 3. Cada nombre corto necesita su `use`

`use` es de PHP, no de Symfony. Sin él, `LoggerInterface` se resuelve contra el namespace del archivo (`App\Service\LoggerInterface` → no existe → fatal).

- **Lleva `use`:** toda clase / interfaz / atributo cuyo nombre corto escribas. `#[Autowire(...)]` **es** la clase `Autowire` → `use Symfony\Component\DependencyInjection\Attribute\Autowire;`.
- **No lleva `use`:** primitivos (`string`, `int`, `bool`, `array`), nombres con `\` delante (`\DateTimeImmutable`), clases del mismo namespace.
- **Gotcha:** `HttpClientInterface` vive en `Symfony\Contracts\HttpClient\…` (Contracts), **no** `Symfony\Component\HttpClient\…`.

`symfony console debug:autowiring <algo>` te da el FQCN entero.

---

## 🟠 4. `redirectToRoute()` recibe el nombre de la ruta

```php
return $this->redirectToRoute('/tareas');       // ❌ P4 — eso es un path, y encima no existía
return $this->redirectToRoute('product_index'); // ✅ el NAME del #[Route(name: ...)]
```

Y una acción que redirige a **su propia ruta** es un bucle infinito (`ERR_TOO_MANY_REDIRECTS`).

---

## 🟠 5. `persist()` solo para lo nuevo; `flush()` siempre

`persist($x)` = "Doctrine, **empieza a seguir** este objeto nuevo". `flush()` = "sincroniza todo lo que sigues" (calcula los INSERT/UPDATE/DELETE).

- **Crear:** `persist()` + `flush()`.
- **Editar:** solo `flush()` — la entidad ya la sigue Doctrine desde que la cargó (dirty checking → UPDATE).
- **Borrar:** `remove()` + `flush()` (`remove` es el opuesto de `persist`).

---

## 🟠 6. Las Constraints van sobre la entidad

```php
// ❌ P2 — Length(min: 3) sobre un precio no significa nada; y era regla de "name"
#[Assert\Length(min: 3)]
private ?string $price = null;
```

Cada constraint tiene que ser **verdad de ese campo**. `price` → `Positive` (>0). `stock` → `PositiveOrZero` (≥0). `NotBlank` rechaza `null` **y** `""`; `NotNull` solo `null`.

---

## 🟡 7. Servicio: transforma, no valida — y su resultado necesita un hueco

En S2 la confusión fue: "es un servicio, ¿no necesito getter/setter?". Sí.

- El servicio (`SlugGenerator`, `ReferenceGenerator`) **produce un dato**. Para guardarlo, la entidad necesita: propiedad `#[ORM\Column]` + `getX()`/`setX()` + **migración**.
- La lógica no vive en el controlador: el controlador orquesta y delega en el servicio.
- El servicio recibe lo que necesita como **argumento del método** y devuelve el resultado — no guarda estado de la petición en propiedades (es compartido).

📖 [Servicios → Crear un servicio propio](/symfony/00-fundamentos/07-servicios/#crear-un-servicio-propio)

---

## 🟡 8. Autowiring — servicio vs escalar

```php
public function __construct(
    private HttpClientInterface $http,          // ✅ servicio/interfaz → automático, sin atributo
    #[Autowire('%env(API_KEY)%')]
    private string $apiKey,                     // ✅ string → el contenedor no adivina, se lo dices
) {}
```

Type-hint de una clase/interfaz → autowiring lo resuelve solo. Type-hint primitivo (`string`, `int`) → **siempre** `#[Autowire]` (env, `param:`, o literal).

---

## 🟡 9. CSRF a mano — los dos extremos del cable

```twig
<input type="hidden" name="_token" value="{{ csrf_token('delete-task-' ~ task.id) }}">
```
```php
if ($this->isCsrfTokenValid('delete-task-' . $task->getId(), $request->request->get('_token'))) { ... }
```

La **cadena de intención** (`'delete-task-' ~ id`) y el **nombre del campo** (`_token`) tienen que ser idénticos en los dos sitios, o `get('_token')` devuelve `null` y nunca valida. Un `<a>` hace GET sin token — no protege.

---

## 🟡 10. Form sin `data_class` — leer del form, no del `Request`

```php
$form = $this->createForm(TaskSearchType::class, null, ['method' => 'GET']);
$form->handleRequest($request);
$q = $form->get('q')->getData();          // ✅ del form (handleRequest ya lo metió ahí)
// NO: $request->query->get('q')
```

Sin `data_class` no hay entidad. Un buscador va por **GET** (consulta, no mutación). `createForm()` tiene **3 argumentos**: Type, dato (`null` aquí), opciones.

---

## 🟢 11. Twig — lo que se cayó

- **`{% block body %}` necesita su `{% endblock %}`** (el error real de S2). Igual que `{% for %}` / `{% endfor %}`.
- **`{% for X in LISTA %}`** — `X` es cada elemento, `LISTA` la colección. Invertirlo rompe en silencio.
- **`{% else %}` va dentro del `{% for %}`**, entre el cuerpo y el `{% endfor %}` (empty state).
- **Twig compara con `==`, nunca `===`** (`===` es de JS/PHP).
- **Un `{% block %}` es un hueco vacío**: lo que está *alrededor* es fijo en todas las plantillas hijas; lo de *dentro* lo reemplaza cada hija. Si querés que `<main class="...">` sea permanente, va alrededor y el bloque dentro.

📖 [Twig](/symfony/00-fundamentos/05-twig/)

---

## ✅ Checklist Symfony de 60 segundos

Antes de dar un controlador o una entidad por terminados:

- [ ] El flujo: `new` → `createForm` → `handleRequest` → `if (isSubmitted && isValid)` → `persist`+`flush`+`redirect` → `render` en el else. ¿La lógica extra está **dentro del `if`**?
- [ ] ¿`edit` usa `flush()` **sin** `persist()`, y la entidad llega por type-hint?
- [ ] ¿`redirectToRoute()` recibe el **nombre** de la ruta? ¿No redirige a sí misma?
- [ ] Cada nombre de clase / interfaz / atributo que escribí, ¿tiene su `use` con el namespace correcto?
- [ ] Tipos de columna (`decimal`, `text`, `enum`) → **dentro** de `#[ORM\Column(type: ...)]`; el type-hint es un tipo PHP real.
- [ ] ¿Las Constraints están sobre la **entidad** y cada una es verdad de ese campo?
- [ ] Si un servicio produce un dato, ¿la entidad tiene propiedad + setter + migración para guardarlo?
- [ ] Argumento escalar de un servicio (`string`, `int`) → ¿lleva `#[Autowire]`?
- [ ] CSRF: ¿la cadena de intención y el `name="_token"` son idénticos en Twig y en el controlador?
- [ ] Form sin `data_class`: ¿leo con `$form->get('x')->getData()` y no del `$request`? ¿va por GET?
- [ ] Twig: ¿cada `{% block %}`/`{% for %}`/`{% if %}` tiene su cierre? ¿comparo con `==`?
- [ ] El namespace del archivo, ¿es espejo exacto de su carpeta?

---

## 📖 Teoría Symfony

| Tema | Enlace |
|---|---|
| Entity, tipos de columna | [Doctrine → Entity](/symfony/00-fundamentos/04-doctrine/01-entity/) |
| Repository, EntityManager, QueryBuilder | [Doctrine → Repository](/symfony/00-fundamentos/04-doctrine/02-repository-entitymanager/) |
| Rutas y controllers | [Rutas](/symfony/00-fundamentos/03-rutas/) · [Controllers](/symfony/00-fundamentos/02-controllers/) |
| Formularios (flujo, editar, sin `data_class`, CSRF) | [Formularios](/symfony/00-fundamentos/06-formularios/) |
| Servicios, autowiring, `#[Autowire]`, Twig Extension | [Servicios](/symfony/00-fundamentos/07-servicios/) |
| Twig | [Twig](/symfony/00-fundamentos/05-twig/) |
