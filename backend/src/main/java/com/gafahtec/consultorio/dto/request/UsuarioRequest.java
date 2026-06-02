package com.gafahtec.consultorio.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioRequest {

	private String email;
	private String nombres;
	private String numeroDocumento;
	private String apellidoPaterno;
	private String apellidoMaterno;
	private Integer idRol;
	private Integer idEmpresa;
	private Integer idUsuario;
	private Integer idEmpleado;
	/** Opcional; si no se envía, el registro usa la contraseña por defecto de desarrollo. */
	private String password;
}
