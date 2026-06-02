-- =====================================================
-- Appointment Service - Base de Datos: appointment_db
-- Descripción: Esquema completo para citas e historias clínicas
-- =====================================================

-- Conectar a la base de datos
\c appointment_db;

-- =====================================================
-- TABLA: historia_clinica
-- =====================================================
CREATE TABLE IF NOT EXISTS historia_clinica (
    id_historia_clinica SERIAL PRIMARY KEY,
    ectoscopia TEXT,
    alergia TEXT,
    motivo TEXT,
    antecedentes_medicos TEXT,
    numero_documento VARCHAR(20),
    nombres VARCHAR(255),
    apellido_paterno VARCHAR(255),
    apellido_materno VARCHAR(255),
    tipo_documento VARCHAR(10),
    direccion VARCHAR(500),
    telefono VARCHAR(20),
    celular VARCHAR(20),
    email VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE historia_clinica IS 'Historias clínicas de los pacientes';
COMMENT ON COLUMN historia_clinica.id_historia_clinica IS 'Identificador único de la historia clínica';
COMMENT ON COLUMN historia_clinica.ectoscopia IS 'Examen físico';
COMMENT ON COLUMN historia_clinica.alergia IS 'Alergias del paciente';
COMMENT ON COLUMN historia_clinica.motivo IS 'Motivo de consulta';
COMMENT ON COLUMN historia_clinica.antecedentes_medicos IS 'Antecedentes médicos';
COMMENT ON COLUMN historia_clinica.numero_documento IS 'Número de documento del paciente';

-- =====================================================
-- TABLA: cita
-- =====================================================
CREATE TABLE IF NOT EXISTS cita (
    id_cita SERIAL PRIMARY KEY,
    id_historia_clinica INTEGER,  -- Puede ser NULL (cita sin historia)
    id_horario INTEGER,  -- Referencia externa (Scheduling Service)
    id_programacion_detalle INTEGER,  -- Referencia externa (Scheduling Service)
    atendido BOOLEAN DEFAULT false,
    informe TEXT,
    estado INTEGER DEFAULT 1,  -- 1: pendiente, 2: no asistió, 3: no programado, 4: atendido
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_atencion TIMESTAMP,
    CONSTRAINT fk_cita_historia 
        FOREIGN KEY (id_historia_clinica) REFERENCES historia_clinica(id_historia_clinica) ON DELETE SET NULL,
    CONSTRAINT chk_cita_estado CHECK (estado IN (1, 2, 3, 4))
);

COMMENT ON TABLE cita IS 'Citas médicas';
COMMENT ON COLUMN cita.id_cita IS 'Identificador único de la cita';
COMMENT ON COLUMN cita.id_historia_clinica IS 'Historia clínica asociada (puede ser NULL)';
COMMENT ON COLUMN cita.id_horario IS 'Referencia externa al horario (Scheduling Service)';
COMMENT ON COLUMN cita.id_programacion_detalle IS 'Referencia externa a la programación detalle (Scheduling Service)';
COMMENT ON COLUMN cita.atendido IS 'Indica si la cita fue atendida';
COMMENT ON COLUMN cita.informe IS 'Informe médico de la consulta';
COMMENT ON COLUMN cita.estado IS 'Estado de la cita: 1=pendiente, 2=no asistió, 3=no programado, 4=atendido';

-- =====================================================
-- ÍNDICES
-- =====================================================

-- Índices para cita
CREATE INDEX IF NOT EXISTS idx_cita_historia ON cita(id_historia_clinica);
CREATE INDEX IF NOT EXISTS idx_cita_horario ON cita(id_horario);
CREATE INDEX IF NOT EXISTS idx_cita_programacion_detalle ON cita(id_programacion_detalle);
CREATE INDEX IF NOT EXISTS idx_cita_estado ON cita(estado);
CREATE INDEX IF NOT EXISTS idx_cita_atendido ON cita(atendido);
CREATE INDEX IF NOT EXISTS idx_cita_fecha_creacion ON cita(fecha_creacion);

-- Índices para historia_clinica
CREATE INDEX IF NOT EXISTS idx_historia_documento ON historia_clinica(numero_documento);
CREATE INDEX IF NOT EXISTS idx_historia_nombres ON historia_clinica(nombres, apellido_paterno);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Verificar tablas creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;



