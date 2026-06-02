# Ejemplo de Implementación: Auth Service

Este documento muestra cómo estructurar el **Auth Service** como ejemplo de implementación de un microservicio.

## 📁 Estructura del Proyecto

```
auth-service/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── gafahtec/
│   │   │           └── auth/
│   │   │               ├── AuthServiceApplication.java
│   │   │               ├── config/
│   │   │               │   ├── ApplicationConfig.java
│   │   │               │   ├── JwtService.java
│   │   │               │   ├── JwtAuthenticationFilter.java
│   │   │               │   └── SecurityConfiguration.java
│   │   │               ├── controller/
│   │   │               │   ├── AuthenticationController.java
│   │   │               │   ├── UsuarioController.java
│   │   │               │   ├── RolController.java
│   │   │               │   └── MenuController.java
│   │   │               ├── dto/
│   │   │               │   ├── request/
│   │   │               │   │   ├── AuthenticationRequest.java
│   │   │               │   │   ├── UsuarioRequest.java
│   │   │               │   │   └── RolRequest.java
│   │   │               │   └── response/
│   │   │               │       ├── AuthenticationResponse.java
│   │   │               │       └── UsuarioResponse.java
│   │   │               ├── model/
│   │   │               │   ├── Usuario.java
│   │   │               │   ├── Rol.java
│   │   │               │   ├── Menu.java
│   │   │               │   ├── RolMenu.java
│   │   │               │   └── Token.java
│   │   │               ├── repository/
│   │   │               │   ├── IUsuarioRepository.java
│   │   │               │   ├── IRolRepository.java
│   │   │               │   ├── IMenuRepository.java
│   │   │               │   └── ITokenRepository.java
│   │   │               └── service/
│   │   │                   ├── IUsuarioService.java
│   │   │                   ├── IRolService.java
│   │   │                   ├── IAuthenticationService.java
│   │   │                   └── impl/
│   │   │                       ├── UsuarioServiceImpl.java
│   │   │                       ├── RolServiceImpl.java
│   │   │                       └── AuthenticationServiceImpl.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── db/
│   │           └── migration/
│   │               ├── V1__create_usuario_table.sql
│   │               ├── V2__create_rol_table.sql
│   │               └── V3__create_token_table.sql
│   └── test/
│       └── java/
│           └── com/
│               └── gafahtec/
│                   └── auth/
│                       └── AuthServiceApplicationTests.java
└── Dockerfile
```

---

## 📄 pom.xml (Auth Service)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.12</version>
        <relativePath/>
    </parent>
    
    <groupId>com.gafahtec</groupId>
    <artifactId>auth-service</artifactId>
    <version>1.0.0</version>
    <name>Auth Service</name>
    <description>Microservicio de Autenticación y Autorización</description>
    
    <properties>
        <java.version>21</java.version>
        <spring-cloud.version>2023.0.0</spring-cloud.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.11.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.11.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.11.5</version>
        </dependency>
        
        <!-- Database -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Flyway -->
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-core</artifactId>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- Spring Cloud -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        
        <!-- OpenFeign (para comunicación con otros servicios) -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>
        
        <!-- Actuator (para health checks y métricas) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        
        <!-- Swagger/OpenAPI -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.1.0</version>
        </dependency>
        
        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

## ⚙️ application.yml (Auth Service)

```yaml
server:
  port: 8081

spring:
  application:
    name: auth-service
  
  datasource:
    url: jdbc:postgresql://localhost:5432/auth_db
    username: postgres
    password: root
    driver-class-name: org.postgresql.Driver
  
  jpa:
    database: postgresql
    show-sql: true
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true

# JWT Configuration
application:
  security:
    jwt:
      secret-key: 404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
      expiration: 86400000  # 24 horas
      refresh-token:
        expiration: 604800000  # 7 días

# Eureka (Service Discovery)
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true

# Actuator
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: always

# Swagger
springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
    enabled: true

# Logging
logging:
  level:
    com.gafahtec.auth: DEBUG
    org.springframework.security: DEBUG
```

---

## 🎯 AuthServiceApplication.java

```java
package com.gafahtec.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients
public class AuthServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }
}
```

---

## 🔐 SecurityConfiguration.java (Simplificada para Microservicio)

```java
package com.gafahtec.auth.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/auth/**",
                    "/actuator/**",
                    "/swagger-ui/**",
                    "/v3/api-docs/**"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

---

## 🌐 AuthenticationController.java

```java
package com.gafahtec.auth.controller;

import com.gafahtec.auth.dto.request.AuthenticationRequest;
import com.gafahtec.auth.dto.response.AuthenticationResponse;
import com.gafahtec.auth.service.IAuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints de autenticación")
public class AuthenticationController {

    private final IAuthenticationService authenticationService;

    @Operation(summary = "Autenticar usuario", description = "Login y generación de JWT")
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @Valid @RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @Operation(summary = "Refrescar token", description = "Obtener nuevo access token")
    @PostMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> refreshToken(
            @RequestParam String refreshToken) {
        return ResponseEntity.ok(authenticationService.refreshToken(refreshToken));
    }

    @Operation(summary = "Cerrar sesión", description = "Invalidar tokens")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestParam String token) {
        authenticationService.logout(token);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
```

---

## 📡 Feign Client (Ejemplo: Comunicación con Employee Service)

```java
package com.gafahtec.auth.client;

import com.gafahtec.auth.dto.response.EmpleadoResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "employee-service", url = "${employee.service.url:http://localhost:8082}")
public interface EmployeeServiceClient {

    @GetMapping("/empleados/{id}")
    EmpleadoResponse getEmpleado(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String token);
}
```

---

## 🐳 Dockerfile (Auth Service)

```dockerfile
FROM openjdk:21-jdk-slim

WORKDIR /app

# Copiar el JAR
COPY target/auth-service-1.0.0.jar app.jar

# Exponer puerto
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8081/actuator/health || exit 1

# Ejecutar aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 🐳 docker-compose.yml (Solo Auth Service)

```yaml
version: '3.8'

services:
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
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  auth-service:
    build: ./auth-service
    container_name: auth-service
    ports:
      - "8081:8081"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://auth-db:5432/auth_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: root
      EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE: http://eureka-server:8761/eureka/
    depends_on:
      auth-db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8081/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  auth_db_data:
```

---

## 🔄 Event Publisher (Ejemplo con Spring Cloud Stream)

```java
package com.gafahtec.auth.service.impl;

import com.gafahtec.auth.dto.response.UsuarioResponse;
import com.gafahtec.auth.event.UsuarioCreadoEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsuarioServiceImpl implements IUsuarioService {

    private final StreamBridge streamBridge;
    
    @Override
    public UsuarioResponse registrar(UsuarioRequest request) {
        // Lógica de registro...
        Usuario usuario = // ... crear usuario
        
        // Publicar evento
        UsuarioCreadoEvent event = UsuarioCreadoEvent.builder()
            .idUsuario(usuario.getIdUsuario())
            .email(usuario.getEmail())
            .idEmpleado(usuario.getEmpleado().getIdEmpleado())
            .build();
        
        streamBridge.send("usuarioCreado-out-0", event);
        log.info("Evento publicado: Usuario creado - {}", event);
        
        return mapper.toResponse(usuario);
    }
}
```

---

## 📊 Health Check Endpoint

```java
package com.gafahtec.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/actuator")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "auth-service");
        return ResponseEntity.ok(status);
    }
}
```

---

## 🧪 Test de Integración (Ejemplo)

```java
package com.gafahtec.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gafahtec.auth.dto.request.AuthenticationRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthenticationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testLogin() throws Exception {
        AuthenticationRequest request = AuthenticationRequest.builder()
            .email("ga@correo.com")
            .password("password")
            .build();

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.accessToken").exists())
            .andExpect(jsonPath("$.refreshToken").exists());
    }
}
```

---

## 📝 Checklist de Implementación

- [ ] Crear estructura de proyecto
- [ ] Configurar `pom.xml` con dependencias
- [ ] Configurar `application.yml`
- [ ] Migrar entidades del monolito
- [ ] Crear migraciones Flyway
- [ ] Implementar repositorios
- [ ] Implementar servicios
- [ ] Implementar controladores
- [ ] Configurar seguridad (JWT)
- [ ] Configurar Feign Clients (si aplica)
- [ ] Configurar Event Publishing (si aplica)
- [ ] Crear Dockerfile
- [ ] Crear docker-compose.yml
- [ ] Implementar health checks
- [ ] Configurar logging
- [ ] Escribir tests
- [ ] Documentar API (Swagger)
- [ ] Configurar Service Discovery (Eureka/Consul)

---

## 🔗 Próximos Pasos

1. **Employee Service**: Seguir el mismo patrón
2. **Scheduling Service**: Agregar lógica de cron y eventos
3. **Appointment Service**: Implementar comunicación con Scheduling
4. **API Gateway**: Configurar enrutamiento y autenticación centralizada

---

**Nota**: Este es un ejemplo base. Ajusta según tus necesidades específicas.



