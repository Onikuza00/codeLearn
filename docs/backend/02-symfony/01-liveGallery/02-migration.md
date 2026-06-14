# 01.02 Migration

**Comando:**
```bash
php bin/console make:migration
```

## Opciones

Ninguna. El Maker compara las entidades con la BD actual y genera el SQL necesario.

## Código generado

```sql
CREATE TABLE product (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    likes INTEGER NOT NULL
);
```

## Ejecutar

```bash
php bin/console doctrine:migrations:migrate
```

## Notas

- El nombre de la tabla se genera automáticamente desde el nombre de la entidad (`Product` → `product`)
- Los nombres de columna se convierten a snake_case (`imageUrl` → `image_url`)
- El `id` se configura como autincremental solo para SQLite. En MySQL/PostgreSQL sería `AUTO_INCREMENT` / `SERIAL`
