#!/usr/bin/env bash
# Compila backend (bootJar) + frontend (Vite prod) en tu PC.
# Uso: bash deploy/native/scripts/build-local.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
NATIVE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DEPLOY_DIR="$(cd "$NATIVE_DIR/.." && pwd)"
ROOT="$(cd "$DEPLOY_DIR/.." && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Falta comando: $1" >&2
    exit 1
  }
}

require_cmd java

echo "==> Backend (Spring Boot bootJar)"
cd "$BACKEND"
chmod +x gradlew 2>/dev/null || true
./gradlew bootJar -x test --no-daemon -q

JAR="$(ls -1 "$BACKEND/build/libs/"*.jar | grep -v plain | head -1)"
[[ -f "$JAR" ]] || { echo "No se generó bootJar" >&2; exit 1; }
echo "    $JAR ($(du -h "$JAR" | cut -f1))"

echo "==> Frontend (Vite, subpath /consultorios/)"
cd "$FRONTEND"
require_cmd npm
export VITE_API_URL="${VITE_API_URL:-https://gafah.dev/consultorio/}"
export VITE_BASE_PATH="${VITE_BASE_PATH:-/consultorios/}"
npm run build:prod

[[ -f "$FRONTEND/dist/index.html" ]] || { echo "No se generó dist/index.html" >&2; exit 1; }
grep -q '/consultorios/' "$FRONTEND/dist/index.html" || {
  echo "dist/index.html no usa base /consultorios/ — revisa vite.config.prod.js" >&2
  exit 1
}

echo ""
echo "==> Artefactos listos:"
echo "  $JAR"
echo "  $FRONTEND/dist/"
echo ""
echo "Siguiente:"
echo "  DROPLET=gafah@157.230.215.197 bash deploy/native/scripts/upload-artifacts.sh"
