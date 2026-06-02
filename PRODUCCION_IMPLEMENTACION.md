# Implementación crítica para producción

Este documento describe **qué se implementó**, **por qué** y **cómo desplegar** el Consultorio (backend Spring Boot + frontend React/Vite).

Fecha de referencia: junio 2026.

---

## 1. Resumen de cambios

| Área | Qué se hizo |
|------|-------------|
| **Seguridad API** | Eliminado `permitAll` global en GET/POST/PUT. Solo públicos: `/auth/**`, `POST /usuarios` (registro) y `OPTIONS`. El resto exige JWT válido. |
| **Perfiles Spring** | `dev` (desarrollo) y `prod` (producción) con `application-dev.yml` y `application-prod.yml`. |
| **Flyway / JPA en prod** | `ddl-auto=validate`, sin `clean`, sin borrado en error de validación. |
| **Swagger** | Desactivado en perfil `prod`. Visible solo en `dev`. |
| **CORS** | Orígenes configurables con variable `CORS_ALLOWED_ORIGINS`. |
| **Actuator** | Health check en `/consultorio/actuator/health` para Docker y monitoreo. |
| **Frontend Docker** | `VITE_API_URL` y `VITE_API_TIMEOUT` en tiempo de build (`ARG`/`ENV`). |
| **Secretos Docker** | `docker-compose` usa `env_file`; sin JWT/BD hardcodeados en prod. |
| **Stack prod** | `docker-compose.prod.yml` + nginx reverse proxy (mismo dominio → API relativa `/consultorio/`). |
| **HTTPS** | Plantilla comentada en `deploy/nginx/nginx.prod.conf` para montar certificados. |

---

## 2. Archivos nuevos o modificados

### Backend

- `src/main/resources/application.yml` — valores por defecto más seguros; perfil activo por defecto `dev`.
- `src/main/resources/application-dev.yml` — SQL visible, Swagger on, Hibernate `update` opcional.
- `src/main/resources/application-prod.yml` — validate, Flyway seguro, Swagger off.
- `config/SecurityConfiguration.java` — reglas de autorización endurecidas.
- `config/CorsProperties.java` — lectura de `CORS_ALLOWED_ORIGINS`.
- `util/CORS.java` — usa lista configurable (ya no hardcodeada solo en código).
- `build.gradle` — `spring-boot-starter-actuator`.
- `Dockerfile` — `curl` para healthcheck.
- `.env.example` — variables documentadas.

### Frontend

- `Dockerfile` — `ARG VITE_API_URL`, `ARG VITE_API_TIMEOUT`.
- `.env.example` — nota de URL relativa en prod.

### Raíz del proyecto

- `docker-compose.yml` — desarrollo con `env_file` y build args.
- `docker-compose.prod.yml` — producción con proxy, healthchecks y red interna.
- `.env.prod.example` — plantilla de variables de producción.
- `deploy/nginx/nginx.prod.conf` — reverse proxy front + API.

---

## 3. Seguridad: comportamiento actual

### Rutas públicas (sin token)

- `POST /consultorio/auth/login`
- `POST /consultorio/auth/refresh-token`
- `POST /consultorio/usuarios` (registro de cuenta)
- `OPTIONS /**` (preflight CORS)
- `GET /consultorio/actuator/health` (y `info` en dev)

### Rutas protegidas

Todo lo demás (`/empleados`, `/citas`, `/menus`, etc.) requiere cabecera:

```http
Authorization: Bearer <token>
```

### Registro de usuario

El flujo de `RegistrarUsuario` sigue funcionando:

1. `POST /usuarios` (público) → devuelve tokens.
2. El frontend guarda el token y las siguientes peticiones van autenticadas.

### Swagger

- **dev**: `http://localhost:8080/consultorio/swagger-ui.html`
- **prod**: deshabilitado (404 / no expuesto).

---

## 4. Variables de entorno

### Backend (`.env` o `.env.prod`)

| Variable | Desarrollo | Producción |
|----------|------------|------------|
| `SPRING_PROFILES_ACTIVE` | `dev` | `prod` |
| `DB_URL` | JDBC local o `postgres:5432` | JDBC del servidor |
| `DB_USERNAME` / `DB_PASSWORD` | local | **secretos fuertes** |
| `JWT_SECRET_KEY` | ejemplo | **nueva clave Base64** (`openssl rand -base64 32`) |
| `JPA_DDL_AUTO` | `update` (dev) | `validate` (prod) |
| `FLYWAY_CLEAN_DISABLED` | `false` (dev) | `true` (prod) |
| `CORS_ALLOWED_ORIGINS` | localhost + tu dominio | solo dominios HTTPS reales |

### Frontend (build)

| Variable | Desarrollo | Producción (con proxy nginx) |
|----------|------------|------------------------------|
| `VITE_API_URL` | `http://localhost:8080/consultorio/` | `/consultorio/` (mismo origen) |
| `VITE_API_TIMEOUT` | `30000` | `30000` |

---

## 5. Pasos: desarrollo local (sin Docker)

### Backend

```bash
cd backend
cp .env.example .env
# Editar .env con tu PostgreSQL
./gradlew bootRun
```

Perfil por defecto: `dev` (Swagger activo).

### Frontend

```bash
cd frontend
cp .env.example .env
npm ci
npm run dev
```

Abrir `http://localhost:5173`, login y probar un listado (PrimeReact DataTable).

---

## 6. Pasos: desarrollo con Docker

```bash
# En backend/
cp .env.example .env
# Ajustar DB_PASSWORD si hace falta

# En la raíz
docker compose up --build
```

- Frontend: `http://localhost:3000`
- API: `http://localhost:8080/consultorio/`
- Swagger (dev): `http://localhost:8080/consultorio/swagger-ui.html`

---

## 7. Pasos: despliegue en producción (Docker Compose)

### 7.1 Preparar variables

```bash
cp .env.prod.example .env.prod
```

Editar **todos** los `CAMBIAR_*`:

- Contraseñas PostgreSQL distintas y largas.
- `JWT_SECRET_KEY` nuevo (no reutilizar el de desarrollo).
- `CORS_ALLOWED_ORIGINS` con la URL real del frontend (ej. `https://consultorio.tudominio.com`).
- `VITE_API_URL=/consultorio/` si usas el proxy incluido.

> **No commitear** `.env.prod`.

### 7.2 Levantar el stack

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

### 7.3 Comprobar salud

```bash
docker compose -f docker-compose.prod.yml ps
curl http://localhost/consultorio/actuator/health
```

Respuesta esperada: `"status":"UP"`.

### 7.4 Prueba funcional (smoke test)

1. Abrir la URL del proxy (`http://localhost` o tu dominio).
2. Login con usuario existente.
3. Abrir un listado (empleados, citas, etc.).
4. Crear o editar un registro de prueba.
5. Cerrar sesión / volver a entrar.

### 7.5 HTTPS (recomendado en servidor real)

1. Obtener certificados (Let's Encrypt, etc.).
2. Colocarlos en `deploy/certs/` (o ruta que elijas).
3. Descomentar el bloque `listen 443 ssl` en `deploy/nginx/nginx.prod.conf`.
4. Montar volumen de certs en el servicio `proxy` de `docker-compose.prod.yml`.
5. Descomentar redirección HTTP → HTTPS en el mismo archivo.
6. Añadir `https://tu-dominio.com` a `CORS_ALLOWED_ORIGINS`.
7. Reconstruir front si la URL pública cambió: `docker compose ... up -d --build frontend`.

---

## 8. Base de datos vacía (solo tablas + catálogos)

Para producción **sin** exportar datos de desarrollo: **[BASE_DATOS_PRODUCCION_VACIA.md](./BASE_DATOS_PRODUCCION_VACIA.md)**.

- Flyway crea todas las tablas; catálogos (`rol`, `menu`, `tipo_empleado`, etc.) con datos mínimos.
- `empresa`, `usuario`, `cita`, `historia_clinica`, etc. en **cero filas**.
- Primer acceso: pantalla **`/registrar`** (no hay admin automático en `prod`).

---

## 9. Build del frontend para producción (sin Docker)

```bash
cd frontend
export VITE_API_URL=/consultorio/   # o URL absoluta del API
export VITE_API_TIMEOUT=30000
npm ci
npm run build:prod
```

Servir la carpeta `dist/` con nginx/Apache y apuntar `/consultorio/` al backend.

---

## 10. Checklist post-despliegue

- [ ] `SPRING_PROFILES_ACTIVE=prod` en el servidor.
- [ ] Swagger no accesible desde internet.
- [ ] API sin datos sensibles en respuestas de error en prod.
- [ ] PostgreSQL no expuesto en puerto público (solo red Docker).
- [ ] Backup de BD configurado (externo al repo).
- [ ] `CORS_ALLOWED_ORIGINS` solo con dominios de confianza.
- [ ] Certificado TLS válido en producción real.
- [ ] Smoke test login + CRUD completado.

---

## 11. Qué sigue pendiente (fuera de este alcance)

- Pipeline CI/CD en `.github/workflows` en la **raíz** del monorepo.
- Tests de integración y E2E ampliados.
- Rate limiting y revocación de tokens (Redis).
- `@ControllerAdvice` global de errores.
- Majors de frontend (React 19, Router 7, etc.).

---

## 12. Solución de problemas

### 401 en todas las peticiones tras el cambio

- Verificar que el login devuelve `access_token` y que el frontend lo guarda en `localStorage` como `token`.
- Comprobar cabecera `Authorization: Bearer ...` en DevTools → Network.

### CORS bloqueado en el navegador

- Añadir el origen exacto (esquema + host + puerto) a `CORS_ALLOWED_ORIGINS`.
- Reiniciar el backend tras cambiar la variable.

### Registro falla en paso de menús/roles

- Tras `POST /usuarios`, el token debe guardarse antes de `GET /menus`. Si falla, revisar respuesta del registro (debe incluir `access_token`).

### Healthcheck del backend falla en Docker

```bash
docker logs consultorio-backend-prod
curl http://localhost:8080/consultorio/actuator/health
```

Comprobar que Flyway y PostgreSQL arrancaron correctamente.

---

## 13. Contacto / mantenimiento

Al actualizar dominios o certificados, revisar siempre:

1. `.env.prod`
2. `CORS_ALLOWED_ORIGINS`
3. `VITE_API_URL` en el build del frontend
4. `deploy/nginx/nginx.prod.conf`
