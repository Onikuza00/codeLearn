# 01.08 AssetMapper — Registro automático

## Sin registro manual

Symfony auto-registra todos los archivos JS en `assets/controllers/`. No necesitás registrar nada manualmente.

## Flujo completo

```
base.html.twig
  └── {{ importmap('app') }}
        └── assets/app.js
              ├── import './stimulus_bootstrap.js'
              │     └── startStimulusApp()
              │           └── escanea assets/controllers/
              │                 └── gallery_zoom_controller.js
              │                       → registrado como "gallery-zoom"
              └── import './styles/app.css'
```

## Normalización de nombres Stimulus

| Archivo | Nombre registrado |
|---------|------------------|
| `gallery_zoom_controller.js` | `gallery-zoom` |
| `galleryZoom_controller.js` | `gallery-zoom` |
| `GalleryZoomController.js` | `gallery-zoom` |

Stimulus convierte guión bajo a guión, camelCase a kebab-case, y quita el sufijo `_controller`.

## Archivos clave

| Archivo | Función |
|---------|---------|
| `assets/app.js` | Punto de entrada JS |
| `assets/stimulus_bootstrap.js` | Inicia Stimulus con `startStimulusApp()` |
| `assets/controllers.json` | Configura controllers de terceros (Live, Turbo) |
| `importmap.php` | Mapa de módulos JS |
