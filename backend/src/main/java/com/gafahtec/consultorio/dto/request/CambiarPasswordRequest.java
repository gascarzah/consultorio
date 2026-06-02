package com.gafahtec.consultorio.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CambiarPasswordRequest {

	private String passwordActual;
	private String nuevaPassword;
	/** Opcional; si se envía debe coincidir con el usuario autenticado. */
	private Integer idUsuario;
}
