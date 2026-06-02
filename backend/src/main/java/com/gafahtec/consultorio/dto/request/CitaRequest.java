package com.gafahtec.consultorio.dto.request;

import jakarta.validation.constraints.NotNull;
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

public class CitaRequest {

    @NotNull(message = "idProgramacionDetalle es obligatorio")
    private Integer idProgramacionDetalle;
    @NotNull(message = "idHistoriaClinica es obligatorio")
    private Integer idHistoriaClinica;
    private Integer idCita;
    @NotNull(message = "idHorario es obligatorio")
    private Integer idHorario;
    private String informe;
    private String motivo;
    private String diagnostico;
    private Boolean atendido;
}
