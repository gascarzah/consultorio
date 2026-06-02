package com.gafahtec.consultorio.controller;

import java.util.List;
import java.util.Set;

import org.springframework.beans.BeanUtils;
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

import com.gafahtec.consultorio.dto.request.MenuRequest;
import com.gafahtec.consultorio.dto.response.MenuResponse;
import com.gafahtec.consultorio.exception.ResourceNotFoundException;
import com.gafahtec.consultorio.model.auth.Menu;
import com.gafahtec.consultorio.service.IMenuService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/menus")
@AllArgsConstructor
@Log4j2
@PreAuthorize("@authz.isSuperOrAdmin()")
@Tag(name = "Menu", description = "Operaciones sobre menús")
public class MenuController {

    private IMenuService iMenuService;

    @Operation(summary = "Registrar menú", description = "Registra un nuevo menú.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Menú creado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping
    public ResponseEntity<MenuResponse> registrar(@Valid @RequestBody MenuRequest menuRequest) throws Exception {

        var obj = iMenuService.registrar(menuRequest);

        log.info("objeto creado {}", obj);
        return new ResponseEntity<>(obj, HttpStatus.CREATED);
    }

    @Operation(summary = "Listar menús paginados", description = "Obtiene menús paginados. Opcionalmente puede incluir un parámetro de búsqueda para filtrar por nombre del menú.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/pageable")
    public ResponseEntity<Page<MenuResponse>> listarPageable(@PageableDefault(sort = "idMenu") Pageable pageable,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String search) throws Exception {

        Page<MenuResponse> paginas;

        if (search != null && !search.trim().isEmpty()) {
            paginas = iMenuService.buscarMenus(search.trim(), pageable);
        } else {
            paginas = iMenuService.listarPageable(pageable);
        }

        if (paginas.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(paginas, HttpStatus.OK);
    }

    @Operation(summary = "Obtener menú por ID", description = "Obtiene un menú por su identificador único.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "404", description = "Menú no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/{id}")
    public ResponseEntity<MenuResponse> listarPorId(@PathVariable("id") Integer id) throws Exception {
        var obj = iMenuService.listarPorId(id);

        if (obj.getIdMenu() == null) {
            throw new ResourceNotFoundException("Id no encontrado " + id);
        }

        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @Operation(summary = "Listar menús", description = "Obtiene todos los menús registrados.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping
    public ResponseEntity<List<MenuResponse>> getMenus() throws Exception {
        var menus = iMenuService.listar();
        if (menus.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(menus, HttpStatus.OK);
    }

    @Operation(summary = "Eliminar menú", description = "Elimina un menú por su identificador único.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Menú eliminado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Menú no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable("id") Integer id) throws Exception {
        var obj = iMenuService.listarPorId(id);

        if (obj == null) {
            throw new ResourceNotFoundException("ID NO ENCONTRADO " + id);
        }
        iMenuService.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Modificar menú", description = "Modifica un menú existente.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Menú modificado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PutMapping
    public ResponseEntity<MenuResponse> modificar(@Valid @RequestBody MenuRequest menuRequest) throws Exception {

        var obj = iMenuService.modificar(menuRequest);

        log.info("objeto creado {}", obj);
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }
}
