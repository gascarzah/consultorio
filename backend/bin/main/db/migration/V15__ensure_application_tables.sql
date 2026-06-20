-- Tablas requeridas por JPA que no estaban en migraciones anteriores (instalación limpia con ddl-auto=validate en prod).

CREATE TABLE IF NOT EXISTS usuario (
  id_usuario SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  empleado_id INTEGER,
  CONSTRAINT fk_usuario_empleado
    FOREIGN KEY (empleado_id) REFERENCES empleado(id_empleado)
);

CREATE TABLE IF NOT EXISTS usuario_rol (
  id_usuario INTEGER NOT NULL,
  id_rol INTEGER NOT NULL,
  PRIMARY KEY (id_usuario, id_rol),
  CONSTRAINT fk_usuario_rol_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
  CONSTRAINT fk_usuario_rol_rol FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
);

CREATE TABLE IF NOT EXISTS token (
  id SERIAL PRIMARY KEY,
  token VARCHAR(512) UNIQUE,
  token_type VARCHAR(50),
  revoked BOOLEAN NOT NULL DEFAULT FALSE,
  expired BOOLEAN NOT NULL DEFAULT FALSE,
  id_usuario INTEGER,
  CONSTRAINT fk_token_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE IF NOT EXISTS programacion (
  id_programacion SERIAL PRIMARY KEY,
  fecha_inicial TIMESTAMP,
  fecha_final TIMESTAMP,
  str_fecha_inicial VARCHAR(50),
  str_fecha_final VARCHAR(50),
  rango VARCHAR(100),
  activo BOOLEAN DEFAULT TRUE,
  id_empresa INTEGER,
  numero_semana INTEGER
);

CREATE TABLE IF NOT EXISTS programacion_detalle (
  id_programacion_detalle SERIAL PRIMARY KEY,
  fecha DATE,
  dia_semana VARCHAR(20),
  numero_dia_semana INTEGER,
  activo BOOLEAN DEFAULT TRUE,
  str_fecha VARCHAR(50),
  empleado_id INTEGER,
  id_programacion INTEGER NOT NULL,
  CONSTRAINT fk_prog_det_empleado FOREIGN KEY (empleado_id) REFERENCES empleado(id_empleado),
  CONSTRAINT fk_prog_det_programacion FOREIGN KEY (id_programacion) REFERENCES programacion(id_programacion)
);

CREATE TABLE IF NOT EXISTS feriado (
  id_feriado SERIAL PRIMARY KEY,
  fecha DATE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  sector_publico BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS maestra (
  id_maestra SERIAL PRIMARY KEY,
  id_maestra_padre INTEGER,
  id_empresa INTEGER,
  descripcion VARCHAR(255),
  estado BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS dias_por_empleado (
  id BIGSERIAL PRIMARY KEY,
  id_empleado INTEGER NOT NULL,
  dias TEXT,
  CONSTRAINT fk_dias_empleado FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado)
);

-- FK empleado -> empresa (si la columna existe sin constraint)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = current_schema()
      AND table_name = 'empleado' AND constraint_name = 'fk_empleado_empresa'
  ) THEN
    ALTER TABLE empleado
      ADD CONSTRAINT fk_empleado_empresa
      FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa);
  END IF;
EXCEPTION
  WHEN others THEN NULL;
END $$;
