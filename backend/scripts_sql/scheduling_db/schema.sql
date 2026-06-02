-- =====================================================
-- Scheduling Service - Base de Datos: scheduling_db
-- Descripción: Esquema completo para programaciones y horarios
-- =====================================================

-- Conectar a la base de datos
\c scheduling_db;

-- =====================================================
-- TABLA: feriado
-- =====================================================
CREATE TABLE IF NOT EXISTS feriado (
    id_feriado SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    sector_publico BOOLEAN DEFAULT false,
    CONSTRAINT uk_feriado_fecha UNIQUE (fecha)
);

COMMENT ON TABLE feriado IS 'Feriados del sistema';
COMMENT ON COLUMN feriado.id_feriado IS 'Identificador único del feriado';
COMMENT ON COLUMN feriado.fecha IS 'Fecha del feriado (única)';
COMMENT ON COLUMN feriado.nombre IS 'Nombre del feriado';
COMMENT ON COLUMN feriado.sector_publico IS 'Indica si es feriado del sector público';

-- =====================================================
-- TABLA: horario
-- =====================================================
CREATE TABLE IF NOT EXISTS horario (
    id_horario SERIAL PRIMARY KEY,
    descripcion VARCHAR(255),
    id_empresa INTEGER,  -- Referencia externa (Employee Service)
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE horario IS 'Horarios disponibles para citas';
COMMENT ON COLUMN horario.id_horario IS 'Identificador único del horario';
COMMENT ON COLUMN horario.descripcion IS 'Descripción del horario';
COMMENT ON COLUMN horario.id_empresa IS 'Referencia externa a la empresa (Employee Service)';
COMMENT ON COLUMN horario.activo IS 'Indica si el horario está activo';

-- =====================================================
-- TABLA: programacion
-- =====================================================
CREATE TABLE IF NOT EXISTS programacion (
    id_programacion SERIAL PRIMARY KEY,
    fecha_inicial DATE NOT NULL,
    fecha_final DATE NOT NULL,
    str_fecha_inicial VARCHAR(50),
    str_fecha_final VARCHAR(50),
    rango VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    id_empresa INTEGER,  -- Referencia externa (Employee Service)
    numero_semana INTEGER,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_programacion_fechas CHECK (fecha_final >= fecha_inicial)
);

COMMENT ON TABLE programacion IS 'Programaciones semanales o por rango de fechas';
COMMENT ON COLUMN programacion.id_programacion IS 'Identificador único de la programación';
COMMENT ON COLUMN programacion.fecha_inicial IS 'Fecha inicial del rango';
COMMENT ON COLUMN programacion.fecha_final IS 'Fecha final del rango';
COMMENT ON COLUMN programacion.activo IS 'Indica si la programación está activa';
COMMENT ON COLUMN programacion.numero_semana IS 'Número de semana del año';
COMMENT ON COLUMN programacion.id_empresa IS 'Referencia externa a la empresa (Employee Service)';

-- =====================================================
-- TABLA: programacion_detalle
-- =====================================================
CREATE TABLE IF NOT EXISTS programacion_detalle (
    id_programacion_detalle SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    dia_semana VARCHAR(20),
    numero_dia_semana INTEGER,
    activo BOOLEAN DEFAULT true,
    str_fecha VARCHAR(50),
    id_empleado INTEGER NOT NULL,  -- Referencia externa (Employee Service)
    id_programacion INTEGER NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_programacion_detalle_programacion 
        FOREIGN KEY (id_programacion) REFERENCES programacion(id_programacion) ON DELETE CASCADE
);

COMMENT ON TABLE programacion_detalle IS 'Detalles de programación por empleado y fecha';
COMMENT ON COLUMN programacion_detalle.id_programacion_detalle IS 'Identificador único del detalle';
COMMENT ON COLUMN programacion_detalle.fecha IS 'Fecha específica programada';
COMMENT ON COLUMN programacion_detalle.dia_semana IS 'Nombre del día de la semana';
COMMENT ON COLUMN programacion_detalle.numero_dia_semana IS 'Número del día (1=Lunes, 7=Domingo)';
COMMENT ON COLUMN programacion_detalle.id_empleado IS 'Referencia externa al empleado (Employee Service)';
COMMENT ON COLUMN programacion_detalle.id_programacion IS 'Programación a la que pertenece';

-- =====================================================
-- TABLA: dias_por_empleado
-- =====================================================
CREATE TABLE IF NOT EXISTS dias_por_empleado (
    id BIGSERIAL PRIMARY KEY,
    id_empleado INTEGER NOT NULL,  -- Referencia externa (Employee Service)
    dias TEXT,  -- JSON array de números (días de la semana: [1,2,3,4,5])
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE dias_por_empleado IS 'Días de la semana que trabaja cada empleado';
COMMENT ON COLUMN dias_por_empleado.id IS 'Identificador único';
COMMENT ON COLUMN dias_por_empleado.id_empleado IS 'Referencia externa al empleado (Employee Service)';
COMMENT ON COLUMN dias_por_empleado.dias IS 'Array JSON con los días (ej: [1,2,3,4,5] para Lunes a Viernes)';

-- =====================================================
-- ÍNDICES
-- =====================================================

-- Índices para programacion
CREATE INDEX IF NOT EXISTS idx_programacion_empresa ON programacion(id_empresa);
CREATE INDEX IF NOT EXISTS idx_programacion_activo ON programacion(activo);
CREATE INDEX IF NOT EXISTS idx_programacion_fechas ON programacion(fecha_inicial, fecha_final);
CREATE INDEX IF NOT EXISTS idx_programacion_semana ON programacion(numero_semana);

-- Índices para programacion_detalle
CREATE INDEX IF NOT EXISTS idx_programacion_detalle_programacion ON programacion_detalle(id_programacion);
CREATE INDEX IF NOT EXISTS idx_programacion_detalle_empleado ON programacion_detalle(id_empleado);
CREATE INDEX IF NOT EXISTS idx_programacion_detalle_fecha ON programacion_detalle(fecha);
CREATE INDEX IF NOT EXISTS idx_programacion_detalle_activo ON programacion_detalle(activo);
CREATE INDEX IF NOT EXISTS idx_programacion_detalle_empleado_fecha ON programacion_detalle(id_empleado, fecha);

-- Índices para horario
CREATE INDEX IF NOT EXISTS idx_horario_empresa ON horario(id_empresa);
CREATE INDEX IF NOT EXISTS idx_horario_activo ON horario(activo);

-- Índices para feriado
CREATE INDEX IF NOT EXISTS idx_feriado_fecha ON feriado(fecha);
CREATE INDEX IF NOT EXISTS idx_feriado_anio ON feriado(EXTRACT(YEAR FROM fecha));

-- Índices para dias_por_empleado
CREATE INDEX IF NOT EXISTS idx_dias_por_empleado_empleado ON dias_por_empleado(id_empleado);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Verificar tablas creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;



