-- =====================================================
-- Catalog Service - Base de Datos: catalog_db
-- Descripción: Esquema completo para catálogos y datos maestros
-- =====================================================

-- Conectar a la base de datos
\c catalog_db;

-- =====================================================
-- TABLA: maestra
-- =====================================================
CREATE TABLE IF NOT EXISTS maestra (
    id_maestra SERIAL PRIMARY KEY,
    id_maestra_padre INTEGER,  -- Auto-referencia (tabla jerárquica)
    id_empresa INTEGER,  -- Referencia externa (Employee Service)
    descripcion VARCHAR(255) NOT NULL,
    estado BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creado_por VARCHAR(100),
    modificado_por VARCHAR(100),
    CONSTRAINT fk_maestra_padre FOREIGN KEY (id_maestra_padre) REFERENCES maestra(id_maestra) ON DELETE CASCADE
);

COMMENT ON TABLE maestra IS 'Tabla maestra para datos de referencia configurables';
COMMENT ON COLUMN maestra.id_maestra IS 'Identificador único del registro maestra';
COMMENT ON COLUMN maestra.id_maestra_padre IS 'Referencia al registro padre (para jerarquías)';
COMMENT ON COLUMN maestra.id_empresa IS 'Referencia externa a la empresa (Employee Service)';
COMMENT ON COLUMN maestra.descripcion IS 'Descripción del registro';
COMMENT ON COLUMN maestra.estado IS 'Indica si el registro está activo';

-- =====================================================
-- ÍNDICES
-- =====================================================

-- Índices para maestra
CREATE INDEX IF NOT EXISTS idx_maestra_padre ON maestra(id_maestra_padre);
CREATE INDEX IF NOT EXISTS idx_maestra_empresa ON maestra(id_empresa);
CREATE INDEX IF NOT EXISTS idx_maestra_estado ON maestra(estado);
CREATE INDEX IF NOT EXISTS idx_maestra_descripcion ON maestra(descripcion);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Verificar tablas creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;



