package com.gafahtec.consultorio.repository;

import java.util.List;
import java.util.Set;

import com.gafahtec.consultorio.model.auth.Empresa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.gafahtec.consultorio.model.auth.Empleado;
import org.springframework.stereotype.Repository;

@Repository
public interface IEmpleadoRepository extends IGenericRepository<Empleado, Integer> {

	Set<Empleado> findByEmpresa(Empresa empresa);

	// @Query("SELECT emp FROM Usuario u join u.empleado emp join u.roles r where
	// r.idRol = :idRol ")
	@Query("SELECT emp FROM Empleado  emp  ")
	List<Empleado> findByRol(@Param("idRol") Integer idRol);

	@Query("""
			SELECT e FROM Empleado e
			WHERE COALESCE(e.activo, true) = true AND (
				(e.nombres IS NOT NULL AND LOWER(e.nombres) LIKE LOWER(CONCAT('%', :search, '%'))) OR
				(e.apellidoPaterno IS NOT NULL AND LOWER(e.apellidoPaterno) LIKE LOWER(CONCAT('%', :search, '%'))) OR
				(e.apellidoMaterno IS NOT NULL AND LOWER(e.apellidoMaterno) LIKE LOWER(CONCAT('%', :search, '%'))) OR
				(e.numeroDocumento IS NOT NULL AND LOWER(e.numeroDocumento) LIKE LOWER(CONCAT('%', :search, '%')))
			)
			""")
	Page<Empleado> buscarEmpleados(@Param("search") String search, Pageable pageable);

	@Query("""
			SELECT e FROM Empleado e
			WHERE COALESCE(e.activo, true) = true
			AND e.empresa.idEmpresa = :idEmpresa
			AND (
				(e.nombres IS NOT NULL AND LOWER(e.nombres) LIKE LOWER(CONCAT('%', :search, '%'))) OR
				(e.apellidoPaterno IS NOT NULL AND LOWER(e.apellidoPaterno) LIKE LOWER(CONCAT('%', :search, '%'))) OR
				(e.apellidoMaterno IS NOT NULL AND LOWER(e.apellidoMaterno) LIKE LOWER(CONCAT('%', :search, '%'))) OR
				(e.numeroDocumento IS NOT NULL AND LOWER(e.numeroDocumento) LIKE LOWER(CONCAT('%', :search, '%')))
			)
			""")
	Page<Empleado> buscarEmpleadosPorEmpresa(@Param("search") String search, @Param("idEmpresa") Integer idEmpresa, Pageable pageable);

	@Query("""
			SELECT DISTINCT e FROM Empleado e
			LEFT JOIN e.tipoEmpleado te
			WHERE e.empresa.idEmpresa = :idEmpresa
			AND COALESCE(e.activo, true) = true
			AND (
				(te.nombre IS NOT NULL AND (
					LOWER(te.nombre) LIKE '%odontolog%' OR
					LOWER(te.nombre) LIKE '%odontólogo%' OR
					LOWER(te.nombre) LIKE '%medico%' OR
					LOWER(te.nombre) LIKE '%médico%' OR
					LOWER(te.nombre) LIKE '%doctor%'
				)) OR
				(te.descripcion IS NOT NULL AND (
					LOWER(te.descripcion) LIKE '%odontolog%' OR
					LOWER(te.descripcion) LIKE '%odontólogo%' OR
					LOWER(te.descripcion) LIKE '%medico%' OR
					LOWER(te.descripcion) LIKE '%médico%' OR
					LOWER(te.descripcion) LIKE '%doctor%'
				)) OR
				EXISTS (
					SELECT 1 FROM Usuario u
					JOIN u.roles r
					WHERE u.empleado = e
					AND (
						LOWER(r.nombre) LIKE '%odontolog%' OR
						LOWER(r.nombre) LIKE '%odontólogo%' OR
						LOWER(r.nombre) LIKE '%medico%' OR
						LOWER(r.nombre) LIKE '%médico%' OR
						LOWER(r.nombre) LIKE '%doctor%'
					)
				)
			)
			""")
	List<Empleado> findOdontologosByEmpresa(@Param("idEmpresa") Integer idEmpresa);

	@Query("SELECT e FROM Empleado e WHERE COALESCE(e.activo, true) = true")
	Page<Empleado> listarActivos(Pageable pageable);

	@Query("SELECT e FROM Empleado e WHERE COALESCE(e.activo, true) = true AND e.empresa.idEmpresa = :idEmpresa")
	Page<Empleado> listarActivosPorEmpresa(@Param("idEmpresa") Integer idEmpresa, Pageable pageable);
	List<Empleado> findByActivoTrue();

	@Query("SELECT e FROM Empleado e WHERE e.idEmpleado = :id AND COALESCE(e.activo, true) = true")
	java.util.Optional<Empleado> findByIdActivo(@Param("id") Integer id);

	// @Query("SELECT emp FROM Empleado emp ")
	// @Query("SELECT emp FROM Empleado emp ")
	// List<Empleado> findByTipoEmpleadoEmpresa(@Param("idEmpresa")Integer
	// idEmpresa, @Param("descTipoEmpleado")String descTipoEmpleado);

}
