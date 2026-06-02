# Provisiona rol + base consultorio_db. Requiere psql en PATH y PGPASSWORD (superusuario).
$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

$PgHost = if ($env:PGHOST) { $env:PGHOST } else { "localhost" }
$PgPort = if ($env:PGPORT) { $env:PGPORT } else { "5432" }
$PgAdminUser = if ($env:PGADMIN_USER) { $env:PGADMIN_USER } else { "postgres" }
$PgAdminDb = if ($env:PGADMIN_DB) { $env:PGADMIN_DB } else { "postgres" }

if (-not $env:PGPASSWORD) {
    Write-Error "Defina la variable de entorno PGPASSWORD con la contraseña del usuario administrador ($PgAdminUser)."
}

function Invoke-MonolithSql {
    param(
        [string]$Database,
        [string]$File
    )
    & psql -h $PgHost -p $PgPort -U $PgAdminUser -d $Database -v ON_ERROR_STOP=1 -f $File
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host "==> 01_create_app_role.sql (en $PgAdminDb)"
Invoke-MonolithSql -Database $PgAdminDb -File "01_create_app_role.sql"

Write-Host "==> 02_create_database.sql (en $PgAdminDb)"
Invoke-MonolithSql -Database $PgAdminDb -File "02_create_database.sql"

Write-Host "==> 03_post_create_grants.sql (en consultorio_db)"
Invoke-MonolithSql -Database "consultorio_db" -File "03_post_create_grants.sql"

Write-Host "Listo. Configure backend\.env (vea consultorio-backend.env.snippet) y arranque la app para Flyway."
