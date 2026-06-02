-- =============================================================================
-- Monolito consultorio: permisos en la base nueva
-- Ejecutar conectado a la base "consultorio_db" como superusuario (p. ej. postgres).
-- En PostgreSQL 15+ el esquema public tiene restricciones; el OWNER debe poder crear tablas (Flyway).
-- Con psql se recomienda: -v ON_ERROR_STOP=1
-- =============================================================================

GRANT ALL PRIVILEGES ON DATABASE consultorio_db TO consultorio_app;
GRANT ALL ON SCHEMA public TO consultorio_app;
ALTER SCHEMA public OWNER TO consultorio_app;

-- Objetos futuros creados por el rol de la app (por si Flyway usa otro rol en algún entorno)
ALTER DEFAULT PRIVILEGES FOR ROLE consultorio_app IN SCHEMA public
  GRANT ALL ON TABLES TO consultorio_app;
ALTER DEFAULT PRIVILEGES FOR ROLE consultorio_app IN SCHEMA public
  GRANT ALL ON SEQUENCES TO consultorio_app;
