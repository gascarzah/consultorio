# Arquitectura de Microservicios - Consultorio Backend

## 📋 Análisis del Monolito Actual

El proyecto actual está organizado en los siguientes dominios:
- **Autenticación y Autorización**: Usuario, Rol, Menu, Token
- **Gestión de Empleados**: Empleado, Empresa, TipoEmpleado
- **Agendamiento**: Programacion, ProgramacionDetalle, Horario, DiasPorEmpleado
- **Consultas Médicas**: Cita, HistoriaClinica
- **Catálogos**: Maestra, Feriado
- **Gimnasio** (módulo adicional): Matricula, Plan, Visita

---

## 🏗️ Propuesta de Distribución en Microservicios

### 1. **Auth Service** (Servicio de Autenticación)
**Responsabilidad**: Autenticación, autorización y gestión de usuarios

**Entidades**:
- `Usuario`
- `Rol`
- `Menu`
- `RolMenu`
- `Token`

**Endpoints**:
- `/auth/**` (login, logout, refresh token)
- `/usuarios/**`
- `/roles/**`
- `/menus/**`
- `/rol-menus/**`

**Base de Datos**: `auth_db` (PostgreSQL)

**Características**:
- JWT token generation y validation
- Gestión de roles y permisos
- UserDetailsService para Spring Security
- Refresh token management

**Puerto sugerido**: `8081`

---

### 2. **Employee Service** (Servicio de Empleados)
**Responsabilidad**: Gestión de empleados, empresas y tipos de empleado

**Entidades**:
- `Empleado`
- `Empresa`
- `TipoEmpleado`

**Endpoints**:
- `/empleados/**`
- `/empresas/**`
- `/tipos-empleado/**`

**Base de Datos**: `employee_db` (PostgreSQL)

**Características**:
- CRUD de empleados
- Gestión multi-empresa
- Búsqueda y paginación de empleados
- Relación con Auth Service (idUsuario)

**Puerto sugerido**: `8082`

**Comunicación**:
- Consume: Auth Service (validar usuario al crear empleado)

---

### 3. **Scheduling Service** (Servicio de Agendamiento)
**Responsabilidad**: Programaciones, horarios y disponibilidad

**Entidades**:
- `Programacion`
- `ProgramacionDetalle`
- `Horario`
- `DiasPorEmpleado`
- `Feriado`

**Endpoints**:
- `/programaciones/**`
- `/programaciones-detalle/**`
- `/horarios/**`
- `/dias-por-empleado/**`
- `/feriados/**`

**Base de Datos**: `scheduling_db` (PostgreSQL)

**Características**:
- Generación automática de programaciones (cron)
- Gestión de horarios por empleado
- Validación de disponibilidad
- Tareas programadas (Scheduler)

**Puerto sugerido**: `8083`

**Comunicación**:
- Consume: Employee Service (validar empleado)
- Publica eventos: Programación creada/actualizada

---

### 4. **Appointment Service** (Servicio de Citas)
**Responsabilidad**: Gestión de citas e historias clínicas

**Entidades**:
- `Cita`
- `HistoriaClinica`

**Endpoints**:
- `/citas/**`
- `/historias-clinicas/**`

**Base de Datos**: `appointment_db` (PostgreSQL)

**Características**:
- CRUD de citas
- Gestión de historias clínicas
- Estados de citas (pendiente, atendida, no asistió, etc.)
- Actualización automática de estados (cron)

**Puerto sugerido**: `8084`

**Comunicación**:
- Consume: 
  - Scheduling Service (validar programación/horario)
  - Employee Service (validar empleado/medico)
- Publica eventos: Cita creada, Cita cancelada, Cita atendida

---

### 5. **Catalog Service** (Servicio de Catálogos)
**Responsabilidad**: Datos maestros y referenciales

**Entidades**:
- `Maestra` (tablas maestras configurables)

**Endpoints**:
- `/maestras/**`

**Base de Datos**: `catalog_db` (PostgreSQL) o puede ser compartida

**Características**:
- Gestión de tablas maestras
- Datos de referencia compartidos
- Cacheable (Redis recomendado)

**Puerto sugerido**: `8085`

**Comunicación**:
- Consumido por: Todos los servicios (datos de referencia)

---

### 6. **Gym Service** (Servicio de Gimnasio) - Opcional
**Responsabilidad**: Gestión del módulo de gimnasio

**Entidades**:
- `Matricula`
- `Plan`
- `Visita`

**Endpoints**:
- `/matriculas/**`
- `/planes/**`
- `/visitas/**`

**Base de Datos**: `gym_db` (PostgreSQL)

**Puerto sugerido**: `8086`

---

## 🔄 Comunicación entre Microservicios

### Patrones de Comunicación

#### 1. **Síncrona (REST)**
Para operaciones que requieren respuesta inmediata:
- Auth Service → Employee Service (validar usuario)
- Appointment Service → Scheduling Service (validar disponibilidad)
- Appointment Service → Employee Service (obtener datos de empleado)

**Tecnología sugerida**: 
- Spring Cloud OpenFeign
- RestTemplate / WebClient

#### 2. **Asíncrona (Eventos)**
Para operaciones que no requieren respuesta inmediata:
- Programación creada → Appointment Service (notificar disponibilidad)
- Cita cancelada → Scheduling Service (liberar horario)
- Empleado inactivado → Scheduling Service (cancelar programaciones)

**Tecnología sugerida**:
- Apache Kafka
- RabbitMQ
- Spring Cloud Stream

#### 3. **API Gateway**
Punto de entrada único para todos los servicios:
- Enrutamiento
- Autenticación centralizada
- Rate limiting
- Load balancing

**Tecnología sugerida**:
- Spring Cloud Gateway
- Kong
- Zuul (legacy)

---

## 🗄️ Estrategia de Base de Datos

### Opción 1: Database per Service (Recomendada)
Cada microservicio tiene su propia base de datos:
- `auth_db`
- `employee_db`
- `scheduling_db`
- `appointment_db`
- `catalog_db`
- `gym_db` (opcional)

**Ventajas**:
- Independencia total
- Escalabilidad independiente
- Tecnologías diferentes por servicio

**Desventajas**:
- Transacciones distribuidas complejas
- Consistencia eventual

### Opción 2: Schema per Service
Todos los servicios comparten la misma instancia PostgreSQL pero con schemas separados:
- `auth_schema`
- `employee_schema`
- `scheduling_schema`
- etc.

**Ventajas**:
- Más fácil de gestionar
- Backup centralizado
- Transacciones más simples

**Desventajas**:
- Menor independencia
- Acoplamiento a PostgreSQL

---

## 🔐 Seguridad y Autenticación

### Arquitectura de Seguridad

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  API Gateway    │ ← Autenticación JWT
└──────┬──────────┘
       │
       ├──► Auth Service (validar token)
       │
       ├──► Employee Service (con token)
       ├──► Scheduling Service (con token)
       ├──► Appointment Service (con token)
       └──► Catalog Service (con token)
```

**Flujo**:
1. Cliente → API Gateway: Login request
2. API Gateway → Auth Service: Validar credenciales
3. Auth Service → API Gateway: JWT token
4. Cliente → API Gateway: Request con JWT
5. API Gateway: Valida token (puede delegar a Auth Service)
6. API Gateway → Microservicio: Request con token validado

---

## 📦 Estructura de Proyectos

### Estructura Recomendada (Maven Multi-Module)

```
consultorio-microservices/
├── pom.xml (parent)
├── api-gateway/
│   └── pom.xml
├── auth-service/
│   ├── pom.xml
│   └── src/main/java/...
├── employee-service/
│   ├── pom.xml
│   └── src/main/java/...
├── scheduling-service/
│   ├── pom.xml
│   └── src/main/java/...
├── appointment-service/
│   ├── pom.xml
│   └── src/main/java/...
├── catalog-service/
│   ├── pom.xml
│   └── src/main/java/...
├── common/
│   ├── pom.xml
│   └── src/main/java/... (DTOs compartidos, utilidades)
└── docker/
    ├── docker-compose.yml
    └── Dockerfile (por servicio)
```

---

## 🐳 Dockerización

### docker-compose.yml (Ejemplo)

```yaml
version: '3.8'

services:
  # Bases de datos
  auth-db:
    image: postgres:15
    environment:
      POSTGRES_DB: auth_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: root
    ports:
      - "5432:5432"

  employee-db:
    image: postgres:15
    environment:
      POSTGRES_DB: employee_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: root
    ports:
      - "5433:5432"

  scheduling-db:
    image: postgres:15
    environment:
      POSTGRES_DB: scheduling_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: root
    ports:
      - "5434:5432"

  appointment-db:
    image: postgres:15
    environment:
      POSTGRES_DB: appointment_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: root
    ports:
      - "5435:5432"

  # Message Broker
  kafka:
    image: confluentinc/cp-kafka:latest
    ports:
      - "9092:9092"

  # Redis (para cache)
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  # Servicios
  api-gateway:
    build: ./api-gateway
    ports:
      - "8080:8080"
    depends_on:
      - auth-service

  auth-service:
    build: ./auth-service
    ports:
      - "8081:8081"
    depends_on:
      - auth-db

  employee-service:
    build: ./employee-service
    ports:
      - "8082:8082"
    depends_on:
      - employee-db
      - auth-service

  scheduling-service:
    build: ./scheduling-service
    ports:
      - "8083:8083"
    depends_on:
      - scheduling-db
      - employee-service
      - kafka

  appointment-service:
    build: ./appointment-service
    ports:
      - "8084:8084"
    depends_on:
      - appointment-db
      - scheduling-service
      - employee-service
      - kafka

  catalog-service:
    build: ./catalog-service
    ports:
      - "8085:8085"
    depends_on:
      - catalog-db
      - redis
```

---

## 🔍 Service Discovery

Para que los servicios se encuentren entre sí:

**Opción 1: Spring Cloud Eureka**
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

**Opción 2: Consul**
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-consul-discovery</artifactId>
</dependency>
```

**Opción 3: Kubernetes Service Discovery** (si usas K8s)

---

## 📊 Monitoreo y Observabilidad

### Herramientas Recomendadas:

1. **Logging Centralizado**
   - ELK Stack (Elasticsearch, Logstash, Kibana)
   - Loki + Grafana

2. **Tracing Distribuido**
   - Zipkin
   - Jaeger

3. **Métricas**
   - Prometheus + Grafana
   - Micrometer

4. **Health Checks**
   - Spring Boot Actuator
   - Endpoints: `/actuator/health`, `/actuator/info`

---

## 🚀 Plan de Migración

### Fase 1: Preparación (1-2 semanas)
1. Identificar dependencias entre módulos
2. Crear estructura de proyectos multi-módulo
3. Extraer código común a módulo `common`
4. Configurar Docker y docker-compose

### Fase 2: Extraer Auth Service (1 semana)
1. Crear `auth-service`
2. Migrar entidades: Usuario, Rol, Menu, Token
3. Migrar endpoints de autenticación
4. Configurar base de datos propia
5. Probar independientemente

### Fase 3: Extraer Employee Service (1 semana)
1. Crear `employee-service`
2. Migrar entidades: Empleado, Empresa, TipoEmpleado
3. Configurar comunicación con Auth Service
4. Migrar endpoints

### Fase 4: Extraer Catalog Service (3 días)
1. Crear `catalog-service`
2. Migrar entidad Maestra
3. Configurar cache (Redis)

### Fase 5: Extraer Scheduling Service (1-2 semanas)
1. Crear `scheduling-service`
2. Migrar entidades: Programacion, ProgramacionDetalle, Horario, Feriado
3. Migrar lógica de cron/Scheduler
4. Configurar eventos asíncronos

### Fase 6: Extraer Appointment Service (1 semana)
1. Crear `appointment-service`
2. Migrar entidades: Cita, HistoriaClinica
3. Configurar comunicación con Scheduling y Employee
4. Migrar lógica de actualización de estados

### Fase 7: API Gateway (1 semana)
1. Configurar Spring Cloud Gateway
2. Configurar rutas a todos los servicios
3. Implementar autenticación centralizada
4. Configurar rate limiting

### Fase 8: Testing y Optimización (2 semanas)
1. Tests de integración
2. Tests de carga
3. Optimización de comunicación
4. Documentación

---

## ⚠️ Consideraciones Importantes

### Desafíos de la Migración:

1. **Transacciones Distribuidas**
   - Problema: Una operación puede requerir actualizar múltiples servicios
   - Solución: Patrón Saga, Event Sourcing, o aceptar consistencia eventual

2. **Datos Duplicados**
   - Problema: Algunos datos pueden necesitarse en múltiples servicios
   - Solución: Replicar datos necesarios (ej: datos básicos de empleado en Scheduling)

3. **Comunicación entre Servicios**
   - Problema: Latencia y fallos de red
   - Solución: Circuit breakers (Resilience4j), timeouts, retries

4. **Versionado de APIs**
   - Problema: Cambios en contratos entre servicios
   - Solución: Versionado semántico, backward compatibility

5. **Testing**
   - Problema: Tests más complejos con múltiples servicios
   - Solución: Testcontainers, mocks, contract testing (Pact)

---

## 📚 Tecnologías Adicionales Recomendadas

### Spring Cloud Stack:
- **Spring Cloud Gateway**: API Gateway
- **Spring Cloud OpenFeign**: Comunicación síncrona
- **Spring Cloud Stream**: Comunicación asíncrona
- **Spring Cloud Config**: Configuración centralizada
- **Spring Cloud Sleuth**: Distributed tracing

### Otras:
- **Resilience4j**: Circuit breakers, retries, rate limiting
- **Testcontainers**: Testing con contenedores reales
- **Lombok**: Reducir boilerplate (ya lo usas)
- **MapStruct**: Mapeo DTOs (ya lo usas)

---

## 📝 Ejemplo de Configuración: Feign Client

```java
// En Employee Service
@FeignClient(name = "auth-service", url = "${auth.service.url}")
public interface AuthServiceClient {
    @GetMapping("/usuarios/{id}")
    UsuarioResponse getUsuario(@PathVariable Integer id);
}
```

---

## 🎯 Ventajas de esta Arquitectura

1. **Escalabilidad Independiente**: Cada servicio escala según necesidad
2. **Tecnología Independiente**: Cada servicio puede usar diferentes tecnologías
3. **Despliegue Independiente**: Deploy sin afectar otros servicios
4. **Equipos Independientes**: Equipos pueden trabajar en paralelo
5. **Falla Aislada**: Un servicio caído no afecta a todos

---

## 📌 Notas Finales

- **Empezar pequeño**: Extraer un servicio a la vez
- **Mantener el monolito funcionando**: Migración gradual
- **Comunicación clara**: Documentar contratos entre servicios
- **Monitoreo desde el inicio**: Implementar logging y métricas temprano
- **Testing continuo**: Asegurar que cada servicio funciona independientemente

---

**¿Necesitas ayuda con la implementación de algún servicio específico?**



