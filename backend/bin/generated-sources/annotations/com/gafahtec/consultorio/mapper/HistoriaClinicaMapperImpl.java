package com.gafahtec.consultorio.mapper;

import com.gafahtec.consultorio.dto.request.HistoriaClinicaRequest;
import com.gafahtec.consultorio.dto.response.HistoriaClinicaResponse;
import com.gafahtec.consultorio.model.consultorio.HistoriaClinica;
import javax.annotation.processing.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-06-15T11:35:29-0500",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
public class HistoriaClinicaMapperImpl implements HistoriaClinicaMapper {

    @Override
    public HistoriaClinica historiaClinicaDtoToEntity(HistoriaClinicaRequest historiaClinicaRequest) {
        if ( historiaClinicaRequest == null ) {
            return null;
        }

        HistoriaClinica.HistoriaClinicaBuilder historiaClinica = HistoriaClinica.builder();

        historiaClinica.alergia( historiaClinicaRequest.getAlergia() );
        historiaClinica.antecedentesMedicos( historiaClinicaRequest.getAntecedentesMedicos() );
        historiaClinica.apellidoMaterno( historiaClinicaRequest.getApellidoMaterno() );
        historiaClinica.apellidoPaterno( historiaClinicaRequest.getApellidoPaterno() );
        historiaClinica.celular( historiaClinicaRequest.getCelular() );
        historiaClinica.direccion( historiaClinicaRequest.getDireccion() );
        historiaClinica.ectoscopia( historiaClinicaRequest.getEctoscopia() );
        historiaClinica.email( historiaClinicaRequest.getEmail() );
        historiaClinica.idHistoriaClinica( historiaClinicaRequest.getIdHistoriaClinica() );
        historiaClinica.motivo( historiaClinicaRequest.getMotivo() );
        historiaClinica.nombres( historiaClinicaRequest.getNombres() );
        historiaClinica.numeroDocumento( historiaClinicaRequest.getNumeroDocumento() );
        historiaClinica.telefono( historiaClinicaRequest.getTelefono() );
        historiaClinica.tipoDocumento( historiaClinicaRequest.getTipoDocumento() );

        return historiaClinica.build();
    }

    @Override
    public HistoriaClinicaResponse historiaClinicaEntityToDto(HistoriaClinica historiaClinica) {
        if ( historiaClinica == null ) {
            return null;
        }

        HistoriaClinicaResponse historiaClinicaResponse = new HistoriaClinicaResponse();

        historiaClinicaResponse.setAlergia( historiaClinica.getAlergia() );
        historiaClinicaResponse.setAntecedentesMedicos( historiaClinica.getAntecedentesMedicos() );
        historiaClinicaResponse.setApellidoMaterno( historiaClinica.getApellidoMaterno() );
        historiaClinicaResponse.setApellidoPaterno( historiaClinica.getApellidoPaterno() );
        historiaClinicaResponse.setCelular( historiaClinica.getCelular() );
        historiaClinicaResponse.setDireccion( historiaClinica.getDireccion() );
        historiaClinicaResponse.setEctoscopia( historiaClinica.getEctoscopia() );
        historiaClinicaResponse.setEmail( historiaClinica.getEmail() );
        historiaClinicaResponse.setIdHistoriaClinica( historiaClinica.getIdHistoriaClinica() );
        historiaClinicaResponse.setMotivo( historiaClinica.getMotivo() );
        historiaClinicaResponse.setNombres( historiaClinica.getNombres() );
        historiaClinicaResponse.setNumeroDocumento( historiaClinica.getNumeroDocumento() );
        historiaClinicaResponse.setTelefono( historiaClinica.getTelefono() );
        historiaClinicaResponse.setTipoDocumento( historiaClinica.getTipoDocumento() );

        return historiaClinicaResponse;
    }
}
