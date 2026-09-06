<div align="center">

# codeLearn

**Un cuaderno de aprendizaje que se escribe mientras se aprende.**

Teoría, ejercicios y registro diario de errores en el camino de junior a desarrollador *full stack*.

[![Documentación](https://img.shields.io/badge/📚_Leer_la_documentación-onikuza00.github.io-0b7285?style=for-the-badge)](https://onikuza00.github.io/codeLearn/)

![MkDocs Material](https://img.shields.io/badge/MkDocs-Material-526CFE?logo=materialformkdocs&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?logo=php&logoColor=white)
![Symfony](https://img.shields.io/badge/Symfony-000000?logo=symfony&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?logo=greensock&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

</div>

---

> [!NOTE]
> **Este repositorio tiene una finalidad exclusivamente educativa y personal.**
> Son mis apuntes de estudio, publicados en abierto por si le sirven a alguien más. No es un curso, ni una guía profesional, ni material de referencia autorizado. Contiene errores propios documentados a propósito, porque forman parte del aprendizaje.

---

## Qué es esto

Un repositorio donde **documento todo lo que estudio, en el momento en que lo estudio**.

No es una colección de tutoriales copiados. Cada página nace de una sesión real de estudio: se escribe la teoría, se hace el ejercicio, se anota lo que salió mal y por qué. Si un tema no se ha dado, no está escrito.

**297 páginas** de teoría · **37 registros diarios** · en desarrollo continuo desde junio de 2026.

## Quién lo escribe

Soy **Pau Crosas Batista**, desarrollador web. Vengo de un ciclo de Desarrollo de Aplicaciones Web y escribo código de producción — APIs con Symfony y JWT, animación con GSAP, maquetación con CSS y Tailwind.

Este repositorio existe porque detecté que tenía **agujeros de fundamentos** debajo de cosas que ya sabía usar. Sabía montar una API sin tener escrito qué es exactamente una cabecera HTTP. Usaba `:has()` sin tener el modelo de caja documentado. Así que decidí escribirlo todo, de abajo arriba, y dejar constancia de cada fallo.

## Por qué existe

<table>
<tr><td width="50%">

### 🧠 Conceptos antes que código

Un framework se aprende en semanas; los fundamentos que hay debajo, no. Aquí primero va el porqué y después la sintaxis.

</td><td width="50%">

### 🛠️ La IA es una herramienta

Se usa para explicar, corregir y documentar. **Nunca para resolver los ejercicios.** Quien conduce es la persona.

</td></tr>
<tr><td>

### 🧱 Base sólida

Patrones, arquitectura y decisiones razonadas antes que la última librería de moda. Vanilla por defecto.

</td><td>

### 🐢 Contra la inmediatez

Aprender lleva tiempo y esfuerzo. Aquí no se optimiza para parecer productivo, sino para entender.

</td></tr>
</table>

---

## Cómo está organizado

La documentación vive en `docs/` y se publica con **MkDocs Material**.

| Bloque | Páginas | Contenido |
|---|:---:|---|
| 🌐 **Web** | 8 | El sustrato: petición y respuesta, métodos y códigos, cabeceras, CORS, caché HTTP, seguridad, rendimiento |
| 🎨 **CSS** | 36 | Selectores modernos, layout, responsive, arquitectura, animaciones, formularios |
| 💨 **Tailwind** | 28 | Fundamentos, sistema de diseño, layout, estados, efectos, accesibilidad |
| 🟨 **JavaScript** | 52 | Desde tipos hasta asincronía, DOM, almacenamiento, módulos y expresiones regulares |
| 🐘 **Backend** | 19 | PHP de la base a la POO avanzada, y cinco casos de diseño de arquitectura |
| 🎼 **Symfony** | 50 | Fundamentos, Doctrine, servicios, seguridad, API REST, pruebas y despliegue |
| 🐳 **DevOps** | 14 | Docker de los comandos al stack completo, y línea de Linux |
| 🤖 **IA** | 36 | Dirigir un asistente de código, la API de Claude, y ejecutar modelos en local |
| 📐 **SDD** | 2 | Desarrollo guiado por especificaciones |
| 🗺️ **Way to Code** | 37 | La bitácora: un registro por sesión de estudio |

### Fuera de `docs/`

```
codeLearn/
├── docs/          📚 toda la teoría — es el corazón del repositorio
├── assessment/    ✍️  ejercicios interactivos con sus tests
├── Backend/       🐘 proyectos PHP y Symfony de práctica
├── CSS/           🎨 laboratorios de maquetación
├── Frontend/      🟨 práctica de JavaScript y Vue
├── GsapAcademy/   ✨ animación
├── Portfolio/     🖼️  proyectos personales
├── openspec/      📋 registro de decisiones del propio repositorio
└── rules/         ⚖️  las normas que sigue este proyecto
```

---

## El método

Esto es probablemente lo más útil que hay aquí. Son normas que **no salieron de un libro, sino de haberlas necesitado** después de tropezar.

### 1 · La teoría se escribe antes que el ejercicio

Nunca se plantea un ejercicio sobre algo que no esté documentado. Si al preparar una práctica falta la teoría, se escribe primero.

> *Salió de aparcar un ejercicio a mitad porque el patrón que exigía no estaba en ningún sitio. Explicarlo sobre la marcha no sustituye a tenerlo escrito.*

### 2 · Los ejercicios se resuelven sin IA

Se consulta la teoría propia cuantas veces haga falta. No se piden soluciones. Un ejercicio resuelto por otro no enseña nada.

### 3 · Un concepto nuevo por ejercicio

Nunca se apilan dos cosas que no se han visto antes en la misma práctica. Si un ejercicio exige dos piezas nuevas, se parte en dos.

> *Salió de un ejercicio que combinaba interfaces, enums y closures a la vez. No se aprendió ninguno de los tres.*

### 4 · Los fallos se documentan, con su porqué

Cada sesión deja un registro con los errores **conceptuales** —no las erratas— y cada uno lleva su lección nombrada: *esto es un early return*, *esto es un off-by-one*, *esto es una fuga de memoria*.

Nombrar el patrón es lo que hace que la próxima vez se reconozca.

### 5 · El registro diario no se salta

Al cerrar cada sesión se escribe qué se hizo, qué falló y qué queda pendiente. Sin esa disciplina, el error de hace tres semanas se repite tal cual.

---

## Consejos que han salido de aquí

> [!TIP]
> **Escribe la teoría con tus palabras, no la copies.** El momento en que te atascas redactando una explicación es exactamente el momento en que descubres que no lo entendías.

> [!TIP]
> **Documenta el fallo, no solo el arreglo.** «Estaba mal y ahora está bien» no enseña nada. «Usé `sort()` esperando que devolviera el array, y devuelve un booleano» sí.

> [!TIP]
> **Un concepto moderno sobre una base sin escribir se sostiene mal.** Se puede usar `:has()` sin entender el modelo de caja, hasta el día en que algo no cuadra y no hay dónde mirar.

> [!TIP]
> **Repite la pregunta antes de responder.** Al explicar algo en voz alta, el fallo más caro no es no saber: es contestar a una pregunta más fácil que la que te han hecho.

> [!TIP]
> **Guarda las chuletas separadas de la teoría.** Los apuntes largos son para aprender; una hoja compacta de confusiones típicas es para repasar diez minutos antes. Son dos formatos distintos y hacen falta los dos.

---

## Leer la documentación

**→ [onikuza00.github.io/codeLearn](https://onikuza00.github.io/codeLearn/)**

O en local:

```bash
pip install -r requirements.txt
mkdocs serve
```

→ `http://localhost:8000`

### Cómo se publica

`develop` es la rama de trabajo diario y no publica nada. Lo que se fusiona a `main` dispara una GitHub Action que construye el sitio con `mkdocs build --strict` y lo despliega. Si hay un enlace roto, **la Action falla y no se publica** documentación rota.

---

## Sobre el contenido

- **Idioma:** castellano. El código, los identificadores y los comentarios técnicos, en inglés.
- **Fuentes:** apuntes propios, documentación oficial (MDN, php.net, Symfony, OWASP, web.dev) y formación reglada. Cada página cierra con las suyas.
- **Errores:** los hay, y algunos están puestos a propósito como material de aprendizaje. Si encuentras uno de los otros, se agradece el aviso.

<div align="center">

---

*Aprender lleva tiempo. Este repositorio es la prueba.*

</div>
