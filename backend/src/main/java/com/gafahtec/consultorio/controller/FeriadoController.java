package com.gafahtec.consultorio.controller;

import com.gafahtec.consultorio.model.Feriado;
import com.gafahtec.consultorio.service.IFeriadoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/feriados")
@AllArgsConstructor
@Log4j2
@Tag(name = "Feriado", description = "Operaciones sobre feriados")
public class FeriadoController {
    private final IFeriadoService feriadoService;

    @Operation(summary = "Listar feriados", description = "Obtiene todos los feriados registrados.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping
    public ResponseEntity<List<Feriado>> getTodos() {
        return ResponseEntity.ok(feriadoService.getAll());
    }
}
