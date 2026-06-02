package com.gafahtec.consultorio.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gafahtec.consultorio.dto.request.ProgramacionRequest;
import com.gafahtec.consultorio.dto.response.ProgramacionResponse;
import com.gafahtec.consultorio.exception.ResourceNotFoundException;
import com.gafahtec.consultorio.service.IProgramacionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping("/programaciones")
@AllArgsConstructor
@Log4j2
@PreAuthorize("@authz.isSuperOrAdmin()")
@Tag(name = "Programacion", description = "Operaciones sobre programaciones")
public class ProgramacionController {

    private IProgramacionService iProgramacionService;

    @Operation(summary = "Listar programaciones", description = "Obtiene todas las programaciones registradas.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping
    public ResponseEntity<List<ProgramacionResponse>> listar() throws Exception {
        var lista = iProgramacionService.listar();
        if (lista.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(lista, HttpStatus.OK);
    }

    @Operation(summary = "Obtener programación por ID", description = "Obtiene una programación por su identificador único.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "404", description = "Programación no encontrada"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ProgramacionResponse> listarPorId(@PathVariable("id") Integer id) throws Exception {
        var obj = iProgramacionService.listarPorId(id);

        if (obj.getIdProgramacion() == null) {
            throw new ResourceNotFoundException("Id no encontrado " + id);
        }

        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @Operation(summary = "Obtener programación activa", description = "Obtiene la programación activa.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "404", description = "Programación activa no encontrada"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/activo")
    public ResponseEntity<ProgramacionResponse> programacionActivo() throws Exception {
        var list = iProgramacionService.programacionActivo().stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("programacion activa no encontrado "));

        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @Operation(summary = "Registrar programación", description = "Registra una nueva programación.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Programación creada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping
    public ResponseEntity<ProgramacionResponse> registrar(@Valid @RequestBody ProgramacionRequest programacionRequest)
            throws RuntimeException {

        var obj = iProgramacionService.registrar(programacionRequest);

        return new ResponseEntity<>(obj, HttpStatus.CREATED);

    }

    @Operation(summary = "Modificar programación", description = "Modifica una programación existente.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Programación modificada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PutMapping
    public ResponseEntity<ProgramacionResponse> modificar(@Valid @RequestBody ProgramacionRequest programacionRequest)
            throws Exception {
        var obj = iProgramacionService.modificar(programacionRequest);
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @Operation(summary = "Eliminar programación", description = "Elimina una programación por su identificador único.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Programación eliminada exitosamente"),
            @ApiResponse(responseCode = "404", description = "Programación no encontrada"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable("id") Integer id) throws Exception {
        var obj = iProgramacionService.listarPorId(id);

        if (obj.getIdProgramacion() == null) {
            throw new ResourceNotFoundException("ID NO ENCONTRADO " + id);
        }

        iProgramacionService.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Listar programaciones paginadas", description = "Obtiene programaciones paginadas para una empresa.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/{idEmpresa}/pageable")
    public ResponseEntity<Page<ProgramacionResponse>> listarPageable(
            @PathVariable("idEmpresa") Integer idEmpresa,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String search) throws Exception {

        var paging = PageRequest.of(page, size, Sort.by("idProgramacion").descending());
        Page<ProgramacionResponse> paginas;
        if (search != null && !search.trim().isEmpty()) {
            paginas = iProgramacionService.buscarProgramaciones(idEmpresa, search.trim(), paging);
        } else {
            paginas = iProgramacionService.listarProgramacionPageable(idEmpresa, paging);
        }

        if (paginas.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(paginas, HttpStatus.OK);
    }
}
