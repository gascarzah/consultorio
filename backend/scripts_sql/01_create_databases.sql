-- =====================================================
-- Script: Crear todas las bases de datos
-- Descripción: Crea las 6 bases de datos para los microservicios
-- =====================================================

-- Crear bases de datos
CREATE DATABASE auth_db;
CREATE DATABASE employee_db;
CREATE DATABASE scheduling_db;
CREATE DATABASE appointment_db;
CREATE DATABASE catalog_db;
CREATE DATABASE gym_db;

-- Asignar permisos (ajustar usuario según tu configuración)
GRANT ALL PRIVILEGES ON DATABASE auth_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE employee_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE scheduling_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE appointment_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE catalog_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE gym_db TO postgres;

-- Verificar creación
SELECT datname FROM pg_database 
WHERE datname IN ('auth_db', 'employee_db', 'scheduling_db', 'appointment_db', 'catalog_db', 'gym_db')
ORDER BY datname;



