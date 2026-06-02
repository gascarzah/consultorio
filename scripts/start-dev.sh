#!/usr/bin/env bash
# Levanta backend (Spring Boot) y frontend (Vite) en paralelo.
# Uso: ./scripts/start-dev.sh   (desde la raíz del repo)

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  echo ""
  echo "Deteniendo servicios..."
  if [[ -n "$FRONTEND_PID" ]] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
  if [[ -n "$BACKEND_PID" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  wait 2>/dev/null || true
}

trap cleanup SIGINT SIGTERM
trap 'cleanup; exit 0' EXIT

if [[ ! -f "$BACKEND_DIR/.env" ]]; then
  echo "AVISO: No existe backend/.env — copia backend/.env.example y configura la BD."
  if [[ -f "$BACKEND_DIR/.env.example" ]]; then
    read -r -p "¿Crear backend/.env desde .env.example? [s/N] " ans
    if [[ "${ans,,}" == "s" || "${ans,,}" == "y" ]]; then
      cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
      echo "Creado backend/.env"
    fi
  fi
fi

if [[ ! -f "$FRONTEND_DIR/.env" ]] && [[ -f "$FRONTEND_DIR/.env.example" ]]; then
  cp "$FRONTEND_DIR/.env.example" "$FRONTEND_DIR/.env"
  echo "Creado frontend/.env desde .env.example"
fi

if [[ ! -x "$BACKEND_DIR/gradlew" ]]; then
  echo "Error: no se encuentra backend/gradlew ejecutable."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm no está en el PATH."
  exit 1
fi

if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
  echo "Instalando dependencias del frontend (npm ci)..."
  (cd "$FRONTEND_DIR" && npm ci)
fi

echo "Iniciando backend..."
(
  cd "$BACKEND_DIR"
  if [[ -f .env ]]; then
    set -a
    # shellcheck disable=SC1091
    source .env
    set +a
  fi
  ./gradlew --no-daemon bootRun
) &
BACKEND_PID=$!

echo "Iniciando frontend..."
(
  cd "$FRONTEND_DIR"
  npm run dev
) &
FRONTEND_PID=$!

echo ""
echo "=========================================="
echo "  Consultorio — entorno de desarrollo"
echo "=========================================="
echo "  API:  http://localhost:8080/consultorio/"
echo "  UI:   http://localhost:5173"
echo "  Swagger (dev): http://localhost:8080/consultorio/swagger-ui.html"
echo "=========================================="
echo "  Pulsa Ctrl+C para detener ambos."
echo ""

wait
