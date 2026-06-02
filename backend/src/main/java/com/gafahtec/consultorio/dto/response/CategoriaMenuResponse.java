package com.gafahtec.consultorio.dto.response;

import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CategoriaMenuResponse implements Serializable {
    private Integer idCategoria;
    private String nombre;
    private Integer orden;
    private Boolean activo;
}
