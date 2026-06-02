# Diagrama de Arquitectura de Microservicios

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENTE (Frontend/Mobile)                      │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                │ HTTPS
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY (Puerto 8080)                        │
│  - Enrutamiento                                                          │
│  - Autenticación JWT                                                     │
│  - Rate Limiting                                                         │
│  - Load Balancing                                                        │
└───────┬───────┬───────┬───────┬───────┬───────┬─────────────────────────┘
        │       │       │       │       │       │
        │       │       │       │       │       │
    ┌───▼───┐ ┌─▼───┐ ┌─▼───┐ ┌─▼───┐ ┌─▼───┐ ┌─▼───┐
    │ Auth  │ │Emp  │ │Sched│ │Appt │ │Cat  │ │Gym  │
    │(8081) │ │(8082)│ │(8083)│ │(8084)│ │(8085)│ │(8086)│
    └───┬───┘ └─┬───┘ └─┬───┘ └─┬───┘ └─┬───┘ └─┬───┘
        │       │       │       │       │       │
        │       │       │       │       │       │
    ┌───▼───┐ ┌─▼───┐ ┌─▼───┐ ┌─▼───┐ ┌─▼───┐ ┌─▼───┐
    │auth_db│ │emp_db│ │sch_db│ │app_db│ │cat_db│ │gym_db│
    └───────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘
```

---

## 🔄 Flujo de Comunicación

### 1. Flujo de Autenticación

```
Cliente                    API Gateway              Auth Service
   │                            │                         │
   │─── POST /auth/login ──────►│                         │
   │                            │─── Validar creds ──────►│
   │                            │                         │
   │                            │◄─── JWT Token ──────────│
   │◄─── JWT Token ─────────────│                         │
   │                            │                         │
```

### 2. Flujo de Creación de Cita

```
Cliente                    API Gateway              Appointment Service
   │                            │                         │
   │─── POST /citas ───────────►│                         │
   │    (con JWT)               │                         │
   │                            │─── Validar JWT ────────►│
   │                            │                         │
   │                            │─── Crear Cita ─────────►│
   │                            │                         │
   │                            │    ┌────────────────────┘
   │                            │    │
   │                            │    ▼
   │                            │  Scheduling Service
   │                            │  (validar disponibilidad)
   │                            │    │
   │                            │    ▼
   │                            │  Employee Service
   │                            │  (validar empleado)
   │                            │    │
   │                            │    ▼
   │                            │  Kafka Event
   │                            │  "Cita Creada"
   │                            │    │
   │                            │◄─── Cita Creada ────────│
   │◄─── 201 Created ───────────│                         │
   │                            │                         │
```

### 3. Comunicación Asíncrona (Eventos)

```
Scheduling Service          Kafka              Appointment Service
      │                      │                         │
      │─── Programación ─────►│                         │
      │    Creada Event      │                         │
      │                      │                         │
      │                      │─── Event ───────────────►│
      │                      │                         │
      │                      │                         │ (Actualiza
      │                      │                         │  disponibilidad)
```

---

## 📦 Distribución de Entidades por Servicio

### Auth Service (8081)
```
┌─────────────────────┐
│   Auth Service      │
├─────────────────────┤
│ • Usuario           │
│ • Rol               │
│ • Menu              │
│ • RolMenu           │
│ • Token             │
└─────────────────────┘
         │
         ▼
    ┌─────────┐
    │ auth_db │
    └─────────┘
```

### Employee Service (8082)
```
┌─────────────────────┐
│  Employee Service   │
├─────────────────────┤
│ • Empleado          │
│ • Empresa           │
│ • TipoEmpleado      │
└─────────────────────┘
         │
         ▼
    ┌─────────┐
    │ employee_db │
    └─────────┘
         │
         │ (consume)
         ▼
    ┌─────────────┐
    │ Auth Service│
    └─────────────┘
```

### Scheduling Service (8083)
```
┌─────────────────────┐
│ Scheduling Service  │
├─────────────────────┤
│ • Programacion      │
│ • ProgramacionDetalle│
│ • Horario           │
│ • DiasPorEmpleado   │
│ • Feriado           │
│ • Scheduler (Cron) │
└─────────────────────┘
         │
         ▼
    ┌─────────────┐
    │ scheduling_db│
    └─────────────┘
         │
         │ (consume)      (publish)
         ▼                ▼
    ┌─────────────┐   ┌─────────┐
    │Employee Svc │   │  Kafka  │
    └─────────────┘   └─────────┘
```

### Appointment Service (8084)
```
┌─────────────────────┐
│ Appointment Service │
├─────────────────────┤
│ • Cita              │
│ • HistoriaClinica   │
│ • Scheduler (Cron)  │
└─────────────────────┘
         │
         ▼
    ┌─────────────┐
    │appointment_db│
    └─────────────┘
         │
         │ (consume)      (publish)
         ▼                ▼
    ┌─────────────┐   ┌─────────┐
    │Scheduling   │   │  Kafka  │
    │Service      │   └─────────┘
    └─────────────┘
         │
         │ (consume)
         ▼
    ┌─────────────┐
    │Employee Svc │
    └─────────────┘
```

### Catalog Service (8085)
```
┌─────────────────────┐
│  Catalog Service    │
├─────────────────────┤
│ • Maestra           │
└─────────────────────┘
         │
         ▼
    ┌─────────────┐
    │  catalog_db │
    └─────────────┘
         │
         │ (cache)
         ▼
    ┌─────────┐
    │  Redis   │
    └─────────┘
```

---

## 🔐 Arquitectura de Seguridad

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │
       │ 1. POST /auth/login
       ▼
┌─────────────────┐
│   API Gateway   │
└──────┬──────────┘
       │
       │ 2. Forward to Auth Service
       ▼
┌─────────────────┐      ┌──────────────┐
│  Auth Service   │─────►│   auth_db    │
│                 │      │              │
│ - Validar creds │      │ - Usuarios   │
│ - Generar JWT   │      │ - Roles      │
│ - Refresh token │      │ - Tokens     │
└──────┬──────────┘      └──────────────┘
       │
       │ 3. Return JWT
       ▼
┌─────────────────┐
│   API Gateway   │
│                 │
│ - Validar JWT   │
│ - Extract claims│
└──────┬──────────┘
       │
       │ 4. Request con JWT
       ▼
┌─────────────────┐
│ Microservicio   │
│ (Employee, etc) │
└─────────────────┘
```

---

## 📊 Stack Tecnológico por Capa

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│  • API Gateway (Spring Cloud Gateway)                    │
│  • Swagger/OpenAPI (SpringDoc)                          │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                     │
│  • Controllers (REST)                                    │
│  • DTOs (Request/Response)                              │
│  • Mappers (MapStruct)                                   │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                     BUSINESS LAYER                      │
│  • Services (Lógica de Negocio)                         │
│  • Validators                                            │
│  • Schedulers (Cron)                                     │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                      DATA LAYER                          │
│  • Repositories (Spring Data JPA)                        │
│  • Entities (JPA/Hibernate)                             │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                    │
│  • PostgreSQL (por servicio)                            │
│  • Kafka (Event Streaming)                               │
│  • Redis (Cache)                                         │
│  • Eureka/Consul (Service Discovery)                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Despliegue (Docker Compose)

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Network                       │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │   Auth   │  │ Employee │  │Scheduling│            │
│  │ Service  │  │ Service  │  │ Service  │            │
│  │ :8081    │  │ :8082    │  │ :8083    │            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
│       │             │             │                   │
│       ▼             ▼             ▼                   │
│  ┌────────┐   ┌────────┐   ┌────────┐               │
│  │auth_db │   │emp_db  │   │sch_db  │               │
│  └────────┘   └────────┘   └────────┘               │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │Appointment│ │ Catalog  │  │   Kafka  │            │
│  │ Service   │ │ Service  │  │          │            │
│  │ :8084    │  │ :8085    │  │ :9092    │            │
│  └────┬─────┘  └────┬─────┘  └──────────┘            │
│       │             │                                 │
│       ▼             ▼                                 │
│  ┌────────┐   ┌────────┐                            │
│  │app_db  │   │cat_db  │                            │
│  └────────┘   └────────┘                            │
│                                                       │
│  ┌──────────┐  ┌──────────┐                         │
│  │API Gateway│ │  Redis   │                         │
│  │ :8080    │  │ :6379    │                         │
│  └──────────┘  └──────────┘                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📈 Escalabilidad

### Escalado Horizontal

```
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                        │
└───────┬───────────┬───────────┬─────────────────────────┘
        │           │           │
    ┌───▼───┐   ┌───▼───┐   ┌───▼───┐
    │ Auth  │   │ Auth  │   │ Auth  │
    │ Svc 1 │   │ Svc 2 │   │ Svc 3 │
    └───┬───┘   └───┬───┘   └───┬───┘
        │           │           │
        └───────────┴───────────┘
                    │
                    ▼
            ┌───────────────┐
            │   auth_db     │
            │  (Primary)    │
            └───────────────┘
                    │
                    ▼
            ┌───────────────┐
            │   auth_db     │
            │  (Replica)    │
            └───────────────┘
```

---

## 🔍 Monitoreo y Observabilidad

```
┌─────────────────────────────────────────────────────────┐
│                    Monitoring Stack                      │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │Prometheus│  │  Grafana │  │  Zipkin  │              │
│  │(Métricas)│  │(Dashboards│ │(Tracing) │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│       │             │             │                     │
│       └─────────────┴─────────────┘                     │
│                    │                                     │
│                    ▼                                     │
│  ┌─────────────────────────────────────┐                │
│  │      ELK Stack                      │                │
│  │  Elasticsearch + Logstash + Kibana  │                │
│  │         (Logging Centralizado)       │                │
│  └─────────────────────────────────────┘                │
│                    │                                     │
│                    ▼                                     │
│  ┌─────────────────────────────────────┐                │
│  │    Microservicios                   │                │
│  │  (Spring Boot Actuator)             │                │
│  │  /actuator/health                    │                │
│  │  /actuator/metrics                   │                │
│  └─────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Resumen de Puertos y Servicios

| Servicio | Puerto | Base de Datos | Dependencias |
|----------|--------|---------------|--------------|
| API Gateway | 8080 | - | Auth Service |
| Auth Service | 8081 | auth_db | - |
| Employee Service | 8082 | employee_db | Auth Service |
| Scheduling Service | 8083 | scheduling_db | Employee Service, Kafka |
| Appointment Service | 8084 | appointment_db | Scheduling, Employee, Kafka |
| Catalog Service | 8085 | catalog_db | Redis |
| Gym Service | 8086 | gym_db | - |
| Kafka | 9092 | - | - |
| Redis | 6379 | - | - |
| PostgreSQL (auth) | 5432 | auth_db | - |
| PostgreSQL (employee) | 5433 | employee_db | - |
| PostgreSQL (scheduling) | 5434 | scheduling_db | - |
| PostgreSQL (appointment) | 5435 | appointment_db | - |

---

**Nota**: Estos diagramas muestran la arquitectura propuesta. La implementación real puede variar según necesidades específicas.



