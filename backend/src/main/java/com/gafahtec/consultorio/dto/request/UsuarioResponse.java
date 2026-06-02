package com.gafahtec.consultorio.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioResponse {

	private String email;
	private String password;
	private String nombres;
	private String numeroDocumento;
	private String apellidoPaterno;
	private String apellidoMaterno;
	private Integer idRol;
	private Integer idEmpresa;
	private Integer idUsuario;
}
