package com.gafahtec.consultorio.config;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.gafahtec.consultorio.model.auth.Empleado;
import com.gafahtec.consultorio.model.auth.Empresa;
import com.gafahtec.consultorio.model.auth.Rol;
import com.gafahtec.consultorio.model.auth.Usuario;
import com.gafahtec.consultorio.repository.IEmpleadoRepository;
import com.gafahtec.consultorio.repository.IEmpresaRepository;
import com.gafahtec.consultorio.repository.IRolRepository;
import com.gafahtec.consultorio.repository.IUsuarioRepository;
import com.gafahtec.consultorio.util.Constants;

import lombok.extern.slf4j.Slf4j;

/**
 * Crea o actualiza el superusuario local (rol SUPER, empresa gafah).
 * Solo perfil {@code dev}; desactivar con {@code app.seed.super-gafah.enabled=false}.
 */
@Configuration
@Profile("dev")
@Slf4j
public class SuperGafahAdminSeedInitializer {

  @Bean
  @ConditionalOnProperty(prefix = "app.seed.super-gafah", name = "enabled", havingValue = "true", matchIfMissing = true)
  CommandLineRunner superGafahAdminSeed(
      IEmpresaRepository empresaRepository,
      IRolRepository rolRepository,
      IEmpleadoRepository empleadoRepository,
      IUsuarioRepository usuarioRepository,
      PasswordEncoder passwordEncoder,
      @Value("${app.seed.super-gafah.email:ga@correo.com}") String email,
      @Value("${app.seed.super-gafah.password:super-gafah-admin}") String plainPassword,
      @Value("${app.seed.super-gafah.empresa:gafah}") String empresaNombre,
      @Value("${app.seed.super-gafah.nombres:Gafah}") String nombres,
      @Value("${app.seed.super-gafah.apellido-paterno:Admin}") String apellidoPaterno,
      @Value("${app.seed.super-gafah.apellido-materno:Sistema}") String apellidoMaterno,
      @Value("${app.seed.super-gafah.numero-documento:00000001}") String numeroDocumento) {
    return args -> {
      Rol superRol = rolRepository.findByNombre("SUPER");
      if (superRol == null) {
        log.warn("Rol SUPER no encontrado; omitiendo seed de super usuario gafah");
        return;
      }

      Empresa empresa = empresaRepository.findAll().stream()
          .filter(e -> empresaNombre.equalsIgnoreCase(e.getNombre()))
          .findFirst()
          .orElseGet(() -> empresaRepository.save(
              Empresa.builder().nombre(empresaNombre).activo(true).build()));

      String encodedPassword = passwordEncoder.encode(plainPassword);
      Set<Rol> roles = new HashSet<>();
      roles.add(superRol);

      var existing = usuarioRepository.findByEmail(email);
      if (existing.isPresent()) {
        Usuario usuario = existing.get();
        usuario.setPassword(encodedPassword);
        usuario.setRoles(roles);
        usuarioRepository.save(usuario);
        log.info("Super usuario gafah actualizado (email={}, rol SUPER)", email);
        return;
      }

      Empleado empleado = Empleado.builder()
          .activo(Constants.ACTIVO)
          .nombres(nombres)
          .apellidoPaterno(apellidoPaterno)
          .apellidoMaterno(apellidoMaterno)
          .numeroDocumento(numeroDocumento)
          .empresa(empresa)
          .build();
      empleado = empleadoRepository.save(empleado);

      Usuario usuario = Usuario.builder()
          .email(email)
          .password(encodedPassword)
          .empleado(empleado)
          .roles(roles)
          .build();
      usuarioRepository.save(usuario);
      log.info("Super usuario gafah creado (email={}, empresa={}, rol SUPER)", email, empresaNombre);
    };
  }
}
