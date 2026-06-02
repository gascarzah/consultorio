package com.gafahtec.consultorio.security;

import java.util.Optional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.gafahtec.consultorio.model.auth.Usuario;
import com.gafahtec.consultorio.repository.IUsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CurrentUserService {

	private final IUsuarioRepository usuarioRepository;

	public Optional<Usuario> getCurrentUsuario() {
		var authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || authentication.getName() == null) {
			return Optional.empty();
		}
		return usuarioRepository.findByEmail(authentication.getName());
	}

	public boolean hasAuthority(String roleName) {
		return getCurrentUsuario()
				.map(Usuario::getRoles)
				.map(roles -> roles.stream()
						.anyMatch(r -> roleName.equalsIgnoreCase(r.getNombre())))
				.orElse(false);
	}

	/** {@code null} si el usuario es SUPER (sin restricción de empresa). */
	public Integer getEmpresaRestringidaParaAdmin() {
		var userOpt = getCurrentUsuario();
		if (userOpt.isEmpty() || userOpt.get().getRoles() == null) {
			return null;
		}

		boolean isSuper = userOpt.get().getRoles().stream()
				.anyMatch(r -> "SUPER".equalsIgnoreCase(r.getNombre()));
		if (isSuper) {
			return null;
		}

		boolean isAdmin = userOpt.get().getRoles().stream()
				.anyMatch(r -> "ADMIN".equalsIgnoreCase(r.getNombre()));
		if (!isAdmin || userOpt.get().getEmpleado() == null
				|| userOpt.get().getEmpleado().getEmpresa() == null) {
			return null;
		}
		return userOpt.get().getEmpleado().getEmpresa().getIdEmpresa();
	}

	public Integer resolveEmpresaIdForWrite(Integer requestedEmpresaId) {
		Integer restricted = getEmpresaRestringidaParaAdmin();
		if (restricted != null) {
			if (requestedEmpresaId != null && !restricted.equals(requestedEmpresaId)) {
				throw new IllegalArgumentException("No puede operar sobre otra empresa");
			}
			return restricted;
		}
		if (requestedEmpresaId == null) {
			throw new IllegalArgumentException("idEmpresa es obligatorio");
		}
		return requestedEmpresaId;
	}

	public void assertCanAccessEmpresa(Integer idEmpresa) {
		if (idEmpresa == null) {
			return;
		}
		Integer restricted = getEmpresaRestringidaParaAdmin();
		if (restricted != null && !restricted.equals(idEmpresa)) {
			throw new IllegalArgumentException("Acceso denegado a datos de otra empresa");
		}
	}
}
