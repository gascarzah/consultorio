package com.gafahtec.consultorio.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiasPorEmpleadoRequest {
    private Integer idEmpleado;
    private Set<Integer> dias; // ejemplo: [1, 3, 5]
}