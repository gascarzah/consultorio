package com.gafahtec.consultorio.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gafahtec.consultorio.model.consultorio.HistoriaClinica;

@Repository
public interface IHistoriaClinicaRepository extends IGenericRepository<HistoriaClinica, Integer> {

    @Query("""
            SELECT h FROM HistoriaClinica h
            WHERE h.activo = true AND (
            	(h.nombres IS NOT NULL AND LOWER(h.nombres) LIKE LOWER(CONCAT('%', :search, '%'))) OR
            	(h.apellidoPaterno IS NOT NULL AND LOWER(h.apellidoPaterno) LIKE LOWER(CONCAT('%', :search, '%'))) OR
            	(h.apellidoMaterno IS NOT NULL AND LOWER(h.apellidoMaterno) LIKE LOWER(CONCAT('%', :search, '%'))) OR
            	(h.numeroDocumento IS NOT NULL AND LOWER(h.numeroDocumento) LIKE LOWER(CONCAT('%', :search, '%'))) OR
            	(h.telefono IS NOT NULL AND LOWER(h.telefono) LIKE LOWER(CONCAT('%', :search, '%'))) OR
            	(h.celular IS NOT NULL AND LOWER(h.celular) LIKE LOWER(CONCAT('%', :search, '%'))) OR
            	(h.email IS NOT NULL AND LOWER(h.email) LIKE LOWER(CONCAT('%', :search, '%')))
            )
            """)
    Page<HistoriaClinica> buscarHistoriasClinicas(@Param("search") String search, Pageable pageable);

    @Query("""
            SELECT h FROM HistoriaClinica h
            WHERE h.activo = true AND h.empresa.idEmpresa = :idEmpresa AND (
                (h.nombres IS NOT NULL AND LOWER(h.nombres) LIKE LOWER(CONCAT('%', :search, '%'))) OR
                (h.apellidoPaterno IS NOT NULL AND LOWER(h.apellidoPaterno) LIKE LOWER(CONCAT('%', :search, '%'))) OR
                (h.apellidoMaterno IS NOT NULL AND LOWER(h.apellidoMaterno) LIKE LOWER(CONCAT('%', :search, '%'))) OR
                (h.numeroDocumento IS NOT NULL AND LOWER(h.numeroDocumento) LIKE LOWER(CONCAT('%', :search, '%'))) OR
                (h.telefono IS NOT NULL AND LOWER(h.telefono) LIKE LOWER(CONCAT('%', :search, '%'))) OR
                (h.celular IS NOT NULL AND LOWER(h.celular) LIKE LOWER(CONCAT('%', :search, '%'))) OR
                (h.email IS NOT NULL AND LOWER(h.email) LIKE LOWER(CONCAT('%', :search, '%')))
            )
            """)
    Page<HistoriaClinica> buscarHistoriasClinicasPorEmpresa(
            @Param("search") String search,
            @Param("idEmpresa") Integer idEmpresa,
            Pageable pageable);

    Page<HistoriaClinica> findByActivoTrue(Pageable pageable);

    Page<HistoriaClinica> findByActivoTrueAndEmpresaIdEmpresa(Integer idEmpresa, Pageable pageable);

    java.util.List<HistoriaClinica> findByActivoTrueAndEmpresaIdEmpresa(Integer idEmpresa);
}
