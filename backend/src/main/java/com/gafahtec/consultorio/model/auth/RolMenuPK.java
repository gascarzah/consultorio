package com.gafahtec.consultorio.model.auth;

import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Embeddable
public class RolMenuPK {
	@ManyToOne
	@JoinColumn(name = "id_menu", nullable = false)
	private Menu menu;
	@ManyToOne
	@JoinColumn(name = "id_rol", nullable = false)
	private Rol rol;
}
