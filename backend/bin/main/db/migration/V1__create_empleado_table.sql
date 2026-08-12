-- Base minima para permitir reconstruccion desde cero con Flyway.
CREATE TABLE IF NOT EXISTS empleado (
  id_empleado SERIAL PRIMARY KEY,
  numero_documento VARCHAR(20),
  tipo_documento VARCHAR(20),
  nombres VARCHAR(150),
  apellido_paterno VARCHAR(150),
  apellido_materno VARCHAR(150),
  direccion VARCHAR(255),
  sexo VARCHAR(20),
  fecha_ingreso TIMESTAMP,
  fecha_registro TIMESTAMP,
  telefono VARCHAR(30),
  celular VARCHAR(30),
  id_empresa INTEGER,
  activo BOOLEAN DEFAULT TRUE
);

-- Crear la secuencia para empleado si no existe
CREATE SEQUENCE IF NOT EXISTS empleado_id_seq;

-- Asegurar uso de secuencia en empleado.id_empleado
ALTER TABLE empleado ALTER COLUMN id_empleado SET DEFAULT nextval('empleado_id_seq');
ALTER SEQUENCE empleado_id_seq OWNED BY empleado.id_empleado;

-- Sincronizar secuencia al maximo actual
SELECT setval('empleado_id_seq', COALESCE((SELECT MAX(id_empleado) FROM empleado), 0) + 1, false);