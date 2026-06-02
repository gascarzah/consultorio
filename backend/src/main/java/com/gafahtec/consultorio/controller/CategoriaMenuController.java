package com.gafahtec.consultorio.controller;

import com.gafahtec.consultorio.dto.request.CategoriaMenuRequest;
import com.gafahtec.consultorio.dto.response.CategoriaMenuResponse;
import com.gafahtec.consultorio.exception.ResourceNotFoundException;
import com.gafahtec.consultorio.service.ICategoriaMenuService;
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
@RequestMapping("/categoria-menus")
@AllArgsConstructor
@PreAuthorize("@authz.isSuperOrAdmin()")
@Tag(name = "Categoria Menu", description = "Operaciones sobre categorías de menús")
public class CategoriaMenuController {

    private ICategoriaMenuService iCategoriaMenuService;

    @GetMapping
    @Operation(summary = "Listar categorías", description = "Devuelve todas las categorías activas.")
    public ResponseEntity<List<CategoriaMenuResponse>> listar() {
        var lista = iCategoriaMenuService.listar();
        if (lista.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(lista, HttpStatus.OK);
    }

    @GetMapping("/pageable")
    @Operation(summary = "Listar categorías paginadas", description = "Obtiene categorías paginadas y permite búsqueda por nombre.")
    public ResponseEntity<Page<CategoriaMenuResponse>> listarPageable(
            @PageableDefault(sort = "orden") Pageable pageable,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String search) {

        Page<CategoriaMenuResponse> paginas = (search != null && !search.trim().isEmpty())
                ? iCategoriaMenuService.buscarCategorias(search.trim(), pageable)
                : iCategoriaMenuService.listarPageable(pageable);

        if (paginas.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(paginas, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener categoría por ID", description = "Devuelve una categoría por su ID.")
    @ApiResponses({ @ApiResponse(responseCode = "404", description = "Categoría no encontrada") })
    public ResponseEntity<CategoriaMenuResponse> listarPorId(@PathVariable("id") Integer id) throws Exception {
        var obj = iCategoriaMenuService.listarPorId(id);
        if (obj.getIdCategoria() == null) {
            throw new ResourceNotFoundException("Id no encontrado " + id);
        }
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "Registrar categoría", description = "Registra una nueva categoría de menú.")
    public ResponseEntity<CategoriaMenuResponse> registrar(@Valid @RequestBody CategoriaMenuRequest request) {
        return new ResponseEntity<>(iCategoriaMenuService.registrar(request), HttpStatus.CREATED);
    }

    @PutMapping
    @Operation(summary = "Modificar categoría", description = "Modifica una categoría existente.")
    public ResponseEntity<CategoriaMenuResponse> modificar(@Valid @RequestBody CategoriaMenuRequest request) {
        return new ResponseEntity<>(iCategoriaMenuService.modificar(request), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar categoría", description = "Elimina lógicamente una categoría por ID.")
    public ResponseEntity<Void> eliminar(@PathVariable("id") Integer id) throws Exception {
        var obj = iCategoriaMenuService.listarPorId(id);
        if (obj == null) {
            throw new ResourceNotFoundException("ID NO ENCONTRADO " + id);
        }
        iCategoriaMenuService.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
