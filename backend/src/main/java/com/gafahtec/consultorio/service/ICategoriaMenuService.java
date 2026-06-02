package com.gafahtec.consultorio.service;

import com.gafahtec.consultorio.dto.request.CategoriaMenuRequest;
import com.gafahtec.consultorio.dto.response.CategoriaMenuResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ICategoriaMenuService extends ICRUD<CategoriaMenuRequest, CategoriaMenuResponse, Integer> {

    Page<CategoriaMenuResponse> listarPageable(Pageable pageable);

    Page<CategoriaMenuResponse> buscarCategorias(String search, Pageable pageable);
}
