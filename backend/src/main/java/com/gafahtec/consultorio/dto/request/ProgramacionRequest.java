package com.gafahtec.consultorio.dto.request;

import java.util.Date;

import lombok.*;

@Setter

@Getter

@AllArgsConstructor

@NoArgsConstructor
@Builder
@ToString
public class ProgramacionRequest {
    private Integer idProgramacion;
    private Date fechaInicial;
    private Date fechaFinal;
    private String[] checked;
    private Integer idEmpresa;
    private String numeroDocumento;
    private Integer numeroSemana;
}
