package com.gafahtec.consultorio.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.gafahtec.consultorio.dto.request.ProgramacionRequest;
import com.gafahtec.consultorio.dto.response.ProgramacionResponse;
import com.gafahtec.consultorio.model.consultorio.Programacion;


public interface IProgramacionService extends ICRUD<ProgramacionRequest, ProgramacionResponse,Integer>{

    

    List<ProgramacionResponse> listarPorRango(String rango);

    

    Page<ProgramacionResponse> listarPageable(Pageable pageable);

    Page<ProgramacionResponse> listarProgramacionPageable(Integer idEmpresa,Pageable pageable);
    Page<ProgramacionResponse> buscarProgramaciones(Integer idEmpresa, String search, Pageable pageable);

    List<ProgramacionResponse> programacionActivo();

    List<ProgramacionResponse> programacionActivo(Integer idEmpresa);

    public List<Programacion> programacionEntityActivo();
    
    public Programacion modificarEntity(Programacion request);

	/** Crea la programación solo si el rango no existe; si existe, la devuelve sin error. */
	ProgramacionResponse registrarSiNoExiste(ProgramacionRequest request);

}
