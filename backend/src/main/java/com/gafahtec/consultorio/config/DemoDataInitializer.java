package com.gafahtec.consultorio.config;

import java.util.Objects;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.gafahtec.consultorio.dto.request.EmpresaRequest;
import com.gafahtec.consultorio.dto.request.RolRequest;
import com.gafahtec.consultorio.dto.request.UsuarioRequest;
import com.gafahtec.consultorio.service.IEmpresaService;
import com.gafahtec.consultorio.service.IRolService;
import com.gafahtec.consultorio.service.IUsuarioService;

import lombok.extern.slf4j.Slf4j;

/**
 * Datos de demostración solo para desarrollo local explícito.
 * En producción no debe activarse (perfil prod + propiedad en false).
 */
@Configuration
@Profile("dev")
@Slf4j
public class DemoDataInitializer {

  @Bean
  @ConditionalOnProperty(prefix = "app.seed", name = "demo-enabled", havingValue = "true")
  CommandLineRunner demoDataRunner(
      IRolService rolService,
      IEmpresaService empresaService,
      IUsuarioService usuarioService) {
    return args -> {
      log.warn("app.seed.demo-enabled=true: insertando empresa y usuario de demostración");

      rolService.registrar(RolRequest.builder().idRol(1).nombre("SUPER").build());
      rolService.registrar(RolRequest.builder().idRol(2).nombre("ADMIN").build());
      empresaService.registrar(EmpresaRequest.builder().idEmpresa(1).nombre("gafah").build());

      var admin = UsuarioRequest.builder()
          .nombres("GIOVANNI")
          .numeroDocumento("41181764")
          .email("ga@correo.com")
          .password("super-gafah-admin")
          .idEmpresa(1)
          .idRol(1)
          .apellidoPaterno("ASCARZA")
          .apellidoMaterno("HINOSTROZA")
          .build();

      var created = usuarioService.register(admin);
      if (!Objects.isNull(created)) {
        log.info("Usuario demo registrado: {}", created.getEmail());
      }
    };
  }
}
