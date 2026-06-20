-- Aislar historias clínicas por empresa (multi-tenant)
ALTER TABLE historia_clinica
    ADD COLUMN IF NOT EXISTS id_empresa INTEGER;

UPDATE historia_clinica hc
SET id_empresa = (
    SELECT MIN(e.id_empresa)
    FROM empresa e
    WHERE COALESCE(e.activo, TRUE) = TRUE
)
WHERE hc.id_empresa IS NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_schema = current_schema()
          AND table_name = 'historia_clinica'
          AND constraint_name = 'fk_historia_clinica_empresa'
    ) THEN
        ALTER TABLE historia_clinica
            ADD CONSTRAINT fk_historia_clinica_empresa
            FOREIGN KEY (id_empresa) REFERENCES empresa (id_empresa);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_historia_clinica_empresa
    ON historia_clinica (id_empresa);
