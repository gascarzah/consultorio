package com.gafahtec.consultorio.controller;

import com.gafahtec.consultorio.dto.request.MaestraRequest;
import com.gafahtec.consultorio.exception.ResourceNotFoundException;
import com.gafahtec.consultorio.model.Maestra;
import com.gafahtec.consultorio.service.IMaestraService;
import com.gafahtec.consultorio.util.Constants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/maestras")
@AllArgsConstructor
@Log4j2
@Tag(name = "Maestra", description = "Operaciones sobre maestras")
public class MaestraController {

    private IMaestraService iMaestraService;

    @Operation(summary = "Registrar maestra", description = "Registra una nueva maestra.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Maestra creada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping
    public ResponseEntity<Maestra> registrar(@Valid @RequestBody MaestraRequest MaestraRequest) throws Exception {
        Maestra maestra = Maestra.builder().build();
        BeanUtils.copyProperties(MaestraRequest, maestra);
        maestra.setEstado(Constants.ACTIVO);
        Maestra obj = iMaestraService.registrar(maestra);

        log.info("objeto creado {}", obj);
        return new ResponseEntity<>(obj, HttpStatus.CREATED);
    }

    @Operation(summary = "Listar maestras paginadas", description = "Obtiene maestras paginadas.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/pageable")
    public ResponseEntity<Page<Maestra>> listarPageable(Pageable pageable,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam("idEmpresa") Integer idEmpresa,
            @RequestParam("idMaestra") Integer idMaestra) throws Exception {
        Pageable paging = PageRequest.of(page, size, Sort.by("idMaestra").descending());
        Page<Maestra> paginas = iMaestraService.listarMaestraPageable(idEmpresa, idMaestra, paging);
        if (paginas.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<Page<Maestra>>(paginas, HttpStatus.OK);
    }

    @Operation(summary = "Obtener maestra por ID", description = "Obtiene una maestra por su identificador único.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "404", description = "Maestra no encontrada"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Maestra> listarPorId(@PathVariable("id") Integer id) throws Exception {
        Maestra obj = iMaestraService.listarPorId(id);

        if (obj.getIdMaestra() == null) {
            throw new ResourceNotFoundException("Id no encontrado " + id);
        }

        return new ResponseEntity<Maestra>(obj, HttpStatus.OK);
    }

    @Operation(summary = "Listar maestras", description = "Obtiene todas las maestras registradas.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Consulta exitosa"),
            @ApiResponse(responseCode = "204", description = "Sin contenido"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping
    public ResponseEntity<List<Maestra>> getMaestras() throws Exception {
        List<Maestra> Maestras = iMaestraService.listar();
        if (Maestras.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<List<Maestra>>(Maestras, HttpStatus.OK);
    }

    @Operation(summary = "Eliminar maestra", description = "Elimina una maestra por su identificador único.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Maestra eliminada exitosamente"),
            @ApiResponse(responseCode = "404", description = "Maestra no encontrada"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable("id") Integer id) throws Exception {
        var obj = iMaestraService.listarPorId(id);

        if (obj == null) {
            throw new ResourceNotFoundException("ID NO ENCONTRADO " + id);
        }
        iMaestraService.eliminar(id);
        return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Modificar maestra", description = "Modifica una maestra existente.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Maestra modificada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PutMapping
    public ResponseEntity<Maestra> modificar(@Valid @RequestBody MaestraRequest MaestraRequest) throws Exception {
        Maestra maestra = Maestra.builder().build();
        BeanUtils.copyProperties(maestra, MaestraRequest);
        Maestra obj = iMaestraService.modificar(maestra);

        log.info("objeto creado {}", obj);
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }
}
