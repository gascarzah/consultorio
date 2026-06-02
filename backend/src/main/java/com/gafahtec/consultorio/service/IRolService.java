package com.gafahtec.consultorio.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.gafahtec.consultorio.dto.request.RolRequest;
import com.gafahtec.consultorio.dto.response.RolResponse;

public interface IRolService extends ICRUD<RolRequest, RolResponse, Integer> {

    Page<RolResponse> listarPageable(Pageable pageable);

    Page<RolResponse> buscarRoles(String search, Pageable pageable);

}
