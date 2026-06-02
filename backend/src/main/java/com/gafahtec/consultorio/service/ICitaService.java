package com.gafahtec.consultorio.service;

import java.util.List;
import java.util.Map;
import java.util.List;

import com.gafahtec.consultorio.dto.response.CitadosResponse;
import com.gafahtec.consultorio.dto.response.DoctorDisponibleResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.gafahtec.consultorio.dto.request.CitaRequest;
import com.gafahtec.consultorio.dto.response.CitaResponse;
import com.gafahtec.consultorio.model.consultorio.Cita;
import com.gafahtec.consultorio.model.consultorio.ProgramacionDetalle;

public interface ICitaService extends ICRUD<CitaRequest, CitaResponse, Integer> {

    Page<CitaResponse> listarPageable(Pageable pageable);

    Page<CitaResponse> buscarCitas(String search, Pageable pageable);

    void registrarHorarios(List<ProgramacionDetalle> list);

    List<CitaResponse> listarCitas(Integer idProgramacionDetalle);

    Integer eliminar(Integer idCita, Integer idHorario, Integer idProgramacionDetalle);

    Integer updateAtencion(Integer idCita);

    List<CitaResponse> listaCitados(Integer idEmpresa);

    Page<CitaResponse> listaHistorialCitaCliente(String numeroDocumento, Pageable paging);

    // List<CitaResponse> listaHistorialCitaCliente(Integer idCliente);

    List<Cita> listarNoAtendidos(Integer idProgramacionDetalle, Boolean noAtendidos);

    Cita modificarToEntity(Cita request);

    List<Cita> listarPorFecha(String fecha);

    List<DoctorDisponibleResponse> listarCitados(String fecha);

}
