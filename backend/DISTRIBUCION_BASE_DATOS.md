# Distribución de Base de Datos - Arquitectura de Microservicios

## 📊 Resumen de Distribución

| Microservicio | Base de Datos | Tablas | Puerto DB |
|---------------|---------------|--------|-----------|
| **Auth Service** | `auth_db` | usuario, rol, menu, rol_menu, token, usuario_rol | 5432 |
| **Employee Service** | `employee_db` | empleado, empresa, tipo_empleado | 5433 |
| **Scheduling Service** | `scheduling_db` | programacion, programacion_detalle, horario, dias_por_empleado, feriado | 5434 |
| **Appointment Service** | `appointment_db` | cita, historia_clinica | 5435 |
| **Catalog Service** | `catalog_db` | maestra | 5436 |
| **Gym Service** | `gym_db` | matricula, plan, visita | 5437 |

---

## 1️⃣ Auth Service - `auth_db`

### Tablas

```sql
-- Base de datos: auth_db
-- Puerto: 5432

-- Tabla: usuario
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    id_empleado INTEGER,  -- Referencia externa (Employee Service)
    CONSTRAINT uk_usuario_email UNIQUE (email)
);

-- Tabla: rol
CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    CONSTRAINT uk_rol_nombre UNIQUE (nombre)
);

-- Tabla: menu
CREATE TABLE menu (
    id_menu SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    path VARCHAR(500),
    activo BOOLEAN DEFAULT true
);

-- Tabla: rol_menu (tabla intermedia)
CREATE TABLE rol_menu (
    id_rol INTEGER NOT NULL,
    id_menu INTEGER NOT NULL,
    PRIMARY KEY (id_rol, id_menu),
    CONSTRAINT fk_rol_menu_rol FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON DELETE CASCADE,
    CONSTRAINT fk_rol_menu_menu FOREIGN KEY (id_menu) REFERENCES menu(id_menu) ON DELETE CASCADE
);

-- Tabla: usuario_rol (tabla intermedia)
CREATE TABLE usuario_rol (
    id_usuario INTEGER NOT NULL,
    id_rol INTEGER NOT NULL,
    PRIMARY KEY (id_usuario, id_rol),
    CONSTRAINT fk_usuario_rol_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_usuario_rol_rol FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON DELETE CASCADE
);

-- Tabla: token
CREATE TABLE token (
    id SERIAL PRIMARY KEY,
    token VARCHAR(500) UNIQUE NOT NULL,
    token_type VARCHAR(50) DEFAULT 'BEARER',
    revoked BOOLEAN DEFAULT false,
    expired BOOLEAN DEFAULT false,
    id_usuario INTEGER NOT NULL,
    CONSTRAINT fk_token_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT uk_token_token UNIQUE (token)
);

-- Índices
CREATE INDEX idx_usuario_email ON usuario(email);
CREATE INDEX idx_token_usuario ON token(id_usuario);
CREATE INDEX idx_token_token ON token(token);
CREATE INDEX idx_usuario_rol_usuario ON usuario_rol(id_usuario);
CREATE INDEX idx_usuario_rol_rol ON usuario_rol(id_rol);
```

### Notas Importantes:
- `id_empleado` en `usuario` es una **referencia externa** (no foreign key real)
- Se valida mediante llamada al Employee Service
- Los tokens se almacenan para logout y refresh token

---

## 2️⃣ Employee Service - `employee_db`

### Tablas

```sql
-- Base de datos: employee_db
-- Puerto: 5433

-- Tabla: empresa
CREATE TABLE empresa (
    id_empresa SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    CONSTRAINT uk_empresa_nombre UNIQUE (nombre)
);

-- Tabla: tipo_empleado
CREATE TABLE tipo_empleado (
    id_tipo_empleado SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creado_por VARCHAR(100)
);

-- Tabla: empleado
CREATE TABLE empleado (
    id_empleado SERIAL PRIMARY KEY,
    numero_documento VARCHAR(20) NOT NULL,
    tipo_documento VARCHAR(10),
    nombres VARCHAR(255) NOT NULL,
    apellido_paterno VARCHAR(255),
    apellido_materno VARCHAR(255),
    direccion VARCHAR(500),
    sexo VARCHAR(10),
    fecha_ingreso TIMESTAMP,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    telefono VARCHAR(20),
    celular VARCHAR(20),
    id_empresa INTEGER,
    id_tipo_empleado INTEGER,
    activo BOOLEAN DEFAULT true,
    CONSTRAINT fk_empleado_empresa FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa) ON DELETE SET NULL,
    CONSTRAINT fk_empleado_tipo FOREIGN KEY (id_tipo_empleado) REFERENCES tipo_empleado(id_tipo_empleado) ON DELETE SET NULL,
    CONSTRAINT uk_empleado_documento UNIQUE (numero_documento)
);

-- Índices
CREATE INDEX idx_empleado_empresa ON empleado(id_empresa);
CREATE INDEX idx_empleado_tipo ON empleado(id_tipo_empleado);
CREATE INDEX idx_empleado_documento ON empleado(numero_documento);
CREATE INDEX idx_empleado_activo ON empleado(activo);
```

### Notas Importantes:
- Esta es la **fuente de verdad** para datos de empleados
- Otros servicios referencian `id_empleado` pero no tienen foreign key
- Se puede replicar datos básicos en otros servicios si es necesario para performance

---

## 3️⃣ Scheduling Service - `scheduling_db`

### Tablas

```sql
-- Base de datos: scheduling_db
-- Puerto: 5434

-- Tabla: horario
CREATE TABLE horario (
    id_horario SERIAL PRIMARY KEY,
    descripcion VARCHAR(255),
    id_empresa INTEGER  -- Referencia externa (Employee Service)
);

-- Tabla: feriado
CREATE TABLE feriado (
    id_feriado SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    sector_publico BOOLEAN DEFAULT false,
    CONSTRAINT uk_feriado_fecha UNIQUE (fecha)
);

-- Tabla: programacion
CREATE TABLE programacion (
    id_programacion SERIAL PRIMARY KEY,
    fecha_inicial DATE NOT NULL,
    fecha_final DATE NOT NULL,
    str_fecha_inicial VARCHAR(50),
    str_fecha_final VARCHAR(50),
    rango VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    id_empresa INTEGER,  -- Referencia externa (Employee Service)
    numero_semana INTEGER,
    CONSTRAINT chk_programacion_fechas CHECK (fecha_final >= fecha_inicial)
);

-- Tabla: programacion_detalle
CREATE TABLE programacion_detalle (
    id_programacion_detalle SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    dia_semana VARCHAR(20),
    numero_dia_semana INTEGER,
    activo BOOLEAN DEFAULT true,
    str_fecha VARCHAR(50),
    id_empleado INTEGER NOT NULL,  -- Referencia externa (Employee Service)
    id_programacion INTEGER NOT NULL,
    CONSTRAINT fk_programacion_detalle_programacion 
        FOREIGN KEY (id_programacion) REFERENCES programacion(id_programacion) ON DELETE CASCADE
);

-- Tabla: dias_por_empleado
CREATE TABLE dias_por_empleado (
    id BIGSERIAL PRIMARY KEY,
    id_empleado INTEGER NOT NULL,  -- Referencia externa (Employee Service)
    dias TEXT  -- JSON array de números (días de la semana)
);

-- Índices
CREATE INDEX idx_programacion_empresa ON programacion(id_empresa);
CREATE INDEX idx_programacion_activo ON programacion(activo);
CREATE INDEX idx_programacion_fechas ON programacion(fecha_inicial, fecha_final);
CREATE INDEX idx_programacion_detalle_programacion ON programacion_detalle(id_programacion);
CREATE INDEX idx_programacion_detalle_empleado ON programacion_detalle(id_empleado);
CREATE INDEX idx_programacion_detalle_fecha ON programacion_detalle(fecha);
CREATE INDEX idx_programacion_detalle_activo ON programacion_detalle(activo);
CREATE INDEX idx_dias_por_empleado_empleado ON dias_por_empleado(id_empleado);
CREATE INDEX idx_feriado_fecha ON feriado(fecha);
```

### Notas Importantes:
- `id_empleado` y `id_empresa` son **referencias externas**
- Se validan mediante llamadas al Employee Service
- Se puede mantener una **caché local** de datos básicos de empleados para performance

---

## 4️⃣ Appointment Service - `appointment_db`

### Tablas

```sql
-- Base de datos: appointment_db
-- Puerto: 5435

-- Tabla: historia_clinica
CREATE TABLE historia_clinica (
    id_historia_clinica SERIAL PRIMARY KEY,
    ectoscopia TEXT,
    alergia TEXT,
    motivo TEXT,
    antecedentes_medicos TEXT,
    numero_documento VARCHAR(20),
    nombres VARCHAR(255),
    apellido_paterno VARCHAR(255),
    apellido_materno VARCHAR(255),
    tipo_documento VARCHAR(10),
    direccion VARCHAR(500),
    telefono VARCHAR(20),
    celular VARCHAR(20),
    email VARCHAR(255)
);

-- Tabla: cita
CREATE TABLE cita (
    id_cita SERIAL PRIMARY KEY,
    id_historia_clinica INTEGER,  -- Puede ser NULL (cita sin historia)
    id_horario INTEGER,  -- Referencia externa (Scheduling Service)
    id_programacion_detalle INTEGER,  -- Referencia externa (Scheduling Service)
    atendido BOOLEAN DEFAULT false,
    informe TEXT,
    estado INTEGER DEFAULT 1,  -- 1: pendiente, 2: no asistió, 3: no programado
    CONSTRAINT fk_cita_historia 
        FOREIGN KEY (id_historia_clinica) REFERENCES historia_clinica(id_historia_clinica) ON DELETE SET NULL
);

-- Índices
CREATE INDEX idx_cita_historia ON cita(id_historia_clinica);
CREATE INDEX idx_cita_horario ON cita(id_horario);
CREATE INDEX idx_cita_programacion_detalle ON cita(id_programacion_detalle);
CREATE INDEX idx_cita_estado ON cita(estado);
CREATE INDEX idx_cita_atendido ON cita(atendido);
CREATE INDEX idx_historia_documento ON historia_clinica(numero_documento);
```

### Notas Importantes:
- `id_horario` y `id_programacion_detalle` son **referencias externas** al Scheduling Service
- Se validan mediante llamadas al Scheduling Service antes de crear la cita
- El estado de la cita se actualiza mediante cron jobs

---

## 5️⃣ Catalog Service - `catalog_db`

### Tablas

```sql
-- Base de datos: catalog_db
-- Puerto: 5436

-- Tabla: maestra
CREATE TABLE maestra (
    id_maestra SERIAL PRIMARY KEY,
    id_maestra_padre INTEGER,  -- Auto-referencia (tabla jerárquica)
    id_empresa INTEGER,  -- Referencia externa (Employee Service)
    descripcion VARCHAR(255) NOT NULL,
    estado BOOLEAN DEFAULT true,
    CONSTRAINT fk_maestra_padre FOREIGN KEY (id_maestra_padre) REFERENCES maestra(id_maestra) ON DELETE CASCADE
);

-- Índices
CREATE INDEX idx_maestra_padre ON maestra(id_maestra_padre);
CREATE INDEX idx_maestra_empresa ON maestra(id_empresa);
CREATE INDEX idx_maestra_estado ON maestra(estado);
```

### Notas Importantes:
- Datos de referencia compartidos
- Se recomienda usar **Redis** para cache
- `id_empresa` es referencia externa

---

## 6️⃣ Gym Service - `gym_db` (Opcional)

### Tablas

```sql
-- Base de datos: gym_db
-- Puerto: 5437

-- Tabla: plan
CREATE TABLE plan (
    id_plan SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2),
    duracion_dias INTEGER,
    activo BOOLEAN DEFAULT true
);

-- Tabla: matricula
CREATE TABLE matricula (
    id_matricula SERIAL PRIMARY KEY,
    id_plan INTEGER,
    numero_documento VARCHAR(20),
    nombres VARCHAR(255),
    apellido_paterno VARCHAR(255),
    apellido_materno VARCHAR(255),
    fecha_inicio DATE,
    fecha_fin DATE,
    activo BOOLEAN DEFAULT true,
    CONSTRAINT fk_matricula_plan FOREIGN KEY (id_plan) REFERENCES plan(id_plan) ON DELETE SET NULL
);

-- Tabla: visita
CREATE TABLE visita (
    id_visita SERIAL PRIMARY KEY,
    id_matricula INTEGER,
    fecha_visita TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_visita_matricula FOREIGN KEY (id_matricula) REFERENCES matricula(id_matricula) ON DELETE CASCADE
);

-- Índices
CREATE INDEX idx_matricula_plan ON matricula(id_plan);
CREATE INDEX idx_matricula_documento ON matricula(numero_documento);
CREATE INDEX idx_visita_matricula ON visita(id_matricula);
CREATE INDEX idx_visita_fecha ON visita(fecha_visita);
```

---

## 🔗 Manejo de Relaciones entre Servicios

### Problema: Foreign Keys que cruzan servicios

En microservicios, **NO se pueden tener foreign keys reales** entre bases de datos diferentes. Se usan estas estrategias:

### Estrategia 1: Referencias por ID (Recomendada)

```java
// En Scheduling Service - ProgramacionDetalle
@Entity
public class ProgramacionDetalle {
    @Id
    private Integer idProgramacionDetalle;
    
    // NO es @ManyToOne, solo un Integer
    @Column(name = "id_empleado")
    private Integer idEmpleado;  // Referencia externa
    
    // Validación mediante servicio
    public void validarEmpleado() {
        // Llamada a Employee Service
        empleadoServiceClient.getEmpleado(idEmpleado);
    }
}
```

### Estrategia 2: Replicación de Datos (Para Performance)

```sql
-- En Scheduling Service: Tabla de caché local
CREATE TABLE empleado_cache (
    id_empleado INTEGER PRIMARY KEY,
    nombres VARCHAR(255),
    apellido_paterno VARCHAR(255),
    apellido_materno VARCHAR(255),
    numero_documento VARCHAR(20),
    activo BOOLEAN,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Se actualiza mediante eventos o polling
```

### Estrategia 3: Eventos para Sincronización

```java
// Employee Service publica evento cuando se actualiza un empleado
@EventListener
public void onEmpleadoActualizado(EmpleadoActualizadoEvent event) {
    // Scheduling Service actualiza su caché
    empleadoCacheService.actualizar(event.getEmpleado());
}
```

---

## 📋 Scripts de Creación de Bases de Datos

### Script Principal (PostgreSQL)

```sql
-- Crear bases de datos
CREATE DATABASE auth_db;
CREATE DATABASE employee_db;
CREATE DATABASE scheduling_db;
CREATE DATABASE appointment_db;
CREATE DATABASE catalog_db;
CREATE DATABASE gym_db;

-- Asignar permisos (ajustar según tu usuario)
GRANT ALL PRIVILEGES ON DATABASE auth_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE employee_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE scheduling_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE appointment_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE catalog_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE gym_db TO postgres;
```

### Docker Compose para Bases de Datos

```yaml
version: '3.8'

services:
  # Auth Database
  auth-db:
    image: postgres:15
    container_name: auth-db
    environment:
      POSTGRES_DB: auth_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: root
    ports:
      - "5432:5432"
    volumes:
      - auth_db_data:/var/lib/postgresql/data
      - ./sql/auth_db_init.sql:/docker-entrypoint-initdb.d/init.sql

  # Employee Database
  employee-db:
    image: postgres:15
    container_name: employee-db
    environment:
      POSTGRES_DB: employee_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: root
    ports:
      - "5433:5432"
    volumes:
      - employee_db_data:/var/lib/postgresql/data
      - ./sql/employee_db_init.sql:/docker-entrypoint-initdb.d/init.sql

  # Scheduling Database
  scheduling-db:
    image: postgres:15
    container_name: scheduling-db
    environment:
      POSTGRES_DB: scheduling_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: root
    ports:
      - "5434:5432"
    volumes:
      - scheduling_db_data:/var/lib/postgresql/data
      - ./sql/scheduling_db_init.sql:/docker-entrypoint-initdb.d/init.sql

  # Appointment Database
  appointment-db:
    image: postgres:15
    container_name: appointment-db
    environment:
      POSTGRES_DB: appointment_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: root
    ports:
      - "5435:5432"
    volumes:
      - appointment_db_data:/var/lib/postgresql/data
      - ./sql/appointment_db_init.sql:/docker-entrypoint-initdb.d/init.sql

  # Catalog Database
  catalog-db:
    image: postgres:15
    container_name: catalog-db
    environment:
      POSTGRES_DB: catalog_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: root
    ports:
      - "5436:5432"
    volumes:
      - catalog_db_data:/var/lib/postgresql/data
      - ./sql/catalog_db_init.sql:/docker-entrypoint-initdb.d/init.sql

  # Gym Database (Opcional)
  gym-db:
    image: postgres:15
    container_name: gym-db
    environment:
      POSTGRES_DB: gym_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: root
    ports:
      - "5437:5432"
    volumes:
      - gym_db_data:/var/lib/postgresql/data
      - ./sql/gym_db_init.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  auth_db_data:
  employee_db_data:
  scheduling_db_data:
  appointment_db_data:
  catalog_db_data:
  gym_db_data:
```

---

## 🔄 Migraciones con Flyway

### Estructura de Migraciones por Servicio

```
auth-service/
└── src/main/resources/db/migration/
    ├── V1__create_usuario_table.sql
    ├── V2__create_rol_table.sql
    ├── V3__create_menu_table.sql
    ├── V4__create_rol_menu_table.sql
    ├── V5__create_usuario_rol_table.sql
    └── V6__create_token_table.sql

employee-service/
└── src/main/resources/db/migration/
    ├── V1__create_empresa_table.sql
    ├── V2__create_tipo_empleado_table.sql
    └── V3__create_empleado_table.sql

scheduling-service/
└── src/main/resources/db/migration/
    ├── V1__create_feriado_table.sql
    ├── V2__create_horario_table.sql
    ├── V3__create_programacion_table.sql
    ├── V4__create_programacion_detalle_table.sql
    └── V5__create_dias_por_empleado_table.sql

appointment-service/
└── src/main/resources/db/migration/
    ├── V1__create_historia_clinica_table.sql
    └── V2__create_cita_table.sql

catalog-service/
└── src/main/resources/db/migration/
    └── V1__create_maestra_table.sql
```

---

## 📊 Diagrama de Relaciones entre Servicios

```
┌─────────────────┐
│  auth_db        │
│  - usuario      │───┐
│  - rol          │   │ id_empleado (referencia externa)
│  - menu         │   │
│  - token        │   │
└─────────────────┘   │
                      │
                      ▼
┌─────────────────┐   │
│  employee_db    │◄──┘
│  - empleado     │───┐
│  - empresa      │   │ id_empleado (referencia externa)
│  - tipo_empleado│   │
└─────────────────┘   │
                      │
        ┌─────────────┴─────────────┐
        │                            │
        ▼                            ▼
┌─────────────────┐        ┌─────────────────┐
│  scheduling_db  │        │ appointment_db  │
│  - programacion │        │  - cita          │
│  - programacion │        │  - historia_clinica│
│    _detalle     │        │                  │
│  - horario      │        │                  │
│  - feriado      │        │                  │
│  - dias_por_    │        │                  │
│    empleado     │        │                  │
└─────────────────┘        └─────────────────┘
        │                            │
        │ id_programacion_detalle    │
        │ id_horario (referencias)   │
        └────────────────────────────┘

┌─────────────────┐
│  catalog_db     │
│  - maestra      │
└─────────────────┘
```

---

## ⚠️ Consideraciones Importantes

### 1. Consistencia de Datos

**Problema**: No hay transacciones distribuidas entre servicios

**Solución**: 
- **Consistencia eventual**: Aceptar que los datos se sincronizan eventualmente
- **Patrón Saga**: Para operaciones que requieren múltiples servicios
- **Event Sourcing**: Para auditoría y reconstrucción de estado

### 2. Validación de Referencias

```java
// Ejemplo: Validar empleado antes de crear programación
@Service
public class ProgramacionDetalleService {
    
    @Autowired
    private EmployeeServiceClient employeeClient;
    
    public ProgramacionDetalleResponse registrar(ProgramacionDetalleRequest request) {
        // Validar que el empleado existe
        try {
            EmpleadoResponse empleado = employeeClient.getEmpleado(request.getIdEmpleado());
            if (!empleado.getActivo()) {
                throw new BusinessException("El empleado no está activo");
            }
        } catch (FeignException.NotFound e) {
            throw new ResourceNotFoundException("Empleado no encontrado");
        }
        
        // Continuar con la creación...
    }
}
```

### 3. Caché Local de Datos Externos

```java
// Scheduling Service mantiene caché de empleados
@Entity
@Table(name = "empleado_cache")
public class EmpleadoCache {
    @Id
    private Integer idEmpleado;
    private String nombres;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private Boolean activo;
    private LocalDateTime ultimaActualizacion;
}

// Se actualiza mediante eventos
@EventListener
public void onEmpleadoActualizado(EmpleadoActualizadoEvent event) {
    empleadoCacheRepository.save(convertToCache(event.getEmpleado()));
}
```

### 4. Índices para Referencias Externas

Aunque no hay foreign keys, **sí se deben crear índices** para performance:

```sql
-- En scheduling_db
CREATE INDEX idx_programacion_detalle_empleado 
    ON programacion_detalle(id_empleado);

-- En appointment_db
CREATE INDEX idx_cita_programacion_detalle 
    ON cita(id_programacion_detalle);
```

---

## 📝 Checklist de Migración de Base de Datos

- [ ] Crear todas las bases de datos
- [ ] Ejecutar scripts de creación de tablas por servicio
- [ ] Configurar Flyway en cada servicio
- [ ] Crear índices para referencias externas
- [ ] Implementar validación de referencias en servicios
- [ ] Configurar caché local donde sea necesario
- [ ] Implementar sincronización mediante eventos
- [ ] Configurar backups independientes por base de datos
- [ ] Documentar relaciones entre servicios
- [ ] Crear scripts de migración de datos del monolito

---

## 🔍 Consultas Cross-Service (Ejemplo)

### Problema: Necesito datos de múltiples servicios

```java
// ❌ NO HACER: JOIN entre servicios
// SELECT * FROM cita c 
// JOIN programacion_detalle pd ON c.id_programacion_detalle = pd.id
// JOIN empleado e ON pd.id_empleado = e.id

// ✅ HACER: Agregación en el servicio
@Service
public class CitaService {
    
    public CitaCompletaResponse getCitaCompleta(Integer idCita) {
        // 1. Obtener cita
        Cita cita = citaRepository.findById(idCita).orElseThrow();
        
        // 2. Obtener programación detalle (Scheduling Service)
        ProgramacionDetalleResponse pd = schedulingClient
            .getProgramacionDetalle(cita.getIdProgramacionDetalle());
        
        // 3. Obtener empleado (Employee Service)
        EmpleadoResponse empleado = employeeClient
            .getEmpleado(pd.getIdEmpleado());
        
        // 4. Agregar datos
        return CitaCompletaResponse.builder()
            .cita(cita)
            .programacionDetalle(pd)
            .empleado(empleado)
            .build();
    }
}
```

---

**Nota**: Esta distribución permite que cada servicio sea independiente y escalable, aunque requiere manejo cuidadoso de las relaciones entre servicios.



