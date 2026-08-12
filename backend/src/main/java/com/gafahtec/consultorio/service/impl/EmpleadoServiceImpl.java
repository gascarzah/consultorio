package com.gafahtec.consultorio.service.impl;

import com.gafahtec.consultorio.dto.request.EmpleadoRequest;
import com.gafahtec.consultorio.dto.response.EmpleadoResponse;
import com.gafahtec.consultorio.model.auth.Empleado;
import com.gafahtec.consultorio.model.auth.TipoEmpleado;
import com.gafahtec.consultorio.repository.IEmpleadoRepository;
import com.gafahtec.consultorio.repository.IEmpresaRepository;
import com.gafahtec.consultorio.repository.ITipoEmpleadoRepository;
import com.gafahtec.consultorio.service.IEmpleadoService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
@Transactional
@Slf4j
public class EmpleadoServiceImpl implements IEmpleadoService {

	private IEmpleadoRepository iEmpleadoRepository;
	private com.gafahtec.consultorio.repository.IUsuarioRepository iUsuarioRepository;
	private IEmpresaRepository iEmpresaRepository;
	private ITipoEmpleadoRepository iTipoEmpleadoRepository;

	@Override
	public Page<EmpleadoResponse> listarPageable(Pageable pageable) {
		Integer idEmpresa = getEmpresaRestringidaParaAdmin();
		Page<Empleado> empleados = (idEmpresa != null)
				? iEmpleadoRepository.listarActivosPorEmpresa(idEmpresa, pageable)
				: iEmpleadoRepository.listarActivos(pageable);
		return empleados
				.map(this::entityToResponse);
	}

	@Override
	public Page<EmpleadoResponse> buscarEmpleados(String search, Pageable pageable) {
		Integer idEmpresa = getEmpresaRestringidaParaAdmin();
		Page<Empleado> empleados = (idEmpresa != null)
				? iEmpleadoRepository.buscarEmpleadosPorEmpresa(search, idEmpresa, pageable)
				: iEmpleadoRepository.buscarEmpleados(search, pageable);
		return empleados.map(this::entityToResponse);
	}

	@Override
	public List<EmpleadoResponse> listarPorRol(Integer idRol) {

		return iEmpleadoRepository.findByRol(idRol)
				.stream().map(this::entityToResponse).toList();
	}

	@Override
	public List<EmpleadoResponse> listarEmpleadosPorEmpresa(Integer idEmpresa) {
		var empresa = iEmpresaRepository
				.findById(idEmpresa)
				.orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada con ID: " + idEmpresa));
		return iEmpleadoRepository.findByEmpresa(empresa)
				.stream()
				.filter(e -> !Boolean.FALSE.equals(e.getActivo()))
				.map(this::entityToResponse).toList();
	}

	@Override
	public List<EmpleadoResponse> listarOdontologosPorEmpresa(Integer idEmpresa) {
		iEmpresaRepository.findById(idEmpresa)
				.orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada con ID: " + idEmpresa));

		return iEmpleadoRepository.findOdontologosByEmpresa(idEmpresa)
				.stream()
				.map(this::entityToResponse)
				.toList();
	}

	@Override
	public EmpleadoResponse registrar(EmpleadoRequest request) {

		var empresa = iEmpresaRepository
				.findById(request.getIdEmpresa())
				.orElseThrow(
						() -> new EntityNotFoundException("Empresa no encontrada con ID: " + request.getIdEmpresa()));

		TipoEmpleado tipoEmpleado = iTipoEmpleadoRepository.getReferenceById(request.getIdTipoEmpleado());

		var empleado = Empleado.builder()
				.empresa(empresa)
				.numeroDocumento(request.getNumeroDocumento())
				.apellidoMaterno(request.getApellidoMaterno())
				.apellidoPaterno(request.getApellidoPaterno())
				.nombres(request.getNombres())
				.direccion(request.getDireccion())
				.tipoEmpleado(tipoEmpleado)
				.build();
		var obj = iEmpleadoRepository.save(empleado);

		return entityToResponse(obj);
	}

	@Override
	public EmpleadoResponse modificar(EmpleadoRequest request) {
		var empleadoExistente = iEmpleadoRepository.findById(request.getIdEmpleado())
				.orElseThrow(
						() -> new EntityNotFoundException("Empleado no encontrado con ID: " + request.getIdEmpleado()));

		var empresa = iEmpresaRepository
				.findById(request.getIdEmpresa())
				.orElseThrow(
						() -> new EntityNotFoundException("Empresa no encontrada con ID: " + request.getIdEmpresa()));
		TipoEmpleado tipoEmpleado = iTipoEmpleadoRepository.getReferenceById(request.getIdTipoEmpleado());
		empleadoExistente.setEmpresa(empresa);
		empleadoExistente.setNumeroDocumento(request.getNumeroDocumento());
		empleadoExistente.setApellidoMaterno(request.getApellidoMaterno());
		empleadoExistente.setApellidoPaterno(request.getApellidoPaterno());
		empleadoExistente.setNombres(request.getNombres());
		empleadoExistente.setDireccion(request.getDireccion());
		empleadoExistente.setTipoEmpleado(tipoEmpleado);
		var empleadoActualizado = iEmpleadoRepository.save(empleadoExistente);

		return entityToResponse(empleadoActualizado);
	}

	@Override
	public List<EmpleadoResponse> listar() {
		return iEmpleadoRepository.findByActivoTrue()
				.stream()
				.map(this::entityToResponse)
				.toList();
	}

	@Override
	public EmpleadoResponse listarPorId(Integer id) {

		Optional<Empleado> empleadoOpt = iEmpleadoRepository.findByIdActivo(id);
		if (empleadoOpt.isPresent()) {
			return entityToResponse(empleadoOpt.get());
		} else {
			throw new EntityNotFoundException("Empleado no encontrado con id: " + id);
		}
	}

	@Override
	public void eliminar(Integer id) {
		var empleado = iEmpleadoRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Empleado no encontrado con id: " + id));
		empleado.setActivo(Boolean.FALSE);
		iEmpleadoRepository.save(empleado);
	}

	private EmpleadoResponse entityToResponse(Empleado entity) {
		log.info("EmpleadoResponse {}", entity);
		var response = new EmpleadoResponse();
		BeanUtils.copyProperties(entity, response);

		if (entity.getEmpresa() != null) {
			response.setIdEmpresa(entity.getEmpresa().getIdEmpresa());
		}
		response.setNumeroDocumento(entity.getNumeroDocumento());

		if (entity.getTipoEmpleado() != null) {
			response.setIdTipoEmpleado(entity.getTipoEmpleado().getIdTipoEmpleado());
			response.setTipoEmpleadoNombre(entity.getTipoEmpleado().getNombre());
		}
		return response;
	}

	private Integer getEmpresaRestringidaParaAdmin() {
		var authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || authentication.getName() == null) {
			return null;
		}

		var userOpt = iUsuarioRepository.findByEmail(authentication.getName());
		if (userOpt.isEmpty() || userOpt.get().getRoles() == null) {
			return null;
		}

		boolean isSuper = userOpt.get().getRoles().stream()
				.anyMatch(r -> "SUPER".equalsIgnoreCase(r.getNombre()));
		if (isSuper) {
			return null;
		}

		if (userOpt.get().getEmpleado() == null || userOpt.get().getEmpleado().getEmpresa() == null) {
			return null;
		}
		return userOpt.get().getEmpleado().getEmpresa().getIdEmpresa();
	}
}