package com.gafahtec.consultorio.service;

import com.gafahtec.consultorio.dto.request.HistoriaClinicaRequest;
import com.gafahtec.consultorio.dto.response.HistoriaClinicaResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IHistoriaClinicaService extends ICRUD<HistoriaClinicaRequest, HistoriaClinicaResponse, Integer> {
    Page<HistoriaClinicaResponse> listarPageable(Pageable pageable);

    Page<HistoriaClinicaResponse> buscarHistoriasClinicas(String search, Pageable pageable);
}
