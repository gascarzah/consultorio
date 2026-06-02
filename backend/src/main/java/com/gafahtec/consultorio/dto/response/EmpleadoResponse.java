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
public class EmpleadoResponse implements Serializable{
    private Integer idEmpleado;
	private String numeroDocumento;
    private String nombres;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private Integer tipoDocumento;
    private Integer idEmpresa;


    private String direccion;

    private EmpresaResponse empresa;
	

    private Boolean activo;
    private Integer idTipoEmpleado;
    private String tipoEmpleadoNombre;
    private TipoEmpleadoResponse tipoEmpleado;
}
