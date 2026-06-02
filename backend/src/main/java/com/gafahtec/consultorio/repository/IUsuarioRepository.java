package com.gafahtec.consultorio.repository;

import com.gafahtec.consultorio.model.auth.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface IUsuarioRepository extends IGenericRepository<Usuario, Integer> {

	Optional<Usuario> findByEmail(String email);

	@Query("""
			Select u from Usuario u where u.empleado.idEmpleado = :idEmpleado
			and (u.empleado.activo IS NULL OR u.empleado.activo = true)
			""")
	Usuario findUsuarioByEmpleado(@Param("idEmpleado") Integer idEmpleado);

    @Query(value = """
            SELECT DISTINCT u FROM Usuario u
            JOIN u.empleado e
            LEFT JOIN u.roles r
            WHERE u.email IS NOT NULL
            AND u.email != ''
            AND (e.activo IS NULL OR e.activo = true)
            AND (
              (u.email IS NOT NULL AND LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) OR
              (e.nombres IS NOT NULL AND LOWER(e.nombres) LIKE LOWER(CONCAT('%', :search, '%'))) OR
              (e.apellidoPaterno IS NOT NULL AND LOWER(e.apellidoPaterno) LIKE LOWER(CONCAT('%', :search, '%'))) OR
              (e.apellidoMaterno IS NOT NULL AND LOWER(e.apellidoMaterno) LIKE LOWER(CONCAT('%', :search, '%'))) OR
              (r.nombre IS NOT NULL AND LOWER(r.nombre) LIKE LOWER(CONCAT('%', :search, '%')))
            )
            """,
            countQuery = """
            SELECT COUNT(DISTINCT u.idUsuario) FROM Usuario u
            JOIN u.empleado e
            LEFT JOIN u.roles r
            WHERE u.email IS NOT NULL
            AND u.email != ''
            AND (e.activo IS NULL OR e.activo = true)
            AND (
              (u.email IS NOT NULL AND LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) OR
              (e.nombres IS NOT NULL AND LOWER(e.nombres) LIKE LOWER(CONCAT('%', :search, '%'))) OR
              (e.apellidoPaterno IS NOT NULL AND LOWER(e.apellidoPaterno) LIKE LOWER(CONCAT('%', :search, '%'))) OR
              (e.apellidoMaterno IS NOT NULL AND LOWER(e.apellidoMaterno) LIKE LOWER(CONCAT('%', :search, '%'))) OR
              (r.nombre IS NOT NULL AND LOWER(r.nombre) LIKE LOWER(CONCAT('%', :search, '%')))
            )
            """)
    Page<Usuario> buscarUsuarios(@Param("search") String search, Pageable pageable);

    @Query(value = """
            SELECT DISTINCT u FROM Usuario u
            JOIN u.empleado e
            LEFT JOIN u.roles r
            WHERE u.email IS NOT NULL
            AND u.email != ''
            AND (e.activo IS NULL OR e.activo = true)
            AND e.empresa.idEmpresa = :idEmpresa
            AND (
              (u.email IS NOT NULL AND LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) OR
              (e.nombres IS NOT NULL AND LOWER(e.nombres) LIKE LOWER(CONCAT('%', :search, '%'))) OR
              (e.apellidoPaterno IS NOT NULL AND LOWER(e.apellidoPaterno) LIKE LOWER(CONCAT('%', :search, '%'))) OR
              (e.apellidoMaterno IS NOT NULL AND LOWER(e.apellidoMaterno) LIKE LOWER(CONCAT('%', :search, '%'))) OR
              (r.nombre IS NOT NULL AND LOWER(r.nombre) LIKE LOWER(CONCAT('%', :search, '%')))
            )
            """,
            countQuery = """
            SELECT COUNT(DISTINCT u.idUsuario) FROM Usuario u
            JOIN u.empleado e
            LEFT JOIN u.roles r
            WHERE u.email IS NOT NULL
            AND u.email != ''
            AND (e.activo IS NULL OR e.activo = true)
            AND e.empresa.idEmpresa = :idEmpresa
            AND (
              (u.email IS NOT NULL AND LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) OR
              (e.nombres IS NOT NULL AND LOWER(e.nombres) LIKE LOWER(CONCAT('%', :search, '%'))) OR
              (e.apellidoPaterno IS NOT NULL AND LOWER(e.apellidoPaterno) LIKE LOWER(CONCAT('%', :search, '%'))) OR
              (e.apellidoMaterno IS NOT NULL AND LOWER(e.apellidoMaterno) LIKE LOWER(CONCAT('%', :search, '%'))) OR
              (r.nombre IS NOT NULL AND LOWER(r.nombre) LIKE LOWER(CONCAT('%', :search, '%')))
            )
            """)
    Page<Usuario> buscarUsuariosPorEmpresa(@Param("search") String search, @Param("idEmpresa") Integer idEmpresa, Pageable pageable);

	@Query("""
			SELECT u FROM Usuario u
			JOIN u.empleado e
			WHERE (e.activo IS NULL OR e.activo = true)
			""")
	Page<Usuario> listarActivos(Pageable pageable);

	@Query("""
			SELECT u FROM Usuario u
			JOIN u.empleado e
			WHERE (e.activo IS NULL OR e.activo = true)
			AND e.empresa.idEmpresa = :idEmpresa
			""")
	Page<Usuario> listarActivosPorEmpresa(@Param("idEmpresa") Integer idEmpresa, Pageable pageable);

	@Query("""
			SELECT u FROM Usuario u
			JOIN u.empleado e
			WHERE u.idUsuario = :id
			AND (e.activo IS NULL OR e.activo = true)
			""")
	Optional<Usuario> findByIdActivo(@Param("id") Integer id);
}
