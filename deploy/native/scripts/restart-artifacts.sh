#!/usr/bin/env bash
# Ejecutar EN EL DROPLET tras subir artefactos.
# Uso: bash ~/consultorio/deploy/native/scripts/restart-artifacts.sh

set -euo pipefail

CONSULTORIO_ROOT="${CONSULTORIO_ROOT:-$HOME/consultorio}"
DEPLOY="$CONSULTORIO_ROOT/deploy"
UNIT_SRC="$DEPLOY/native/systemd/consultorio-backend.service"
UNIT_DST="$HOME/.config/systemd/user/consultorio-backend.service"
ENV_FILE="$CONSULTORIO_ROOT/.env"
EXAMPLE="$DEPLOY/native/backend.env.example"

[[ -f "$CONSULTORIO_ROOT/app.jar" ]] || {
  echo "Falta $CONSULTORIO_ROOT/app.jar" >&2
  exit 1
}
[[ -f "$CONSULTORIO_ROOT/frontend/index.html" ]] || {
  echo "Falta frontend en $CONSULTORIO_ROOT/frontend/" >&2
  exit 1
}

mkdir -p "$CONSULTORIO_ROOT/logs" "$HOME/.config/systemd/user"

if [[ ! -f "$ENV_FILE" ]]; then
  cp "$EXAMPLE" "$ENV_FILE"
  chmod 600 "$ENV_FILE"
  echo "Creado $ENV_FILE — edita DB_PASSWORD y JWT_SECRET_KEY, luego vuelve a ejecutar." >&2
  exit 1
fi

# Asegurar esquema consultorio en gafahnet
if command -v docker >/dev/null 2>&1 && docker ps --format '{{.Names}}' | grep -q '^academias-postgres$'; then
  DBPW="$(grep '^DB_PASSWORD=' "$ENV_FILE" | cut -d= -f2- || true)"
  if [[ -n "$DBPW" ]]; then
    docker exec -e PGPASSWORD="$DBPW" academias-postgres psql -U gafah -d gafahnet -v ON_ERROR_STOP=1 -c \
      "CREATE SCHEMA IF NOT EXISTS consultorio AUTHORIZATION gafah;" >/dev/null 2>&1 || true
  fi
fi

grep -q '^DB_SCHEMA=' "$ENV_FILE" || echo 'DB_SCHEMA=consultorio' >> "$ENV_FILE"
if grep -q '^DB_URL=jdbc:postgresql://127.0.0.1:5432/gafahnet$' "$ENV_FILE"; then
  sed -i 's|^DB_URL=jdbc:postgresql://127.0.0.1:5432/gafahnet$|DB_URL=jdbc:postgresql://127.0.0.1:5432/gafahnet?currentSchema=consultorio|' "$ENV_FILE"
fi

cp "$UNIT_SRC" "$UNIT_DST"
systemctl --user daemon-reload
systemctl --user enable consultorio-backend.service
systemctl --user restart consultorio-backend.service

echo "==> Esperando arranque (hasta 360s; en 1 GB RAM puede tardar)..."
if ! swapon --show 2>/dev/null | grep -q .; then
  echo "AVISO: no hay swap. Si no arranca, en el Droplet: sudo fallocate -l 1G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile" >&2
fi
for i in $(seq 1 72); do
  if curl -fsS --max-time 5 "http://127.0.0.1:8082/consultorio/actuator/health" >/dev/null 2>&1; then
    echo "OK health: http://127.0.0.1:8082/consultorio/actuator/health"
    curl -sS "http://127.0.0.1:8082/consultorio/actuator/health"
    echo
    exit 0
  fi
  sleep 5
done

echo "Health aún no responde. Logs:" >&2
tail -30 "$CONSULTORIO_ROOT/logs/backend.log" 2>/dev/null || journalctl --user -u consultorio-backend -n 30 --no-pager
exit 1
