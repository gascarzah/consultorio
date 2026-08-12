package com.gafahtec.consultorio.controller;

import com.gafahtec.consultorio.dto.request.CitaRequest;
import com.gafahtec.consultorio.dto.response.CitaResponse;
import com.gafahtec.consultorio.dto.response.CitadosResponse;
import com.gafahtec.consultorio.dto.response.DoctorDisponibleResponse;
import com.gafahtec.consultorio.exception.ResourceNotFoundException;
import com.gafahtec.consultorio.model.consultorio.Cita;
import com.gafahtec.consultorio.service.ICitaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/citas")
@AllArgsConstructor
@Log4j2
@PreAuthorize("@authz.canAccessApp()")
@Tag(name = "Cita", description = "Operaciones sobre citas médicas")
public class CitaController {

    private ICitaService iCitaService;

    @Operation(summary = "Listar todas las citas", description = "Devuelve todas las citas registradas.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping
    public ResponseEntity<List<CitaResponse>> listar() throws ResourceNotFoundException {
        var lista = iCitaService.listar();
        if (lista.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(lista, HttpStatus.OK);
    }

    @Operation(summary = "Citas del día por empresa", description = "Lista las citas de hoy para la empresa (no por un empleado concreto). ADMIN/médicos: empresa del usuario autenticado; SUPER: idEmpresa solicitada.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/listaCitados")
    public ResponseEntity<List<CitaResponse>> listaCitados(
            @RequestParam(value = "idEmpresa", required = false) Integer idEmpresa) throws ResourceNotFoundException {
        var lista = iCitaService.listaCitados(idEmpresa);
        return ResponseEntity.ok(lista);
    }

    @Operation(summary = "Listar citas por médico", description = "Devuelve las citas de un médico según el id de programación detalle.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/medico")
    public ResponseEntity<List<CitaResponse>> listarCitas(
            @RequestParam("idProgramacionDetalle") Integer idProgramacionDetalle) throws ResourceNotFoundException {
        var lista = iCitaService.listarCitas(idProgramacionDetalle);
        if (lista.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(lista, HttpStatus.OK);
    }

    @Operation(summary = "Obtener cita por ID", description = "Este endpoint devuelve una cita médica por su ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "404", description = "Cita no encontrada"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/{id}")
    public ResponseEntity<CitaResponse> listarPorId(@PathVariable("id") Integer id) throws ResourceNotFoundException {
        var obj = iCitaService.listarPorId(id);

        if (obj.getIdCita() == null) {
            throw new ResourceNotFoundException("Id no encontrado " + id);
        }

        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @Operation(summary = "Registrar nueva cita", description = "Este endpoint registra una nueva cita médica.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Cita creada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping
    public ResponseEntity<CitaResponse> registrar(@Valid @RequestBody CitaRequest citaRequest)
            throws ResourceNotFoundException {
        var obj = iCitaService.registrar(citaRequest);

        return new ResponseEntity<>(obj, HttpStatus.CREATED);
    }

    @Operation(summary = "Modificar cita existente", description = "Este endpoint permite modificar los detalles de una cita médica.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cita actualizada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PutMapping
    public ResponseEntity<CitaResponse> modificar(@Valid @RequestBody CitaRequest citaRequest)
            throws ResourceNotFoundException {

        var obj = iCitaService.modificar(citaRequest);
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @Operation(summary = "Eliminar cita", description = "Este endpoint elimina una cita médica por su ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Cita eliminada exitosamente"),
            @ApiResponse(responseCode = "404", description = "Cita no encontrada"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable("id") Integer id) throws Exception {
        var obj = iCitaService.listarPorId(id);

        if (obj == null) {
            throw new ResourceNotFoundException("ID NO ENCONTRADO " + id);
        }
        iCitaService.eliminar(id);
        return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Listar historial de citas de un cliente de manera paginada", description = "Este endpoint devuelve el historial de citas de un cliente paginado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/historial/pageable")
    public ResponseEntity<Page<CitaResponse>> listarPageableHistorico(
            @RequestParam("numeroDocumento") String numeroDocumento,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) throws ResourceNotFoundException {
        Pageable paging = PageRequest.of(page, size);
        Page<CitaResponse> paginas = iCitaService.listaHistorialCitaCliente(numeroDocumento, paging);

        if (paginas.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(paginas, HttpStatus.OK);
    }

    @Operation(summary = "Listar citas paginadas", description = "Devuelve las citas paginadas. Opcionalmente puede incluir un parámetro de búsqueda para filtrar por datos del paciente (documento, nombres, apellidos, teléfono, email). Incluye citas sin historia clínica asignada (huecos).")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa (página vacía si no hay resultados)"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/pageable")
    public ResponseEntity<Page<CitaResponse>> listarPageable(Pageable pageable,
            @RequestParam(required = false) String search) throws ResourceNotFoundException {
        Page<CitaResponse> paginas;

        if (search != null && !search.trim().isEmpty()) {
            paginas = iCitaService.buscarCitas(search.trim(), pageable);
        } else {
            paginas = iCitaService.listarPageable(pageable);
        }

        return ResponseEntity.ok(paginas);
    }

    @Operation(summary = "Listar citas por fecha paginadas", description = "Devuelve las citas de una fecha específica paginadas.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/pageable/{fecha}")
    public ResponseEntity<List<Cita>> listarPageablePorFecha(Pageable pageable,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size,
            @PathVariable String fecha) {
        var obj = iCitaService.listarPorFecha(fecha);
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @Operation(summary = "Listar citas de hoy", description = "Devuelve las citas del día actual.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/hoy/{fecha}")
    public ResponseEntity<List<DoctorDisponibleResponse>> citasHoy(@PathVariable String fecha) {
        List<DoctorDisponibleResponse> obj = iCitaService.listarCitados(fecha);
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }
}
