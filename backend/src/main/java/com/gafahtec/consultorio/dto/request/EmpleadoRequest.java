package com.gafahtec.consultorio.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Setter

@Getter

@AllArgsConstructor

@NoArgsConstructor

@ToString
public class EmpleadoRequest {
    private Integer idEmpleado;
    private String nombres;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String tipoDocumento;
    private String numeroDocumento;
    private String direccion;
    private String telefono;
    private String celular;
    private LocalDateTime fecha;
    private Integer idEmpresa;
    private Integer idTipoEmpleado;
    private String email;
}
