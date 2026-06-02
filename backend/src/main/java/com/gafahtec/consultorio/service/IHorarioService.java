package com.gafahtec.consultorio.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.gafahtec.consultorio.dto.request.HorarioRequest;
import com.gafahtec.consultorio.dto.response.HorarioResponse;

import java.util.List;


public interface IHorarioService extends ICRUD<HorarioRequest,HorarioResponse,Integer>{
    Page<HorarioResponse> listarPageable(Pageable pageable);
    Page<HorarioResponse> buscarHorarios(String search, Pageable pageable);



    List<HorarioResponse> obtenerHorariosDisponibles(Integer idProgramacionDetalle, Integer idEmpresa);
}
