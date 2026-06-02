package com.gafahtec.consultorio.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gafahtec.consultorio.model.consultorio.Cita;

@Repository
public interface ICitaRepository extends IGenericRepository<Cita, Integer> {

  @Query("""
      SELECT c FROM Cita c
      JOIN c.programacionDetalle pd
      JOIN pd.empleado e
      LEFT JOIN c.historiaClinica h
      WHERE (pd.activo IS NULL OR pd.activo = true)
      AND (e.activo IS NULL OR e.activo = true)
      AND (h IS NULL OR h.activo IS NULL OR h.activo = true)
      """)
  Page<Cita> listarActivas(Pageable pageable);

  @Query("""
      SELECT c FROM Cita c
      JOIN c.programacionDetalle pd
      JOIN pd.empleado e
      LEFT JOIN c.historiaClinica h
      WHERE (pd.activo IS NULL OR pd.activo = true)
      AND (e.activo IS NULL OR e.activo = true)
      AND (h IS NULL OR h.activo IS NULL OR h.activo = true)
      AND COALESCE(e.empresa.idEmpresa, pd.programacion.idEmpresa) = :idEmpresa
      """)
  Page<Cita> listarActivasPorEmpresa(@Param("idEmpresa") Integer idEmpresa, Pageable pageable);

  @Query("""
      SELECT c FROM Cita c
      JOIN c.programacionDetalle pd
      JOIN pd.empleado e
      LEFT JOIN c.historiaClinica h
      WHERE c.idCita = :id
      AND (pd.activo IS NULL OR pd.activo = true)
      AND (e.activo IS NULL OR e.activo = true)
      AND (h IS NULL OR h.activo IS NULL OR h.activo = true)
      """)
  java.util.Optional<Cita> findByIdActiva(@Param("id") Integer id);

  @Query("""
      SELECT c FROM Cita c
      JOIN c.programacionDetalle pd
      JOIN pd.empleado e
      LEFT JOIN c.historiaClinica h
      WHERE c.idCita = :id
      AND (pd.activo IS NULL OR pd.activo = true)
      AND (e.activo IS NULL OR e.activo = true)
      AND (h IS NULL OR h.activo IS NULL OR h.activo = true)
      AND COALESCE(e.empresa.idEmpresa, pd.programacion.idEmpresa) = :idEmpresa
      """)
  java.util.Optional<Cita> findByIdActivaPorEmpresa(@Param("id") Integer id, @Param("idEmpresa") Integer idEmpresa);

  @Query("Select c from Cita c join c.programacionDetalle pro where pro.idProgramacionDetalle = :idProgramacionDetalle and pro.activo = true order by c.idCita ")
  List<Cita> findByProgramacionDetalleOrderByCita(@Param("idProgramacionDetalle") Integer idProgramacionDetalle);

  /**
   * Citas de hoy para todos los médicos de una empresa. {@code strFecha} o {@code pd.fecha} según datos cargados.
   */
  @Query("""
            Select c from Cita c
            join ProgramacionDetalle pd on c.programacionDetalle.idProgramacionDetalle = pd.idProgramacionDetalle
            join pd.empleado e
      where COALESCE(e.empresa.idEmpresa, pd.programacion.idEmpresa) = :idEmpresa
        and (pd.strFecha = :strFecha or pd.fecha = :fechaDia)
             and (pd.activo IS NULL OR pd.activo = true)
             and (e.activo IS NULL OR e.activo = true)
             order by c.idCita
             """)
  List<Cita> listaCitadosPorEmpresa(@Param("idEmpresa") Integer idEmpresa, @Param("strFecha") String strFecha,
      @Param("fechaDia") LocalDate fechaDia);

  @Query("Select c from Cita c join c.historiaClinica cl where  cl.numeroDocumento = :numeroDocumento and c.atendido = true and cl.activo = true")
  Page<Cita> listaHistorialCitaCliente(String numeroDocumento, Pageable pageable);

  @Query("Select count(c) from Cita c join c.programacionDetalle pd where pd.idProgramacionDetalle = :idProgramacionDetalle and pd.activo = true")
  Integer getTotalCitas(@Param("idProgramacionDetalle") Integer idProgramacionDetalle);

  @Query("Select c from Cita c join c.programacionDetalle pd where  pd.idProgramacionDetalle = :idProgramacionDetalle and c.atendido = :atendido and pd.activo = true")
  List<Cita> getNoAtendidos(Integer idProgramacionDetalle, Boolean atendido);
  ////////////////////////////

  @Modifying
  @Query(value = "UPDATE Cita List id_cliente = null where id_cita = :idCita and id_horario = :idHorario and id_programacion_detalle = :idProgramacionDetalle ", nativeQuery = true)
  Integer eliminar(@Param("idCita") Integer idCita, @Param("idHorario") Integer idHorario,
      @Param("idProgramacionDetalle") Integer idProgramacionDetalle);

  @Modifying
  @Query(value = "UPDATE Cita List atendido = 1 where id_cita = :idCita ", nativeQuery = true)
  Integer updateAtencion(@Param("idCita") Integer idCita);

  @Query("Select c from Cita c ")
  // @Query("Select c from Cita c join c.cliente cl where cl.idCliente =
  // :idCliente" )
  List<Cita> listaHistorialCitaCliente(@Param("idCliente") Integer idCliente);

  List<Cita> findByAtendido(Boolean atendido);

  @Query("Select c from Cita c join c.programacionDetalle pd where pd.fecha = :date and (pd.activo IS NULL OR pd.activo = true) ")
  List<Cita> listarPacientesHoy(LocalDate date);

  @Query("""
      SELECT c FROM Cita c
      JOIN c.historiaClinica h
      JOIN c.programacionDetalle pd
      WHERE (

          LOWER(h.nombres) LIKE LOWER(CONCAT('%', :search, '%')) OR
          LOWER(h.apellidoPaterno) LIKE LOWER(CONCAT('%', :search, '%')) OR
          LOWER(h.apellidoMaterno) LIKE LOWER(CONCAT('%', :search, '%')) OR
          LOWER(CONCAT(h.nombres, ' ', h.apellidoPaterno, ' ', h.apellidoMaterno)) LIKE LOWER(CONCAT('%', :search, '%')) OR
          LOWER(h.telefono) LIKE LOWER(CONCAT('%', :search, '%')) OR
          LOWER(h.celular) LIKE LOWER(CONCAT('%', :search, '%')) OR
          LOWER(h.email) LIKE LOWER(CONCAT('%', :search, '%'))
      )
      AND h.activo = true
      AND pd.activo = true
      """)
  Page<Cita> buscarCitas(@Param("search") String search, Pageable pageable);

  @Query("""
      SELECT c FROM Cita c
      JOIN c.historiaClinica h
      JOIN c.programacionDetalle pd
      JOIN pd.empleado e
      WHERE (
          LOWER(h.nombres) LIKE LOWER(CONCAT('%', :search, '%')) OR
          LOWER(h.apellidoPaterno) LIKE LOWER(CONCAT('%', :search, '%')) OR
          LOWER(h.apellidoMaterno) LIKE LOWER(CONCAT('%', :search, '%')) OR
          LOWER(CONCAT(h.nombres, ' ', h.apellidoPaterno, ' ', h.apellidoMaterno)) LIKE LOWER(CONCAT('%', :search, '%')) OR
          LOWER(h.telefono) LIKE LOWER(CONCAT('%', :search, '%')) OR
          LOWER(h.celular) LIKE LOWER(CONCAT('%', :search, '%')) OR
          LOWER(h.email) LIKE LOWER(CONCAT('%', :search, '%'))
      )
      AND (h.activo IS NULL OR h.activo = true)
      AND (pd.activo IS NULL OR pd.activo = true)
      AND (e.activo IS NULL OR e.activo = true)
      AND COALESCE(e.empresa.idEmpresa, pd.programacion.idEmpresa) = :idEmpresa
      """)
  Page<Cita> buscarCitasPorEmpresa(@Param("search") String search, @Param("idEmpresa") Integer idEmpresa, Pageable pageable);
}
