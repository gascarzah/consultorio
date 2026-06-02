package com.gafahtec.consultorio.dto.response;

import java.io.Serializable;

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
public class HistoriaClinicaResponse implements Serializable{
	private Integer idHistoriaClinica;
	private Integer idEmpresa;

	private String ectoscopia;
	private String alergia;
	private String motivo;
	private String antecedentesMedicos;


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
