package com.gafahtec.consultorio.controller;

import com.gafahtec.consultorio.dto.request.EmpleadoRequest;
import com.gafahtec.consultorio.dto.response.EmpleadoResponse;
import com.gafahtec.consultorio.exception.ResourceNotFoundException;
import com.gafahtec.consultorio.service.IEmpleadoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/empleados")
@PreAuthorize("@authz.isSuperOrAdmin()")
@AllArgsConstructor
@Log4j2
@Tag(name = "Empleado", description = "Operaciones sobre empleados")
public class EmpleadoController {

    private IEmpleadoService iEmpleadoService;

    @Operation(summary = "Listar empleados por rol", description = "Obtiene empleados filtrados por rol.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping(value = "/medicos/{idRol}")
    public ResponseEntity<List<EmpleadoResponse>> listar(@PathVariable("idRol") Integer idRol) throws Exception {
        var lista = iEmpleadoService.listarPorRol(idRol);
        if (lista.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(lista, HttpStatus.OK);
    }

    @Operation(summary = "Listar empleados por empresa", description = "Obtiene empleados filtrados por empresa.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping(value = "/empresa/{idEmpresa}")
    public ResponseEntity<List<EmpleadoResponse>> listarEmpleadosPorEmpresa(
            @PathVariable("idEmpresa") Integer idEmpresa) throws Exception {
        var lista = iEmpleadoService.listarEmpleadosPorEmpresa(idEmpresa);
        if (lista.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(lista, HttpStatus.OK);
    }

    @Operation(summary = "Listar odontólogos por empresa", description = "Obtiene solo empleados odontólogos de la empresa, considerando tipo de empleado y/o rol.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping(value = "/empresa/{idEmpresa}/odontologos")
    public ResponseEntity<List<EmpleadoResponse>> listarOdontologosPorEmpresa(
            @PathVariable("idEmpresa") Integer idEmpresa) throws Exception {
        var lista = iEmpleadoService.listarOdontologosPorEmpresa(idEmpresa);
        if (lista.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(lista, HttpStatus.OK);
    }

    @Operation(summary = "Obtener empleado por ID", description = "Obtiene un empleado por su identificador único.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "404", description = "Empleado no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/{id}")
    public ResponseEntity<EmpleadoResponse> listarPorId(@PathVariable("id") Integer id) throws Exception {
        var obj = iEmpleadoService.listarPorId(id);

        if (obj.getIdEmpleado() == null) {
            throw new ResourceNotFoundException("Id no encontrado " + id);
        }

        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @Operation(summary = "Registrar empleado", description = "Registra un nuevo empleado.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Empleado creado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping
    public ResponseEntity<EmpleadoResponse> registrar(@Valid @RequestBody EmpleadoRequest empleadoRequest)
            throws Exception {
        var obj = iEmpleadoService.registrar(empleadoRequest);
        log.info("Empleado creado {}", obj);
        return new ResponseEntity<>(obj, HttpStatus.CREATED);
    }

    @Operation(summary = "Modificar empleado", description = "Modifica un empleado existente.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Empleado modificado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PutMapping
    public ResponseEntity<EmpleadoResponse> modificar(@Valid @RequestBody EmpleadoRequest empleadoRequest)
            throws Exception {

        var obj = iEmpleadoService.modificar(empleadoRequest);
        log.info("Empleado modificado {}", obj);
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @Operation(summary = "Eliminar empleado", description = "Elimina un empleado por su ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Empleado eliminado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Empleado no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable("id") Integer id) throws Exception {
        iEmpleadoService.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Listar empleados paginados", description = "Obtiene empleados paginados. Opcionalmente puede incluir un parámetro de búsqueda para filtrar por nombres, apellidos, documento o email del empleado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/pageable")
    public ResponseEntity<Page<EmpleadoResponse>> listarPageable(Pageable pageable,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String search) throws Exception {

        Page<EmpleadoResponse> paginas;

        if (search != null && !search.trim().isEmpty()) {
            paginas = iEmpleadoService.buscarEmpleados(search.trim(), pageable);
        } else {
            paginas = iEmpleadoService.listarPageable(pageable);
        }

        if (paginas.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(paginas, HttpStatus.OK);
    }
}
