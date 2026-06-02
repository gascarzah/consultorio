package com.gafahtec.consultorio.model.auth;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.*;

@Setter
@Getter
@Entity
@Table
@AllArgsConstructor
@NoArgsConstructor
@Builder
@IdClass(RolMenuPK.class)
@ToString
public class RolMenu {

	@Id
	private Menu menu;
	
	@Id
	private Rol rol;
}
