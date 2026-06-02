package com.gafahtec.consultorio.service.impl;

import com.gafahtec.consultorio.dto.request.CitaRequest;
import com.gafahtec.consultorio.dto.response.*;
import com.gafahtec.consultorio.exception.ResourceNotFoundException;
import com.gafahtec.consultorio.model.consultorio.Cita;
import com.gafahtec.consultorio.model.consultorio.HistoriaClinica;
import com.gafahtec.consultorio.model.consultorio.Horario;
import com.gafahtec.consultorio.model.consultorio.ProgramacionDetalle;
import com.gafahtec.consultorio.repository.ICitaRepository;
import com.gafahtec.consultorio.repository.IHorarioRepository;
import com.gafahtec.consultorio.repository.IUsuarioRepository;
import com.gafahtec.consultorio.service.ICitaService;
import com.gafahtec.consultorio.util.Constants;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@Transactional
@Service
public class CitaServiceImpl implements ICitaService {

	private ICitaRepository iCitaRepository;
	private IUsuarioRepository iUsuarioRepository;

	private IHorarioRepository iHorarioRepository;

	@Override
	public Page<CitaResponse> listarPageable(Pageable pageable) throws ResourceNotFoundException {
		// Crear un Pageable con ordenamiento por fecha de ProgramacionDetalle
		Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
				Sort.by("programacionDetalle.fecha").descending());

		Integer idEmpresa = getEmpresaRestringidaParaAdmin();
		Page<Cita> citas = (idEmpresa != null)
				? iCitaRepository.listarActivasPorEmpresa(idEmpresa, sortedPageable)
				: iCitaRepository.listarActivas(sortedPageable);
		return citas
				.map(this::entityToResponse);
	}

	@Override
	public Page<CitaResponse> buscarCitas(String search, Pageable pageable) throws ResourceNotFoundException {
		// Crear un Pageable con ordenamiento por fecha de ProgramacionDetalle
		Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
				Sort.by("programacionDetalle.fecha").descending());

		Integer idEmpresa = getEmpresaRestringidaParaAdmin();
		Page<Cita> citas = (idEmpresa != null)
				? iCitaRepository.buscarCitasPorEmpresa(search, idEmpresa, sortedPageable)
				: iCitaRepository.buscarCitas(search, sortedPageable);
		return citas.map(this::entityToResponse);
	}

	public void registrarHorarios(List<ProgramacionDetalle> list) {

		List<Horario> horarios = iHorarioRepository.findAll();

		for (ProgramacionDetalle programacionDetalle : list) {

			for (Horario horario : horarios) {

				iCitaRepository.save(Cita.builder()
						.programacionDetalle(programacionDetalle)
						.horario(horario)
						.atendido(Constants.ACTIVO)
						.build());
			}
		}
	}

	@Override
	public List<CitaResponse> listarCitas(Integer idProgramacionDetalle) {

		return iCitaRepository.findByProgramacionDetalleOrderByCita(idProgramacionDetalle)
				.stream().map(this::entityToResponse).toList();
	}

	@Override
	public Integer eliminar(Integer idCita, Integer idHorario, Integer idProgramacionDetalle) {

		return iCitaRepository.eliminar(idCita, idHorario, idProgramacionDetalle);
	}

	@Override
	public Integer updateAtencion(Integer idCita) {

		return iCitaRepository.updateAtencion(idCita);
	}

	@Override
	public List<CitaResponse> listaCitados(Integer idEmpresaSolicitada) {
		Integer idEmpresa = resolverIdEmpresaListaCitados(idEmpresaSolicitada);
		if (idEmpresa == null) {
			return Collections.emptyList();
		}
		LocalDate fechaActual = LocalDate.now();
		DateTimeFormatter formato = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		String fechaFormateada = fechaActual.format(formato);

		return iCitaRepository.listaCitadosPorEmpresa(idEmpresa, fechaFormateada, fechaActual)
				.stream().map(this::entityToResponse).toList();
	}

	/**
	 * SUPER: usa {@code idEmpresaSolicitada}. Cualquier otro usuario con empleado: empresa de ese empleado
	 * (ignora intentos de pasar otra empresa). Sin usuario autenticado: {@code idEmpresaSolicitada}.
	 */
	private Integer resolverIdEmpresaListaCitados(Integer idEmpresaSolicitada) {
		var authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || authentication.getName() == null) {
			return idEmpresaSolicitada;
		}
		var userOpt = iUsuarioRepository.findByEmail(authentication.getName());
		if (userOpt.isEmpty()) {
			return idEmpresaSolicitada;
		}
		var usuario = userOpt.get();
		if (usuario.getRoles() != null && usuario.getRoles().stream()
				.anyMatch(r -> "SUPER".equalsIgnoreCase(r.getNombre()))) {
			return idEmpresaSolicitada;
		}
		if (usuario.getEmpleado() != null && usuario.getEmpleado().getEmpresa() != null) {
			return usuario.getEmpleado().getEmpresa().getIdEmpresa();
		}
		return idEmpresaSolicitada;
	}

	@Override
	public Page<CitaResponse> listaHistorialCitaCliente(String numeroDocumento, Pageable paging) {

		return iCitaRepository.listaHistorialCitaCliente(numeroDocumento, paging)
				.map(this::entityToResponse);
	}

	@Override
	public List<Cita> listarNoAtendidos(Integer idProgramacionDetalle, Boolean atendido) {

		return iCitaRepository.getNoAtendidos(idProgramacionDetalle, atendido);
	}

	@Override
	public CitaResponse registrar(CitaRequest request) {
		var obj = iCitaRepository.save(Cita.builder()
				.horario(Horario.builder().idHorario(request.getIdHorario()).build())
				.programacionDetalle(ProgramacionDetalle.builder()
						.idProgramacionDetalle(request.getIdProgramacionDetalle()).build())
				.historiaClinica(HistoriaClinica.builder().idHistoriaClinica(request.getIdHistoriaClinica()).build())
				.atendido(Constants.DESATENDIDO)
				.build());
		return entityToResponse(obj);
	}

	@Override
	public CitaResponse modificar(CitaRequest request) {

		var obj = iCitaRepository.save(Cita.builder()
				.idCita(request.getIdCita())
				.historiaClinica(HistoriaClinica.builder().idHistoriaClinica(request.getIdHistoriaClinica()).build())
				.programacionDetalle(
						ProgramacionDetalle.builder().idProgramacionDetalle(request.getIdProgramacionDetalle()).build())
				.horario(Horario.builder().idHorario(request.getIdHorario()).build())
				.atendido(request.getAtendido())
				.informe(request.getInforme())
				.motivo(request.getMotivo())
				.diagnostico(request.getDiagnostico())
				.build());
		return entityToResponse(obj);
	}

	@Override
	public List<CitaResponse> listar() {

		return iCitaRepository.listarActivas(Pageable.unpaged()).getContent()
				.stream().map(this::entityToResponse).toList();
	}

	@Override
	public CitaResponse listarPorId(Integer id) {
		Integer idEmpresa = getEmpresaRestringidaParaAdmin();
		var cita = (idEmpresa != null)
				? iCitaRepository.findByIdActivaPorEmpresa(id, idEmpresa)
				: iCitaRepository.findByIdActiva(id);
		return entityToResponse(cita
				.orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada")));

	}

	@Override
	public void eliminar(Integer id) {
		var cita = iCitaRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada"));
		iCitaRepository.delete(cita);
	}

	public Cita modificarToEntity(Cita request) {

		return iCitaRepository.save(request);
	}

	@Override
	public List<Cita> listarPorFecha(String fecha) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		LocalDate date = LocalDate.parse(fecha.trim(), formatter);
		return iCitaRepository.listarPacientesHoy(date);
	}

	public List<DoctorDisponibleResponse> listarCitados(String fecha) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		LocalDate date = LocalDate.parse(fecha.trim(), formatter);
		List<Cita> citas = iCitaRepository.listarPacientesHoy(date);

		List<DoctorDisponibleResponse> atenciones = citas
				.stream().map(c -> {

					var list = new ArrayList<CitadosResponse>();
					var hc = c.getHistoriaClinica();
					String nombrePaciente = hc != null
							? String.format("%s %s %s",
									Objects.toString(hc.getApellidoPaterno(), ""),
									Objects.toString(hc.getApellidoMaterno(), ""),
									Objects.toString(hc.getNombres(), "")).trim()
							: "Sin paciente asignado";
					var citado = CitadosResponse.builder()
							.paciente(nombrePaciente)
							.horario(c.getHorario() != null ? c.getHorario().getDescripcion() : "")
							.idCita(c.getIdCita())
							.numeroDocumento(hc != null ? hc.getNumeroDocumento() : null)
							.idHistoriaClinica(hc != null ? hc.getIdHistoriaClinica() : null)
							.build();
					list.add(citado);

					return DoctorDisponibleResponse.builder()
							.medico(c.getProgramacionDetalle().getEmpleado().getApellidoPaterno() + " " +
									c.getProgramacionDetalle().getEmpleado().getApellidoMaterno() + " " +
									c.getProgramacionDetalle().getEmpleado().getNombres())
							.citados(list)
							.build();
				}).toList();

		return agruparCitas(atenciones).entrySet().stream()
				.map(entry -> DoctorDisponibleResponse.builder()
						.citados(entry.getValue())
						.medico(entry.getKey())
						.build())
				.toList();
	}

	public Map<String, List<CitadosResponse>> agruparCitas(List<DoctorDisponibleResponse> atenciones) {
		return atenciones.stream()
				.collect(Collectors.groupingBy(
						DoctorDisponibleResponse::getMedico, // Clave: Nombre del médico
						Collectors.flatMapping(
								d -> d.getCitados().stream(), // Aplanar la lista de citados
								Collectors.toList() // Recolectar en una lista única
						)));
	}

	private CitaResponse entityToResponse(Cita entity) {
		var response = new CitaResponse();
		BeanUtils.copyProperties(entity, response);
		if (entity.getHistoriaClinica() != null) {
			var historiaClinica = new HistoriaClinicaResponse();
			BeanUtils.copyProperties(entity.getHistoriaClinica(), historiaClinica);
			response.setHistoriaClinica(historiaClinica);
		} else {
			response.setHistoriaClinica(null);
		}
		if (entity.getHorario() != null) {
			var horarioResponse = new HorarioResponse();
			BeanUtils.copyProperties(entity.getHorario(), horarioResponse);
			response.setHorario(horarioResponse);
		} else {
			response.setHorario(null);
		}
		var programacionDetalleResponse = new ProgramacionDetalleResponse();
		BeanUtils.copyProperties(entity.getProgramacionDetalle(), programacionDetalleResponse);

		if (!Objects.isNull(entity.getProgramacionDetalle().getEmpleado())) {

			var empleado = new EmpleadoResponse();
			BeanUtils.copyProperties(entity.getProgramacionDetalle().getEmpleado(), empleado);

			// Solo crear TipoEmpleadoResponse si tipoEmpleado no es null
			if (entity.getProgramacionDetalle().getEmpleado().getTipoEmpleado() != null) {
				var tipoEmpleado = new TipoEmpleadoResponse();
				BeanUtils.copyProperties(entity.getProgramacionDetalle().getEmpleado().getTipoEmpleado(), tipoEmpleado);
				empleado.setTipoEmpleado(tipoEmpleado);
			}

			programacionDetalleResponse.setEmpleado(empleado);
		}
		response.setProgramacionDetalle(programacionDetalleResponse);
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

		boolean isAdmin = userOpt.get().getRoles().stream()
				.anyMatch(r -> "ADMIN".equalsIgnoreCase(r.getNombre()));
		if (!isAdmin || userOpt.get().getEmpleado() == null || userOpt.get().getEmpleado().getEmpresa() == null) {
			return null;
		}
		return userOpt.get().getEmpleado().getEmpresa().getIdEmpresa();
	}

}
