package com.gafahtec.consultorio.repository;

import com.gafahtec.consultorio.model.consultorio.DiasPorEmpleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface IDiasPorEmpleadoRepository extends JpaRepository<DiasPorEmpleado, Long> {
    List<DiasPorEmpleado> findByEmpleadoIdEmpleado(Integer idEmpleado);


    @Query("""
            select d 
            from DiasPorEmpleado d 
            inner join d.empleado e on d.empleado.idEmpleado=e.idEmpleado
            where e.empresa.idEmpresa = :idEmpresa
            """)
    List<DiasPorEmpleado> findByEmpresa(@Param("idEmpresa") Integer idEmpresa);
}
