package com.gafahtec.consultorio.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gafahtec.consultorio.model.consultorio.Programacion;

@Repository
public interface IProgramacionRepository extends IGenericRepository<Programacion,Integer>{

    List<Programacion> findByActivo(Boolean activo);
    
    List<Programacion> findByRango(String rango);
    

    
    @Query("Select p from Programacion p  " )
//    @Query("Select p from Programacion p where p.idEmpresa = :idEmpresa " )
    Page<Programacion> listarProgramacionPageable(@Param("idEmpresa") Integer idEmpresa, Pageable pageable);

    Page<Programacion> findByActivoTrue(Pageable pageable);

    @Query("""
            SELECT p FROM Programacion p
            WHERE p.activo = true
            AND p.idEmpresa = :idEmpresa
            AND (
                CAST(p.idProgramacion AS string) LIKE CONCAT('%', :search, '%')
                OR LOWER(COALESCE(p.strFechaInicial, '')) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(COALESCE(p.strFechaFinal, '')) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(COALESCE(p.rango, '')) LIKE LOWER(CONCAT('%', :search, '%'))
            )
            """)
    Page<Programacion> buscarProgramaciones(@Param("idEmpresa") Integer idEmpresa, @Param("search") String search, Pageable pageable);

    // Ordenar por fechaInicial (ascendente)
    @Query("SELECT p FROM Programacion p WHERE p.activo = :activo ORDER BY p.fechaInicial, p.fechaFinal ")
    List<Programacion> findByActivoOrderByFechaInicial(@Param("activo") Boolean activo);

//    // Ordenar por fechaFinal (ascendente)
//    @Query("SELECT p FROM Programacion p WHERE p.activo = :activo ORDER BY p.fechaFinal ")
//    Set<Programacion> findByActivoOrderByFechaFinal(@Param("activo") Boolean activo);
    
}
