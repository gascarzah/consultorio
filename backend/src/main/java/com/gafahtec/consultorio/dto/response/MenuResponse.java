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
public class MenuResponse implements Serializable{
	private Integer idMenu;
	private String nombre;
	private String path;
	private Integer idCategoria;
	private String categoriaNombre;
	private Integer orden;
	private Boolean activo;
}
