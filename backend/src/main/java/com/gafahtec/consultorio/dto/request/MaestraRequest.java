package com.gafahtec.consultorio.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MaestraRequest {

    private Integer idMaestra;

    private Integer idMaestraPadre;

    private Integer idEmpresa;

    private String descripcion;
    
    private Boolean estado;
}
