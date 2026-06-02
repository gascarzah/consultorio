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
public class CitaResponse implements Serializable {

	private static final long serialVersionUID = -5595456377414621907L;

	private Integer idCita;

	private HistoriaClinicaResponse historiaClinica;

	private HorarioResponse horario;

	private ProgramacionDetalleResponse programacionDetalle;

	private Boolean atendido;

	private String informe;

	private String motivo;

	private String diagnostico;
}
