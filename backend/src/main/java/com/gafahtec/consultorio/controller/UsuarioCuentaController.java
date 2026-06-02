package com.gafahtec.consultorio.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gafahtec.consultorio.dto.request.CambiarPasswordRequest;
import com.gafahtec.consultorio.service.IUsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/usuario")
@RequiredArgsConstructor
@Tag(name = "Cuenta de usuario", description = "Operaciones de la cuenta autenticada")
public class UsuarioCuentaController {

	private final IUsuarioService usuarioService;

	@Operation(summary = "Cambiar contraseña", description = "Actualiza la contraseña del usuario autenticado e invalida tokens previos.")
	@PostMapping("/cambiar-password")
	public ResponseEntity<Map<String, String>> cambiarPassword(@RequestBody CambiarPasswordRequest request) {
		usuarioService.cambiarPassword(request);
		return ResponseEntity.ok(Map.of("message", "Contraseña actualizada correctamente"));
	}
}
