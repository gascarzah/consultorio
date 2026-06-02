package com.gafahtec.consultorio.service;

import java.text.ParseException;
import java.util.List;
import java.util.List;

import com.gafahtec.consultorio.model.consultorio.Programacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.gafahtec.consultorio.dto.request.ProgramacionDetalleRequest;
import com.gafahtec.consultorio.dto.response.ProgramacionDetalleHelperResponse;
import com.gafahtec.consultorio.dto.response.ProgramacionDetalleResponse;
import com.gafahtec.consultorio.model.consultorio.ProgramacionDetalle;

import jakarta.validation.Valid;

public interface IProgramacionDetalleService {

	List<ProgramacionDetalleResponse> registrar(ProgramacionDetalleRequest request);

	ProgramacionDetalleResponse modificar(@Valid ProgramacionDetalleRequest programacionDetalleRequest);

	void eliminar(Integer id);

	Page<ProgramacionDetalleResponse> listarPageable(Pageable pageable);

	Page<ProgramacionDetalleResponse> buscarProgramacionesDetalle(String search, Pageable pageable);

	List<ProgramacionDetalleResponse> getProgramacionEmpleado(ProgramacionDetalleRequest programacionDetalleRequest);

	Boolean existeProgramacionEmpleado(ProgramacionDetalleRequest request);

	List<ProgramacionDetalleResponse> listarDiasProgramados(String numeroDocumento, Integer idEmpresa)
			throws ParseException;

	List<ProgramacionDetalle> getProgramacionDetalleActivo(Boolean estado);

	public ProgramacionDetalle modificarEntity(ProgramacionDetalle programacionDetalle);
	//////////////////////////////////////////////

	List<ProgramacionDetalleResponse> verificaProgramacion(Integer idMedico, String fechaInicial, String fechaFinal);

	List<ProgramacionDetalleResponse> citasPendientes(Integer idMedico, Integer numeroDiaSemana);

	ProgramacionDetalleHelperResponse listarPorIdProgramacion(Integer idProgramacion);

	void generarProgramacionAutomaticaCada3Meses();

}
