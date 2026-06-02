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

import com.gafahtec.consultorio.dto.request.RolRequest;
import com.gafahtec.consultorio.dto.response.RolResponse;
import com.gafahtec.consultorio.exception.ResourceNotFoundException;
import com.gafahtec.consultorio.model.auth.Rol;
import com.gafahtec.consultorio.service.IRolService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/roles")
@AllArgsConstructor
@PreAuthorize("@authz.isSuperOrAdmin()")
@Tag(name = "Rol", description = "Operaciones sobre roles")
public class RolController {

	private IRolService iRolService;

	@Operation(summary = "Listar roles", description = "Obtiene todos los roles registrados.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Consulta exitosa"),
			@ApiResponse(responseCode = "204", description = "Sin contenido"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor")
	})
	@GetMapping
	public ResponseEntity<List<RolResponse>> listar() throws Exception {
		var lista = iRolService.listar();
		if (lista.isEmpty()) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<>(lista, HttpStatus.OK);
	}

	@Operation(summary = "Obtener rol por ID", description = "Obtiene un rol por su identificador único.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Consulta exitosa"),
			@ApiResponse(responseCode = "404", description = "Rol no encontrado"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor")
	})
	@GetMapping("/{id}")
	public ResponseEntity<RolResponse> listarPorId(@PathVariable("id") Integer id) throws Exception {
		var obj = iRolService.listarPorId(id);

		if (obj.getIdRol() == null) {
			throw new ResourceNotFoundException("Id no encontrado " + id);
		}

		return new ResponseEntity<>(obj, HttpStatus.OK);
	}

	@Operation(summary = "Registrar rol", description = "Registra un nuevo rol.")
	@ApiResponses({
			@ApiResponse(responseCode = "201", description = "Rol creado exitosamente"),
			@ApiResponse(responseCode = "400", description = "Datos inválidos"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor")
	})
	@PostMapping
	public ResponseEntity<RolResponse> registrar(@Valid @RequestBody RolRequest p) throws Exception {
		var obj = iRolService.registrar(p);
		return new ResponseEntity<>(obj, HttpStatus.CREATED);
	}

	@Operation(summary = "Modificar rol", description = "Modifica un rol existente.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Rol modificado exitosamente"),
			@ApiResponse(responseCode = "400", description = "Datos inválidos"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor")
	})
	@PutMapping
	public ResponseEntity<RolResponse> modificar(@Valid @RequestBody RolRequest p) throws Exception {
		var obj = iRolService.modificar(p);
		return new ResponseEntity<>(obj, HttpStatus.OK);
	}

	@Operation(summary = "Eliminar rol", description = "Elimina un rol por su identificador único.")
	@ApiResponses({
			@ApiResponse(responseCode = "204", description = "Rol eliminado exitosamente"),
			@ApiResponse(responseCode = "404", description = "Rol no encontrado"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor")
	})
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable("id") Integer id) throws Exception {
		var obj = iRolService.listarPorId(id);

		if (obj.getIdRol() == null) {
			throw new ResourceNotFoundException("ID NO ENCONTRADO " + id);
		}

		iRolService.eliminar(id);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
	}

	@Operation(summary = "Listar roles paginados", description = "Obtiene roles paginados. Opcionalmente puede incluir un parámetro de búsqueda para filtrar por nombre del rol.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Consulta exitosa"),
			@ApiResponse(responseCode = "204", description = "Sin contenido"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor")
	})
	@GetMapping("/pageable")
	public ResponseEntity<Page<RolResponse>> listarPageable(@PageableDefault(sort = "nombre") Pageable pageable,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "5") int size,
			@RequestParam(required = false) String search) throws Exception {

		Page<RolResponse> paginas;

		if (search != null && !search.trim().isEmpty()) {
			paginas = iRolService.buscarRoles(search.trim(), pageable);
		} else {
			paginas = iRolService.listarPageable(pageable);
		}

		if (paginas.isEmpty()) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<>(paginas, HttpStatus.OK);
	}
}
