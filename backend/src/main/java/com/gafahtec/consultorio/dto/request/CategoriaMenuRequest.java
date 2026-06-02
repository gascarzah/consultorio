package com.gafahtec.consultorio.dto.request;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class CategoriaMenuRequest {
    private Integer idCategoria;
    private String nombre;
    private Integer orden;
    private Boolean activo;
}
