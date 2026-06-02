-- V12: normaliza categorías de menú y enlaza menú->categoría.
-- Usa el campo texto menu.categoria (V10) como fuente inicial.

CREATE TABLE IF NOT EXISTS categoria_menu (
  id_categoria SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  orden INTEGER,
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE menu
  ADD COLUMN IF NOT EXISTS id_categoria INTEGER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'menu'
      AND constraint_name = 'fk_menu_categoria_menu'
  ) THEN
    ALTER TABLE menu
      ADD CONSTRAINT fk_menu_categoria_menu
      FOREIGN KEY (id_categoria) REFERENCES categoria_menu(id_categoria);
  END IF;
END $$;

INSERT INTO categoria_menu (nombre, orden, activo)
VALUES
  ('Gestión Principal', 1, TRUE),
  ('Gestión Médica', 2, TRUE),
  ('Administración', 3, TRUE),
  ('Configuración', 4, TRUE)
ON CONFLICT (nombre) DO NOTHING;

UPDATE menu m
SET id_categoria = c.id_categoria
FROM categoria_menu c
WHERE m.id_categoria IS NULL
  AND c.nombre = COALESCE(NULLIF(TRIM(m.categoria), ''), 'Gestión Principal');

UPDATE menu
SET id_categoria = (
  SELECT id_categoria FROM categoria_menu WHERE nombre = 'Gestión Principal'
)
WHERE id_categoria IS NULL;

INSERT INTO menu (nombre, path, categoria, id_categoria, orden, activo)
SELECT
  'Categorías Menú',
  'listar-categoria-menu',
  'Configuración',
  c.id_categoria,
  15,
  TRUE
FROM categoria_menu c
WHERE c.nombre = 'Configuración'
  AND NOT EXISTS (
    SELECT 1 FROM menu m WHERE m.path = 'listar-categoria-menu'
  );

INSERT INTO rol_menu (id_rol, id_menu)
SELECT r.id_rol, m.id_menu
FROM rol r
JOIN menu m ON m.path = 'listar-categoria-menu'
WHERE UPPER(r.nombre) = 'SUPER'
  AND COALESCE(r.activo, TRUE) = TRUE
  AND NOT EXISTS (
    SELECT 1
    FROM rol_menu rm
    WHERE rm.id_rol = r.id_rol
      AND rm.id_menu = m.id_menu
  );
