package com.gafahtec.consultorio.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

import com.gafahtec.consultorio.dto.request.ProgramacionDetalleRequest;
import com.gafahtec.consultorio.dto.response.ProgramacionDetalleHelperResponse;
import com.gafahtec.consultorio.dto.response.ProgramacionDetalleResponse;
import com.gafahtec.consultorio.exception.ResourceNotFoundException;
import com.gafahtec.consultorio.service.IProgramacionDetalleService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/programacionesDetalladas")
@AllArgsConstructor
@Log4j2
@PreAuthorize("@authz.isSuperOrAdmin()")
@Tag(name = "ProgramacionDetalle", description = "Operaciones sobre los detalles de programación")
public class ProgramacionDetalleController {

    private IProgramacionDetalleService iProgramacionDetalleService;

    @Operation(summary = "Registrar detalle de programación", description = "Registra un nuevo detalle de programación.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Detalle creado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o empleado ya tiene programación"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping
    public ResponseEntity<List<ProgramacionDetalleResponse>> registrar(
            @Valid @RequestBody ProgramacionDetalleRequest programacionDetalleRequest) throws Exception {

        if (!iProgramacionDetalleService.existeProgramacionEmpleado(programacionDetalleRequest)) {
            throw new ResourceNotFoundException(
                    "El empleado " + programacionDetalleRequest.getIdEmpleado() + " ya tiene programacion");
        }

        var obj = iProgramacionDetalleService.registrar(programacionDetalleRequest);
        return new ResponseEntity<>(obj, HttpStatus.CREATED);
    }

    @Operation(summary = "Modificar detalle de programación", description = "Modifica un detalle de programación existente.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Detalle modificado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PutMapping
    public ResponseEntity<ProgramacionDetalleResponse> modificar(
            @Valid @RequestBody ProgramacionDetalleRequest programacionDetalleRequest) throws Exception {
        var obj = iProgramacionDetalleService.modificar(programacionDetalleRequest);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @Operation(summary = "Listar detalles de programación paginados", description = "Obtiene detalles de programación paginados. Opcionalmente puede incluir un parámetro de búsqueda para filtrar por datos del empleado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/pageable")
    public ResponseEntity<Page<ProgramacionDetalleResponse>> listarPageable(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String search) throws Exception {

        Pageable paging = PageRequest.of(page, size, Sort.by("numeroDiaSemana").descending());
        Page<ProgramacionDetalleResponse> paginas;

        if (search != null && !search.trim().isEmpty()) {
            paginas = iProgramacionDetalleService.buscarProgramacionesDetalle(search.trim(), paging);
        } else {
            paginas = iProgramacionDetalleService.listarPageable(paging);
        }

        if (paginas.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(paginas, HttpStatus.OK);
    }

    @Operation(summary = "Obtener detalle de programación por ID", description = "Obtiene un detalle de programación por su identificador único.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "404", description = "Detalle no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/programaDetalle/{id}")
    public ResponseEntity<ProgramacionDetalleHelperResponse> listarPorId(@PathVariable("id") Integer idProgramacion)
            throws Exception {

        var obj = iProgramacionDetalleService.listarPorIdProgramacion(idProgramacion);

        if (obj == null || obj.getEmpleado() == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @Operation(summary = "Listar días programados", description = "Obtiene los días programados para un empleado y empresa.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/listarDiasProgramados")
    public ResponseEntity<List<ProgramacionDetalleResponse>> listarDiasProgramados(
            @RequestParam("numeroDocumento") String numeroDocumento,
            @RequestParam("idEmpresa") Integer idEmpresa)
            throws Exception {

        var lista = iProgramacionDetalleService.listarDiasProgramados(numeroDocumento, idEmpresa);

        if (lista.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(lista, HttpStatus.OK);
    }

    @Operation(summary = "Eliminar detalle de programación", description = "Elimina un detalle de programación por su ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Detalle eliminado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Detalle no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable("id") Integer id) throws Exception {
        iProgramacionDetalleService.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
