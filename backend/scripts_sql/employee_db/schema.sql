-- =====================================================
-- Employee Service - Base de Datos: employee_db
-- Descripción: Esquema completo para gestión de empleados
-- =====================================================

-- Conectar a la base de datos
\c employee_db;

-- =====================================================
-- TABLA: empresa
-- =====================================================
CREATE TABLE IF NOT EXISTS empresa (
    id_empresa SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT true,
    CONSTRAINT uk_empresa_nombre UNIQUE (nombre)
);

COMMENT ON TABLE empresa IS 'Empresas del sistema';
COMMENT ON COLUMN empresa.id_empresa IS 'Identificador único de la empresa';
COMMENT ON COLUMN empresa.nombre IS 'Nombre de la empresa (único)';
COMMENT ON COLUMN empresa.activo IS 'Indica si la empresa está activa';

-- =====================================================
-- TABLA: tipo_empleado
-- =====================================================
CREATE TABLE IF NOT EXISTS tipo_empleado (
    id_tipo_empleado SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creado_por VARCHAR(100)
);

COMMENT ON TABLE tipo_empleado IS 'Tipos de empleado (Médico, Enfermera, etc.)';
COMMENT ON COLUMN tipo_empleado.id_tipo_empleado IS 'Identificador único del tipo de empleado';
COMMENT ON COLUMN tipo_empleado.nombre IS 'Nombre del tipo de empleado';
COMMENT ON COLUMN tipo_empleado.descripcion IS 'Descripción del tipo de empleado';

-- =====================================================
-- TABLA: empleado
-- =====================================================
CREATE TABLE IF NOT EXISTS empleado (
    id_empleado SERIAL PRIMARY KEY,
    numero_documento VARCHAR(20) NOT NULL,
    tipo_documento VARCHAR(10),
    nombres VARCHAR(255) NOT NULL,
    apellido_paterno VARCHAR(255),
    apellido_materno VARCHAR(255),
    direccion VARCHAR(500),
    sexo VARCHAR(10),
    fecha_ingreso TIMESTAMP,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    telefono VARCHAR(20),
    celular VARCHAR(20),
    id_empresa INTEGER,
    id_tipo_empleado INTEGER,
    activo BOOLEAN DEFAULT true,
    CONSTRAINT fk_empleado_empresa FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa) ON DELETE SET NULL,
    CONSTRAINT fk_empleado_tipo FOREIGN KEY (id_tipo_empleado) REFERENCES tipo_empleado(id_tipo_empleado) ON DELETE SET NULL,
    CONSTRAINT uk_empleado_documento UNIQUE (numero_documento)
);

COMMENT ON TABLE empleado IS 'Empleados del sistema';
COMMENT ON COLUMN empleado.id_empleado IS 'Identificador único del empleado';
COMMENT ON COLUMN empleado.numero_documento IS 'Número de documento (DNI, etc.) - único';
COMMENT ON COLUMN empleado.tipo_documento IS 'Tipo de documento (DNI, CE, etc.)';
COMMENT ON COLUMN empleado.nombres IS 'Nombres del empleado';
COMMENT ON COLUMN empleado.apellido_paterno IS 'Apellido paterno';
COMMENT ON COLUMN empleado.apellido_materno IS 'Apellido materno';
COMMENT ON COLUMN empleado.id_empresa IS 'Empresa a la que pertenece';
COMMENT ON COLUMN empleado.id_tipo_empleado IS 'Tipo de empleado';
COMMENT ON COLUMN empleado.activo IS 'Indica si el empleado está activo';

-- =====================================================
-- ÍNDICES
-- =====================================================

-- Índices para empleado
CREATE INDEX IF NOT EXISTS idx_empleado_empresa ON empleado(id_empresa);
CREATE INDEX IF NOT EXISTS idx_empleado_tipo ON empleado(id_tipo_empleado);
CREATE INDEX IF NOT EXISTS idx_empleado_documento ON empleado(numero_documento);
CREATE INDEX IF NOT EXISTS idx_empleado_activo ON empleado(activo);
CREATE INDEX IF NOT EXISTS idx_empleado_nombres ON empleado(nombres);
CREATE INDEX IF NOT EXISTS idx_empleado_apellidos ON empleado(apellido_paterno, apellido_materno);

-- Índices para empresa
CREATE INDEX IF NOT EXISTS idx_empresa_activo ON empresa(activo);

-- Índices para tipo_empleado
CREATE INDEX IF NOT EXISTS idx_tipo_empleado_activo ON tipo_empleado(activo);

-- =====================================================
-- DATOS INICIALES (Opcional)
-- =====================================================

-- Insertar empresa por defecto
INSERT INTO empresa (id_empresa, nombre) VALUES (1, 'gafah')
ON CONFLICT (id_empresa) DO NOTHING;

-- Insertar tipos de empleado comunes
INSERT INTO tipo_empleado (id_tipo_empleado, nombre, descripcion) VALUES 
    (1, 'Médico', 'Médico general o especialista'),
    (2, 'Enfermera', 'Personal de enfermería'),
    (3, 'Recepcionista', 'Personal de recepción')
ON CONFLICT (id_tipo_empleado) DO NOTHING;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Verificar tablas creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;



