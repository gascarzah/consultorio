#!/usr/bin/env bash
# Build local + subida + reinicio en Droplet.
# Uso: bash scripts/deploy-droplet.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DROPLET="${DEPLOY_HOST:-gafah@157.230.215.197}"

bash "$ROOT/deploy/native/scripts/build-local.sh"
DROPLET="$DROPLET" bash "$ROOT/deploy/native/scripts/upload-artifacts.sh"
ssh "$DROPLET" "find ~/consultorio/deploy -type f -name '*.sh' -exec sed -i 's/\r$//' {} + 2>/dev/null; bash ~/consultorio/deploy/native/scripts/restart-artifacts.sh"

echo ""
echo "Si nginx aún no tiene consultorios:"
echo "  ssh $DROPLET 'sudo cp ~/consultorio/deploy/nginx/gafah.dev.with-consultorios.conf /etc/nginx/sites-available/gafah.dev && sudo nginx -t && sudo systemctl reload nginx'"
echo "  https://gafah.dev/consultorios/"
