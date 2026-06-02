package com.gafahtec.consultorio.service;

import com.gafahtec.consultorio.dto.request.EmpleadoRequest;
import com.gafahtec.consultorio.dto.response.EmpleadoResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IEmpleadoService extends ICRUD<EmpleadoRequest, EmpleadoResponse, Integer> {

	Page<EmpleadoResponse> listarPageable(Pageable pageable);

	Page<EmpleadoResponse> buscarEmpleados(String search, Pageable pageable);

	List<EmpleadoResponse> listarPorRol(Integer idRol);

	List<EmpleadoResponse> listarEmpleadosPorEmpresa(Integer idEmpresa);

	List<EmpleadoResponse> listarOdontologosPorEmpresa(Integer idEmpresa);
}
