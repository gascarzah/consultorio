package com.gafahtec.consultorio.dto.response;

import lombok.*;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class DoctorDisponibleResponse {

    private String medico;

    private List<CitadosResponse> citados;

}
