package com.gafahtec.consultorio.dto.response;

import java.io.Serializable;
import java.util.Date;

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
public class ProgramacionResponse implements Serializable{
	private Integer idProgramacion;

	private EmpleadoResponse empleado;
	
	private Date fechaInicial;
	private Date fechaFinal;

	private String strFechaInicial;
	private String strFechaFinal;

	private String rango;

	private Boolean activo;
}
