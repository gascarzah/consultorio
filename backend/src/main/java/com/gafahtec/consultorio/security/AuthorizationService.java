package com.gafahtec.consultorio.security;

import org.springframework.stereotype.Component;

import com.gafahtec.consultorio.model.auth.Usuario;

import lombok.RequiredArgsConstructor;

@Component("authz")
@RequiredArgsConstructor
public class AuthorizationService {

	private final CurrentUserService currentUserService;

	public boolean isSuper() {
		return currentUserService.hasAuthority("SUPER");
	}

	public boolean isAdmin() {
		return currentUserService.hasAuthority("ADMIN");
	}

	public boolean isSuperOrAdmin() {
		return isSuper() || isAdmin();
	}

	/** Cualquier usuario autenticado con al menos un rol activo. */
	public boolean canAccessApp() {
		return currentUserService.getCurrentUsuario()
				.map(Usuario::getRoles)
				.map(roles -> roles != null && !roles.isEmpty())
				.orElse(false);
	}

	/** True si el usuario autenticado tiene el rol indicado (por id). */
	public boolean hasRoleId(Integer idRol) {
		if (idRol == null) {
			return false;
		}
		return currentUserService.getCurrentUsuario()
				.map(Usuario::getRoles)
				.map(roles -> roles != null && roles.stream()
						.anyMatch(r -> idRol.equals(r.getIdRol())))
				.orElse(false);
	}

	/** Lectura de rol propio o gestión completa SUPER/ADMIN. */
	public boolean canReadRole(Integer idRol) {
		return isSuperOrAdmin() || hasRoleId(idRol);
	}

	/** True si el email coincide con el usuario autenticado (case-insensitive). */
	public boolean isCurrentUser(String email) {
		if (email == null || email.isBlank()) {
			return false;
		}
		return currentUserService.getCurrentUsuario()
				.map(Usuario::getEmail)
				.map(current -> current.equalsIgnoreCase(email.trim()))
				.orElse(false);
	}
}
