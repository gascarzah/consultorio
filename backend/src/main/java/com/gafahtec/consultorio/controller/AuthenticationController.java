package com.gafahtec.consultorio.controller;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gafahtec.consultorio.dto.request.AuthenticationRequest;
import com.gafahtec.consultorio.dto.request.AuthenticationResponse;
import com.gafahtec.consultorio.service.IUsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación", description = "Operaciones de autenticación y manejo de tokens JWT")
public class AuthenticationController {

  private final IUsuarioService iUsuarioService;

  @Operation(summary = "Autenticar usuario", description = "Autentica un usuario y retorna el token JWT.")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Autenticación exitosa"),
      @ApiResponse(responseCode = "400", description = "Credenciales inválidas"),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor")
  })
  @PostMapping("/login")
  public ResponseEntity<AuthenticationResponse> authenticate(
      @RequestBody AuthenticationRequest request) {
    return ResponseEntity.ok(iUsuarioService.authenticate(request));
  }

  @Operation(summary = "Refrescar token JWT", description = "Refresca el token JWT usando el refresh token.")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "Token refrescado exitosamente"),
      @ApiResponse(responseCode = "400", description = "Token inválido o expirado"),
      @ApiResponse(responseCode = "500", description = "Error interno del servidor")
  })
  @PostMapping("/refresh-token")
  public void refreshToken(
      HttpServletRequest request,
      HttpServletResponse response) throws IOException {
    iUsuarioService.refreshToken(request, response);
  }

}
