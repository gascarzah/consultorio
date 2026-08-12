-- V2 puente: asegurar tabla empleado antes de V3.
-- Este script permite continuar instalaciones que ya tienen V1 aplicada
-- pero sin la estructura completa de empleado.

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

-- Secuencia y default para identidad
CREATE SEQUENCE IF NOT EXISTS empleado_id_seq;
ALTER TABLE empleado ALTER COLUMN id_empleado SET DEFAULT nextval('empleado_id_seq');
ALTER SEQUENCE empleado_id_seq OWNED BY empleado.id_empleado;

-- FK a empresa (si existe la tabla empresa)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = current_schema
      AND table_name = 'empresa'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = current_schema
      AND table_name = 'empleado'
      AND constraint_name = 'fk_empleado_empresa'
  ) THEN
    ALTER TABLE empleado
      ADD CONSTRAINT fk_empleado_empresa
      FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa);
  END IF;
END $$;

-- Sincronizar secuencia
SELECT setval('empleado_id_seq', COALESCE((SELECT MAX(id_empleado) FROM empleado), 0) + 1, false);
