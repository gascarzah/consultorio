package com.gafahtec.consultorio.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gafahtec.consultorio.model.auth.Menu;

@Repository
public interface IMenuRepository extends IGenericRepository<Menu, Integer> {

    @Query("""
            SELECT m FROM Menu m
            WHERE m.nombre IS NOT NULL
            AND m.nombre != ''
            AND m.activo = true
            AND LOWER(m.nombre) LIKE LOWER(CONCAT('%', :search, '%'))
            """)
    Page<Menu> buscarMenus(@Param("search") String search, Pageable pageable);

    Page<Menu> findByActivoTrue(Pageable pageable);
}
