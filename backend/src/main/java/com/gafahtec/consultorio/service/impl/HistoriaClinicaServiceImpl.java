package com.gafahtec.consultorio.service.impl;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gafahtec.consultorio.dto.request.HistoriaClinicaRequest;
import com.gafahtec.consultorio.dto.response.HistoriaClinicaResponse;
import com.gafahtec.consultorio.mapper.HistoriaClinicaMapper;
import com.gafahtec.consultorio.model.consultorio.HistoriaClinica;
import com.gafahtec.consultorio.repository.IEmpresaRepository;
import com.gafahtec.consultorio.repository.IHistoriaClinicaRepository;
import com.gafahtec.consultorio.security.CurrentUserService;
import com.gafahtec.consultorio.service.IHistoriaClinicaService;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;

@AllArgsConstructor
@Service
@Transactional
@Log4j2
public class HistoriaClinicaServiceImpl implements IHistoriaClinicaService {

	private final IHistoriaClinicaRepository iHistoriaClinicaRepository;
	private final IEmpresaRepository iEmpresaRepository;
	private final CurrentUserService currentUserService;

	@Override
	public HistoriaClinicaResponse registrar(HistoriaClinicaRequest request) {
		Integer idEmpresa = currentUserService.resolveEmpresaIdForWrite(request.getIdEmpresa());
		var empresa = iEmpresaRepository.findById(idEmpresa)
				.orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada con ID: " + idEmpresa));

		var historiaClinica = HistoriaClinicaMapper.INSTANCE.historiaClinicaDtoToEntity(request);
		historiaClinica.setActivo(Boolean.TRUE);
		historiaClinica.setEmpresa(empresa);

		var obj = iHistoriaClinicaRepository.save(historiaClinica);
		return entityToResponse(obj);
	}

	@Override
	public HistoriaClinicaResponse modificar(HistoriaClinicaRequest request) {
		var historiaClinica = loadAndAuthorize(request.getIdHistoriaClinica());
		BeanUtils.copyProperties(request, historiaClinica, "activo", "empresa", "citas");
		var obj = iHistoriaClinicaRepository.save(historiaClinica);
		return entityToResponse(obj);
	}

	@Override
	public List<HistoriaClinicaResponse> listar() {
		Integer idEmpresa = currentUserService.getEmpresaRestringidaParaAdmin();
		if (idEmpresa != null) {
			return iHistoriaClinicaRepository.findByActivoTrueAndEmpresaIdEmpresa(idEmpresa).stream()
					.map(this::entityToResponse)
					.toList();
		}
		return iHistoriaClinicaRepository.findAll().stream()
				.filter(HistoriaClinica::getActivo)
				.map(this::entityToResponse)
				.toList();
	}

	@Override
	public HistoriaClinicaResponse listarPorId(Integer id) {
		return entityToResponse(loadAndAuthorize(id));
	}

	@Override
	public void eliminar(Integer id) {
		var historiaClinica = loadAndAuthorize(id);
		historiaClinica.setActivo(Boolean.FALSE);
		iHistoriaClinicaRepository.save(historiaClinica);
	}

	@Override
	public Page<HistoriaClinicaResponse> listarPageable(Pageable pageable) {
		Integer idEmpresa = currentUserService.getEmpresaRestringidaParaAdmin();
		Page<HistoriaClinica> page = (idEmpresa != null)
				? iHistoriaClinicaRepository.findByActivoTrueAndEmpresaIdEmpresa(idEmpresa, pageable)
				: iHistoriaClinicaRepository.findByActivoTrue(pageable);
		return page.map(this::entityToResponse);
	}

	@Override
	public Page<HistoriaClinicaResponse> buscarHistoriasClinicas(String search, Pageable pageable) {
		Integer idEmpresa = currentUserService.getEmpresaRestringidaParaAdmin();
		Page<HistoriaClinica> historias = (idEmpresa != null)
				? iHistoriaClinicaRepository.buscarHistoriasClinicasPorEmpresa(search, idEmpresa, pageable)
				: iHistoriaClinicaRepository.buscarHistoriasClinicas(search, pageable);
		return historias.map(this::entityToResponse);
	}

	private HistoriaClinica loadAndAuthorize(Integer id) {
		var historiaClinica = iHistoriaClinicaRepository.findById(id)
				.filter(HistoriaClinica::getActivo)
				.orElseThrow(() -> new EntityNotFoundException("Historia clínica no encontrada con ID: " + id));
		if (historiaClinica.getEmpresa() != null) {
			currentUserService.assertCanAccessEmpresa(historiaClinica.getEmpresa().getIdEmpresa());
		}
		return historiaClinica;
	}

	private HistoriaClinicaResponse entityToResponse(HistoriaClinica entity) {
		var response = HistoriaClinicaMapper.INSTANCE.historiaClinicaEntityToDto(entity);
		if (entity.getEmpresa() != null) {
			response.setIdEmpresa(entity.getEmpresa().getIdEmpresa());
		}
		return response;
	}
}
