# Subida y validación de archivos { .section-fundamentos }

> Aceptar un archivo del usuario tiene tres pasos que no se pueden saltar: comprobar que es lo que dice ser (tipo y tamaño), moverlo a un sitio controlado con un nombre seguro, y guardar solo la ruta en la base de datos. Toda esa lógica vive en un servicio, no en el controlador.

---

## De dónde sale el archivo {: .topic-title }

En el controlador, un archivo subido llega como `UploadedFile` dentro de `$request->files`:

```php
use Symfony\Component\HttpFoundation\File\UploadedFile;

#[Route('/upload', name: 'file_upload', methods: ['POST'])]
public function upload(Request $request, UploadStorage $storage): Response
{
    /** @var UploadedFile|null $file */
    $file = $request->files->get('documento');   // name="documento" en el <input type="file">

    if (!$file) {
        return $this->json(['error' => 'No llegó ningún archivo.'], 400);
    }

    $errors = $storage->validate($file);
    if ($errors) {
        return $this->json(['errors' => $errors], 422);
    }

    $ruta = $storage->store($file);   // devuelve la ruta relativa para guardar en la entidad
    // ... $entity->setImagePath($ruta); $em->flush();
}
```

Si el archivo viene de un formulario Symfony, se usa `FileType` con la constraint `File` o `Image` — la validación la hace el propio formulario. Este servicio es para cuando manejas la subida a mano (una API, un endpoint AJAX).

## Validar: tipo real y tamaño {: .topic-title }

```php
// src/Service/UploadStorage.php
namespace App\Service;

use Symfony\Component\HttpFoundation\File\UploadedFile;

class UploadStorage
{
    private const MAX_BYTES = 5 * 1024 * 1024;   // 5 MB
    private const ALLOWED = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
        'video/mp4'  => 'mp4',
        'application/pdf' => 'pdf',
    ];

    /** @return string[] lista de errores; vacía si el archivo es válido */
    public function validate(UploadedFile $file): array
    {
        $errors = [];

        if ($file->getSize() > self::MAX_BYTES) {
            $errors[] = 'El archivo supera los 5 MB.';
        }

        $mime = $file->getMimeType();   // lo deduce del contenido, no de la extensión
        if (!isset(self::ALLOWED[$mime])) {
            $errors[] = 'Formato no permitido.';
        }

        return $errors;
    }
}
```

!!! warning "`getClientMimeType()` y la extensión los pone el navegador — mienten"
    `$file->getClientOriginalName()` y `$file->getClientMimeType()` vienen del cliente y se pueden falsear: subir un `.php` renombrado a `.jpg`. Usa siempre **`$file->getMimeType()`** (o `guessExtension()`), que Symfony calcula leyendo los primeros bytes del archivo. La lista blanca se comprueba contra ese valor, nunca contra la extensión del nombre.

## Mover con un nombre único {: .topic-title }

Nunca guardes el archivo con el nombre que trae. Dos problemas: colisiones (dos usuarios suben `foto.jpg`) y nombres con caracteres raros o rutas (`../../etc/passwd`). Se genera uno nuevo: base legible + parte aleatoria + extensión deducida.

```php
use Symfony\Component\String\Slugger\SluggerInterface;

class UploadStorage
{
    public function __construct(
        #[Autowire('%kernel.project_dir%/public/uploads')]
        private string $uploadDir,
        private SluggerInterface $slugger,
    ) {
    }

    public function store(UploadedFile $file): string
    {
        $original = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeName = $this->slugger->slug($original)->lower();
        $filename = sprintf('%s-%s.%s', $safeName, uniqid(), $file->guessExtension());

        $file->move($this->uploadDir, $filename);

        return 'uploads/' . $filename;   // ruta relativa a public/ para usar en la plantilla
    }
}
```

| Pieza | Por qué |
|---|---|
| `SluggerInterface` | Convierte "Mi Foto (2).JPG" en "mi-foto-2" — sin espacios, acentos ni símbolos |
| `uniqid()` | Sufijo único: evita que dos subidas con el mismo nombre se pisen |
| `guessExtension()` | Extensión a partir del tipo real, no de la que trajo el navegador |
| `$file->move($dir, $name)` | Saca el archivo de la carpeta temporal de PHP y lo deja en su sitio definitivo |
| `return 'uploads/...'` | En la BD se guarda **solo la ruta**, nunca el archivo (los BLOB en base de datos escalan mal) |

## Dónde guardarlos {: .topic-title }

| Carpeta | Cuándo | Cómo se sirve |
|---|---|---|
| `public/uploads/` | Archivos públicos (avatares, imágenes de producto) | Directo por URL: `<img src="{{ asset('uploads/' ~ producto.imagen) }}">` |
| `var/uploads/` (fuera de `public/`) | Archivos privados (facturas, documentos de un usuario) | Nunca por URL: un controlador comprueba permisos y responde con `BinaryFileResponse` |

!!! tip "Los límites reales los pone el servidor, no tu constante"
    Aunque tu `validate()` corte a 5 MB, PHP rechaza antes cualquier subida que pase de `upload_max_filesize` / `post_max_size` (`php.ini`), y Nginx de `client_max_body_size`. Si un archivo "no llega" sin dar error tuyo, revisa esos tres valores primero.

## 📚 Fuentes {: .topic-title }
| Fuente | Enlace |
|---|---|
| 📘 **Symfony — How to Upload Files** | [symfony.com/doc/current/controller/upload_file.html](https://symfony.com/doc/current/controller/upload_file.html) |
| 📘 **Symfony — File & Image constraints** | [symfony.com/doc/current/reference/constraints/File.html](https://symfony.com/doc/current/reference/constraints/File.html) |
| 📘 **Symfony — The String Component (Slugger)** | [symfony.com/doc/current/string.html#slugger](https://symfony.com/doc/current/string.html#slugger) |
