# Consultorio Frontend + Backend

Proyecto full stack compuesto por dos aplicaciones:

- `backend`: API Spring Boot (Java 21, Gradle, PostgreSQL)
- `frontend`: UI React + Vite

## Requisitos

- Java 21
- Node.js 20+
- Docker (opcional, para levantar todo con contenedores)
- PostgreSQL (si se ejecuta local sin Docker)

## Configuracion por entorno

### Backend

1. Copiar `backend/.env.example` a `backend/.env`.
2. Ajustar variables segun tu entorno.

Variables principales:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET_KEY`
- `JWT_EXPIRATION_MS`
- `JWT_REFRESH_EXPIRATION_MS`

### Frontend

1. Copiar `frontend/.env.example` a `frontend/.env`.
2. Ajustar variables:
   - `VITE_API_URL`
   - `VITE_API_TIMEOUT`

## Ejecucion local (sin Docker)

### Backend + frontend a la vez

**Git Bash / Linux / macOS:**

```bash
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh
```

**Windows CMD:**

```bat
scripts\start-dev.bat
```

**PowerShell:**

```powershell
.\scripts\start-dev.ps1
```

- API: `http://localhost:8080/consultorio/`
- UI: `http://localhost:5173`
- `Ctrl+C` detiene ambos (script `.sh`).

### Por separado

**Backend:**

```bash
cd backend
./gradlew bootRun
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## Testing y calidad

### Backend

```bash
cd backend
./gradlew test
```

### Frontend

```bash
cd frontend
npm run lint
npm run test
npm run build
```

## Ejecucion con Docker Compose

Desde la raiz del proyecto:

```bash
docker compose up --build
```

Servicios disponibles:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080/consultorio`
- PostgreSQL: `localhost:5432`

## Producción

Guía de lo implementado para despliegue seguro y pasos operativos: **[PRODUCCION_IMPLEMENTACION.md](./PRODUCCION_IMPLEMENTACION.md)**.

Base de datos **vacía** en producción (solo tablas y catálogos): **[BASE_DATOS_PRODUCCION_VACIA.md](./BASE_DATOS_PRODUCCION_VACIA.md)**.

Resumen rápido:

```bash
cp .env.prod.example .env.prod
# Editar secretos y dominios
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

## CI/CD

Se agregaron pipelines de GitHub Actions:

- `backend/.github/workflows/ci.yml`
- `frontend/.github/workflows/ci.yml`

Cada pipeline ejecuta validaciones de calidad en `push` y `pull_request`.
