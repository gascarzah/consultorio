-- Deduplicar tipo_empleado por nombre (case-insensitive) y evitar nuevos duplicados.
-- Conserva el id más bajo; reasigna empleados de los duplicados y desactiva el resto.

UPDATE empleado e
SET id_tipo_empleado = keeper.id_tipo_empleado
FROM tipo_empleado dup
JOIN LATERAL (
  SELECT MIN(t.id_tipo_empleado) AS id_tipo_empleado
  FROM tipo_empleado t
  WHERE LOWER(TRIM(t.nombre)) = LOWER(TRIM(dup.nombre))
) keeper ON TRUE
WHERE e.id_tipo_empleado = dup.id_tipo_empleado
  AND dup.id_tipo_empleado <> keeper.id_tipo_empleado
  AND dup.nombre IS NOT NULL
  AND TRIM(dup.nombre) <> '';

UPDATE tipo_empleado dup
SET activo = FALSE
FROM (
  SELECT MIN(t.id_tipo_empleado) AS id_tipo_empleado, LOWER(TRIM(t.nombre)) AS nombre_norm
  FROM tipo_empleado t
  WHERE t.nombre IS NOT NULL
    AND TRIM(t.nombre) <> ''
  GROUP BY LOWER(TRIM(t.nombre))
) keeper
WHERE LOWER(TRIM(dup.nombre)) = keeper.nombre_norm
  AND dup.id_tipo_empleado <> keeper.id_tipo_empleado
  AND COALESCE(dup.activo, TRUE) = TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS uq_tipo_empleado_nombre_activo
  ON tipo_empleado (LOWER(TRIM(nombre)))
  WHERE activo = TRUE
    AND nombre IS NOT NULL
    AND TRIM(nombre) <> '';
