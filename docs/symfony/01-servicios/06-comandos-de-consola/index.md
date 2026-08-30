# Comandos de consola { .section-fundamentos }

> Un comando es un servicio que se ejecuta desde la terminal en vez de desde una petición HTTP. Sirve para lo que no lo dispara un usuario: importar un CSV, limpiar registros viejos, enviar un resumen diario. Se programa con cron y usa los mismos servicios que el resto de la aplicación.

---

## Crear el comando {: .topic-title }

!!! example "💻 Comando"
    ```bash
    symfony console make:command app:clean-old-tasks
    ```

Genera `src/Command/CleanOldTasksCommand.php`. El nombre (`app:clean-old-tasks`) es con el que lo llamarás: `symfony console app:clean-old-tasks`.

## Anatomía {: .topic-title }

```php
// src/Command/CleanOldTasksCommand.php
namespace App\Command;

use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:clean-old-tasks',
    description: 'Borra las tareas terminadas hace más de N días',
)]
class CleanOldTasksCommand extends Command
{
    public function __construct(
        private TaskRepository $tasks,
        private EntityManagerInterface $em,
    ) {
        parent::__construct();   // obligatorio al tener constructor propio
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $limite = new \DateTimeImmutable('-30 days');
        $viejas = $this->tasks->findDoneBefore($limite);

        foreach ($viejas as $task) {
            $this->em->remove($task);
        }
        $this->em->flush();

        $io->success(sprintf('Borradas %d tareas.', count($viejas)));

        return Command::SUCCESS;
    }
}
```

| Pieza | Qué es |
|---|---|
| `#[AsCommand(name, description)]` | Registra el comando. `autoconfigure` lo detecta solo, no toca `services.yaml` |
| Constructor con servicios | Igual que cualquier servicio. `parent::__construct()` es obligatorio si defines constructor |
| `execute(...)` | El cuerpo. Devuelve `Command::SUCCESS` (0) o `Command::FAILURE` (1) — el código de salida que lee el sistema |
| `SymfonyStyle $io` | Helpers de salida con formato: `$io->success()`, `$io->error()`, `$io->table()`, `$io->progressBar()` |

## Argumentos y opciones {: .topic-title }

- **Argumento**: valor posicional obligatorio u opcional — `app:clean-old-tasks 45`.
- **Opción**: bandera con nombre, siempre opcional — `app:clean-old-tasks --dry-run`.

```php
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

protected function configure(): void
{
    $this
        ->addArgument('days', InputArgument::OPTIONAL, 'Días de antigüedad', 30)
        ->addOption('dry-run', null, InputOption::VALUE_NONE, 'Solo muestra qué borraría');
}

protected function execute(InputInterface $input, OutputInterface $output): int
{
    $days = (int) $input->getArgument('days');
    $dryRun = $input->getOption('dry-run');
    // ...
}
```

!!! tip "Añade siempre un `--dry-run` a los comandos que borran o modifican"
    Un comando que `remove()` + `flush()` sin forma de ver antes qué va a tocar es peligroso en producción. Con `--dry-run` recorres los registros, imprimes cuáles serían y sales sin `flush()`. Lo ejecutas una vez en seco, compruebas, y luego sin la bandera.

## Programarlo con cron {: .topic-title }

El comando no se ejecuta solo: lo llama el cron del sistema. En Linux, `crontab -e`:

```cron
# todos los días a las 03:00
0 3 * * * cd /var/www/miapp && php bin/console app:clean-old-tasks >> var/log/cron.log 2>&1
```

!!! warning "El entorno de cron no es el de tu terminal"
    Cron ejecuta con un `PATH` mínimo y sin las variables de tu sesión. Usa rutas absolutas (`/usr/bin/php`, la ruta completa del proyecto) y añade `APP_ENV=prod` si hace falta. Redirige la salida a un archivo (`>> log 2>&1`): si el comando falla en silencio a las 3 de la mañana, ese log es lo único que tendrás.

## 📚 Fuentes {: .topic-title }
| Fuente | Enlace |
|---|---|
| 📘 **Symfony — Console Commands** | [symfony.com/doc/current/console.html](https://symfony.com/doc/current/console.html) |
| 📘 **Symfony — Console Input (Arguments & Options)** | [symfony.com/doc/current/console/input.html](https://symfony.com/doc/current/console/input.html) |
| 📘 **Symfony — Console: Styling (SymfonyStyle)** | [symfony.com/doc/current/console/style.html](https://symfony.com/doc/current/console/style.html) |
