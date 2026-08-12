package com.gafahtec.consultorio.service.impl;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gafahtec.consultorio.dto.request.HorarioRequest;
import com.gafahtec.consultorio.dto.response.HorarioResponse;
import com.gafahtec.consultorio.model.consultorio.Horario;
import com.gafahtec.consultorio.repository.IHorarioRepository;
import com.gafahtec.consultorio.service.IHorarioService;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;

@AllArgsConstructor
@Service
@Transactional
@Log4j2
public class HorarioServiceImpl implements IHorarioService {

	private IHorarioRepository iHorarioRepository;

	@Override
	public Page<HorarioResponse> listarPageable(Pageable pageable) {
		return iHorarioRepository.findByActivoTrue(pageable)
				.map(this::entityToResponse);
	}

	@Override
	public Page<HorarioResponse> buscarHorarios(String search, Pageable pageable) {
		return iHorarioRepository.buscarHorarios(search, pageable).map(this::entityToResponse);
	}

	@Override
	public List<HorarioResponse> obtenerHorariosDisponibles(Integer idProgramacionDetalle, Integer idEmpresa) {
		var horarios = iHorarioRepository.obtenerHorariosDisponibles(idProgramacionDetalle, idEmpresa);
		log.info("horarios =====> {}", horarios);
		return horarios.stream().map(this::entityToResponse).toList();
	}

	@Override
	public HorarioResponse registrar(HorarioRequest request) {
		var horario = Horario.builder().build();
		BeanUtils.copyProperties(request, horario);
		horario.setActivo(Boolean.TRUE);
		var obj = iHorarioRepository.save(horario);

		log.info("objeto creado {}", obj);
		return entityToResponse(obj);
	}

	@Override
	public HorarioResponse modificar(HorarioRequest request) {
		var horario = iHorarioRepository.findById(request.getIdHorario())
				.filter(Horario::getActivo)
				.orElseThrow(() -> new IllegalArgumentException("Horario no encontrado: " + request.getIdHorario()));
		horario.setDescripcion(request.getDescripcion());
		if (request.getIdEmpresa() != null) {
			horario.setIdEmpresa(request.getIdEmpresa());
		}
		var obj = iHorarioRepository.save(horario);

		log.info("objeto creado {}", obj);
		return entityToResponse(obj);
	}

	@Override
	public List<HorarioResponse> listar() {

		return iHorarioRepository.findByActivoTrue(Pageable.unpaged()).stream()
				.map(this::entityToResponse).toList();
	}

	@Override
	public HorarioResponse listarPorId(Integer id) {

		return entityToResponse(iHorarioRepository.findById(id)
				.filter(Horario::getActivo)
				.orElseThrow(() -> new IllegalArgumentException("Horario no encontrado: " + id)));
	}

	@Override
	public void eliminar(Integer id) {
		var horario = iHorarioRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Horario no encontrado: " + id));
		horario.setActivo(Boolean.FALSE);
		iHorarioRepository.save(horario);
	}

	private HorarioResponse entityToResponse(Horario entity) {
		var response = new HorarioResponse();
		BeanUtils.copyProperties(entity, response);
		return response;
	}

}
