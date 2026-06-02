package com.gafahtec.consultorio.controller;

import com.gafahtec.consultorio.dto.request.TipoEmpleadoRequest;
import com.gafahtec.consultorio.dto.response.TipoEmpleadoResponse;
import com.gafahtec.consultorio.exception.ResourceNotFoundException;
import com.gafahtec.consultorio.service.ITipoEmpleadoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tipo-empleados")
@AllArgsConstructor
@PreAuthorize("@authz.isSuperOrAdmin()")
@Tag(name = "Tipo Empleado", description = "Operaciones sobre tipos de empleado")
public class TipoEmpleadoController {

    private ITipoEmpleadoService iTipoEmpleadoService;

    @Operation(summary = "Listar todos los tipos de empleado", description = "Devuelve todos los tipos de empleado registrados.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping
    public ResponseEntity<List<TipoEmpleadoResponse>> listar() throws ResourceNotFoundException {
        var lista = iTipoEmpleadoService.listar();
        if (lista.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(lista, HttpStatus.OK);
    }

    @Operation(summary = "Listar tipos de empleado paginados", description = "Obtiene tipos de empleado paginados. Opcionalmente puede incluir un parámetro de búsqueda para filtrar por nombre del tipo de empleado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/pageable")
    public ResponseEntity<Page<TipoEmpleadoResponse>> listarPageable(
            @PageableDefault(sort = "nombre") Pageable pageable,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String search) throws Exception {

        Page<TipoEmpleadoResponse> paginas;

        if (search != null && !search.trim().isEmpty()) {
            paginas = iTipoEmpleadoService.buscarTiposEmpleado(search.trim(), pageable);
        } else {
            paginas = iTipoEmpleadoService.listarPageable(pageable);
        }

        if (paginas.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(paginas, HttpStatus.OK);
    }

    @Operation(summary = "Obtener tipo de empleado por ID", description = "Este endpoint devuelve un tipo de empleado por su ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "404", description = "Tipo de empleado no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/{id}")
    public ResponseEntity<TipoEmpleadoResponse> listarPorId(@PathVariable("id") Integer id)
            throws ResourceNotFoundException {
        var obj = iTipoEmpleadoService.listarPorId(id);

        if (obj.getIdTipoEmpleado() == null) {
            throw new ResourceNotFoundException("Id no encontrado " + id);
        }

        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @Operation(summary = "Registrar nuevo tipo de empleado", description = "Este endpoint registra un nuevo tipo de empleado.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Tipo de empleado creado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping
    public ResponseEntity<TipoEmpleadoResponse> registrar(@Valid @RequestBody TipoEmpleadoRequest tipoEmpleadoRequest)
            throws ResourceNotFoundException {
        var obj = iTipoEmpleadoService.registrar(tipoEmpleadoRequest);

        return new ResponseEntity<>(obj, HttpStatus.CREATED);
    }

    @Operation(summary = "Modificar tipo de empleado existente", description = "Este endpoint permite modificar los detalles de un tipo de empleado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tipo de empleado actualizado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PutMapping
    public ResponseEntity<TipoEmpleadoResponse> modificar(@Valid @RequestBody TipoEmpleadoRequest tipoEmpleadoRequest)
            throws ResourceNotFoundException {

        var obj = iTipoEmpleadoService.modificar(tipoEmpleadoRequest);
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @Operation(summary = "Eliminar tipo de empleado", description = "Este endpoint elimina un tipo de empleado por su ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Tipo de empleado eliminado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Tipo de empleado no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable("id") Integer id) throws Exception {
        var obj = iTipoEmpleadoService.listarPorId(id);

        if (obj == null) {
            throw new ResourceNotFoundException("ID NO ENCONTRADO " + id);
        }
        iTipoEmpleadoService.eliminar(id);
        return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
    }
}
