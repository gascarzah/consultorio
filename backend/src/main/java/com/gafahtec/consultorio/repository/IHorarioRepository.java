package com.gafahtec.consultorio.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gafahtec.consultorio.model.consultorio.Horario;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface IHorarioRepository extends IGenericRepository<Horario,Integer>{


    List<Horario> findByIdEmpresaAndActivoTrue(Integer idEmpresa);
    Page<Horario> findByActivoTrue(Pageable pageable);

    @Query("""
    SELECT h
    FROM Horario h
    WHERE h.activo = true
    AND (
        CAST(h.idHorario AS string) LIKE CONCAT('%', :search, '%')
        OR LOWER(COALESCE(h.descripcion, '')) LIKE LOWER(CONCAT('%', :search, '%'))
    )
    """)
    Page<Horario> buscarHorarios(@Param("search") String search, Pageable pageable);

    @Query("""
    SELECT h 
    FROM Horario h 
    WHERE h.idHorario NOT IN (
                                SELECT c.horario.idHorario 
                                FROM Cita c 
                                WHERE c.horario IS NOT NULL
                                AND c.programacionDetalle.idProgramacionDetalle = :idProgramacionDetalle
    )
    AND h.idEmpresa = :idEmpresa
    AND h.activo = true
""")
    List<Horario> obtenerHorariosDisponibles(@Param("idProgramacionDetalle") Integer idProgramacionDetalle,@Param("idEmpresa") Integer idEmpresa);
}
