package com.gafahtec.consultorio.repository;

import com.gafahtec.consultorio.model.auth.CategoriaMenu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ICategoriaMenuRepository extends IGenericRepository<CategoriaMenu, Integer> {

    @Query("""
            SELECT c FROM CategoriaMenu c
            WHERE c.nombre IS NOT NULL
            AND c.nombre != ''
            AND c.activo = true
            AND LOWER(c.nombre) LIKE LOWER(CONCAT('%', :search, '%'))
            """)
    Page<CategoriaMenu> buscarCategorias(@Param("search") String search, Pageable pageable);

    Page<CategoriaMenu> findByActivoTrue(Pageable pageable);

    List<CategoriaMenu> findByActivoTrueOrderByOrdenAscNombreAsc();
}
