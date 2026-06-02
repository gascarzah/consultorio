package com.gafahtec.consultorio.dto;

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
public class DiaProgramado {
    private Integer numero;
    private String desc;
    private Boolean estado;
}
