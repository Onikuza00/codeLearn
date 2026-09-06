# 🚨 Repaso urgente — Importación masiva

> Repaso rápido del caso «cada mañana llega un fichero de 80.000 líneas y hay que cargarlo». Separar subir de procesar, lotes, idempotencia y visibilidad. Antes de resolver este caso, repasar esto.
>
> Teoría completa en [Backend → Arquitectura → Importación masiva](/backend/02-arquitectura/05-importacion-masiva/).

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

## 📊 Los conceptos que más se mezclan

| Concepto | La confusión típica |
|---|---|
| Subir vs. procesar | Leer y guardar las 80.000 líneas dentro de la petición web |
| «Todo o nada» vs. «lo que se pueda» | No preguntarlo, y construir lo contrario de lo que necesitan |
| Leer el fichero | Cargarlo entero en un array con `file()` |
| Doctrine en un bucle largo | Leer en flujo y aun así agotar la memoria |
| Idempotencia | Pensar que basta con no insertar dos veces en tu BD |
| Clave de la línea | Identificar cada línea por un id autonumérico y no por su referencia de negocio |
| Línea inválida | Detener el proceso, o descartarla en silencio |
| Proceso en segundo plano | Dejarlo sin estados: nadie sabe si el fichero de hoy entró |
| Proceso colgado | No distinguir «lento» de «muerto» |
| Fichero con precios absurdos | Aplicarlo sin comprobación de cordura |

---

!!! danger "Lo que NO se hace: procesar el fichero durante la petición web"
    Falla por cuatro sitios a la vez: **se agota el tiempo** (PHP corta a los 30-60 s), **se agota la memoria**, si **se corta a mitad** la mitad de los datos están cargados y nadie sabe cuáles, y el **navegador se cuelga** — el usuario recarga y lanza una segunda importación en paralelo.

    La frase: **«subir y procesar son dos cosas distintas»**. La subida guarda el fichero, crea un registro en estado `pendiente` y devuelve un identificador al momento; el proceso ocurre después, en segundo plano.

!!! tip "La pregunta que define la arquitectura: ¿qué pasa si una línea viene mal?"
    Son dos diseños distintos, y no se adivina — se pregunta.

    | Respuesta | Diseño |
    |---|---|
    | **Todo o nada** | Validar el fichero entero **sin escribir nada**, acumulando errores; si hay alguno, se rechaza completo. Cuesta leerlo dos veces, pero evita una transacción gigante bloqueando tablas |
    | **Lo que se pueda** | Procesar **por lotes** + **informe de errores** |

    En datos de negocio, **casi siempre quieren «lo que se pueda» más un informe**.

!!! note "Validación rápida antes de encolar"
    Segundos, no minutos: que sea el **tipo de fichero** esperado, que tenga las **columnas previstas** (basta leer la cabecera), que **no esté vacío**. Si falla, estado `rechazado` con un error claro al instante, sin gastar un *worker*.

!!! danger "Memoria: leer en flujo, nunca el fichero entero"
    ```php
    $fichero = fopen($ruta, 'r');
    while (($linea = fgetcsv($fichero)) !== false) {
        $lote[] = $linea;
        if (count($lote) === 500) { $this->procesarLote($lote); $lote = []; }
    }
    ```
    Nunca `file()` ni `file_get_contents()` sobre un fichero grande: cargan las 80.000 líneas de golpe.

!!! warning "El fallo clásico de Symfony: limpiar el gestor de entidades"
    Aunque leas en flujo, **Doctrine guarda en memoria todas las entidades que gestiona**. Tras 40.000 te quedas sin memoria igual. En cada lote:

    ```php
    $this->em->flush();
    $this->em->clear();   // suelta lo ya guardado
    ```
    Se lee bien y aun así revienta en la línea 40.000 — si no sabes esto, no lo ves venir.

!!! tip "Lotes de 500, cada uno una transacción"
    Valida, guarda y confirma por lote. Si un lote falla, **no arrastra a los anteriores**. Y registrar el último lote confirmado permite **reanudar** si el proceso muere a mitad.

!!! danger "Idempotencia: dos defensas, y se ponen las dos"
    El mismo fichero llega dos veces más de lo que parece: el proveedor lo reenvía, el proceso reintenta tras un fallo de red, alguien pulsa dos veces.

    1. **Huella del fichero.** Un `sha256` del contenido al recibirlo. Si ya existe una importación con esa huella, no se procesa.
    2. **Insertar o actualizar por clave de negocio.** Cada línea se identifica por su **referencia de producto**, no por un autonumérico. Si ya existe, se actualiza.

    Con las dos, procesarlo cinco veces deja el sistema igual que procesarlo una. **«Eso es idempotencia»** — es la palabra que hay que decir.

!!! note "Las líneas inválidas no detienen el proceso, pero tampoco se tiran"
    Se anotan en un **informe** con su número de línea y el motivo, descargable. Al final el registro pasa a `terminado` con el resumen: cuántas bien, cuántas mal.

!!! tip "Sin estados es una caja negra"
    `pendiente` → `procesando` (con contador) → `terminado` / `terminado con errores` / `fallido`. Sin esto, cada mañana la misma pregunta: «¿ha entrado el fichero de hoy?», y no hay forma de responder sin mirar la BD. **Una pantalla con el historial de importaciones vale más que cualquier optimización.**

!!! note "Cómo saber si el proceso sigue vivo o está colgado"
    Actualizando un **contador de progreso y una marca de tiempo** en el registro **cada lote**. Si la marca no se mueve en varios minutos, salta una alerta. Sin eso, un proceso muerto y uno lento **se ven exactamente igual**.

!!! warning "El umbral de alarma: la protección que nadie pide y todos agradecen"
    Si el proveedor manda el fichero con un error de formato y todos los precios salen multiplicados por cien, un proceso automático los aplica sin rechistar — y eso llega al catálogo público.

    Una comprobación de cordura —«si más del 20 % de los precios varían más de un 50 %, no apliques y avisa»— cuesta poco. **Proponerla sin que te la pidan demuestra que piensas en el negocio, no solo en el código.**

!!! tip "Cinco proveedores con formatos distintos"
    Una interfaz común —`LectorDeTarifas`— con una implementación por proveedor. Cada una traduce su formato a un **modelo interno único** y el resto del proceso no se entera. Es el mismo adaptador del Caso 2: **aislar lo que varía**.

!!! note "«80.000 líneas, ¿cuánto debería tardar?»"
    **No des una cifra.** Di cómo lo medirías: probar con 1.000 líneas, extrapolar, y ver si el cuello está en leer, en validar o en escribir. Las palancas: insertar por lotes, desactivar índices durante una sustitución completa, y no cargar relaciones que no hacen falta.

</div>
