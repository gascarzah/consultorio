package com.gafahtec.consultorio.controller;

import java.util.List;
import java.util.Set;

import com.gafahtec.consultorio.model.consultorio.HistoriaClinica;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.gafahtec.consultorio.dto.request.HistoriaClinicaRequest;
import com.gafahtec.consultorio.dto.response.HistoriaClinicaResponse;
import com.gafahtec.consultorio.exception.ResourceNotFoundException;
import com.gafahtec.consultorio.service.IHistoriaClinicaService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/historiasClinicas")
@AllArgsConstructor
@PreAuthorize("@authz.canAccessApp()")
@Tag(name = "HistoriaClinica", description = "Operaciones sobre historias clínicas")
public class HistoriaClinicaController {

	private IHistoriaClinicaService iHistoriaClinicaService;

	@Operation(summary = "Listar historias clínicas", description = "Obtiene todas las historias clínicas registradas.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Consulta exitosa"),
			@ApiResponse(responseCode = "204", description = "Sin contenido"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor")
	})
	@GetMapping
	public ResponseEntity<List<HistoriaClinicaResponse>> listar() throws Exception {
		var lista = iHistoriaClinicaService.listar();
		if (lista.isEmpty()) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<>(lista, HttpStatus.OK);
	}

	@Operation(summary = "Obtener historia clínica por ID", description = "Obtiene una historia clínica por su identificador único.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Consulta exitosa"),
			@ApiResponse(responseCode = "404", description = "Historia clínica no encontrada"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor")
	})
	@GetMapping("/{id}")
	public ResponseEntity<HistoriaClinicaResponse> listarPorId(@PathVariable("id") Integer id) throws Exception {
		var obj = iHistoriaClinicaService.listarPorId(id);

		if (obj.getIdHistoriaClinica() == null) {
			throw new ResourceNotFoundException("Id no encontrado " + id);
		}

		return new ResponseEntity<>(obj, HttpStatus.OK);
	}

	@Operation(summary = "Registrar historia clínica", description = "Registra una nueva historia clínica.")
	@ApiResponses({
			@ApiResponse(responseCode = "201", description = "Historia clínica creada exitosamente"),
			@ApiResponse(responseCode = "400", description = "Datos inválidos"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor")
	})
	@PostMapping
	public ResponseEntity<HistoriaClinicaResponse> registrar(
			@Valid @RequestBody HistoriaClinicaRequest historiaClinicaRequest) throws Exception {

		var obj = iHistoriaClinicaService.registrar(historiaClinicaRequest);
		return new ResponseEntity<>(obj, HttpStatus.CREATED);
	}

	@Operation(summary = "Modificar historia clínica", description = "Modifica una historia clínica existente.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Historia clínica modificada exitosamente"),
			@ApiResponse(responseCode = "400", description = "Datos inválidos"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor")
	})
	@PutMapping
	public ResponseEntity<HistoriaClinicaResponse> modificar(
			@Valid @RequestBody HistoriaClinicaRequest historiaClinicaRequest) throws Exception {

		var obj = iHistoriaClinicaService.modificar(historiaClinicaRequest);
		return new ResponseEntity<>(obj, HttpStatus.OK);
	}

	@Operation(summary = "Eliminar historia clínica", description = "Elimina una historia clínica por su identificador único.")
	@ApiResponses({
			@ApiResponse(responseCode = "204", description = "Historia clínica eliminada exitosamente"),
			@ApiResponse(responseCode = "404", description = "Historia clínica no encontrada"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor")
	})
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable("id") Integer id) throws Exception {
		var obj = iHistoriaClinicaService.listarPorId(id);

		if (obj.getIdHistoriaClinica() == null) {
			throw new ResourceNotFoundException("ID NO ENCONTRADO " + id);
		}

		iHistoriaClinicaService.eliminar(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	@Operation(summary = "Listar historias clínicas paginadas", description = "Obtiene historias clínicas paginadas. Opcionalmente puede incluir un parámetro de búsqueda para filtrar por nombres, apellidos, documento, teléfono o email del paciente.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Consulta exitosa"),
			@ApiResponse(responseCode = "204", description = "Sin contenido"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor")
	})
	@GetMapping("/pageable")
	public ResponseEntity<Page<HistoriaClinicaResponse>> listarPageable(
			@PageableDefault(sort = "apellidoPaterno") Pageable pageable,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "5") int size,
			@RequestParam(required = false) String search) throws Exception {

		Page<HistoriaClinicaResponse> paginas;

		if (search != null && !search.trim().isEmpty()) {
			paginas = iHistoriaClinicaService.buscarHistoriasClinicas(search.trim(), pageable);
		} else {
			paginas = iHistoriaClinicaService.listarPageable(pageable);
		}
		// Siempre 200 con Page (aunque content esté vacío) para que el frontend
		// pueda leer totalElements sin tratar 204 como lista rota.
		return new ResponseEntity<>(paginas, HttpStatus.OK);
	}
}
