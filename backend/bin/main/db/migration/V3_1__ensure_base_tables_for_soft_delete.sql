-- V3.1 puente: asegurar tablas base que usan V4, V5, V6 y V7.
-- Se mantiene idempotente para no romper entornos parcialmente creados.

CREATE TABLE IF NOT EXISTS empresa (
  id_empresa SERIAL PRIMARY KEY,
  nombre VARCHAR(150),
  activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS rol (
  id_rol SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS historia_clinica (
  id_historia_clinica SERIAL PRIMARY KEY,
  nombres VARCHAR(150),
  apellido_paterno VARCHAR(150),
  apellido_materno VARCHAR(150),
  numero_documento VARCHAR(20),
  telefono VARCHAR(30),
  celular VARCHAR(30),
  email VARCHAR(150),
  direccion VARCHAR(255),
  alergia VARCHAR(255),
  antecedentes_medicos VARCHAR(255),
  ectoscopia VARCHAR(255),
  motivo TEXT,
  activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS horario (
  id_horario SERIAL PRIMARY KEY,
  descripcion VARCHAR(150),
  activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS menu (
  id_menu SERIAL PRIMARY KEY,
  nombre VARCHAR(150),
  path VARCHAR(255),
  activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS rol_menu (
  id_rol INTEGER NOT NULL,
  id_menu INTEGER NOT NULL,
  PRIMARY KEY (id_rol, id_menu)
);

-- FK rol_menu -> rol/menu (solo si no existen)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = current_schema()
      AND table_name = 'rol_menu'
      AND constraint_name = 'fk_rol_menu_rol'
  ) THEN
    ALTER TABLE rol_menu
      ADD CONSTRAINT fk_rol_menu_rol
      FOREIGN KEY (id_rol) REFERENCES rol(id_rol);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = current_schema()
      AND table_name = 'rol_menu'
      AND constraint_name = 'fk_rol_menu_menu'
  ) THEN
    ALTER TABLE rol_menu
      ADD CONSTRAINT fk_rol_menu_menu
      FOREIGN KEY (id_menu) REFERENCES menu(id_menu);
  END IF;
END $$;
