package com.gafahtec.consultorio.service.impl;

import com.gafahtec.consultorio.dto.request.CategoriaMenuRequest;
import com.gafahtec.consultorio.dto.response.CategoriaMenuResponse;
import com.gafahtec.consultorio.model.auth.CategoriaMenu;
import com.gafahtec.consultorio.repository.ICategoriaMenuRepository;
import com.gafahtec.consultorio.service.ICategoriaMenuService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class CategoriaMenuServiceImpl implements ICategoriaMenuService {

    private ICategoriaMenuRepository iCategoriaMenuRepository;

    @Override
    public CategoriaMenuResponse registrar(CategoriaMenuRequest request) {
        var obj = iCategoriaMenuRepository.save(CategoriaMenu.builder()
                .nombre(request.getNombre())
                .orden(request.getOrden())
                .activo(request.getActivo() != null ? request.getActivo() : true)
                .build());
        return entityToResponse(obj);
    }

    @Override
    public CategoriaMenuResponse modificar(CategoriaMenuRequest request) {
        var obj = iCategoriaMenuRepository.save(CategoriaMenu.builder()
                .idCategoria(request.getIdCategoria())
                .nombre(request.getNombre())
                .orden(request.getOrden())
                .activo(request.getActivo() != null ? request.getActivo() : true)
                .build());
        return entityToResponse(obj);
    }

    @Override
    public List<CategoriaMenuResponse> listar() {
        return iCategoriaMenuRepository.findByActivoTrueOrderByOrdenAscNombreAsc()
                .stream()
                .map(this::entityToResponse)
                .toList();
    }

    @Override
    public CategoriaMenuResponse listarPorId(Integer id) {
        return iCategoriaMenuRepository.findById(id)
                .filter(CategoriaMenu::getActivo)
                .map(this::entityToResponse)
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con ID: " + id));
    }

    @Override
    public void eliminar(Integer id) {
        var categoria = iCategoriaMenuRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con ID: " + id));
        categoria.setActivo(Boolean.FALSE);
        iCategoriaMenuRepository.save(categoria);
    }

    @Override
    public Page<CategoriaMenuResponse> listarPageable(Pageable pageable) {
        return iCategoriaMenuRepository.findByActivoTrue(pageable).map(this::entityToResponse);
    }

    @Override
    public Page<CategoriaMenuResponse> buscarCategorias(String search, Pageable pageable) {
        return iCategoriaMenuRepository.buscarCategorias(search, pageable).map(this::entityToResponse);
    }

    private CategoriaMenuResponse entityToResponse(CategoriaMenu entity) {
        var response = new CategoriaMenuResponse();
        BeanUtils.copyProperties(entity, response);
        return response;
    }
}
