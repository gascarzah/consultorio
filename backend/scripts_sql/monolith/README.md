# Scripts para nueva base de datos (monolito)

El backend en este repositorio usa **una** base PostgreSQL (`DB_URL`). Estos scripts crean el **rol** y la **base**; el **esquema y los datos iniciales** los aplica **Flyway** al arrancar Spring Boot (`src/main/resources/db/migration/`).

## Orden de ejecución

1. `01_create_app_role.sql` — rol `consultorio_app` (idempotente si el rol no existe).
2. `02_create_database.sql` — base `consultorio_db` propiedad del rol (falla si la base ya existe).
3. `03_post_create_grants.sql` — permisos en `public` (ejecutar **conectado a** `consultorio_db`).

## Opción A: `psql` manual

```bash
export PGPASSWORD='contraseña_del_superusuario_postgres'
psql -h localhost -p 5432 -U postgres -d postgres -v ON_ERROR_STOP=1 -f 01_create_app_role.sql
psql -h localhost -p 5432 -U postgres -d postgres -v ON_ERROR_STOP=1 -f 02_create_database.sql
psql -h localhost -p 5432 -U postgres -d consultorio_db -v ON_ERROR_STOP=1 -f 03_post_create_grants.sql
```

Edita `01_create_app_role.sql` y sustituye `CambiarEstaContraseña` antes del primer paso, o después ejecuta:

```sql
ALTER ROLE consultorio_app PASSWORD 'tu_contraseña_segura';
```

## Opción B: script Bash (`init_db.sh`)

Requiere `psql` en el PATH (Git Bash, Linux, macOS).

```bash
export PGPASSWORD='contraseña_superusuario'
./init_db.sh
```

Variables opcionales: `PGHOST`, `PGPORT`, `PGADMIN_USER`, `PGADMIN_DB` (por defecto `postgres`).

## Opción C: PowerShell (`init_db.ps1`)

```powershell
$env:PGPASSWORD = "contraseña_superusuario"
.\init_db.ps1
```

Mismas variables de entorno opcionales que el script Bash.

## Después de crear la base

1. Copia `consultorio-backend.env.snippet` a `backend/.env` y ajusta host, puerto y contraseña.
2. Arranca el backend con `FLYWAY_ENABLED=true` para que se creen tablas y seeds.

Si cambias el nombre de la base o del rol, edita los tres `.sql` y el snippet para que coincidan con `DB_URL` / `DB_USERNAME`.
