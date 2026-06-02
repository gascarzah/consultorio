package com.gafahtec.consultorio.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter

@Getter

@AllArgsConstructor

@NoArgsConstructor

@ToString
public class HistoriaClinicaRequest {

    private Integer idHistoriaClinica;

    private String ectoscopia;
    private String alergia;
    private String motivo;
    private String antecedentesMedicos;
    private Integer idCliente;
    private Integer idEmpresa;

	private String nombres;
	
	private String apellidoPaterno;
	
	private String apellidoMaterno;

	private String tipoDocumento;
	
	private String numeroDocumento;

	private String direccion;

	private String telefono;
	private String celular;
	
	private String email;
}
