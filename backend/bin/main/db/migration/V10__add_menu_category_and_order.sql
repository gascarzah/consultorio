-- V10: agrega categoria y orden para renderizado dinamico del sidebar.
-- Script idempotente.

ALTER TABLE menu
  ADD COLUMN IF NOT EXISTS categoria VARCHAR(100);

ALTER TABLE menu
  ADD COLUMN IF NOT EXISTS orden INTEGER;

UPDATE menu
SET categoria = CASE
  WHEN path IN ('/dashboard', 'listar-horario', 'listar-programacion', 'listar-programacion-detalle')
    THEN 'Gestión Principal'
  WHEN path IN ('listar-historia-clinica', 'listar-cita', 'listar-consulta')
    THEN 'Gestión Médica'
  WHEN path IN ('listar-usuario', 'listar-empleado', 'listar-empresa')
    THEN 'Administración'
  WHEN path IN ('listar-rol', 'listar-menu', 'listar-rol-menu', 'listar-tipo-empleado')
    THEN 'Configuración'
  ELSE COALESCE(categoria, 'Gestión Principal')
END
WHERE categoria IS NULL OR TRIM(categoria) = '';

UPDATE menu
SET orden = CASE path
  WHEN '/dashboard' THEN 1
  WHEN 'listar-horario' THEN 2
  WHEN 'listar-programacion' THEN 3
  WHEN 'listar-programacion-detalle' THEN 4
  WHEN 'listar-historia-clinica' THEN 5
  WHEN 'listar-cita' THEN 6
  WHEN 'listar-consulta' THEN 7
  WHEN 'listar-usuario' THEN 8
  WHEN 'listar-empleado' THEN 9
  WHEN 'listar-empresa' THEN 10
  WHEN 'listar-rol' THEN 11
  WHEN 'listar-menu' THEN 12
  WHEN 'listar-rol-menu' THEN 13
  WHEN 'listar-tipo-empleado' THEN 14
  ELSE COALESCE(orden, 999)
END
WHERE orden IS NULL;
