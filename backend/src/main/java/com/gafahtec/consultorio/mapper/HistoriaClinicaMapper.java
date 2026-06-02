package com.gafahtec.consultorio.mapper;

import com.gafahtec.consultorio.dto.request.HistoriaClinicaRequest;
import com.gafahtec.consultorio.dto.response.HistoriaClinicaResponse;
import com.gafahtec.consultorio.model.consultorio.HistoriaClinica;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface HistoriaClinicaMapper {

    HistoriaClinicaMapper INSTANCE = Mappers.getMapper(HistoriaClinicaMapper.class);

    HistoriaClinica historiaClinicaDtoToEntity(HistoriaClinicaRequest historiaClinicaRequest);

    HistoriaClinicaResponse historiaClinicaEntityToDto(HistoriaClinica historiaClinica);
}
