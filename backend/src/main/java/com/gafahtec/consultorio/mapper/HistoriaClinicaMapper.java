package com.gafahtec.consultorio.mapper;

import org.springframework.beans.BeanUtils;

import com.gafahtec.consultorio.dto.request.HistoriaClinicaRequest;
import com.gafahtec.consultorio.dto.response.HistoriaClinicaResponse;
import com.gafahtec.consultorio.model.consultorio.HistoriaClinica;

/**
 * Mapper manual (BeanUtils). Evita MapStruct+Lombok generando impls vacíos
 * cuando falta lombok-mapstruct-binding.
 */
public final class HistoriaClinicaMapper {

	private HistoriaClinicaMapper() {
	}

	public static HistoriaClinica toEntity(HistoriaClinicaRequest request) {
		if (request == null) {
			return null;
		}
		var entity = new HistoriaClinica();
		BeanUtils.copyProperties(request, entity, "idEmpresa", "idCliente");
		return entity;
	}

	public static HistoriaClinicaResponse toResponse(HistoriaClinica entity) {
		if (entity == null) {
			return null;
		}
		var response = new HistoriaClinicaResponse();
		BeanUtils.copyProperties(entity, response);
		if (entity.getEmpresa() != null) {
			response.setIdEmpresa(entity.getEmpresa().getIdEmpresa());
		}
		return response;
	}
}
