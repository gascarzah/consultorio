package com.gafahtec.consultorio.cron;

import java.text.SimpleDateFormat;
import java.time.Year;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.gafahtec.consultorio.dto.Semana;
import com.gafahtec.consultorio.dto.request.ProgramacionRequest;
import com.gafahtec.consultorio.model.consultorio.Cita;
import com.gafahtec.consultorio.model.consultorio.Programacion;
import com.gafahtec.consultorio.model.consultorio.ProgramacionDetalle;
import com.gafahtec.consultorio.service.ICitaService;
import com.gafahtec.consultorio.service.IProgramacionDetalleService;
import com.gafahtec.consultorio.service.IProgramacionService;
import com.gafahtec.consultorio.util.Constants;
import com.gafahtec.consultorio.util.GenerarProgramacionFechas;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;

import static com.gafahtec.consultorio.util.GenerarProgramacionFechas.obtenerNumeroSemana;

@Component
@AllArgsConstructor
@Log4j2
public class Scheduler {

	private final IProgramacionService iProgramacionService;
	private final IProgramacionDetalleService iProgramacionDetalleService;
	private final ICitaService iCitaService;

	@Scheduled(cron = "${cron.expression}")
	public void ejecutar() {
		runSafely("inactivar programaciones vencidas", this::scheduleTask);
		runSafely("asegurar programaciones semanales del año", this::registrarProgramacionAutomatica);
		runSafely("generar detalle a 3 meses", this::verificarYGenerarTercerMes);
	}

	private void runSafely(String nombre, ThrowingRunnable task) {
		try {
			task.run();
		} catch (Exception e) {
			log.error("Error en tarea programada '{}': {}", nombre, e.getMessage(), e);
		}
	}

	@FunctionalInterface
	private interface ThrowingRunnable {
		void run() throws Exception;
	}

	public void scheduleTask() throws Exception {
		String pattern = "dd/MM/yyyy";
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);

		ZoneId systemTimeZone = ZoneId.systemDefault();
		Date fechaActual = new Date();
		String strFechaActual = simpleDateFormat.format(fechaActual);

		List<Programacion> listaProgramacion = iProgramacionService.programacionEntityActivo();

		for (Programacion programacion : listaProgramacion) {
			if (fechaActual.after(programacion.getFechaFinal())) {
				programacion.setActivo(Constants.INACTIVO);
				try {
					iProgramacionService.modificarEntity(programacion);
				} catch (Exception e) {
					log.error("No se pudo inactivar programación {}: {}",
							programacion.getIdProgramacion(), e.getMessage());
				}
			}
		}

		List<ProgramacionDetalle> listaProgramacionDetalle = iProgramacionDetalleService
				.getProgramacionDetalleActivo(Constants.ACTIVO);

		listaProgramacionDetalle.forEach(det -> {
			ZonedDateTime zonedDateTime = det.getFecha().atStartOfDay(systemTimeZone);
			Date utilDate = Date.from(zonedDateTime.toInstant());
			String strFechaProgramacion = simpleDateFormat.format(utilDate);
			if (fechaActual.after(utilDate) && !StringUtils.equals(strFechaActual, strFechaProgramacion)) {
				det.setActivo(Constants.INACTIVO);
				actualizarCitaDelDia(det.getIdProgramacionDetalle());
				try {
					iProgramacionDetalleService.modificarEntity(det);
				} catch (Exception e) {
					log.error("No se pudo inactivar programación detalle {}: {}",
							det.getIdProgramacionDetalle(), e.getMessage());
				}
			}
		});
	}

	public void actualizarCitaDelDia(Integer idProgramacionDetalle) {
		List<Cita> citas = iCitaService.listarNoAtendidos(idProgramacionDetalle, Constants.DESATENDIDO);

		for (Cita cita : citas) {
			if (null == cita.getHistoriaClinica()) {
				cita.setEstado(3); // no programado
			} else {
				cita.setEstado(2); // no asistio
			}
			iCitaService.modificarToEntity(cita);
		}
	}

	/**
	 * Asegura que existan las semanas del año actual.
	 * Idempotente: si el rango ya existe, no lanza error.
	 */
	public void registrarProgramacionAutomatica() {
		int anioActual = Year.now().getValue();
		List<Semana> rangoSemanal = GenerarProgramacionFechas.semanasDelAnio(anioActual);

		for (Semana s : rangoSemanal) {
			Date inicio = Date.from(s.getInicio().atStartOfDay(ZoneId.systemDefault()).toInstant());
			Date fin = Date.from(s.getFin().atStartOfDay(ZoneId.systemDefault()).toInstant());
			var request = ProgramacionRequest.builder()
					.fechaInicial(inicio)
					.fechaFinal(fin)
					.numeroSemana(obtenerNumeroSemana(s.getInicio()))
					.build();
			iProgramacionService.registrarSiNoExiste(request);
		}
	}

	public void verificarYGenerarTercerMes() {
		iProgramacionDetalleService.generarProgramacionAutomaticaCada3Meses();
	}
}
