@echo off
REM Levanta backend y frontend en ventanas separadas (Windows CMD).
REM Uso: scripts\start-dev.bat

set ROOT=%~dp0..
cd /d "%ROOT%"

if not exist "backend\.env" (
  echo AVISO: Falta backend\.env
  if exist "backend\.env.example" copy "backend\.env.example" "backend\.env"
)

if not exist "frontend\.env" (
  if exist "frontend\.env.example" copy "frontend\.env.example" "frontend\.env"
)

if not exist "frontend\node_modules" (
  echo Instalando dependencias del frontend...
  cd frontend
  call npm ci
  cd ..
)

echo Iniciando backend y frontend...
start "Consultorio Backend" cmd /k "cd /d \"%ROOT%\backend\" && gradlew.bat bootRun"
start "Consultorio Frontend" cmd /k "cd /d \"%ROOT%\frontend\" && npm run dev"

echo.
echo API:  http://localhost:8080/consultorio/
echo UI:   http://localhost:5173
echo Cierra las ventanas de consola para detener cada servicio.
