-- V8: Garantizar que cualquier usuario con rol SUPER vea todas las opciones.
-- Implementacion a nivel de datos: asignar todos los menus activos al rol SUPER.
-- Script idempotente para ejecuciones repetidas.

INSERT INTO rol_menu (id_rol, id_menu)
SELECT r.id_rol, m.id_menu
FROM rol r
JOIN menu m ON m.activo = TRUE
WHERE UPPER(r.nombre) = 'SUPER'
  AND COALESCE(r.activo, TRUE) = TRUE
  AND NOT EXISTS (
    SELECT 1
    FROM rol_menu rm
    WHERE rm.id_rol = r.id_rol
      AND rm.id_menu = m.id_menu
  );
