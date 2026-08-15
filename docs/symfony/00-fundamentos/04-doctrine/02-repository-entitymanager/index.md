# Doctrine — Repository y EntityManager { .section-fundamentos }

> Con la Entity ya mapeada (ver [Entity](../01-entity/index.md)), toca la parte activa: guardar datos con el EntityManager y consultarlos con el Repository.

---

## El EntityManager {: .topic-title }

Gestiona el ciclo de vida completo de las entidades — crear, actualizar, borrar, buscar. No está disponible solo: hay que **inyectarlo** en el controlador o servicio con `EntityManagerInterface` (autowiring), igual que un Repository.

Tiene cuatro métodos principales:

| Método | Qué hace |
|---|---|
| `persist($entity)` | Marca una entidad **nueva** para guardar — solo la prepara, no ejecuta nada todavía |
| `flush()` | Ejecuta de verdad todo lo pendiente (lo marcado con `persist`/`remove`, o modificado) |
| `remove($entity)` | Marca una entidad **existente** para borrar — solo la prepara, igual que `persist()` |
| `find($className, $id)` | Busca una entidad ya guardada, directamente por clase + id, sin pasar por el Repository |

**Cómo se inyecta** — el `use` del namespace, y el parámetro tipado en el controlador:

```php
// use Doctrine\ORM\EntityManagerInterface; — inyectado como EntityManagerInterface $entityManager
public function crear(EntityManagerInterface $entityManager): Response
{
    $entityManager->persist($product);   // prepara el guardado
    $entityManager->flush();             // ejecuta el INSERT real
}
```

`persist()`, `flush()` y `remove()` son **exclusivos del EntityManager** — el Repository nunca los tiene, porque su trabajo es solo consultar, no modificar.

## El Repository {: .topic-title }

`ServiceEntityRepository` trae cinco métodos ya hechos, sin escribir SQL:

| Método | Devuelve |
|---|---|
| `find($id)` | Un objeto (o `null`) — busca por clave primaria |
| `findOneBy(['campo' => $valor])` | Un objeto (o `null`) — busca por cualquier propiedad |
| `findBy(['campo' => $valor])` | Un array de objetos que cumplen la condición |
| `findAll()` | Un array con todos los registros de la tabla |
| `count(['campo' => $valor])` | Un entero — cuántos registros cumplen la condición (sin traerlos) |

```php
// use App\Repository\ProductRepository; — inyectado como ProductRepository $productRepository
$productRepository->find(3);
$productRepository->findOneBy(['name' => 'Zapatillas']);
$productRepository->findBy(['likes' => 0], orderBy: ['name' => 'ASC']);
$productRepository->findAll();
$productRepository->count(['likes' => 0]);
```

**Dos formas de llegar al Repository** — inyectándolo directamente (lo de arriba), o vía el EntityManager con `getRepository()`, útil cuando ya tenés el EntityManager inyectado por otro motivo y no querés añadir un parámetro más:

```php
$repository = $entityManager->getRepository(Product::class);
$product = $repository->find(3);
```

## QueryBuilder {: .topic-title }

```php
// src/Repository/ProductRepository.php
class ProductRepository extends ServiceEntityRepository
{
    // ... constructor ...

    public function findByNameLike(string $texto): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.name LIKE :texto')
            ->setParameter('texto', '%' . $texto . '%')
            ->orderBy('p.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
```

Línea por línea, qué hace y para qué sirve cada una:

| Línea | Qué hace | Para qué sirve |
|---|---|---|
| `public function findByNameLike(string $texto): array` | Declara un método normal de PHP, con el nombre que vos elijas | El "punto de entrada" — así lo vas a llamar desde fuera: `$productRepository->findByNameLike(...)` |
| `$this->createQueryBuilder('p')` | Arranca una consulta nueva sobre `Product` (la Entity de este Repository) | `'p'` es un **alias**: a partir de aquí, cada línea siguiente se refiere a esa consulta como `p` — es exactamente el `SELECT p FROM Product p` |
| `->where('p.name LIKE :texto')` | Añade la condición `WHERE`, usando `p.name` (propiedad de la Entity, no columna SQL) | `:texto` es un **placeholder** — un hueco que se rellena en la línea siguiente, nunca se concatena el valor a mano (evita inyección SQL) |
| `->setParameter('texto', '%' . $texto . '%')` | Rellena el placeholder `:texto` con el valor real, envuelto en `%...%` | Los símbolos `%` son de `LIKE`: significan "cualquier cosa antes/después" — así `'zapa'` encuentra `"Zapatillas"` |
| `->orderBy('p.name', 'ASC')` | Añade `ORDER BY`, otra vez sobre la propiedad de la Entity | Ordena los resultados — opcional, se puede omitir |
| `->getQuery()` | Cierra la construcción y la convierte en un objeto Query ejecutable | Hasta esta línea **no se ha tocado la base de datos** — todo lo anterior solo arma la consulta en memoria |
| `->getResult()` | Ejecuta la Query de verdad contra la BD | Es el único paso que dispara el SQL real y devuelve el array de objetos `Product` |

**Cómo se usa** — igual que cualquier otro método del Repository, ya inyectado:

```php
$productRepository->findByNameLike('zapa');   // encuentra "Zapatillas", "Zapato de tacón"...
```

## ParamConverter {: .topic-title }

Todo el patrón manual (`find()` + comprobar `null` + `createNotFoundException()`) se puede evitar gracias al **ParamConverter** (hoy formalmente `EntityValueResolver`, mismo nombre de siempre en la comunidad).

**Así queda el método completo**, con la ruta y el render — de punta a punta:

```php
#[Route('/productos/{id}', name: 'producto_show')]
public function show(Product $product): Response
{
    return $this->render('producto/show.html.twig', ['product' => $product]);
}
```

**Esto es lo que te evitás escribir** — el patrón manual, mismo resultado, misma ruta `/productos/{id}`:

```php
// Manual — lo que Symfony hace por vos
public function show(int $id, ProductRepository $productRepository): Response
$product = $productRepository->find($id);
if (!$product) { throw $this->createNotFoundException('Producto no encontrado.'); }
```

| Línea | Qué hace |
|---|---|
| `int $id` (manual) | El parámetro llega como número suelto — hay que ir a buscar la entidad vos mismo |
| `Product $product` (ParamConverter) | El type-hint **es** la instrucción — Symfony ve que pediste un `Product`, no un escalar |
| `$productRepository->find($id)` (manual) | Vos escribís explícitamente la consulta | *(Symfony hace este paso solo)* |
| `if (!$product) { throw ... }` (manual) | Vos escribís explícitamente el 404 | *(Symfony hace este paso solo)* |

**Cómo decide qué buscar** — no es magia, sigue una regla fija según el nombre del wildcard de la ruta:

| Wildcard de la ruta | Qué llama Symfony por detrás |
|---|---|
| `{id}` (por defecto) | `find($id)` — busca por clave primaria |
| `{slug}` (o cualquier otro nombre) | Hace falta la sintaxis `{slug:product}` en la ruta → `findOneBy(['slug' => $slug])` |

```php
#[Route('/productos/{id}')]                 // → find($id)
#[Route('/productos/{slug:product}')]       // → findOneBy(['slug' => $slug])
```

Solo funciona para **lectura** (buscar un registro existente) — para crear, actualizar o borrar hace falta seguir usando el EntityManager a mano.

## Manejar "no encontrado" a mano {: .topic-title }

Cuando el nombre del parámetro no coincide con la Entity, o cuando necesitás controlar vos el mensaje de error, se hace a mano: `find()` devuelve `null` si no existe — nunca lanza un error solo. El patrón para convertir eso en un 404 real ya está documentado en [Controllers → Manejo de errores](../../02-controllers/index.md#manejo-de-errores-pagina-404): comprobar el `null` y lanzar `$this->createNotFoundException()`.

## 📚 Fuentes {: .topic-title }
| Fuente | Enlace |
|---|---|
| 📕 **Apuntes propios** (base de estos temarios — prevalece en caso de conflicto) | `Symfony.pdf` — apunts DAW2, secciones 4.4 a 4.7 |
| 📘 **Documentación oficial de Symfony — Doctrine** | [symfony.com/doc/current/doctrine.html](https://symfony.com/doc/current/doctrine.html) |
| 🏫 **Apunts del profesor — Institut Montilivi** | [apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/doctrine](https://apunts.institutmontilivi.cat/MOD-0613/frameworks/symfony/doctrine/) |
