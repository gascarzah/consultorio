-- Columna requerida por JPA (HistoriaClinica.tipoDocumento) ausente en BD legacy.
ALTER TABLE historia_clinica
    ADD COLUMN IF NOT EXISTS tipo_documento VARCHAR(20);
