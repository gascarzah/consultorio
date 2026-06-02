package com.gafahtec.consultorio.service.impl;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gafahtec.consultorio.dto.request.RolRequest;
import com.gafahtec.consultorio.dto.response.RolResponse;
import com.gafahtec.consultorio.model.auth.Rol;
import com.gafahtec.consultorio.repository.IRolRepository;
import com.gafahtec.consultorio.service.IRolService;

import lombok.AllArgsConstructor;
import jakarta.persistence.EntityNotFoundException;

@AllArgsConstructor
@Service
@Transactional
public class RolServiceImpl implements IRolService {

	private IRolRepository iRolRepository;

	@Override
	public Page<RolResponse> listarPageable(Pageable pageable) {
		return iRolRepository.findByActivoTrue(pageable).map(this::entityToResponse);
	}

	@Override
	public Page<RolResponse> buscarRoles(String search, Pageable pageable) {
		Page<Rol> roles = iRolRepository.buscarRoles(search, pageable);
		return roles.map(this::entityToResponse);
	}

	@Override
	public RolResponse registrar(RolRequest request) {
		var entity = new Rol();
		BeanUtils.copyProperties(request, entity);
		entity.setActivo(Boolean.TRUE);
		var obj = iRolRepository.save(entity);
		return entityToResponse(obj);
	}

	@Override
	public RolResponse modificar(RolRequest request) {
		var entity = iRolRepository.findById(request.getIdRol())
				.orElseThrow(() -> new EntityNotFoundException("Rol no encontrado con ID: " + request.getIdRol()));
		entity.setNombre(request.getNombre());
		var obj = iRolRepository.save(entity);
		return entityToResponse(obj);
	}

	@Override
	public List<RolResponse> listar() {
		return iRolRepository.findByActivoTrue()
				.stream().map(this::entityToResponse).toList();
	}

	@Override
	public RolResponse listarPorId(Integer id) {
		var rol = iRolRepository.findById(id)
				.filter(Rol::getActivo)
				.orElseThrow(() -> new EntityNotFoundException("Rol no encontrado con ID: " + id));
		return entityToResponse(rol);
	}

	@Override
	public void eliminar(Integer id) {
		var rol = iRolRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Rol no encontrado con ID: " + id));
		rol.setActivo(Boolean.FALSE);
		iRolRepository.save(rol);
	}

	private RolResponse entityToResponse(Rol entity) {
		var response = new RolResponse();
		BeanUtils.copyProperties(entity, response);
		return response;
	}

}
