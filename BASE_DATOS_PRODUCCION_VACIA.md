# Base de datos vacía para producción

Guía para desplegar con **PostgreSQL vacío**: solo **estructura (tablas)** y **catálogos mínimos** para que la aplicación funcione. Sin pacientes, citas, empresas ni usuarios precargados.

---

## 1. Qué obtienes al arrancar en producción

Al levantar el backend con `SPRING_PROFILES_ACTIVE=prod` y una base **nueva**:

1. **Flyway** crea todas las tablas y aplica migraciones `V1` … `V16`.
2. Quedan datos **solo** en tablas de catálogo (ver sección 2).
3. Las tablas de **negocio** existen pero con **0 filas**.
4. **No** se crea usuario admin automático (el seed demo está desactivado).

---

## 2. Tablas y contenido esperado

### Catálogo (con filas — necesarias para menús y roles)

| Tabla | Contenido |
|-------|-----------|
| `rol` | SUPER (id 1), ADMIN (id 2) |
| `menu` | Rutas del sidebar (dashboard, citas, empleados, etc.) |
| `categoria_menu` | Agrupación de menús |
| `rol_menu` | Permisos SUPER / ADMIN sobre menús |
| `tipo_empleado` | Médico, Enfermero, Administrativo, Técnico |

### Estructura vacía (0 filas al inicio)

| Tabla | Uso |
|-------|-----|
| `empresa` | Consultorios / tenants |
| `usuario` | Cuentas de login |
| `usuario_rol` | Roles por usuario |
| `empleado` | Personal |
| `token` | Sesiones JWT |
| `horario` | Franjas horarias |
| `programacion` | Planificación semanal |
| `programacion_detalle` | Detalle por día/empleado |
| `historia_clinica` | Pacientes |
| `cita` | Citas y consultas |
| `dias_por_empleado` | Días laborables |
| `feriado` | Feriados |
| `maestra` | Tablas auxiliares |

### Sistema

| Tabla | Notas |
|-------|--------|
| `flyway_schema_history` | Control de migraciones (Flyway) |

---

## 3. Qué NO debes exportar ni restaurar

- Dumps de desarrollo con pacientes, citas o usuarios de prueba.
- Tabla `token` de otro ambiente.
- Inserts manuales duplicando `menu` / `rol` (ya vienen en migraciones).

---

## 4. Pasos para producción con BD vacía

### 4.1 Crear base PostgreSQL

```sql
CREATE DATABASE consultorio_db;
CREATE USER consultorio_user WITH ENCRYPTED PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE consultorio_db TO consultorio_user;
```

### 4.2 Configurar backend

```bash
cp .env.prod.example .env.prod
```

En `.env.prod`:

```env
SPRING_PROFILES_ACTIVE=prod
DB_URL=jdbc:postgresql://HOST:5432/consultorio_db
JPA_DDL_AUTO=validate
FLYWAY_ENABLED=true
FLYWAY_CLEAN_DISABLED=true
```

### 4.3 Arrancar aplicación (aplica Flyway)

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build backend
```

O `./gradlew bootRun` apuntando a la BD vacía con perfil `prod`.

### 4.4 Crear el primer acceso (obligatorio)

La base **no trae usuario**. Opciones:

**A) Registro desde el frontend (recomendado)**

1. Desplegar frontend con `VITE_API_URL` correcto.
2. Ir a `/registrar` (ruta de registro).
3. Crear la primera cuenta (asigna rol y empresa en el formulario).

**B) Crear empresa y usuario desde la API** (con Swagger solo en `dev`, o herramienta REST)

1. `POST /consultorio/usuarios` con cuerpo de registro (público).
2. Antes, si el flujo lo exige, crear `empresa` y `rol` vía app o SQL mínimo.

### 4.5 Configurar operación

Después del primer login, desde la aplicación:

1. **Empresa** — datos del consultorio.
2. **Empleados** — personal.
3. **Horarios** — franjas (la BD no trae horarios de demo en prod).
4. **Programaciones** — agenda.

---

## 5. Desarrollo local con datos demo (opcional)

En `backend/.env` o `application-dev.yml`:

```yaml
app:
  seed:
    demo-enabled: true
```

Solo con `SPRING_PROFILES_ACTIVE=dev`:

- **Super usuario gafah** (por defecto, `app.seed.super-gafah.enabled=true`): email `ga@correo.com`, contraseña `super-gafah-admin`, empresa `gafah`, rol SUPER.
- **Demo** (`app.seed.demo-enabled=true`): empresa `gafah` y usuario `ga@correo.com`. **Nunca activar en producción.**

---

## 6. Verificar que la BD quedó “vacía”

```sql
SELECT 'empresa' AS tabla, COUNT(*) FROM empresa
UNION ALL SELECT 'usuario', COUNT(*) FROM usuario
UNION ALL SELECT 'empleado', COUNT(*) FROM empleado
UNION ALL SELECT 'historia_clinica', COUNT(*) FROM historia_clinica
UNION ALL SELECT 'cita', COUNT(*) FROM cita
UNION ALL SELECT 'horario', COUNT(*) FROM horario
UNION ALL SELECT 'rol', COUNT(*) FROM rol
UNION ALL SELECT 'menu', COUNT(*) FROM menu
UNION ALL SELECT 'tipo_empleado', COUNT(*) FROM tipo_empleado;
```

Esperado en prod recién instalado:

- `rol`, `menu`, `tipo_empleado` → **> 0**
- `empresa`, `usuario`, `cita`, `historia_clinica`, `horario` → **0** (hasta que configures)

---

## 7. Migraciones relevantes

| Versión | Rol |
|---------|-----|
| V3_1, V1, V2, V14 | Crean tablas base |
| V7–V12, V9 | Roles, menús, categorías |
| V3 | Tipos de empleado |
| V13 | Horarios demo (empresa 2) |
| V15 | Tablas `usuario`, `token`, `programacion`, etc. |
| V16 | Elimina solo horarios demo de V13 |

---

## 8. Documentación relacionada

- [PRODUCCION_IMPLEMENTACION.md](./PRODUCCION_IMPLEMENTACION.md) — Docker, HTTPS, variables.
- [backend/GUIA_MIGRACION_AMBIENTE.md](./backend/GUIA_MIGRACION_AMBIENTE.md) — Migración entre servidores con datos.
