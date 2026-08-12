package com.gafahtec.consultorio.controller;

import java.util.List;
import java.util.Set;

import com.gafahtec.consultorio.dto.response.MenusPorRolResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

import com.gafahtec.consultorio.dto.request.RolMenuRequest;
import com.gafahtec.consultorio.dto.response.RolMenuResponse;
import com.gafahtec.consultorio.exception.ResourceNotFoundException;
import com.gafahtec.consultorio.service.IRolMenuService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/rolMenus")
@AllArgsConstructor
@Tag(name = "RolMenu", description = "Operaciones sobre la relación entre roles y menús")
public class RolMenuController {

	private IRolMenuService iRolMenuService;

	@Operation(summary = "Obtener menús por rol", description = "Obtiene los menús asociados a un rol por su identificador único.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Consulta exitosa"),
			@ApiResponse(responseCode = "404", description = "Rol no encontrado"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor")
	})
	@GetMapping("/{id}")
	@PreAuthorize("@authz.canReadRole(#id)")
	public ResponseEntity<List<MenusPorRolResponse>> listarPorId(@PathVariable("id") Integer id) throws Exception {
		var obj = iRolMenuService.listarPorId(id);

		if (obj == null) {
			throw new ResourceNotFoundException("idRol no encontrado " + id);
		}

		return new ResponseEntity<>(obj, HttpStatus.OK);
	}

	@Operation(summary = "Registrar menú por rol", description = "Registra un nuevo menú asociado a un rol.")
	@ApiResponses({
			@ApiResponse(responseCode = "201", description = "Menú por rol creado exitosamente"),
			@ApiResponse(responseCode = "400", description = "Datos inválidos"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor")
	})
	@PostMapping
	@PreAuthorize("@authz.isSuperOrAdmin()")
	public ResponseEntity<RolMenuResponse> registrar(@Valid @RequestBody RolMenuRequest rolMenuRequest)
			throws Exception {
		var obj = iRolMenuService.registrar(rolMenuRequest);
		return new ResponseEntity<>(obj, HttpStatus.CREATED);
	}

	@Operation(summary = "Listar menús por rol paginados", description = "Obtiene menús por rol paginados.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Consulta exitosa"),
			@ApiResponse(responseCode = "204", description = "Sin contenido"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor")
	})
	@GetMapping("/pageable/{idRol}")
	@PreAuthorize("@authz.isSuperOrAdmin()")
	public ResponseEntity<Page<RolMenuResponse>> listarPageable(Pageable pageable,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "5") int size, @PathVariable("idRol") Integer idRol) throws Exception {

		var paging = PageRequest.of(page, size);
		var paginas = iRolMenuService.listarPageable(idRol, paging);

		if (paginas.isEmpty()) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<>(paginas, HttpStatus.OK);
	}

	@Operation(summary = "Listar menús por ID de rol", description = "Obtiene los menús asociados a un ID de rol. El usuario puede leer los menús de su propio rol.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Consulta exitosa"),
			@ApiResponse(responseCode = "404", description = "Rol no encontrado"),
			@ApiResponse(responseCode = "500", description = "Error interno del servidor")
	})
	@GetMapping("/menus/{id}")
	@PreAuthorize("@authz.canReadRole(#id)")
	public ResponseEntity<List<RolMenuResponse>> listarRolIdMenus(@PathVariable("id") Integer id) throws Exception {
		var obj = iRolMenuService.listarRolPorMenus(id);

		if (obj == null) {
			throw new ResourceNotFoundException("idRol no encontrado " + id);
		}

		return new ResponseEntity<>(obj, HttpStatus.OK);
	}
}
