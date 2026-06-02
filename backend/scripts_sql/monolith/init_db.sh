#!/usr/bin/env bash
# Provisiona rol + base consultorio_db. Requiere psql y PGPASSWORD (superusuario).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PGHOST="${PGHOST:-localhost}"
PGPORT="${PGPORT:-5432}"
PGADMIN_USER="${PGADMIN_USER:-postgres}"
PGADMIN_DB="${PGADMIN_DB:-postgres}"

if [[ -z "${PGPASSWORD:-}" ]]; then
  echo "Defina PGPASSWORD con la contraseña del usuario administrador de PostgreSQL (${PGADMIN_USER})." >&2
  exit 1
fi

export PGPASSWORD

run_psql() {
  local dbname="$1"
  shift
  psql -h "$PGHOST" -p "$PGPORT" -U "$PGADMIN_USER" -d "$dbname" -v ON_ERROR_STOP=1 "$@"
}

echo "==> 01_create_app_role.sql (en ${PGADMIN_DB})"
run_psql "$PGADMIN_DB" -f 01_create_app_role.sql

echo "==> 02_create_database.sql (en ${PGADMIN_DB})"
run_psql "$PGADMIN_DB" -f 02_create_database.sql

echo "==> 03_post_create_grants.sql (en consultorio_db)"
run_psql "consultorio_db" -f 03_post_create_grants.sql

echo "Listo. Configure backend/.env (vea consultorio-backend.env.snippet) y arranque la app para Flyway."
