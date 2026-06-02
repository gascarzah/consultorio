package com.gafahtec.consultorio.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class MenuRequest {
	private Integer idMenu;
	private String nombre;
	private String path;
	private Integer idCategoria;
	private Integer orden;
	private Boolean activo;
}
