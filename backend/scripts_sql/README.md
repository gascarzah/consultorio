# Scripts SQL para Microservicios

Este directorio contiene los scripts SQL completos para crear todas las bases de datos y tablas de cada microservicio.

## 📁 Estructura

```
scripts_sql/
├── README.md
├── monolith/                        # Monolito actual (una BD + Flyway)
│   ├── README.md
│   ├── 01_create_app_role.sql
│   ├── 02_create_database.sql
│   ├── 03_post_create_grants.sql
│   ├── init_db.sh / init_db.ps1
│   └── consultorio-backend.env.snippet
├── 01_create_databases.sql          # Crear todas las bases de datos
├── auth_db/
│   └── schema.sql                   # Esquema completo de auth_db
├── employee_db/
│   └── schema.sql                   # Esquema completo de employee_db
├── scheduling_db/
│   └── schema.sql                   # Esquema completo de scheduling_db
├── appointment_db/
│   └── schema.sql                   # Esquema completo de appointment_db
├── catalog_db/
│   └── schema.sql                   # Esquema completo de catalog_db
└── gym_db/
    └── schema.sql                   # Esquema completo de gym_db (opcional)
```

## Monolito (este proyecto con `DB_URL` único)

Para levantar **otra** instancia PostgreSQL dedicada al backend monolítico, usa `monolith/` (rol, base y permisos); el esquema lo crea **Flyway** al arrancar la aplicación. Detalle en `monolith/README.md`.

## 🚀 Uso

### Opción 1: Ejecutar todos los scripts

```bash
# Conectar a PostgreSQL
psql -U postgres -h localhost

# Ejecutar script principal
\i 01_create_databases.sql

# Ejecutar esquemas por servicio
\c auth_db
\i auth_db/schema.sql

\c employee_db
\i employee_db/schema.sql

# ... y así sucesivamente
```

### Opción 2: Usar con Docker Compose

Los scripts se ejecutan automáticamente al iniciar los contenedores si los colocas en:
- `docker-entrypoint-initdb.d/` dentro de cada contenedor

### Opción 3: Usar con Flyway

Copia los scripts a las carpetas de migración de cada servicio:
- `auth-service/src/main/resources/db/migration/`
- `employee-service/src/main/resources/db/migration/`
- etc.

## 📝 Notas

- Todos los scripts están listos para PostgreSQL 15+
- Los índices están optimizados para las consultas más comunes
- Las referencias externas (id_empleado, id_empresa, etc.) NO tienen foreign keys
- Se recomienda ejecutar en orden: bases de datos primero, luego esquemas



