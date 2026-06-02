-- Soft delete: agregar bandera activo para horario
ALTER TABLE horario ADD COLUMN IF NOT EXISTS activo BOOLEAN;
UPDATE horario SET activo = TRUE WHERE activo IS NULL;
ALTER TABLE horario ALTER COLUMN activo SET DEFAULT TRUE;
ALTER TABLE horario ALTER COLUMN activo SET NOT NULL;
