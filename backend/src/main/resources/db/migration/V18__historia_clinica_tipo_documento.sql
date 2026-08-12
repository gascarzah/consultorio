-- Alinear historia_clinica con entidad JPA (tipoDocumento)
ALTER TABLE historia_clinica
  ADD COLUMN IF NOT EXISTS tipo_documento VARCHAR(255);
