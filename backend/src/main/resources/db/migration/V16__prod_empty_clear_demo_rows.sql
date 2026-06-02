-- Instalación limpia: eliminar solo horarios de demostración (V13) para empresa inexistente.
-- No borra usuarios, citas ni empresas (evita pérdida de datos al actualizar entornos existentes).

DELETE FROM horario
WHERE id_empresa = 2
  AND descripcion ~ '^\d{2}:\d{2} - \d{2}:\d{2}$';
