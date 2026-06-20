#!/usr/bin/env bash
# Sube JAR + dist + deploy al Droplet (sin compilar en servidor).
# Uso: DROPLET=gafah@157.230.215.197 bash deploy/native/scripts/upload-artifacts.sh

set -euo pipefail

DROPLET="${DROPLET:-gafah@157.230.215.197}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
NATIVE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DEPLOY_DIR="$(cd "$NATIVE_DIR/.." && pwd)"
ROOT="$(cd "$DEPLOY_DIR/.." && pwd)"
REMOTE="${REMOTE_DIR:-consultorio}"

BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"
JAR="$(ls -1 "$BACKEND/build/libs/"*.jar 2>/dev/null | grep -v plain | head -1 || true)"

[[ -f "$JAR" ]] || {
  echo "Falta bootJar. Ejecuta: bash deploy/native/scripts/build-local.sh" >&2
  exit 1
}
[[ -f "$FRONTEND/dist/index.html" ]] || {
  echo "Falta frontend/dist. Ejecuta build-local.sh" >&2
  exit 1
}

echo "==> Destino: $DROPLET:~/$REMOTE/"
ssh "$DROPLET" "mkdir -p ~/$REMOTE/frontend ~/$REMOTE/logs ~/$REMOTE/deploy"

echo "==> Backend app.jar ($(du -h "$JAR" | cut -f1))"
scp "$JAR" "$DROPLET:~/$REMOTE/app.jar"

echo "==> Frontend dist/"
scp -r "$FRONTEND/dist/." "$DROPLET:~/$REMOTE/frontend/"

echo "==> Deploy (scripts, systemd, nginx)"
tar -czf - --exclude=.git -C "$DEPLOY_DIR" . \
  | ssh "$DROPLET" "tar -xzf - -C ~/$REMOTE/deploy"

echo ""
echo "==> Instalar / reiniciar en el Droplet:"
echo "  ssh $DROPLET 'bash ~/$REMOTE/deploy/native/scripts/restart-artifacts.sh'"
echo ""
echo "Nginx (requiere sudo una vez o al cambiar rutas):"
echo "  ssh $DROPLET 'sudo cp ~/$REMOTE/deploy/nginx/gafah.dev.with-consultorios.conf /etc/nginx/sites-available/gafah.dev && sudo nginx -t && sudo systemctl reload nginx'"
