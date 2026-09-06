# Publicar la documentación en GitHub Pages

**Fecha:** 2026-09-06

## Qué

El sitio de MkDocs pasa a publicarse automáticamente en
`https://onikuza00.github.io/codeLearn/` mediante GitHub Actions.

- `.github/workflows/docs.yml` — construye con `mkdocs build --strict` y despliega
  con las acciones nativas de Pages (`upload-pages-artifact` + `deploy-pages`).
- `requirements.txt` — versiones fijadas para que el sitio se construya igual en
  GitHub que en local.
- `mkdocs.yml` — `site_url` corregido: apuntaba a `https://codelearn.pau.dev`,
  un dominio que no existe.
- `docs/sdd/index.md` — los 4 enlaces a páginas inexistentes convertidos en tabla
  de temario con estado. Habrían sido 404 públicos.

## Por qué

El repositorio ya era público pero la documentación solo se leía en local con
`mkdocs serve`. Publicarla la hace consultable desde cualquier sitio y sirve de
carta de presentación del trabajo.

## Decisiones

**Origen `GitHub Actions` en vez de `Deploy from a branch`.** La primera versión del
workflow usaba `mkdocs gh-deploy`, que empuja a una rama `gh-pages`. Eso obliga a un
orden incómodo: la rama no existe hasta que la Action corre, y hasta entonces no se
puede seleccionar en la configuración de Pages. Las acciones nativas entregan el
artefacto directamente y evitan tanto la rama intermedia como el paso extra de
permisos de escritura.

**Se publica desde `main`, no desde `develop`.** `develop` es la rama de trabajo
diario; lo que se fusiona a `main` es lo que se hace público. Ese pull request es el
control de qué sale, algo que importa en un repositorio público con registros diarios.

**`--strict` como puerta.** Si un enlace se rompe, la Action falla y no se publica
documentación rota. Requirió dejar el build limpio primero.

## Añadido en el mismo paso

`README.md` de presentación del repositorio: qué es, quién lo escribe, la filosofía,
la estructura por bloques, el método de estudio y sus normas, y el aviso de que la
finalidad es exclusivamente educativa y personal.
