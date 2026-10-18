# Repaso urgente de React: cards ordenadas por reincidencia

## Qué

- `docs/waytoCode/repaso-urgente-react.md` abandona la estructura de 4 niveles (`nivel-header`) y pasa al formato de las páginas de Symfony y JS: una card (`!!! tip` / `!!! note`, y `warning` / `danger` cuando suban) por fallo, con código ❌/✅, explicación del principio y enlace a la teoría.
- Orden y color por reincidencia, de más a menos urgente: 🟢 1 ejercicio · 🟡 2 · 🟠 3 · 🔴 4 o más (se cuenta en ejercicios distintos donde falló el mismo patrón).
- `extra.css`: clases `.repaso-compact` movidas a la hoja de estilos (antes solo vivían en un `<style>` embebido de la página de Symfony).

## Por qué

Pau no quería niveles por categoría: lo que importa para repasar es qué reincide más. La gama verde → rojo da prioridad visual inmediata y coincide con el formato ya usado en Symfony.

## Ajuste de color

Los tipos `note` y `tip` de Material salen azul y cian, no verde y amarillo. Se añaden en `extra.css` los tipos `rep-verde`, `rep-amarillo`, `rep-naranja` y `rep-rojo` (borde, fondo del título e icono del color de la urgencia, con el icono de `success`/`tip`/`warning`/`danger`). La página de React los usa en lugar de `note`/`tip`.
