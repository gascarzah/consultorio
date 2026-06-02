package com.gafahtec.consultorio.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.gafahtec.consultorio.dto.request.TipoEmpleadoRequest;
import com.gafahtec.consultorio.dto.response.TipoEmpleadoResponse;

public interface ITipoEmpleadoService extends ICRUD<TipoEmpleadoRequest, TipoEmpleadoResponse, Integer> {

    Page<TipoEmpleadoResponse> listarPageable(Pageable pageable);

    Page<TipoEmpleadoResponse> buscarTiposEmpleado(String search, Pageable pageable);

}
