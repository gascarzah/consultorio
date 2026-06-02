package com.gafahtec.consultorio.controller;

import com.gafahtec.consultorio.dto.request.DiasPorEmpleadoRequest;
import com.gafahtec.consultorio.model.auth.Empleado;
import com.gafahtec.consultorio.model.consultorio.DiasPorEmpleado;
import com.gafahtec.consultorio.repository.IEmpleadoRepository;
import com.gafahtec.consultorio.service.DiasPorEmpleadoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dias-por-empleado")
@RequiredArgsConstructor
@Tag(name = "DiasPorEmpleado", description = "Operaciones sobre los días asignados a empleados")
public class DiasPorEmpleadoController {

    private final DiasPorEmpleadoService diasPorEmpleadoService;
    private final IEmpleadoRepository empleadoRepository;

    @Operation(summary = "Registrar días por empleado", description = "Registra los días asignados a un empleado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Registro exitoso"),
            @ApiResponse(responseCode = "404", description = "Empleado no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping
    public ResponseEntity<DiasPorEmpleado> registrarDias(@RequestBody DiasPorEmpleadoRequest request) {
        Empleado empleado = empleadoRepository.findById(request.getIdEmpleado())
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        DiasPorEmpleado nuevoRegistro = DiasPorEmpleado.builder()
                .empleado(empleado)
                .dias(request.getDias())
                .build();

        return ResponseEntity.ok(diasPorEmpleadoService.guardar(nuevoRegistro));
    }

    @Operation(summary = "Obtener días por empleado", description = "Obtiene los días asignados a un empleado específico.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "404", description = "Empleado no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/{idEmpleado}")
    public ResponseEntity<List<DiasPorEmpleado>> obtenerPorEmpleado(@PathVariable Integer idEmpleado) {
        return ResponseEntity.ok(diasPorEmpleadoService.listarPorEmpleado(idEmpleado));
    }

    @Operation(summary = "Listar días por empresa", description = "Obtiene todos los días asignados a empleados de una empresa.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping
    public ResponseEntity<List<DiasPorEmpleado>> empleadosPorEmpresa(@RequestParam("idEmpresa") Integer idEmpresa) {
        List<DiasPorEmpleado> lista = diasPorEmpleadoService.empleadosPorEmpresa(idEmpresa);
        return ResponseEntity.ok(lista);
    }
}
