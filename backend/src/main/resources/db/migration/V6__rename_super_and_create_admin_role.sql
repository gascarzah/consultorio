-- Renombrar rol ADMIN existente (id 1) a SUPER
UPDATE rol
SET nombre = 'SUPER'
WHERE id_rol = 1;

-- Si por alguna razón ADMIN estaba en otro id, renombrarlo también a SUPER
UPDATE rol
SET nombre = 'SUPER'
WHERE UPPER(nombre) = 'ADMIN'
  AND id_rol <> 2;

-- Crear nuevo rol ADMIN con id 2 si no existe
INSERT INTO rol (id_rol, nombre, activo)
SELECT 2, 'ADMIN', TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM rol WHERE id_rol = 2 OR UPPER(nombre) = 'ADMIN'
);

-- Sincronizar secuencia para futuros inserts automáticos
SELECT setval(
  pg_get_serial_sequence('rol', 'id_rol'),
  (SELECT COALESCE(MAX(id_rol), 1) FROM rol)
);
