-- Tabla cita: en instalaciones limpias Flyway corre antes que JPA; se asegura la tabla aquí.
CREATE TABLE IF NOT EXISTS cita (
  id_cita SERIAL PRIMARY KEY,
  historia_clinica INTEGER,
  id_horario INTEGER,
  id_programacion_detalle INTEGER,
  atendido BOOLEAN,
  informe VARCHAR(255),
  estado INTEGER
);

-- Campos de texto libre al registrar consulta (además de informe / dictado)
ALTER TABLE cita ADD COLUMN IF NOT EXISTS motivo VARCHAR(4000);
ALTER TABLE cita ADD COLUMN IF NOT EXISTS diagnostico VARCHAR(4000);
