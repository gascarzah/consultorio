package com.gafahtec.consultorio.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.gafahtec.consultorio.dto.request.MenuRequest;
import com.gafahtec.consultorio.dto.response.MenuResponse;
import com.gafahtec.consultorio.model.auth.Menu;

public interface IMenuService extends ICRUD<MenuRequest, MenuResponse, Integer> {
    Page<MenuResponse> listarPageable(Pageable pageable);

    Page<MenuResponse> buscarMenus(String search, Pageable pageable);
}
