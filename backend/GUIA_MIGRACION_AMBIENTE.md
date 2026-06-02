# Guía de migración a otro ambiente

Documento de referencia para desplegar el backend (y consumo desde frontend) en un **nuevo servidor o entorno** (staging, producción, otro equipo) sin duplicar esquema, seeds ni secretos de forma incorrecta.

---

## 1. Alcance

| Componente | Rol en la migración |
|------------|---------------------|
| **Backend (Spring Boot)** | Conexión a PostgreSQL, Flyway, JWT, cron. |
| **PostgreSQL** | Donde vive el esquema y los datos; debe existir instancia y base (o bases) en el destino. |
| **Frontend (Vite)** | Solo URL del API y timeout; no migra base de datos. |
| **Migraciones Flyway** | Fuente única del esquema y de datos de referencia versionados (`src/main/resources/db/migration/`). |
| **`scripts_sql/`** | Documentación / creación manual multi-BD según arquitectura objetivo; ver `scripts_sql/README.md` y `DISTRIBUCION_BASE_DATOS.md`. |

Este monolito usa **una** URL JDBC (`DB_URL`). Si en el destino adoptas **varias bases** (microservicios), hay que alinear datasource(s) y migraciones con esa arquitectura; la lógica de “no duplicar” es la misma por cada base.

---

## 2. Qué debe existir una sola vez (no repetir mal)

### 2.1 Esquema y seeds versionados

- **Flyway** aplica en orden los scripts `V*.sql` bajo `src/main/resources/db/migration/`.
- Eso incluye tablas, índices y **datos iniciales** (menús, roles, horarios de ejemplo, etc.) que ya estén en esas migraciones.
- En un ambiente nuevo **vacío**, basta con arrancar la aplicación (o `flyway migrate`) para que el esquema y esos seeds se creen **una vez**.

### 2.2 Tabla `flyway_schema_history`

- La gestiona Flyway.
- Si restauras un **dump completo** de otra base donde Flyway ya corrió, esa tabla ya refleja las versiones aplicadas. **No** vuelvas a ejecutar a mano los mismos `INSERT` de catálogo que ya están en migraciones, ni mezcles “dump + scripts sueltos” sin revisar duplicados y unicidades.

### 2.3 Lo que no conviene clonar o reutilizar

| Qué | Motivo |
|-----|--------|
| **JWT y secretos** del ambiente anterior | Cada ambiente debe tener sus propios valores; rotar `JWT_SECRET_KEY` en producción. |
| **Credenciales de BD** | Usuario/contraseña/host del nuevo servidor. |
| **Tokens / sesiones** (tabla `token`, etc.) | Datos efímeros; en destino suele ser mejor empezar limpio. |
| **Doble aplicación de seeds** | Restore que ya trae filas + migraciones que insertan las mismas claves → errores o datos duplicados. |

---

## 3. Variables de entorno

### 3.1 Backend

Copiar **`backend/.env.example`** a `.env` en el servidor (o definir variables en el orquestador) y **ajustar** al destino:

| Variable | Uso |
|----------|-----|
| `DB_URL` | JDBC completo, p. ej. `jdbc:postgresql://HOST:5432/NOMBRE_BASE` |
| `DB_USERNAME` / `DB_PASSWORD` | Credenciales del nuevo PostgreSQL |
| `JPA_SHOW_SQL` | `false` en producción si no necesitas trazas SQL |
| `JPA_DDL_AUTO` | En **producción** se recomienda `validate` (como en `.env.example`). `update` altera el esquema al vuelo y puede chocar con Flyway. |
| `FLYWAY_ENABLED` | `true` para aplicar migraciones al arranque |
| `FLYWAY_VALIDATE_ON_MIGRATE` | `true` recomendado |
| `FLYWAY_CLEAN_DISABLED` | En **producción** debe ser `true` (no permitir `clean`). Valores actuales del proyecto conviene revisarlos por entorno. |
| `FLYWAY_CLEAN_ON_VALIDATION_ERROR` | En producción suele ser `false`; `clean` borra objetos de la base. |
| `CRON_EXPRESSION` | Ajustar zona horaria y política del nuevo entorno |
| `JWT_SECRET_KEY` | **Nuevo** valor fuerte y codificado en Base64 según lo que espere tu configuración de seguridad |
| `JWT_EXPIRATION_MS` / `JWT_REFRESH_EXPIRATION_MS` | Política de sesión del ambiente |

Referencia YAML: `src/main/resources/application.yml`.

### 3.2 Frontend

Copiar **`frontend/.env.example`** a `.env` (o variables del build):

| Variable | Uso |
|----------|-----|
| `VITE_API_URL` | URL pública del backend en el nuevo ambiente (incluir context-path `/consultorio/` si aplica) |
| `VITE_API_TIMEOUT` | Timeout de peticiones |

---

## 4. Estrategias de migración

### Estrategia A — Ambiente nuevo sin datos de negocio (recomendada para staging)

1. Crear base de datos (y usuario con permisos) en PostgreSQL destino.
2. Configurar `.env` del backend con la nueva `DB_URL` y secretos nuevos.
3. Arrancar la aplicación con Flyway habilitado: Flyway crea esquema + seeds versionados.
4. Crear usuarios administrativos por la vía prevista en la aplicación (o migración dedicada), si no vienen en seeds.
5. Configurar frontend con `VITE_API_URL` apuntando al nuevo backend.

**No hace falta** importar un dump del ambiente viejo si solo quieres un entorno limpio con la misma versión de código.

### Estrategia B — Llevar datos de negocio (citas, usuarios, historias, etc.)

1. Decidir si el destino parte **vacío** o desde **restore**.
2. Si partes **vacío**: aplica migraciones Flyway (Estrategia A) y luego **solo** datos de negocio con herramientas controladas (`pg_dump`/`pg_restore` por tablas, ETL, scripts auditados), respetando orden de tablas y FKs.
3. Si haces **restore completo** de la base origen: el esquema y `flyway_schema_history` ya vienen; **no** vuelvas a ejecutar migraciones antiguas a mano ni scripts de seed duplicados.
4. Tratar datos personales/sanitarios según normativa (anonimización en no productivos, acuerdos de tratamiento, etc.).

### Estrategia C — Solo referencia de esquema sin Flyway en ese momento

Los SQL bajo `scripts_sql/` sirven para crear bases y esquemas por servicio según la documentación de arquitectura. Si usas eso **y** Flyway en el mismo destino, puedes generar **divergencia** entre lo manual y lo versionado en `db/migration`. Mantén **una** fuente de verdad preferida (idealmente Flyway para el servicio que arranca).

---

## 5. Checklist rápido antes de dar por cerrada la migración

- [ ] PostgreSQL accesible desde el host del backend (firewall/red).
- [ ] Base creada y credenciales probadas (`psql` o cliente JDBC).
- [ ] `.env` backend con valores del **nuevo** ambiente (sin copiar secretos del viejo).
- [ ] `JPA_DDL_AUTO=validate` (o política acordada) en producción.
- [ ] Flyway sin `clean` en producción (`FLYWAY_CLEAN_DISABLED=true`).
- [ ] Frontend apunta al API correcto; CORS en backend si el dominio del front cambió.
- [ ] Smoke test: login, endpoint crítico, una escritura de prueba si aplica.
- [ ] Backup del ambiente origen antes de cortar tráfico (si es cutover).

---

## 6. Documentación relacionada en el repositorio

- `scripts_sql/monolith/` — Scripts SQL y `init_db.sh` / `init_db.ps1` para crear rol y base `consultorio_db` en un servidor nuevo (Flyway aplica el esquema al arrancar).
- `DISTRIBUCION_BASE_DATOS.md` — Diseño por microservicio y BDs.
- `scripts_sql/README.md` — Creación manual de bases y esquemas.
- `EJEMPLO_IMPLEMENTACION.md` — Notas de implementación y Flyway.

---

## 7. Resumen en una frase

**Versiona y aplica una sola vez** esquema + seeds con **Flyway** en la base destino; **no dupliques** inserts de lo que ya migran los `V*.sql`; **renueva** URLs, usuarios de BD y JWT; para **datos de negocio** usa dump/ETL consciente de `flyway_schema_history` y de unicidades.
