-- =========================================================
-- V7: Asegurar estructura/datos de roles SUPER y ADMIN
-- =========================================================
-- Objetivo:
-- 1) Garantizar que exista SUPER (id 1) y ADMIN (id 2)
-- 2) Corregir datos históricos donde ADMIN quedó en otros IDs
-- 3) Asegurar que SUPER tenga acceso a todos los menús activos
-- 4) Mantener script idempotente para re-ejecuciones controladas

DO $$
BEGIN
  -- Validación mínima de tablas base
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = current_schema() AND table_name = 'rol'
  ) THEN
    RAISE EXCEPTION 'Tabla requerida no encontrada: rol';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = current_schema() AND table_name = 'menu'
  ) THEN
    RAISE EXCEPTION 'Tabla requerida no encontrada: menu';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = current_schema() AND table_name = 'rol_menu'
  ) THEN
    RAISE EXCEPTION 'Tabla requerida no encontrada: rol_menu';
  END IF;
END $$;

-- 1) Forzar rol SUPER en id 1
INSERT INTO rol (id_rol, nombre, activo)
VALUES (1, 'SUPER', TRUE)
ON CONFLICT (id_rol) DO UPDATE
SET nombre = EXCLUDED.nombre,
    activo = TRUE;

-- 2) Normalizar cualquier ADMIN viejo (distinto de id 2) a SUPER
UPDATE rol
SET nombre = 'SUPER',
    activo = TRUE
WHERE UPPER(nombre) = 'ADMIN'
  AND id_rol <> 2;

-- 3) Garantizar rol ADMIN en id 2
INSERT INTO rol (id_rol, nombre, activo)
VALUES (2, 'ADMIN', TRUE)
ON CONFLICT (id_rol) DO UPDATE
SET nombre = EXCLUDED.nombre,
    activo = TRUE;

-- Si existiera ADMIN en otro ID, desactivarlo para evitar ambigüedad
UPDATE rol
SET activo = FALSE
WHERE UPPER(nombre) = 'ADMIN'
  AND id_rol <> 2;

-- 4) Asegurar que SUPER (id 1) tenga todos los menús activos
INSERT INTO rol_menu (id_rol, id_menu)
SELECT 1, m.id_menu
FROM menu m
WHERE m.activo = TRUE
  AND NOT EXISTS (
    SELECT 1
    FROM rol_menu rm
    WHERE rm.id_rol = 1
      AND rm.id_menu = m.id_menu
  );

-- 5) Sincronizar secuencia por si hubo inserts explícitos de ID
SELECT setval(
  pg_get_serial_sequence('rol', 'id_rol'),
  (SELECT COALESCE(MAX(id_rol), 1) FROM rol)
);
