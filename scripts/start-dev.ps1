# Levanta backend y frontend en la misma consola (PowerShell).
# Uso: .\scripts\start-dev.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$BackendDir = Join-Path $Root "backend"
$FrontendDir = Join-Path $Root "frontend"

if (-not (Test-Path (Join-Path $BackendDir ".env"))) {
    Write-Warning "Falta backend\.env"
    $example = Join-Path $BackendDir ".env.example"
    if (Test-Path $example) { Copy-Item $example (Join-Path $BackendDir ".env") }
}

if (-not (Test-Path (Join-Path $FrontendDir ".env"))) {
    $example = Join-Path $FrontendDir ".env.example"
    if (Test-Path $example) { Copy-Item $example (Join-Path $FrontendDir ".env") }
}

if (-not (Test-Path (Join-Path $FrontendDir "node_modules"))) {
    Write-Host "Instalando dependencias del frontend..."
    Push-Location $FrontendDir
    npm ci
    Pop-Location
}

$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:BackendDir
    & .\gradlew.bat --no-daemon bootRun
}

$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:FrontendDir
    npm run dev
}

Write-Host ""
Write-Host "=========================================="
Write-Host "  Consultorio — entorno de desarrollo"
Write-Host "=========================================="
Write-Host "  API:  http://localhost:8080/consultorio/"
Write-Host "  UI:   http://localhost:5173"
Write-Host "=========================================="
Write-Host "  Logs en segundo plano. Ctrl+C para salir."
Write-Host ""

try {
    while ($true) {
        Receive-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue | ForEach-Object { Write-Host $_ }
        if ($backendJob.State -eq "Failed" -or $frontendJob.State -eq "Failed") { break }
        Start-Sleep -Seconds 1
    }
}
finally {
    Write-Host "Deteniendo servicios..."
    Stop-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob, $frontendJob -Force -ErrorAction SilentlyContinue
}
