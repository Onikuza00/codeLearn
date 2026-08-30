# 🚨 Repaso urgente — Symfony

> Repaso antes de tocar código. Sale del checkpoint S1 (rehacer el slice de `Product` de memoria), de los fallos **conceptuales** de Formularios (29/08) y del bloque de Servicios (30/08). Mirar esto antes de escribir el primer controlador.
>
> JS / DOM tiene su propia página: [Repaso urgente — JS / DOM](repaso-urgente-js.md).

<style>
.repaso-compact { font-size: .82rem; line-height: 1.45; }
.repaso-compact .admonition { font-size: .8rem; margin-block: .55rem; }
.repaso-compact .admonition > .admonition-title { font-size: .8rem; }
.repaso-compact :is(pre, code) { font-size: .78em; }
.repaso-compact table { font-size: .76rem; }
.repaso-compact :is(ul, ol) { margin-block: .3rem; }
.repaso-compact li + li { margin-top: .15rem; }
.repaso-compact h2 { font-size: 1rem; margin-top: 1.2rem; }
</style>

<div class="repaso-compact" markdown>

## 📊 Prioridad — de más a menos urgente

| Nivel | Patrón | Dónde falló |
|:---:|---|---|
| 🔴 1 | El flujo del controlador `new`/`edit` no sale de memoria | S1 (2 respuestas seguidas mal) |
| 🔴 2 | Tipo PHP vs tipo de columna Doctrine son dos capas | P1 |
| 🔴 3 | Cada nombre corto necesita su `use` con el namespace correcto | P1, P3, P4, S2, D3, D4 |
| 🟠 4 | `redirectToRoute()` recibe el **nombre** de la ruta, no la URL | P4 |
| 🟠 5 | `persist()` solo para lo nuevo; `flush()` siempre | P5, S2 |
| 🟠 6 | Las Constraints van sobre la **entidad**, no el formulario | P2 |
| 🟠 7 | Un objeto no es su representación textual ni un campo suyo | **D1, D4 (30/08)** |
| 🟠 8 | El contrato de la firma se cumple en el cuerpo | **D2, D4 (30/08)** |
| 🟡 9 | Servicio = **transforma**, no valida; su resultado necesita hueco en la entidad | S2, D1 |
| 🟡 10 | Autowiring: servicio por type-hint, escalar con `#[Autowire]` | S2, D3 |
| 🟡 11 | CSRF a mano: la intención y el `name` idénticos en los dos extremos | P10 |
| 🟡 12 | Form sin `data_class`: leer del **form**, no del `Request` | P12 |
| 🟢 13 | Twig: `{% endblock %}`, `{% for X in LISTA %}`, `==` (no `===`) | S2, P7, P9 |
| 🟢 14 | `.env` es de sintaxis estricta: `CLAVE="valor"`, sin espacios | **D3 (30/08)** |

---

!!! danger "🔴 1 · El flujo del controlador `new` / `edit` — de memoria"
    El hueco del checkpoint S1. En dos preguntas seguidas salió `$form = new form()` y `$form->createForm(...)` — las dos mal.

    ```php
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

    **Las tres cosas que se cayeron:**
    1. Un formulario **nunca** se hace con `new`. Sale de `$this->createForm(...)`.
    2. `createForm` solo envuelve la entidad — **`handleRequest` es lo único** que la rellena.
    3. Cualquier cálculo que dependa de los datos (slug, notificar) va **dentro del `if`**, antes del `persist` — nunca antes de `handleRequest`.

    `edit()` cambia **dos** cosas: la entidad llega como argumento (`Product $product`, vía `EntityValueResolver`) en vez de `new Product()`, y al guardar es **`flush()` sin `persist()`**.

    📖 [Formularios → Procesamiento con el controlador](/symfony/00-fundamentos/06-formularios/#los-tres-argumentos-de-createform)

!!! danger "🔴 2 · Tipo PHP vs tipo de columna Doctrine"
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

    El puente: `DECIMAL` ↔ `#[ORM\Column(type: Types::DECIMAL)]` ↔ type-hint `?string`. Dinero **nunca** `float`.

!!! danger "🔴 3 · Cada nombre corto necesita su `use`"
    `use` es de PHP, no de Symfony. Sin él, `LoggerInterface` se resuelve contra el namespace del archivo (`App\Service\LoggerInterface` → no existe → fatal). Reincidió el 30/08 con `Autowire`, `TaskSearchType`, `Task` y `App\Entity\Task` en el notifier.

    - **Lleva `use`:** toda clase / interfaz / atributo cuyo nombre corto escribas. `#[Autowire(...)]` **es** la clase `Autowire` → `use Symfony\Component\DependencyInjection\Attribute\Autowire;`.
    - **No lleva `use`:** primitivos (`string`, `int`, `bool`, `array`), nombres con `\` delante (`\DateTimeImmutable`), clases del mismo namespace.
    - **Gotcha:** `HttpClientInterface` vive en `Symfony\Contracts\HttpClient\…` (Contracts), **no** `Symfony\Component\HttpClient\…`.

    `symfony console debug:autowiring <algo>` da el FQCN entero.

!!! warning "🟠 4 · `redirectToRoute()` recibe el nombre de la ruta"
    ```php
    return $this->redirectToRoute('/tareas');       // ❌ P4 — eso es un path, y encima no existía
    return $this->redirectToRoute('product_index'); // ✅ el NAME del #[Route(name: ...)]
    ```

    Y una acción que redirige a **su propia ruta** es un bucle infinito (`ERR_TOO_MANY_REDIRECTS`).

!!! warning "🟠 5 · `persist()` solo para lo nuevo; `flush()` siempre"
    `persist($x)` = "Doctrine, **empieza a seguir** este objeto nuevo". `flush()` = "sincroniza todo lo que sigues".

    - **Crear:** `persist()` + `flush()`.
    - **Editar:** solo `flush()` — la entidad ya la sigue Doctrine desde que la cargó (dirty checking → UPDATE).
    - **Borrar:** `remove()` + `flush()`.

!!! warning "🟠 6 · Las Constraints van sobre la entidad"
    ```php
    // ❌ P2 — Length(min: 3) sobre un precio no significa nada; y era regla de "name"
    #[Assert\Length(min: 3)]
    private ?string $price = null;
    ```

    Cada constraint tiene que ser **verdad de ese campo**. `price` → `Positive` (>0). `stock` → `PositiveOrZero` (≥0). `NotBlank` rechaza `null` **y** `""`; `NotNull` solo `null`.

!!! warning "🟠 7 · Un objeto no es su representación textual ni un campo suyo · 30/08"
    ```php
    // ❌ D1 — getCreatedAt() devuelve un objeto DateTimeImmutable, no texto
    $ref = "TSK-" . $task->getCreatedAt() . "-" . $hex;

    // ❌ D4 — taskCreated(Task $task) espera la entidad, no su título
    $notifier->taskCreated($task->getTitle());
    ```
    ```php
    // ✅ Dale la forma que pide el type-hint
    $ref = "TSK-" . $task->getCreatedAt()->format('Ymd') . "-" . $hex;
    $notifier->taskCreated($task);
    ```

    El type-hint dice **qué forma** tiene que tener el dato: un `string` se saca con `->format()` / `->value` / `.textContent`; una entidad se pasa entera, no un getter suyo. Primo del fallo 🟢 de JS "un elemento no es el valor que contiene".

!!! warning "🟠 8 · El contrato de la firma se cumple en el cuerpo · 30/08"
    ```php
    // ❌ D2 — la firma promete : array, pero no hay return
    public function resumen(): array
    {
        $total = $this->tasks->count([]);
        // ...calcula todo en variables locales y termina → devuelve null → TypeError
    }

    // ❌ D4 — argumentos del constructor sin `private` → NO se promocionan
    public function __construct(MailerInterface $mail, LoggerInterface $logger) { }
    // luego $this->mailer / $this->logger no existen → Undefined property
    ```
    ```php
    // ✅
    return ['total' => $total, 'pendientes' => $pendientes, 'vencidas' => $vencidas];

    public function __construct(
        private MailerInterface $mailer,
        private LoggerInterface $logger,
    ) { }
    ```

    Lo que promete la cabecera (`: array`, `: string`, promoción con `private`) tiene que cumplirse dentro. Calcular valores en variables locales **no es** devolverlos; un argumento sin `private`/`public` **no se guarda** en el objeto.

!!! tip "🟡 9 · Servicio: transforma, no valida — y su resultado necesita un hueco"
    En S2 la confusión fue: "es un servicio, ¿no necesito getter/setter?". Sí.

    - El servicio (`SlugGenerator`, `ReferenceGenerator`) **produce un dato**. Para guardarlo, la entidad necesita: propiedad `#[ORM\Column]` + `getX()`/`setX()` + **migración**.
    - La lógica no vive en el controlador: el controlador orquesta y delega.
    - El servicio recibe lo que necesita como **argumento del método** y devuelve el resultado — no guarda estado de la petición en propiedades (es compartido).

    📖 [Servicios → Crear un servicio propio](/symfony/01-servicios/#crear-un-servicio-propio)

!!! tip "🟡 10 · Autowiring — servicio vs escalar"
    ```php
    public function __construct(
        private HttpClientInterface $http,          // ✅ servicio/interfaz → automático, sin atributo
        #[Autowire('%env(API_KEY)%')]
        private string $apiKey,                     // ✅ string → el contenedor no adivina, se lo dices
    ) {}
    ```

    Type-hint de clase/interfaz → autowiring lo resuelve solo. Type-hint primitivo (`string`, `int`) → **siempre** `#[Autowire]` (env, `param:`, o literal).

!!! tip "🟡 11 · CSRF a mano — los dos extremos del cable"
    ```twig
    <input type="hidden" name="_token" value="{{ csrf_token('delete-task-' ~ task.id) }}">
    ```
    ```php
    if ($this->isCsrfTokenValid('delete-task-' . $task->getId(), $request->request->get('_token'))) { ... }
    ```

    La **cadena de intención** (`'delete-task-' ~ id`) y el **nombre del campo** (`_token`) tienen que ser idénticos en los dos sitios, o `get('_token')` devuelve `null` y nunca valida. Un `<a>` hace GET sin token — no protege.

!!! tip "🟡 12 · Form sin `data_class` — leer del form, no del `Request`"
    ```php
    $form = $this->createForm(TaskSearchType::class, null, ['method' => 'GET']);
    $form->handleRequest($request);
    $q = $form->get('q')->getData();          // ✅ del form (handleRequest ya lo metió ahí)
    // NO: $request->query->get('q')
    ```

    Sin `data_class` no hay entidad. Un buscador va por **GET** (consulta, no mutación). `createForm()` tiene **3 argumentos**: Type, dato (`null` aquí), opciones.

!!! note "🟢 13 · Twig — lo que se cayó"
    - **`{% block body %}` necesita su `{% endblock %}`** (el error real de S2). Igual que `{% for %}` / `{% endfor %}`.
    - **`{% for X in LISTA %}`** — `X` es cada elemento, `LISTA` la colección. Invertirlo rompe en silencio.
    - **`{% else %}` va dentro del `{% for %}`**, entre el cuerpo y el `{% endfor %}` (empty state).
    - **Twig compara con `==`, nunca `===`**.
    - **Un `{% block %}` es un hueco vacío**: lo de *alrededor* es fijo en todas las hijas; lo de *dentro* lo reemplaza cada hija.

    📖 [Twig](/symfony/00-fundamentos/05-twig/)

!!! note "🟢 14 · `.env` es de sintaxis estricta · 30/08"
    ```env
    ADMIN_EMAIL = "correo@dominio.com"   # ❌ espacios alrededor del = → FormatException al arrancar
    ADMIN_EMAIL="correo@dominio.com"     # ✅ pegado, en su propia línea
    ```

    El parser de Dotenv no admite espacios alrededor del `=` ni después del nombre de la variable. Un `.env.local` mal formado **rompe el arranque entero** de la app, no solo esa variable.

---

!!! check "✅ Checklist Symfony de 60 segundos"
    Antes de dar un controlador o una entidad por terminados:

    - [ ] El flujo: `new` → `createForm` → `handleRequest` → `if (isSubmitted && isValid)` → `persist`+`flush`+`redirect` → `render` en el else. ¿La lógica extra está **dentro del `if`**?
    - [ ] ¿`edit` usa `flush()` **sin** `persist()`, y la entidad llega por type-hint?
    - [ ] ¿`redirectToRoute()` recibe el **nombre** de la ruta? ¿No redirige a sí misma?
    - [ ] Cada nombre de clase / interfaz / atributo, ¿tiene su `use` con el namespace correcto?
    - [ ] Tipos de columna (`decimal`, `text`, `enum`) → **dentro** de `#[ORM\Column(type: ...)]`; el type-hint es un tipo PHP real.
    - [ ] ¿Las Constraints están sobre la **entidad** y cada una es verdad de ese campo?
    - [ ] ¿Le paso a cada método/función la **forma** que pide su type-hint? (objeto → `->format()`/`->value` para texto; entidad entera, no un getter)
    - [ ] ¿El método devuelve lo que promete su firma (`: array` → `return [...]`)? ¿Los argumentos del constructor llevan `private` para promocionarse?
    - [ ] Si un servicio produce un dato, ¿la entidad tiene propiedad + setter + migración?
    - [ ] Argumento escalar de un servicio (`string`, `int`) → ¿lleva `#[Autowire]`?
    - [ ] CSRF: ¿la cadena de intención y el `name="_token"` son idénticos en Twig y en el controlador?
    - [ ] Form sin `data_class`: ¿leo con `$form->get('x')->getData()` y no del `$request`? ¿va por GET?
    - [ ] Twig: ¿cada `{% block %}`/`{% for %}`/`{% if %}` tiene su cierre? ¿comparo con `==`?
    - [ ] `.env` / `.env.local`: ¿`CLAVE="valor"` sin espacios alrededor del `=`, cada una en su línea?
    - [ ] El namespace del archivo, ¿es espejo exacto de su carpeta (PSR-4)?

</div>

## 📖 Teoría Symfony

| Tema | Enlace |
|---|---|
| Entity, tipos de columna | [Doctrine → Entity](/symfony/00-fundamentos/04-doctrine/01-entity/) |
| Repository, EntityManager, QueryBuilder | [Doctrine → Repository](/symfony/00-fundamentos/04-doctrine/02-repository-entitymanager/) |
| Rutas y controllers | [Rutas](/symfony/00-fundamentos/03-rutas/) · [Controllers](/symfony/00-fundamentos/02-controllers/) |
| Formularios (flujo, editar, sin `data_class`, CSRF) | [Formularios](/symfony/00-fundamentos/06-formularios/) |
| Servicios, autowiring, `#[Autowire]`, Twig Extension, utilidades | [Servicios](/symfony/01-servicios/) |
| Twig | [Twig](/symfony/00-fundamentos/05-twig/) |
