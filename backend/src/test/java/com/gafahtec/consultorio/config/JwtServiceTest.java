package com.gafahtec.consultorio.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

import java.util.HashSet;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import com.gafahtec.consultorio.model.auth.Rol;
import com.gafahtec.consultorio.model.auth.Usuario;

class JwtServiceTest {

  private JwtService jwtService;

  @BeforeEach
  void setUp() {
    jwtService = new JwtService();
    ReflectionTestUtils.setField(jwtService, "secretKey", "MDEyMzQ1Njc4OUFCQ0RFRjAxMjM0NTY3ODlBQkNERUY=");
    ReflectionTestUtils.setField(jwtService, "jwtExpiration", 60000L);
    ReflectionTestUtils.setField(jwtService, "refreshExpiration", 120000L);
  }

  @Test
  void shouldGenerateTokenAndExtractUsername() {
    Usuario usuario = buildUser("doctor@gafah.net", "ADMIN");

    String token = jwtService.generateToken(usuario);

    assertNotNull(token);
    assertEquals("doctor@gafah.net", jwtService.extractUsername(token));
    assertTrue(jwtService.isTokenValid(token, usuario));
  }

  @Test
  void shouldInvalidateTokenForDifferentUser() {
    Usuario tokenOwner = buildUser("owner@gafah.net", "ADMIN");
    Usuario differentUser = buildUser("other@gafah.net", "USER");
    String token = jwtService.generateToken(tokenOwner);

    assertFalse(jwtService.isTokenValid(token, differentUser));
  }

  private Usuario buildUser(String email, String roleName) {
    Set<Rol> roles = new HashSet<>();
    roles.add(Rol.builder().idRol(1).nombre(roleName).build());

    return Usuario.builder()
        .email(email)
        .password("secret")
        .roles(roles)
        .build();
  }
}
