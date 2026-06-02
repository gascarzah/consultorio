-- =============================================================================
-- Monolito consultorio: rol de aplicación
-- Ejecutar conectado a la base "postgres" (o "template1") como superusuario.
-- Edita la contraseña antes de ejecutar (o usa ALTER ROLE después).
-- Con psql se recomienda: -v ON_ERROR_STOP=1
-- =============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'consultorio_app') THEN
    CREATE ROLE consultorio_app WITH LOGIN PASSWORD 'CambiarEstaContraseña';
    RAISE NOTICE 'Rol consultorio_app creado.';
  ELSE
    RAISE NOTICE 'Rol consultorio_app ya existe; no se cambia la contraseña desde este script.';
  END IF;
END
$$;
