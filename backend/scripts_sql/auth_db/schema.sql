-- =====================================================
-- Auth Service - Base de Datos: auth_db
-- Descripción: Esquema completo para autenticación y autorización
-- =====================================================

-- Conectar a la base de datos
\c auth_db;

-- =====================================================
-- TABLA: rol
-- =====================================================
CREATE TABLE IF NOT EXISTS rol (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    CONSTRAINT uk_rol_nombre UNIQUE (nombre)
);

COMMENT ON TABLE rol IS 'Roles del sistema (ADMIN, MANAGER, etc.)';
COMMENT ON COLUMN rol.id_rol IS 'Identificador único del rol';
COMMENT ON COLUMN rol.nombre IS 'Nombre del rol (debe ser único)';

-- =====================================================
-- TABLA: menu
-- =====================================================
CREATE TABLE IF NOT EXISTS menu (
    id_menu SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    path VARCHAR(500),
    activo BOOLEAN DEFAULT true
);

COMMENT ON TABLE menu IS 'Menús del sistema';
COMMENT ON COLUMN menu.id_menu IS 'Identificador único del menú';
COMMENT ON COLUMN menu.nombre IS 'Nombre del menú';
COMMENT ON COLUMN menu.path IS 'Ruta del menú';
COMMENT ON COLUMN menu.activo IS 'Indica si el menú está activo';

-- =====================================================
-- TABLA: rol_menu (tabla intermedia)
-- =====================================================
CREATE TABLE IF NOT EXISTS rol_menu (
    id_rol INTEGER NOT NULL,
    id_menu INTEGER NOT NULL,
    PRIMARY KEY (id_rol, id_menu),
    CONSTRAINT fk_rol_menu_rol FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON DELETE CASCADE,
    CONSTRAINT fk_rol_menu_menu FOREIGN KEY (id_menu) REFERENCES menu(id_menu) ON DELETE CASCADE
);

COMMENT ON TABLE rol_menu IS 'Relación muchos a muchos entre roles y menús';

-- =====================================================
-- TABLA: usuario
-- =====================================================
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    id_empleado INTEGER,  -- Referencia externa (Employee Service)
    CONSTRAINT uk_usuario_email UNIQUE (email)
);

COMMENT ON TABLE usuario IS 'Usuarios del sistema';
COMMENT ON COLUMN usuario.id_usuario IS 'Identificador único del usuario';
COMMENT ON COLUMN usuario.email IS 'Email del usuario (único)';
COMMENT ON COLUMN usuario.password IS 'Contraseña encriptada (BCrypt)';
COMMENT ON COLUMN usuario.id_empleado IS 'Referencia externa al empleado (Employee Service)';

-- =====================================================
-- TABLA: usuario_rol (tabla intermedia)
-- =====================================================
CREATE TABLE IF NOT EXISTS usuario_rol (
    id_usuario INTEGER NOT NULL,
    id_rol INTEGER NOT NULL,
    PRIMARY KEY (id_usuario, id_rol),
    CONSTRAINT fk_usuario_rol_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_usuario_rol_rol FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON DELETE CASCADE
);

COMMENT ON TABLE usuario_rol IS 'Relación muchos a muchos entre usuarios y roles';

-- =====================================================
-- TABLA: token
-- =====================================================
CREATE TABLE IF NOT EXISTS token (
    id SERIAL PRIMARY KEY,
    token VARCHAR(500) UNIQUE NOT NULL,
    token_type VARCHAR(50) DEFAULT 'BEARER',
    revoked BOOLEAN DEFAULT false,
    expired BOOLEAN DEFAULT false,
    id_usuario INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_token_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT uk_token_token UNIQUE (token)
);

COMMENT ON TABLE token IS 'Tokens JWT para autenticación';
COMMENT ON COLUMN token.token IS 'Token JWT completo';
COMMENT ON COLUMN token.token_type IS 'Tipo de token (BEARER)';
COMMENT ON COLUMN token.revoked IS 'Indica si el token fue revocado';
COMMENT ON COLUMN token.expired IS 'Indica si el token expiró';
COMMENT ON COLUMN token.id_usuario IS 'Usuario propietario del token';

-- =====================================================
-- ÍNDICES
-- =====================================================

-- Índices para usuario
CREATE INDEX IF NOT EXISTS idx_usuario_email ON usuario(email);
CREATE INDEX IF NOT EXISTS idx_usuario_empleado ON usuario(id_empleado);

-- Índices para token
CREATE INDEX IF NOT EXISTS idx_token_usuario ON token(id_usuario);
CREATE INDEX IF NOT EXISTS idx_token_token ON token(token);
CREATE INDEX IF NOT EXISTS idx_token_revoked ON token(revoked);
CREATE INDEX IF NOT EXISTS idx_token_expired ON token(expired);

-- Índices para usuario_rol
CREATE INDEX IF NOT EXISTS idx_usuario_rol_usuario ON usuario_rol(id_usuario);
CREATE INDEX IF NOT EXISTS idx_usuario_rol_rol ON usuario_rol(id_rol);

-- Índices para rol_menu
CREATE INDEX IF NOT EXISTS idx_rol_menu_rol ON rol_menu(id_rol);
CREATE INDEX IF NOT EXISTS idx_rol_menu_menu ON rol_menu(id_menu);

-- =====================================================
-- DATOS INICIALES (Opcional)
-- =====================================================

-- Insertar rol ADMIN por defecto
INSERT INTO rol (id_rol, nombre) VALUES (1, 'ADMIN')
ON CONFLICT (id_rol) DO NOTHING;

-- Insertar rol MANAGER por defecto
INSERT INTO rol (id_rol, nombre) VALUES (2, 'MANAGER')
ON CONFLICT (id_rol) DO NOTHING;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Verificar tablas creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar índices
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;



