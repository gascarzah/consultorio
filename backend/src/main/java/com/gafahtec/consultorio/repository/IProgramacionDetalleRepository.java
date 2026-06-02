package com.gafahtec.consultorio.repository;

import com.gafahtec.consultorio.model.consultorio.Programacion;
import com.gafahtec.consultorio.model.consultorio.ProgramacionDetalle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IProgramacionDetalleRepository extends IGenericRepository<ProgramacionDetalle, Integer> {

  @Query("SELECT pd FROM ProgramacionDetalle pd WHERE pd.programacion = :programacion AND pd.activo = true")
  List<ProgramacionDetalle> findByProgramacion(@Param("programacion") Programacion programacion);

  @Query("SELECT pd FROM ProgramacionDetalle pd WHERE pd.programacion.idProgramacion = :idProgramacion and pd.empleado.empresa.idEmpresa  = :idEmpresa and  pd.empleado.idEmpleado  = :idEmpleado")
  List<ProgramacionDetalle> getProgramacionEmpleado(Integer idProgramacion,
      Integer idEmpresa, Integer idEmpleado);

  @Query("SELECT pd FROM ProgramacionDetalle pd WHERE  pd.empleado.numeroDocumento = :numeroDocumento and pd.empleado.empresa.idEmpresa = :idEmpresa and pd.activo = :activo order by pd.fecha asc")
  List<ProgramacionDetalle> findByEmpleadoAndEstado(String numeroDocumento, Integer idEmpresa, Boolean activo);

  // @Query("SELECT new
  // com.gafahtec.consultorio.dto.response.ProgramacionDetalleResponse"
  // + "(pd.idProgramacionDetalle, pd.fecha, pd.diaSemana, pd.numeroDiaSemana,
  // pd.estado, pd.empleado, pd.programacion, count(c.idCita ) ) "
  // + "FROM Cita c join cita.programacionDetalle pd group by
  // pd.idProgramacionDetalle, pd.fecha, pd.diaSemana, pd.numeroDiaSemana,
  // pd.empleado, pd.programacion ")
  // Page<ProgramacionDetalleResponse> listarPageable(Pageable pageable);

  @Query("Select p from ProgramacionDetalle p  where  p.activo = true ")
  Page<ProgramacionDetalle> listarProgramacionDetalleActivoPageable(Pageable pageable);
  //////////////////////////

  @Query("SELECT pp FROM ProgramacionDetalle pp WHERE pp.activo = true")
  // @Query("SELECT pp FROM ProgramacionDetalle pp WHERE pp.empleado.idEmpleado =
  // :idMedico and pp.estado = :estado and pp.numeroDiaSemana = :numeroDiaSemana")
  List<ProgramacionDetalle> citasPendientes(@Param("idMedico") Integer idMedico, @Param("estado") Boolean estado,
      @Param("numeroDiaSemana") Integer numeroDiaSemana);

  List<ProgramacionDetalle> findByActivo(Boolean activo);

  @Query("SELECT pp FROM ProgramacionDetalle pp WHERE pp.activo = true")
  // @Query("SELECT pd FROM ProgramacionDetalle pd join pd.empleado emp join
  // pd.programacion prog where emp.idEmpleado = :idMedico and
  // prog.strFechaInicial = :strFechaInicial and prog.strFechaFinal
  // =:strFechaFinal")
  List<ProgramacionDetalle> verificaProgramacion(@Param("idMedico") Integer idMedico,
      @Param("strFechaInicial") String strFechaInicial, @Param("strFechaFinal") String strFechaFinal);

  @Query("""

                SELECT pp
      FROM ProgramacionDetalle pp
      WHERE pp.programacion.idProgramacion = :idProgramacion
        AND pp.empleado.idEmpleado = :idEmpleado
        AND pp.numeroDiaSemana = :numeroDia
      """)
  ProgramacionDetalle existeProgramacionDetalle(@Param("idProgramacion") Integer idProgramacion,
      @Param("idEmpleado") Integer idEmpleado, @Param("numeroDia") Integer numeroDia);

  @Query("""
      SELECT pd FROM ProgramacionDetalle pd
      JOIN pd.empleado e
      WHERE pd.activo = true
      AND (
      	(e.nombres IS NOT NULL AND LOWER(e.nombres) LIKE LOWER(CONCAT('%', :search, '%'))) OR
      	(e.apellidoPaterno IS NOT NULL AND LOWER(e.apellidoPaterno) LIKE LOWER(CONCAT('%', :search, '%'))) OR
      	(e.apellidoMaterno IS NOT NULL AND LOWER(e.apellidoMaterno) LIKE LOWER(CONCAT('%', :search, '%'))) OR
      	(e.numeroDocumento IS NOT NULL AND LOWER(e.numeroDocumento) LIKE LOWER(CONCAT('%', :search, '%')))
      )
      """)
  Page<ProgramacionDetalle> buscarProgramacionesDetalle(@Param("search") String search, Pageable pageable);
}
