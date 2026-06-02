package com.gafahtec.consultorio.controller;

import java.util.List;
import java.util.Set;

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

import com.gafahtec.consultorio.dto.request.EmpresaRequest;
import com.gafahtec.consultorio.dto.response.EmpresaResponse;
import com.gafahtec.consultorio.exception.ResourceNotFoundException;
import com.gafahtec.consultorio.service.IEmpresaService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/empresas")
@AllArgsConstructor
@PreAuthorize("@authz.isSuperOrAdmin()")
@Tag(name = "Empresa", description = "Operaciones sobre empresas")
public class EmpresaController {

	private IEmpresaService iEmpresaService;

	@Operation(summary = "Listar empresas", description = "Obtiene todas las empresas registradas.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Consulta exitosa"),
			@ApiResponse(responseCode = "204", description = "Sin contenido"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor")
	})
	@GetMapping
	public ResponseEntity<List<EmpresaResponse>> listar() throws Exception {
		var lista = iEmpresaService.listar();
		if (lista.isEmpty()) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<>(lista, HttpStatus.OK);
	}

	@Operation(summary = "Obtener empresa por ID", description = "Obtiene una empresa por su identificador único.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Consulta exitosa"),
			@ApiResponse(responseCode = "404", description = "Empresa no encontrada"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor")
	})
	@GetMapping("/{id}")
	public ResponseEntity<EmpresaResponse> listarPorId(@PathVariable("id") Integer id) throws Exception {
		var obj = iEmpresaService.listarPorId(id);

		if (obj.getIdEmpresa() == null) {
			throw new ResourceNotFoundException("Id no encontrado " + id);
		}

		return new ResponseEntity<>(obj, HttpStatus.OK);
	}

	@Operation(summary = "Registrar empresa", description = "Registra una nueva empresa.")
	@ApiResponses({
			@ApiResponse(responseCode = "201", description = "Empresa creada exitosamente"),
			@ApiResponse(responseCode = "400", description = "Datos inválidos"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor")
	})
	@PostMapping
	public ResponseEntity<EmpresaResponse> registrar(@Valid @RequestBody EmpresaRequest empresaRequest)
			throws Exception {
		var obj = iEmpresaService.registrar(empresaRequest);
		return new ResponseEntity<>(obj, HttpStatus.CREATED);
	}

	@Operation(summary = "Modificar empresa", description = "Modifica una empresa existente.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Empresa modificada exitosamente"),
			@ApiResponse(responseCode = "400", description = "Datos inválidos"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor")
	})
	@PutMapping
	public ResponseEntity<EmpresaResponse> modificar(@Valid @RequestBody EmpresaRequest empresaRequest)
			throws Exception {
		var obj = iEmpresaService.modificar(empresaRequest);
		return new ResponseEntity<>(obj, HttpStatus.OK);
	}

	@Operation(summary = "Eliminar empresa", description = "Elimina una empresa por su identificador único.")
	@ApiResponses({
			@ApiResponse(responseCode = "204", description = "Empresa eliminada exitosamente"),
			@ApiResponse(responseCode = "404", description = "Empresa no encontrada"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor")
	})
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable("id") Integer id) throws Exception {
		var obj = iEmpresaService.listarPorId(id);

		if (obj.getIdEmpresa() == null) {
			throw new ResourceNotFoundException("ID NO ENCONTRADO " + id);
		}

		iEmpresaService.eliminar(id);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
	}

	@Operation(summary = "Listar empresas paginadas", description = "Obtiene empresas paginadas. Opcionalmente puede incluir un parámetro de búsqueda para filtrar por nombre de la empresa.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Consulta exitosa"),
			@ApiResponse(responseCode = "204", description = "Sin contenido"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor")
	})
	@GetMapping("/pageable")
	public ResponseEntity<Page<EmpresaResponse>> listarPageable(@PageableDefault(sort = "nombre") Pageable pageable,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "5") int size,
			@RequestParam(required = false) String search) throws Exception {

		Page<EmpresaResponse> paginas;

		if (search != null && !search.trim().isEmpty()) {
			paginas = iEmpresaService.buscarEmpresas(search.trim(), pageable);
		} else {
			paginas = iEmpresaService.listarPageable(pageable);
		}

		if (paginas.isEmpty()) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<>(paginas, HttpStatus.OK);
	}
}
