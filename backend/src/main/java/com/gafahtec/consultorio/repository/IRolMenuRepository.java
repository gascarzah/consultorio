package com.gafahtec.consultorio.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import com.gafahtec.consultorio.model.auth.Rol;
import com.gafahtec.consultorio.model.auth.RolMenu;
import com.gafahtec.consultorio.model.auth.RolMenuPK;
import org.springframework.stereotype.Repository;

@Repository
public interface IRolMenuRepository extends IGenericRepository<RolMenu,RolMenuPK>{

	@Query("Select rol from Rol rol, RolMenu rm  "
			+ " left outer join rm.menu menu where rm.rol = rol and rol.idRol = :idRol  " )
	Page<RolMenu> listarPageable(Integer idRol, Pageable pageable);
	
	
	@Query("Select rm from RolMenu rm join rm.rol rol join rm.menu menu  where rol.idRol = :idRol order by menu.nombre  " )
	Set<RolMenu> findByRolMenu(Integer idRol);

	@Query("""
        SELECT rm
        FROM  RolMenu rm 
        WHERE rm.rol.idRol = :idRol
        
        """)
	List<RolMenu> findByRolOrder(Integer idRol);

}
