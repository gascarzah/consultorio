package com.gafahtec.consultorio.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gafahtec.consultorio.model.auth.TipoEmpleado;

@Repository
public interface ITipoEmpleadoRepository extends JpaRepository<TipoEmpleado, Integer> {

    @Query("""
            SELECT t FROM TipoEmpleado t
            WHERE t.nombre IS NOT NULL
            AND t.nombre != ''
            AND t.activo = true
            AND LOWER(t.nombre) LIKE LOWER(CONCAT('%', :search, '%'))
            """)
    Page<TipoEmpleado> buscarTiposEmpleado(@Param("search") String search, Pageable pageable);

    Page<TipoEmpleado> findByActivoTrue(Pageable pageable);
    java.util.List<TipoEmpleado> findByActivoTrue();

    boolean existsByActivoTrueAndNombreIgnoreCase(String nombre);

    boolean existsByActivoTrueAndNombreIgnoreCaseAndIdTipoEmpleadoNot(String nombre, Integer idTipoEmpleado);

}
