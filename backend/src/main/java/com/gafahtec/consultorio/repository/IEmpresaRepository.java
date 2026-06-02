package com.gafahtec.consultorio.repository;

import com.gafahtec.consultorio.model.auth.Empresa;
import com.gafahtec.consultorio.model.auth.Rol;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IEmpresaRepository extends IGenericRepository<Empresa, Integer> {

	Rol findByNombre(String nombre);

	@Query("""
			SELECT e FROM Empresa e
			WHERE e.nombre IS NOT NULL
			AND e.nombre != ''
			AND e.activo = true
			AND LOWER(e.nombre) LIKE LOWER(CONCAT('%', :search, '%'))
			""")
	Page<Empresa> buscarEmpresas(@Param("search") String search, Pageable pageable);

	Page<Empresa> findByActivoTrue(Pageable pageable);
	List<Empresa> findByActivoTrue();

}
