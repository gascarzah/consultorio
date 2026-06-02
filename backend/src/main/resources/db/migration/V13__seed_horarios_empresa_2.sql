-- Genera bloques horarios de 1 hora para la empresa 2
-- desde 07:00 hasta 22:00 (ultimo bloque: 21:00 - 22:00).
-- Script idempotente.

ALTER TABLE IF EXISTS horario
  ADD COLUMN IF NOT EXISTS id_empresa INTEGER;

INSERT INTO horario (descripcion, id_empresa, activo)
SELECT
  LPAD(h::text, 2, '0') || ':00 - ' || LPAD((h + 1)::text, 2, '0') || ':00' AS descripcion,
  2 AS id_empresa,
  TRUE AS activo
FROM generate_series(7, 21) AS h
WHERE NOT EXISTS (
  SELECT 1
  FROM horario x
  WHERE x.id_empresa = 2
    AND x.descripcion = LPAD(h::text, 2, '0') || ':00 - ' || LPAD((h + 1)::text, 2, '0') || ':00'
);
