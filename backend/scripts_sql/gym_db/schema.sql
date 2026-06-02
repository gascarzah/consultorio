-- =====================================================
-- Gym Service - Base de Datos: gym_db
-- Descripción: Esquema completo para módulo de gimnasio (Opcional)
-- =====================================================

-- Conectar a la base de datos
\c gym_db;

-- =====================================================
-- TABLA: plan
-- =====================================================
CREATE TABLE IF NOT EXISTS plan (
    id_plan SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2),
    duracion_dias INTEGER,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE plan IS 'Planes de membresía del gimnasio';
COMMENT ON COLUMN plan.id_plan IS 'Identificador único del plan';
COMMENT ON COLUMN plan.nombre IS 'Nombre del plan';
COMMENT ON COLUMN plan.descripcion IS 'Descripción del plan';
COMMENT ON COLUMN plan.precio IS 'Precio del plan';
COMMENT ON COLUMN plan.duracion_dias IS 'Duración del plan en días';
COMMENT ON COLUMN plan.activo IS 'Indica si el plan está activo';

-- =====================================================
-- TABLA: matricula
-- =====================================================
CREATE TABLE IF NOT EXISTS matricula (
    id_matricula SERIAL PRIMARY KEY,
    id_plan INTEGER,
    numero_documento VARCHAR(20),
    nombres VARCHAR(255),
    apellido_paterno VARCHAR(255),
    apellido_materno VARCHAR(255),
    fecha_inicio DATE,
    fecha_fin DATE,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_matricula_plan FOREIGN KEY (id_plan) REFERENCES plan(id_plan) ON DELETE SET NULL
);

COMMENT ON TABLE matricula IS 'Matrículas de miembros del gimnasio';
COMMENT ON COLUMN matricula.id_matricula IS 'Identificador único de la matrícula';
COMMENT ON COLUMN matricula.id_plan IS 'Plan asociado';
COMMENT ON COLUMN matricula.numero_documento IS 'Número de documento del miembro';
COMMENT ON COLUMN matricula.fecha_inicio IS 'Fecha de inicio de la membresía';
COMMENT ON COLUMN matricula.fecha_fin IS 'Fecha de fin de la membresía';
COMMENT ON COLUMN matricula.activo IS 'Indica si la matrícula está activa';

-- =====================================================
-- TABLA: visita
-- =====================================================
CREATE TABLE IF NOT EXISTS visita (
    id_visita SERIAL PRIMARY KEY,
    id_matricula INTEGER,
    fecha_visita TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_visita_matricula FOREIGN KEY (id_matricula) REFERENCES matricula(id_matricula) ON DELETE CASCADE
);

COMMENT ON TABLE visita IS 'Registro de visitas al gimnasio';
COMMENT ON COLUMN visita.id_visita IS 'Identificador único de la visita';
COMMENT ON COLUMN visita.id_matricula IS 'Matrícula asociada';
COMMENT ON COLUMN visita.fecha_visita IS 'Fecha y hora de la visita';

-- =====================================================
-- ÍNDICES
-- =====================================================

-- Índices para matricula
CREATE INDEX IF NOT EXISTS idx_matricula_plan ON matricula(id_plan);
CREATE INDEX IF NOT EXISTS idx_matricula_documento ON matricula(numero_documento);
CREATE INDEX IF NOT EXISTS idx_matricula_activo ON matricula(activo);
CREATE INDEX IF NOT EXISTS idx_matricula_fechas ON matricula(fecha_inicio, fecha_fin);

-- Índices para visita
CREATE INDEX IF NOT EXISTS idx_visita_matricula ON visita(id_matricula);
CREATE INDEX IF NOT EXISTS idx_visita_fecha ON visita(fecha_visita);

-- Índices para plan
CREATE INDEX IF NOT EXISTS idx_plan_activo ON plan(activo);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Verificar tablas creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;



