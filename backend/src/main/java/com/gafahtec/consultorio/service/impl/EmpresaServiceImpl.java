package com.gafahtec.consultorio.service.impl;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gafahtec.consultorio.dto.request.EmpresaRequest;
import com.gafahtec.consultorio.dto.response.EmpresaResponse;
import com.gafahtec.consultorio.model.auth.Empresa;
import com.gafahtec.consultorio.repository.IEmpresaRepository;
import com.gafahtec.consultorio.service.IEmpresaService;

import lombok.AllArgsConstructor;
import jakarta.persistence.EntityNotFoundException;

@AllArgsConstructor
@Service
@Transactional
public class EmpresaServiceImpl implements IEmpresaService {

	private IEmpresaRepository iEmpresaRepository;

	@Override
	public Page<EmpresaResponse> listarPageable(Pageable pageable) {
		return iEmpresaRepository.findByActivoTrue(pageable)
				.map(this::entityToResponse);
	}

	@Override
	public Page<EmpresaResponse> buscarEmpresas(String search, Pageable pageable) {
		Page<Empresa> empresas = iEmpresaRepository.buscarEmpresas(search, pageable);
		return empresas.map(this::entityToResponse);
	}

	private EmpresaResponse entityToResponse(Empresa entity) {
		var response = new EmpresaResponse();
		BeanUtils.copyProperties(entity, response);
		return response;
	}

	@Override
	public EmpresaResponse registrar(EmpresaRequest request) {
		var entity = new Empresa();
		BeanUtils.copyProperties(request, entity);
		entity.setActivo(Boolean.TRUE);
		var obj = iEmpresaRepository.save(entity);
		return entityToResponse(obj);
	}

	@Override
	public EmpresaResponse modificar(EmpresaRequest request) {
		var entity = iEmpresaRepository.findById(request.getIdEmpresa())
				.orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada con ID: " + request.getIdEmpresa()));
		entity.setNombre(request.getNombre());
		var obj = iEmpresaRepository.save(entity);
		return entityToResponse(obj);
	}

	@Override
	public List<EmpresaResponse> listar() {
		return iEmpresaRepository.findByActivoTrue()
				.stream().map(this::entityToResponse).toList();
	}

	@Override
	public EmpresaResponse listarPorId(Integer id) {
		var empresa = iEmpresaRepository.findById(id)
				.filter(Empresa::getActivo)
				.orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada con ID: " + id));
		return entityToResponse(empresa);
	}

	@Override
	public void eliminar(Integer id) {
		var empresa = iEmpresaRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada con ID: " + id));
		empresa.setActivo(Boolean.FALSE);
		iEmpresaRepository.save(empresa);
	}
}
