-- V11: Normalizar datos heredados de soft delete en empleado.
-- Si el campo activo quedo en NULL por datos antiguos, se considera activo.

UPDATE empleado
SET activo = TRUE
WHERE activo IS NULL;
