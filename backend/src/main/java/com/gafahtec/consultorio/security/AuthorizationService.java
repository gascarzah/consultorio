package com.gafahtec.consultorio.security;

import org.springframework.stereotype.Component;

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
}
