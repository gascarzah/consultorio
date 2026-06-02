package com.gafahtec.consultorio.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.gafahtec.consultorio.dto.request.EmpresaRequest;
import com.gafahtec.consultorio.dto.response.EmpresaResponse;

public interface IEmpresaService extends ICRUD<EmpresaRequest, EmpresaResponse, Integer> {
    Page<EmpresaResponse> listarPageable(Pageable pageable);

    Page<EmpresaResponse> buscarEmpresas(String search, Pageable pageable);
}
