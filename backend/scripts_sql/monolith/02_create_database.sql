-- =============================================================================
-- Monolito consultorio: base de datos
-- Ejecutar conectado a "postgres" como superusuario, DESPUÉS de 01_create_app_role.sql
-- CREATE DATABASE no puede ir dentro de un bloque DO.
-- Si la base ya existe, este comando fallará: elimínela o cambia el nombre abajo.
-- Con psql se recomienda: -v ON_ERROR_STOP=1
-- =============================================================================

CREATE DATABASE consultorio_db
  OWNER consultorio_app
  ENCODING 'UTF8';
