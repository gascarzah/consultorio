package com.gafahtec.consultorio.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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

import com.gafahtec.consultorio.dto.request.HorarioRequest;
import com.gafahtec.consultorio.dto.response.HorarioResponse;
import com.gafahtec.consultorio.exception.ResourceNotFoundException;
import com.gafahtec.consultorio.service.IHorarioService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/horarios")
@AllArgsConstructor
@Log4j2
@PreAuthorize("@authz.canAccessApp()")
@Tag(name = "Horario", description = "Operaciones sobre horarios")
public class HorarioController {

    private IHorarioService iHorarioService;

    @Operation(summary = "Registrar horario", description = "Registra un nuevo horario.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Horario creado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping
    public ResponseEntity<HorarioResponse> registrar(@Valid @RequestBody HorarioRequest horarioRequest)
            throws Exception {

        var obj = iHorarioService.registrar(horarioRequest);

        log.info("objeto creado {}", obj);
        return new ResponseEntity<>(obj, HttpStatus.CREATED);
    }

    @Operation(summary = "Listar horarios paginados", description = "Obtiene horarios paginados.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/pageable")
    public ResponseEntity<Page<HorarioResponse>> listarPageable(@PageableDefault(sort = "idHorario") Pageable pageable,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String search) throws Exception {
        Page<HorarioResponse> paginas;
        if (search != null && !search.trim().isEmpty()) {
            paginas = iHorarioService.buscarHorarios(search.trim(), pageable);
        } else {
            paginas = iHorarioService.listarPageable(pageable);
        }
        if (paginas.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(paginas, HttpStatus.OK);
    }

    @Operation(summary = "Obtener horario por ID", description = "Obtiene un horario por su identificador único.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "404", description = "Horario no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/{id}")
    public ResponseEntity<HorarioResponse> listarPorId(@PathVariable("id") Integer id) throws Exception {
        var obj = iHorarioService.listarPorId(id);

        if (obj.getIdHorario() == null) {
            throw new ResourceNotFoundException("Id no encontrado " + id);
        }

        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @Operation(summary = "Listar horarios", description = "Obtiene todos los horarios registrados.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping
    public ResponseEntity<List<HorarioResponse>> getHorarios() throws Exception {
        var horarios = iHorarioService.listar();
        if (horarios.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(horarios, HttpStatus.OK);
    }

    @Operation(summary = "Eliminar horario", description = "Elimina un horario por su identificador único.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Horario eliminado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Horario no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable("id") Integer id) throws Exception {
        var obj = iHorarioService.listarPorId(id);

        if (obj == null) {
            throw new ResourceNotFoundException("ID NO ENCONTRADO " + id);
        }
        iHorarioService.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Modificar horario", description = "Modifica un horario existente.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Horario modificado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PutMapping
    public ResponseEntity<HorarioResponse> modificar(@Valid @RequestBody HorarioRequest horarioRequest)
            throws Exception {

        var obj = iHorarioService.modificar(horarioRequest);

        log.info("objeto creado {}", obj);
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @Operation(summary = "Listar horarios por programación", description = "Obtiene los horarios disponibles para una programación y empresa.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/dia/{idProgramacionDetalle}/{idEmpresa}")
    public ResponseEntity<List<HorarioResponse>> getHorariosPorProgramacion(
            @PathVariable("idProgramacionDetalle") Integer idProgramacionDetalle,
            @PathVariable("idEmpresa") Integer idEmpresa) throws Exception {
        var horarios = iHorarioService.obtenerHorariosDisponibles(idProgramacionDetalle, idEmpresa);
        if (horarios.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(horarios, HttpStatus.OK);
    }
}
