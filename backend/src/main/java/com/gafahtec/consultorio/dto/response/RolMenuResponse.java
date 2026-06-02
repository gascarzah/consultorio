package com.gafahtec.consultorio.dto.response;

import java.io.Serializable;

import com.gafahtec.consultorio.model.auth.Menu;
import com.gafahtec.consultorio.model.auth.Rol;

import lombok.Data;

@Data
public class RolMenuResponse implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 2082293244764097924L;
	private Rol rol;
	private Menu menu;
}
