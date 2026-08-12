-- V9: Semilla de opciones de menu y asignacion por rol.
-- Objetivo:
-- 1) Crear menus base si no existen.
-- 2) Garantizar que SUPER tenga todas las opciones activas.
-- 3) Asignar un set operativo a ADMIN (sin configuracion sensible).
-- Script idempotente.

-- Menus base del frontend (paths usados por Sidebar/rutas).
INSERT INTO menu (nombre, path, activo)
SELECT x.nombre, x.path, TRUE
FROM (
  VALUES
    ('Dashboard', '/dashboard'),
    ('Horarios', 'listar-horario'),
    ('Programaciones', 'listar-programacion'),
    ('Programacion Detalle', 'listar-programacion-detalle'),
    ('Historias Clinicas', 'listar-historia-clinica'),
    ('Citas', 'listar-cita'),
    ('Consultas', 'listar-consulta'),
    ('Usuarios', 'listar-usuario'),
    ('Empleados', 'listar-empleado'),
    ('Empresas', 'listar-empresa'),
    ('Tipos Empleado', 'listar-tipo-empleado'),
    ('Roles', 'listar-rol'),
    ('Menus', 'listar-menu'),
    ('Rol Menu', 'listar-rol-menu')
) AS x(nombre, path)
WHERE NOT EXISTS (
  SELECT 1 FROM menu m WHERE m.path = x.path
);

-- SUPER: todas las opciones activas.
INSERT INTO rol_menu (id_rol, id_menu)
SELECT r.id_rol, m.id_menu
FROM rol r
JOIN menu m ON COALESCE(m.activo, TRUE) = TRUE
WHERE UPPER(r.nombre) = 'SUPER'
  AND COALESCE(r.activo, TRUE) = TRUE
  AND NOT EXISTS (
    SELECT 1
    FROM rol_menu rm
    WHERE rm.id_rol = r.id_rol
      AND rm.id_menu = m.id_menu
  );

-- ADMIN: opciones operativas (sin configuracion sensible de roles/menus).
INSERT INTO rol_menu (id_rol, id_menu)
SELECT r.id_rol, m.id_menu
FROM rol r
JOIN menu m ON m.path IN (
  '/dashboard',
  'listar-horario',
  'listar-programacion',
  'listar-programacion-detalle',
  'listar-historia-clinica',
  'listar-cita',
  'listar-consulta',
  'listar-usuario',
  'listar-empleado',
  'listar-empresa',
  'listar-tipo-empleado'
)
WHERE UPPER(r.nombre) = 'ADMIN'
  AND COALESCE(r.activo, TRUE) = TRUE
  AND NOT EXISTS (
    SELECT 1
    FROM rol_menu rm
    WHERE rm.id_rol = r.id_rol
      AND rm.id_menu = m.id_menu
  );
